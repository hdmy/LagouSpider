const express = require('express');
const path = require('path');
var port = process.env.PORT || 3000;
var app = express();
var data = JSON.parse(require('fs').readFileSync('./statistic.json'));
var exec = require('child_process').exec;

// 静态文件请求
app.use(express.static(path.join(__dirname, 'public')));
// 表单转义
app.use(require('body-parser').urlencoded({ extended: true }));

app.set('views', './views/pages')
    .set('view engine', 'pug')
    .listen(port);

app.get('/db', async (req, res, next) => {
    var cmd = [];
    cmd.push({ $match: { positionTag: '技术' } });
    cmd.push({ $sort: { createTime: -1 } });
    cmd.push({ $limit: 200 });
    var jobs = await require('./public/js/controldb').aggregateJob(cmd);
    res.render('list', {
        title: '计算机相关岗位数据列表',
        jobs: jobs
    })
});

app.get('/index', (req, res, next) => {
    res.render('index', {
        title: '基于爬虫的计算机类职位数据提取及分析'
    });
});

app.get('/api', (req, res, next) => {
    res.send(data);
});

app.post('/predict', (req, res, next) => {
    var cmd = 'python '+ path.join(__dirname,'dataMining','predict.py') + ' ';
    // " 在python中会消失
    var arg = JSON.stringify(req.body).replace(/"/g,'\\');
    console.log(arg);
    require('child_process').exec(cmd + arg, (err,stdout,stderr)=>{
        if(err){
            console.log('stderr:',err);
            res.status(503);
        }
        if(stdout){
            console.log('stdout:',stdout);
            res.setHeader("Content-Type","text/plain");
            res.setHeader("Access-Control-Allow-Origin","*");
            res.send(stdout);
        }
    });
});

require('child_process').spawn("cmd", ["/c","start","http://127.0.0.1:3000/index"]);