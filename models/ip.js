/**
 * Created by huangdan on 17/3/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IpSchema = new Schema({
  proxy: { type: String, required: true }
});

IpSchema.index({proxy: 1});

module.exports = mongoose.model('Ip', IpSchema);