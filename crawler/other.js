var { addCitys, addPositions } = require('../public/js/controldb');
var request = require('superagent');
var cheerio = require('cheerio');

function fetchCity() {
  return new Promise(async (resolve, reject) => {
    console.log(`start to crawler city ${Date.now()}`);
    try {
      var res = await request.get('http://www.lagou.com/lbs/getAllCitySearchLabels.json').timeout(1000);
    } catch (err) {
      return reject(err);
    }
    var all = res.body.content.data.allCitySearchLabels;
    var cities = [];
    for (var cityLabel in all) {
      for (var city of all[cityLabel]) {
        cities.push({ name: city.name });
      }
    }
    try {
      await addCitys(cities);
    } catch (err) {
      return reject(err);
    }
    resolve();
    console.log('**************finish crawler city data***************');
  })
}

function fetchPosition() {
  return new Promise(async (resolve, reject) => {
    console.log(`start to crawler position  ${Date.now()}`);
    try {
      var res = await request.get('https://www.lagou.com/');
    } catch (err) {
      return reject(err);
    }
    var $ = cheerio.load(res.text);
    var positions = [];
    var menus = $('#sidebar .menu_box').toArray();
    for (var menu of menus) {
      var position = {};
      position.name = $(menu).find('.menu_main h2').text().replace(/\s/g, '');
      position.sub = [];
      var dls = $(menu).find('.menu_sub dl').toArray();
      for (var dl of dls) {
        var dlPosition = {};
        dlPosition.name = $(dl).find('dt a').text();
        dlPosition.position = [];
        var dds = $(dl).find('dd a').toArray();
        for (var dd of dds) {
          dlPosition.position.push($(dd).text());
        }
        position.sub.push(dlPosition);
      }
      positions.push(position);
    }
    try {
      await addPositions(positions);
    } catch (err) {
      return reject(err);
    }
    resolve();
    console.log('**************finish crawer position data***************');
  })
}

module.exports = { fetchCity, fetchPosition };
