const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const statSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  weights: [
    {
      weight: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  height: {
    type: Number,
    required: true
  },
  goalWieght: {
    type: Number,
    required: true
  },
  intakeGoal: [
    {
    carb: {
      type: Number,
      default: 30,
      min:0
    },
    fat: {
      type: Number,
      default: 30,
      min:0
    },
    protein: {
      type: Number,
      default: 40,
      min:0
    },
    calories: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    validate: {
      validator:function(macros) {
        return (macros.carb + macros.fat + macros.protein) == 100
      },
      message: 'Sum of macro precentage must be 100'
    },
    required: true
  } 
]
});

statSchema.set(setDefaultOnInsert , true)

module.exports = mongoose.model('Stat', statSchema);
