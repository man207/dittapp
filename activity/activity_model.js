const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const activitySchema = new Schema({

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
    caloriePerMinute: {
        type: Number,
        required: true,
        min:0,
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
    },
    
});


module.exports = mongoose.model('Activity', activitySchema);
