const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const foodSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    desc: {
        type: String,
        required: true,
        maxlength: 50
    },
    calorie: {
        type: Number, 
        required: true,
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
    unit: {
        type: String, 
        required: true,
        enum: {
            values: ['gr', 'ml'],
            message: '{VALUE} is not a supported unit'
          }
    },
    serving: {
        name: {
            type: String,
            default: "وعده"
        },
        units: {
            type: Number,
            required: true
        }
    },
    verified: {
        type: Boolean, 
        default: false
    },
    public: {
        type: Boolean, 
        default: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});


module.exports = mongoose.model('Food', foodSchema);
