var { fetchIp } = require('./ip');
var { fetchCity, fetchPosition } = require('./other');
var { fetchJobs } = require('./lagou');
var statistic = require('./statistic');
var util = require('../public/js/util');
var db = require('../public/js/controldb');
var request = require('superagent');
var _async = require('async');
var fs = require('fs');
var path = require('path');
var domain = require('domain');
var d = domain.create();

d.on('error', function (err) {
  console.error('Error caught by domain:', err);
  fs.writeFile("crash.txt", err.stack);
});

d.run(function () {
  _async.auto({
    // 1.并发请求 ip | city | position | cookies
    getIp: async(callback) => {
      try {
        console.log(`------获取可用Ip------`);
        await fetchIp();
      } catch (error) {
        callback(error);
      }
      setTimeout(() => callback(), 20);
    },
    getCity: async(callback) => {
      try {
        console.log(`------获取所有城市------`);
        await fetchCity();
      } catch (error) {
        callback(error);
      }
      callback();
    },
    getPosition: async(callback) => {
      try {
        console.log(`------获取所有职位类别------`);
        await fetchPosition();
      } catch (error) {
        callback(error);
      }
      callback();
    },
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
    getJobs: ['getIp', 'getCity', 'getPosition', 'getCookie', async(res, callback) => {
      try {
        // await db.init();
        await fetchJobs();
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
      await statistic();
    } catch (error) {
      console.log(err);
      process.exit();
    }
    console.log(`-------CRAWLER OVER-------`);

    // 定时执行更新任务
    function scheduleCronstyle() {
      var schedule = require('node-schedule');
      // 秒 分 时 天 月 周
      schedule.scheduleJob('0 38 14 * * *', function () {
        console.log(`-------开始定时更新任务-------`);
        var cmd = 'node ' + path.join(__dirname, 'update_jobs.js');
        require('child_process').exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.log('update error:', err);
          }
        });
      });
    }
    scheduleCronstyle();

  });
});

process.on('uncaughtException', (err) => {
  console.log(err);
})