/**
 * Created by huangdan on 17/3/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
  positionName: { type: String },
  positionId: { type: Number, unique: true },
  workYear: { type: String },
  education: { type: String },
  companyFullName: { type: String },
  companyShortName: { type: String },
  city: { type: String },
  district: { type: String },
  businessZones: { type: Array },
  industryField: { type: String },
  financeStage: { type: String },
  companySize: { type: String },
  companyLabelList: { type: Array },
  positionAdvantage: { type: String },
  salary: { type: String },
  salaryAvg: { type: Number },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  positionTag: { type: Array },
  createTime: { type: Date },
});

// JobSchema.index({positionId: 1});

module.exports = mongoose.model('Job', JobSchema);