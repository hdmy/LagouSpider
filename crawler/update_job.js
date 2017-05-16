/**
 * 原理：从全国不分城市、不分职位爬取
 * 缺点：无法准确判断该职位类别，放弃
 */
var { post } = require('../public/js/method');
var statistic = require('./statistic');
var util = require('../public/js/util');
var db = require('../public/js/controldb');
var request = require('superagent');
var _async = require('async');
var domain = require('domain');
var fs = require('fs');
var d = domain.create();

function updateJobs() {
  var lastTime = fs.readFileSync('time.txt');
  var ips = [];
  var ipNo = 0;
  var hasNext = true;

  return new Promise(async(resolve, reject) => {
    console.log(`-----开始更新职位，当前时间： ${new Date().toLocaleString()}------`);
    // fs.writeFileSync('time.txt',Date.now());
    ips = await db.getIps();
    var city = '全国';
    var page = 1;
    try {
      await crawlerJobs(city, page);
    } catch (error) {
      console.error(`crawlerJob position ${error}`);
      return reject(err);
    }
    console.log('------Crawler Over------');
    resolve();
  });

  async function crawlerJobs(city, page) {
    return new Promise(async(resolve, reject) => {
      var proxy, json, jobResult, totalCount, pageSize, pageCount;
      // resolve 情况：职位创建时间已小于上次爬取时间
      var success = false;
      while (!success) {
        if (ips.length == 0) {
          ips = await db.getIps();
        }
        proxy = ips[ipNo++].proxy;
        if (ipNo >= ips.length) {
          ipNo = 0;
        }
        console.log('crawlerJobs-------', city, proxy, ' page: ', page);
        try {
          json = await post({
            city: city,
            data: {
              pn: page,
              first: true
            },
            proxy: proxy
          });
        } catch (error) {
          continue;
        }
        success = true;
      }

      totalCount = json.content.positionResult.totalCount;
      jobResult = json.content.positionResult.result;
      pageSize = json.content.pageSize;
      pageCount = Math.ceil(totalCount / pageSize);
      console.log(`------Info:${city} page: ${page} ,totalCount: ${totalCount}, pageCount: ${pageCount}`);

      // 存储jobs
      var count = 0;
      for (var item of jobResult) {
        console.log(item.createTime);
        count++;
        // 职位创建时间已小于上次爬取时间
        if (Date.parse(item.createTime) <= lastTime) {
          hasNext = false;
          console.log('当前数据已最新');
          break;
        }
        item = transform(item);
      }
      try {
        // await db.addJobs(jobResult);
      } catch (error) {
        if (error.code !== 11000) { // 非重复数据错误
          console.error(`------------set into db ${error}-----------\n-------CRAWLER OVER------`);
          process.exit(1);
        }
      }

      // 爬取下一页
      if (hasNext) {
        await crawlerJobs(city, page++);
      } else {
        resolve();
      }
      //   // 顺序遍历各页数
      // if (page == 1 && pageCount > 1) {
      //   _async.timesSeries(pageCount + 1, async(n, call) => { // n:0 ~ pageCount
      //     if (n == 0 || n == 1)
      //       return call();
      //     await crawlerJobs(city, n); //Promise，请求意外错误此时已内部处理
      //     if(hasNext) return call();
      //     return call(new Error(`${city} 无新数据`));
      //   }, (err) => {
      //     console.info(`---info:end update jobs---`);
      //     return resolve();
      //   });
      // } else {
      //   return resolve();
      // }
    })
  }

  function transform(item) {
    var [min, max] = item.salary.replace(/k/g, "").split("-");
    max = parseInt(max || min);
    min = parseInt(min);
    item.salaryMin = min;
    item.salaryMax = max;
    item.salaryAvg = (min + max) / 2;
    // 无法准确判断该职位类别
    // item.positionTag = [position.name, position.firstTag];
    // 异常数据修复
    if (item.financeStage == null) item.financeStage = '无';
    if (typeof item.financeStage == 'string' && item.financeStage.match(/^null\(/)) item.financeStage = item.financeStage.replace(/null\(|\)/g, '');
    if (typeof item.financeStage == 'string' && item.workYear.match(/-.*[^年]$/g)) item.workYear += '年';
    if (item.workYear == '不限年') item.workYear = '不限';
    return item;
  }
}

process.on('uncaughtException', (err) => {
  console.log(err);
})

d.on('error', function (err) {
  console.error('Error caught by domain:', err);
  require('fs').writeFile("crash.txt", err.stack);
});

d.run(function () {
  var crawlerTime = +new Date();
  // require('fs').writeFile("time.txt", crawlerTime);
  _async.auto({
    // 1.获取cookie
    getCookie: async(callback) => {
      console.log(`------获取cookie------`);
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
      console.log(err);
      process.exit();
    }
    try {
      console.log(`-------更新统计分析结果-------`);
      // await statistic(crawlerTime);
    } catch (error) {
      console.log(err);
      process.exit();
    }
    console.log(`-------Update Over-------`);
    process.exit();
  });
});