var _async = require('async');
var db = require('../public/js/controldb');
var { post } = require('../public/js/method');
var ipNo = 0, ips = [];

function fetchJobs() {
  return new Promise(async (resolve, reject) => {
    console.log(`start to fetch jobs ${Date.now()}`);
    try {
      await crawlerJob(crawlerJobs);
    } catch (error) {
      return reject(err);
    }
    resolve();
  })
}

async function crawlerJob(crawlerFn) {
  return new Promise(async (resolve, reject) => {
    ips = await db.getIps();
    var cities = await db.getCitys();
    var positionDb = await db.getPositions();
    var positions = [];
    for (var first of positionDb) {
      for (var sub of first.sub) {
        for (var position of sub.position) {
          positions.push({ name: position, firstTag: first.name, secondTag: sub.name });
        }
      }
    }
    console.log('start', cities.length, positions.length);
    // var flag = false, flag2 = false;
    // 顺序遍历各城市
    _async.mapSeries(cities, (city, callback) => {
      // if (city.name == '北京') flag = true;
      // if (!flag) return callback();
      // 并发遍历各职位
      _async.mapLimit(positions, 7, async (position, call) => {
        // if (!flag2) {
        //   if (position.firstTag == '产品') flag2 = true;
        //   else return call();
        // }
        try {
          await crawlerFn(city.name, position, 1);
        } catch (error) {
          console.error('crawler job error');
          call(error);
        }
        call();
      }, (err) => {
        if (err) {
          console.error(`crawlerJob position ${err}`);
          return callback(err);
        }
        console.log('end crawler ', city);
        callback();
      });
      // --end mapLimit--
    }, (err) => {
      if (err) return reject(err);
      console.log('**************finish crawler job***************');
      resolve();
    })
    // --end mapSeries--
  })
}

async function crawlerJobs(city, position, page) {
  return new Promise(async (resolve, reject) => {
    var proxy, json, jobResult, totalCount, pageSize, pageCount;
    // resolve 情况：存完数据 1.只有p1; 2.并发请求的多页完成后resolve; 3.全国无需
    var success = false;

    while (!success) {
      if (ips.length == 0) {
        ips = await db.getIps();
      }
      proxy = ips[ipNo++].proxy;
      if (ipNo >= ips.length) {
        ipNo = 0;
      }
      console.log('crawlerJobs-------', city, position, proxy, ' page: ', page);
      try {
        json = await post({ city: city, data: { kd: position.name, pn: page, first: true }, proxy: proxy });
      } catch (error) {
        continue;
      }
      success = true;
    }

    totalCount = json.content.positionResult.totalCount;
    jobResult = json.content.positionResult.result;
    pageSize = json.content.pageSize;
    pageCount = Math.ceil(totalCount / pageSize);
    console.log(`------Info:${city} ${position.name} page: ${page} ,totalCount: ${totalCount}, pageCount: ${pageCount}`);

    // 1.存储total
    // if (page == 1) {
    //   var item = {
    //     city: city,
    //     position: position.name,
    //     firstTag: position.firstTag,
    //     secondTag: position.secondTag,
    //     total: totalCount,
    //   };
    //   try {
    //     await db.addJobTotal(item);
    //   } catch (error) {
    //     console.error(`------------set into db ${error}-----------\n-------CRAWLER OVER------`);
    //     process.exit(1);
    //   }
    // }

    // 2.该职位无数据 | 请求无效，以错误的形式reject
    if (json.content.pageNo == 0) {
      console.log(city, position.name, '无数据');
      if (page !== 1) {
        return reject(new Error(`${city} ${position.name} 无数据`));
      } else {
        return resolve();
      }
    }

    // 3.存储jobs
    await setInDb(city, position, jobResult);

    // 4.并发遍历各页数
    if (page == 1 && pageCount > 1) {
      var hasNext = true;
      _async.timesLimit(pageCount + 1, 7, async (n, call) => {   // n:0 ~ pageCount
        if (n == 0 || n == 1)
          return call();
        try {
          await crawlerJobs(city, position, n);   //Promise
        } catch (error) {
          console.error(`async.timesLimit page ${error}`);    //只有达请求上限的错误，请求意外错误此时已内部处理
          hasNext && call(error);
        }
        call();
      }, (err) => {
        hasNext = false;
        console.info(`---info:end crawler ${city.name} ${position.name} jobs`);
        return resolve();
      });
    } else {
      return resolve();
    }
  })
}

async function setInDb(city, position, jobs) {
  for (var item of jobs) {
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
  }
  try {
    await db.addJobs(jobs);
  } catch (error) {
    if (error.code !== 11000) {    // 非重复数据错误
      console.error(`------------set into db ${error}-----------\n-------CRAWLER OVER------`);
      process.exit(1);
    }
  }
}

module.exports = { fetchJobs };