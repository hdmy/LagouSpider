var { Ip, City, Position, JobTotal, Job } = require('../../models/index');

module.exports = {
    // 初始化
    init:()=>{
        Job.remove({}).exec();
        JobTotal.remove({}).exec();
    },
    // Ip代理
    addIps: (data) => {
        Ip.remove({}).exec();
        Ip.insertMany(data);
    },
    getIps: () => Ip.find({}).exec(),
    countIps: () => Ip.find().count().exec(),
    // 城市
    addCitys: (data) => {
        City.remove({}).exec();
        City.insertMany(data);
    },
    getCitys: () => City.find({}).exec(),
    // 职位列表
    addPositions: (data) => {
        Position.remove().exec();
        Position.insertMany(data);
    },
    getPositions: () => Position.find({}).exec(),
    // 职位数
    addJobTotal: (data) => JobTotal.create(data),
    addJobTotals: (data) => JobTotal.insertMany(data),
    getJobTotals: (...arg) => JobTotal.find(...arg).exec(),
    aggregateJobTotal: (cmd) => JobTotal.aggregate(cmd).exec(),     // 聚合查询
    updateJobTotal: (query, ndata) => JobTotal.findOneAndUpdate(query, ndata, { upsert: true }),
    // 职位详情
    addJob: (data) => Job.create(data),
    addJobs: (arr) => Job.insertMany(arr, { ordered: false }),  // 跳过插入错误的文档
    getJobs: (...arg) => Job.find(...arg).exec(),
    aggregateJob: (cmd) => Job.aggregate(cmd).exec(),     // 聚合查询
    // 最新时间
    getLatestJob:()=> Job.find({}).sort({ createTime :-1}).limit(1).exec()
}