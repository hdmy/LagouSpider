/**
 * Created by huangdan on 17/3/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
  name: { type: String, required: true }
});

// CitySchema.index({name: 1});

module.exports = mongoose.model('City', CitySchema);