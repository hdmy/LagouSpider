var { addIps } = require('../public/js/controldb');
var request = require('superagent');
var cheerio = require('cheerio');
var _async = require('async');
require('superagent-proxy')(request);

function fetchIp() {
  return new Promise((resolve, reject) => {
    var urls = [], proxys = [];
    for (var page = 1; page <= 5; page++) {
      urls.push('http://www.httpsdaili.com/?stype=1&page=' + page);
      urls.push('http://www.httpsdaili.com/?stype=3&page=' + page);
    }
    // 并发获取ip
    _async.mapLimit(urls, 10, async (url, callback) => {
      /*
      console.log(`start to crawler ${url} ${Date.now()}`);
      try {
        var res = await request.get(url);
      } catch (err) {
        return callback(err);
      }
      var $ = cheerio.load(res.text);
      var trs = $('#list tbody tr').toArray();
      for (var tr of trs) {
        var td = $(tr).children('td').toArray();
        proxys.push('http://' + td[0].children[0].data + ':' + td[1].children[0].data);
      }
      */
      callback();
    }, (err, res) => {
      var str = require('fs').readFileSync('ip.txt').toString();
      proxys = str.split(',');
      if (err) return reject(err);
      var ips = [];
      // 并发遍历测试ip
      _async.mapLimit(proxys, 15, async (proxy, callback) => {
        try {
          console.log(`start to test ip: ${proxy}`);
          var testip = await request.get('https://www.lagou.com/').proxy(proxy).timeout(4000);
          if (testip.statusCode == 200) {
            console.log(`-----the proxy is ${proxy}-----`);
            ips.push({ 'proxy': proxy });
          }
        } catch (error) {
          // console.log(`Ip ${error}`);
        }
        callback();
      }, async (err, res) => {
        if (err) return reject(err);
        if (ips.length == 0) return reject(new Error('No ip can test!!'));
        try {
          await addIps(ips);
        } catch (error) {
          return reject(error);
        }
        resolve();
      });
      //--end mapLimit--
    })
  });
  //--end mapLimit--
}

module.exports.fetchIp = fetchIp;
