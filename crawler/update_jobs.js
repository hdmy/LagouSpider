var { post } = require('../public/js/method');
var statistic = require('./statistic');
var util = require('../public/js/util');
var db = require('../public/js/controldb');
var request = require('superagent');
var _async = require('async');
var domain = require('domain');
var d = domain.create();
var fs = require('fs');
var lastTime = fs.readFileSync('statistic.json').latestTime;
var ipNo = 0, ips = [];
var totals = {};
var log_paths = require('path').resolve('./logs/log.txt');
var warn_paths = require('path').resolve('./logs/warn.txt');

function log(...msg){
  fs.appendFile(log_paths, msg + '\n', function(err){
    if(err) warn(err);
  })
}

function warn(...msg){
  fs.appendFile(warn_paths, msg + '\n', function(err){
    if(err) warn(err);
  })
}
function updateJobs() {
  return new Promise(async(resolve, reject) => {
    // 获取数据库中各地区总数
    var cmd = { $group: { _id: '$city', value: { $sum: '$total' } } };
    var old_total = await db.aggregateJobTotal(cmd);
    for(var i of old_total){
      totals[i._id] = i.value;
    }
    log(`-----开始更新职位，当前时间： ${new Date().toLocaleString()}------`);
    try {
      await crawlerJob(crawlerJobs);
    } catch (error) {
      return reject(err);
    }
    resolve();
  })
}

async function crawlerJob(crawlerFn) {
  return new Promise(async(resolve, reject) => {
    ips = await db.getIps();
    var cities = await db.getCitys();
    var positionDb = await db.getPositions();
    var positions = [];
    for (var first of positionDb) {
      for (var sub of first.sub) {
        for (var position of sub.position) {
          positions.push({
            name: position,
            firstTag: first.name,
            secondTag: sub.name
          });
        }
      }
    }
    log('start', cities.length, positions.length);
    // var flag = false, flag2 = false;
    // 顺序遍历各城市
    _async.mapLimit(cities,7, async(city, callback) => {
      // if (city.name == '北京') flag = true;
      // if (!flag) return callback();
      if (await crawlerFn(city.name, '', 1) == 0) {
        log(`${city.name} 无需更新`);
        return callback();
      }
      // 并发遍历各职位
      _async.mapLimit(positions, 7, async (position, call) => {
        try {
          await crawlerFn(city.name, position, 1);
        } catch (err) {
          return call(err);
        }
        call();
      }, (err) => {
        if (err) {
          console.error(`crawlerJob error ${err}`);
          return callback(err);
        }
        log(city, '已完成更新');
        callback();
      });
      // --end mapLimit--
    }, (err) => {
      if (err) return reject(err);
      log('------Crawler Over------');
      resolve();
    })
    // --end mapSeries--
  })
}

async function crawlerJobs(city, position, page) {
  return new Promise(async(resolve, reject) => {
    var proxy, json, jobResult, totalCount, pageSize, pageCount;
    // resolve 情况：更新完毕 1.爬取到的数据已小于上一次爬取时间，2.全国无需，3.该地区无数据
    var success = false;
    var hasNext = true;

    while (!success) {
      if (ips.length == 0) {
        ips = await db.getIps();
      }
      proxy = ips[ipNo++].proxy;
      if (ipNo >= ips.length) {
        ipNo = 0;
      }
      log(`crawlerJobs-------${city}, ${position.name}, ${proxy}, page: ${page}`);
      try {
        json = await post({city: city, data: { kd: position ? position.name : position, pn: page, first: true }, proxy: proxy });
      } catch (error) {
        continue;
      }
      success = true;
    }

    totalCount = json.content.positionResult.totalCount;
    // 当前城市无数据，或与数据库相同，无需更新
    if (position == '') {
      if (totalCount == 0 || totalCount == totals[city]) return resolve(0);
      else return resolve(1);
    }

    jobResult = json.content.positionResult.result;
    pageSize = json.content.pageSize;
    pageCount = Math.ceil(totalCount / pageSize);

    log(`------Info:${city} ${position.name} page: ${page} ,totalCount: ${totalCount}, pageCount: ${pageCount}`);

    // 2.该职位无数据 | 请求无效
    if (json.content.pageNo == 0) {
      log(city, position.name, '无数据');
      return resolve();
    }

    // 3.存储jobs
    hasNext = await setInDb(city, position, jobResult,hasNext);

    // 顺序遍历各页数
    if (page == 1 && pageCount > 1) {
      _async.timesSeries(pageCount + 1, async(n, call) => { // n:0 ~ pageCount
        if (!hasNext) return call(new Error(`${city} ${position.name} 无新数据`));
        if (n == 0 || n == 1)  return call();
        await crawlerJobs(city, position, n); //Promise，请求意外错误此时已内部处理
        return call();
      }, (err) => {
        if(err) 
          log(err);
      });
    }
    return resolve();    // 当前职位已爬完
  })
}

