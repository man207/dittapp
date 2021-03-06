const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const weightSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: {
      type: Number,
      min: 0,
      max: 300,
      required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});


module.exports = mongoose.model('Weight', weightSchema);
