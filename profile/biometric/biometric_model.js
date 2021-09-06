const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const biometricSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  height: {
    type: Number,
    min: 0,
    max: 300,
    required: true
  },
  male: {
    type: Boolean,
    default: false
  },
  age: {
    type: Number,
    min: 0,
    max: 140,
    required: true
  },
  calorie: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carb: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
});


module.exports = mongoose.model('Biometric', biometricSchema);
