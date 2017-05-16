/**
 * Created by huangdan on 17/3/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobTotalSchema = new Schema({
  position: { type: String, required: true },
  firstTag: { type: String, required: true},
  secondTag: { type: String, required: true},
  city: { type: String, required: true},
  total: { type: Number, required: true}
});

module.exports = mongoose.model('JobTotal', JobTotalSchema);