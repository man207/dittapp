const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const activitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cpm: {
        type: Number,
        min: 0,
        required: true
    }
});


module.exports = mongoose.model('Activity', activitySchema);
