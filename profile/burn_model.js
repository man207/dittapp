const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const burnSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  },
  minutes: {
      type: Number,
      required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});


module.exports = mongoose.model('Burn', burnSchema);
