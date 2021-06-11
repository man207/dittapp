const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const consumeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  food: {
    type: Schema.Types.ObjectId,
    ref: 'Food'
  },
  serving: {
    type: Schema.Types.ObjectId,
  },
  amount: {
    type: Number,
    required: true
  }
});


module.exports = mongoose.model('Consume', consumeSchema);
