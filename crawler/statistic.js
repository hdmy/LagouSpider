var db = require('../public/js/controldb');
var util = require('../public/js/util');
var fs = require('fs');
var async = require('async');

// **** 以下均只分析技术, By: group by ****
// 全国职业数量分布 -- 地图
async function getJobsNumByCities() {
  var cmd = [];
  cmd.push({ $match: { city: { $ne: '全国' }, firstTag: '技术', total: { $gt: 0 } } });
  cmd.push({ $group: { _id: '$city', value: { $sum: '$total' } } });
  return await db.aggregateJobTotal(cmd);
}

// 全国职业平均薪资分布 -- 地图
async function getJobsSalaryByCities() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$city', value: { $avg: '$salaryAvg' } } });
  return util.formatFloat(await db.aggregateJob(cmd), 'value');
}

// 全国各职业数量平均薪资 -- 柱型
async function getJobNumAndSalary() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$positionTag', num: { $sum: 1 }, avg: { $avg: '$salaryAvg' } } });
  return util.formatFloat(await db.aggregateJob(cmd), 'avg');
}

//Top 25热门职位数量比、薪资比 -- 柱型
async function getComparisonOfHot() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: { city: '$city', position: '$positionTag' }, num: { $sum: 1 }, avg: { $avg: '$salaryAvg' } } });
  cmd.push({ $sort: { num: -1, avg: -1 } });
  cmd.push({ $limit: 25 });
  return util.formatFloat(await db.aggregateJob(cmd), 'avg');
}

// 工资范围 -- 和弦图
async function getSalaryRange() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: { from: '$salaryMin', to: '$salaryMax' }, num: { $sum: 1 } } });
  return await db.aggregateJob(cmd);
}

// 全国各职业最高、最低薪资 -- 柱型
async function getSalaryRangeByJob() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$positionTag', max: { $max: '$salaryMax' }, min: { $min: '$salaryMin' } } });
  return await db.aggregateJob(cmd);
}

// 职业日总量 -- 折线
async function getDailyNum() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$createTime', num: { $sum: 1 } } });
  cmd.push({ $sort: { _id: -1 } });
  return await db.aggregateJob(cmd);
}

// 不同融资阶段公司平均薪资、数量比 -- 折线、柱型
async function getNumAndSalaryByFinance() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$financeStage', avg: { $avg: '$salaryAvg' }, num: { $sum: 1 } } });
  cmd.push({ $sort: { '_id': 1, 'avg': -1 } });
  return util.formatFloat(await db.aggregateJob(cmd), 'avg');
}

// 不同工作经验平均薪资、数量比 -- 折线、柱型
async function getNumAndSalaryByWorkYear() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$workYear', avg: { $avg: '$salaryAvg' }, num: { $sum: 1 } } });
  return util.formatFloat(await db.aggregateJob(cmd), 'avg');
}

// 不同学历平均薪资、数量比 -- 折线、柱型
async function getNumAndSalaryByEducation() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: '$education', avg: { $avg: '$salaryAvg' }, num: { $sum: 1 } } });
  return util.formatFloat(await db.aggregateJob(cmd), 'avg');
}

// 各岗位在不同工作经验下的平均年薪 -- 多条形图
async function getSalaryByJobAndWorkYear() {
  var cmd = [];
  cmd.push({ $match: { positionTag: '技术' } });
  cmd.push({ $group: { _id: { position: '$positionTag', workYear: '$workYear' }, avg: { $avg: '$salaryAvg' } } });
  cmd.push({ $sort: { '_id.position': 1, 'avg': -1 } });
  return util.formatFloat(await db.aggregateJob(cmd), 'avg');
}

module.exports = function statistic(crawlerTime) {
  return new Promise(async (resolve, reject) => {
    var latestJob = await db.getLatestJob()
    var latestTime = Date.parse(latestJob[0].createTime);
    // 更新全部JobTotals
    var cmd = { $group: { _id: { position: '$positionTag', city: '$city'}, total:{$sum : 1} } };
    var totals = await db.aggregateJob(cmd);
    for(var i of totals){
      var item = {
        city: i._id.city,
        position: i._id.position[0],
        firstTag: i._id.position[1],
        secondTag: i._id.position[2],
        total: i.total,
      };
      try {
        await db.updateJobTotal({'city': i._id.city, 'position': i._id.position[0] }, item);
      } catch (error) {
        console.error(`------------set into db ${error}-----------\n-------CRAWLER OVER------`);
        process.exit(1);
      }
    }
    async.auto({
      // 1.并发完成各统计
      MapNum: async (callback) => {
        try {
          var result = await getJobsNumByCities();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      MapSalary: async (callback) => {
        try {
          var result = await getJobsSalaryByCities();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      JobNumAndSalary: async (callback) => {
        try {
          var result = await getJobNumAndSalary();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      HotCmp: async (callback) => {
        try {
          var result = await getComparisonOfHot();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      SalaryRange: async (callback) => {
        try {
          var result = await getSalaryRange();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      JobSalaryRange: async (callback) => {
        try {
          var result = await getSalaryRangeByJob();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      DailyNum: async (callback) => {
        try {
          var result = await getDailyNum();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      Finance: async (callback) => {
        try {
          var result = await getNumAndSalaryByFinance();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      WorkYear: async (callback) => {
        try {
          var result = await getNumAndSalaryByWorkYear();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      Education: async (callback) => {
        try {
          var result = await getNumAndSalaryByEducation();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
      Ability: async (callback) => {
        try {
          var result = await getSalaryByJobAndWorkYear();
        } catch (error) {
          callback(error);
        }
        callback(null, result);
      },
    }, function (err, results) {
      if (err) return reject(err);
      results.latestTime = latestTime;   // 添加最新时间标识
      // fs.writeFileSync('time.txt',latestTime);
      fs.writeFileSync('statistic.json', JSON.stringify(results), (err) => {
        console.log(`-------数据存储失败-------\n${results}`);
        return reject();
      });
      console.log(`-------STATISTIC OVER-------`);
      resolve();
    });
  })
}
