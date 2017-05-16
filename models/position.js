/**
 * Created by huangdan on 17/3/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PositionSchema = new Schema({
  name: { type: String, required: true },
  sub: { type: Array, required: true}
});

// CitySchema.index({name: 1});

module.exports = mongoose.model('Position', PositionSchema);