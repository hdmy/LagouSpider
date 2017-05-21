var request = require('superagent');
require('superagent-proxy')(request);

function post({ city, data, proxy }) {
  var url = 'https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false';
  if (city) {
    url = url + '&city=' + city;
  }
  // x-www-form-urlencoded限制，需字符串化
  if ('string' !== typeof data) {
    data = require('querystring').stringify(data);
  }
  return new Promise((resolve, reject) => {
    request.post(url).send(data).proxy(proxy).timeout(4000)
      .set({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': global.Cookie,  // 请求携带 Cookie
        // 无关伪装
        // Host: 'www.lagou.com',
        Connection: 'keep-alive',
        Origin: 'https://www.lagou.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Anit-Forge-Code': 0,
        'X-Anit-Forge-Token': 'None',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        // 'x-forwarded-for': proxy
      }).end((err, res) => {
        if (err) {
          err.code !== 'ECONNABORTED' && err.code !== 'ECONNRESET' && console.log(err);
          return reject(err);
        }
        if (res.body.hasOwnProperty('success') && res.body.success == true) return resolve(res.body);
        reject(new Error('post request error'));
      });
  })
};

module.exports.post = post;