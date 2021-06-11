const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const exersiceSchema = new Schema({
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
  }
});


module.exports = mongoose.model('Exersice', exersiceSchema);
