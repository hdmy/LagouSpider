/**
 * Created by huangdan on 17/3/7.
 */
var mongoose = require('mongoose');
var config = require('config-lite').mongodb;

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(config.url, function (err) {
  if (err) {
    console.error(`connect to ${config.url} error: ${err.message}`);
    process.exit(1);
  }
});

exports.City = require('./city');
exports.Position = require('./position');
exports.Job = require('./job');
exports.Ip = require('./ip');
exports.JobTotal = require('./jobTotal');