const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Food = require('./food');


const daySchema = new Schema({
  date: {
    type: Date,
    required: true  
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: Number,
    min:1,
    max:5
  },
  foods : [
    {
      food: {
        type: Schema.Types.ObjectId,
        ref: Food
      },
      amount: Number,
      time: Date
    }
  ]
});

daySchema.index({user:1 , date: 1} , {unique: true}) // no user has more than one instance of the same day

module.exports = mongoose.model('Day', daySchema);
