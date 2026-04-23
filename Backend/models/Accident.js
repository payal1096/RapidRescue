const mongoose = require('mongoose');
module.exports = mongoose.model('Accident', new mongoose.Schema({
  name:String,
  contact:String,
  type:String,
  photo:String,
  description:String,
  lat:Number,
  lng:Number,
  ambulanceAssigned:{type:Boolean, default:true},
  createdAt:{type:Date, default:Date.now}
}));