async function setInDb(city, position, jobs, hasNext) {
  for (var item of jobs) {
    if (Date.parse(item.createTime) <= lastTime) {
      hasNext = false;
      log(`当前 ${city} ${position.name} 数据已最新`);
      break;
    }
    var [min, max] = item.salary.replace(/k/g, "").split("-");
    max = parseInt(max || min);
    min = parseInt(min);
    item.salaryMin = min;
    item.salaryMax = max;
    item.salaryAvg = (min + max) / 2;
    item.positionTag = [position.name, position.firstTag, position.secondTag];
    // 异常数据修复
    if (item.financeStage == null) item.financeStage = '无';
    if (typeof item.financeStage == 'string' && item.financeStage.match(/^null\(/)) item.financeStage = item.financeStage.replace(/null\(|\)/g, '');
    if (typeof item.financeStage == 'string' && item.workYear.match(/-.*[^年]$/g)) item.workYear += '年';
    if (item.workYear == '不限年') item.workYear = '不限';
  
    try {
      await db.addJobs(jobs);
      return hasNext;
    } catch (error) {
      if (error.code !== 11000) { // 非重复数据错误
        warn(`------------set into db ${error}-----------\n-------CRAWLER OVER------`);
        process.exit(1);
      }
    }
  }
}

function transform(item) {
  var [min, max] = item.salary.replace(/k/g, "").split("-");
  max = parseInt(max || min);
  min = parseInt(min);
  item.salaryMin = min;
  item.salaryMax = max;
  item.salaryAvg = (min + max) / 2;
  item.positionTag = [position.name, position.firstTag];
  // 异常数据修复
  if (item.financeStage == null) item.financeStage = '无';
  if (typeof item.financeStage == 'string' && item.financeStage.match(/^null\(/)) item.financeStage = item.financeStage.replace(/null\(|\)/g, '');
  if (typeof item.financeStage == 'string' && item.workYear.match(/-.*[^年]$/g)) item.workYear += '年';
  if (item.workYear == '不限年') item.workYear = '不限';
  return item;
}

process.on('uncaughtException', (err) => {
  warn(err);
})

d.on('error', function (err) {
  console.error('Error caught by domain:', err);
  fs.writeFile("crash.txt", err.stack);
});

d.run(function () {
  _async.auto({
    // 1.获取cookie
    getCookie: async(callback) => {
      global.Cookie = '';
      var option = {
        Accept: '*/*'
      };
      try {
        var res1 = await request.get('https://www.lagou.com/');
        var res2 = await request.get('https://a.lagou.com/collect').set(option);
      } catch (error) {
        callback(error);
      }
      util.fetchCookie(res1.header['set-cookie'], 'JSESSIONID');
      util.fetchCookie(res2.header['set-cookie'], ['user_trace_token', 'LGUID']);
      callback();
    },
    // 2.完成后获取Job
    getJobs: ['getCookie', async(res, callback) => {
      try {
        await updateJobs();
      } catch (error) {
        callback(err);
      }
      callback();
    }],
  }, async function (err, results) {
    if (err) {
      warn(err);
      process.exit();
    }
    try {
      log(`-------更新统计分析结果-------`);
      await statistic();
    } catch (error) {
      warn(err);
      process.exit();
    }
    log(`-------Update Over-------`);
    process.exit();
  });
});