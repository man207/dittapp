const Burn = require('./burn_model')
const startOfDay = require('date-fns/startOfDay')
const endOfDay = require('date-fns/endOfDay')


exports.createBurn = (req, res, next) => {

    const activity = req.body.activity;
    const minutes = req.body.minutes;

    if (req.body.date) {
        var date = req.body.date;
    } else {
        var date = Date.now();
    }

    const user = req.userId;

    burn = new Burn({
        activity: activity,
        user: user,
        minutes: minutes,
        date: date
    })


    burn
    .save()
    .then(result => {
        return res.status(201).json({
            message: 'burn created',
            result: result
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
};

//only can change minutes
exports.editBurn = (req, res, next) => {

    const newData = {};

    if (req.body.minutes) {
        newData.minutes = req.body.minutes
    }

    const burnId = req.params.burnId;

    const userId = req.userId;


    Burn.findOneAndUpdate({ _id: burnId, user: userId }, newData, { new: true }, function (err, result) {
        if (err) return res.status(500).json({
            message: err
        });
        if (!result) return res.status(404).json({
            message: "not Found"
        });
        return res.status(200).json({
            resault: result
        });
    });


};

exports.deleteBurn = (req, res, next) => {

    const user = req.userId;

    const burnId = req.params.burnId


    Burn.findById(burnId)
        .then(burn => {
            if (!burn) {
                return res.status(404).json({
                    message: 'no burn found'
                })
            } else {
                if (burn.user.toString() != user) {
                    return res.status(403).json({
                        message: 'You Cannot delete this burn'
                    })
                } else {
                    burn.delete()
                    res.status(200).json({
                        message: 'Burn deleted'
                    })
                }
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};

exports.getBurn = (req, res, next) => {

    const userId = req.userId;
    const userRole = req.userRole

    const burnId = req.params.burnId

    Burn.findById(burnId).populate('activity')
        .then(burn => {
            if (!burn) {
                return res.status(404).json({
                    message: 'no burn found'
                })
            } else if ((burn.user.toString() != userId) && (!['admin', 'mod'].includes(userRole))) { // burn is not made public by the user
                return res.status(403).json({
                    message: 'no burn found'
                })
            }
            else {
                return res.status(200).json({
                    result: burn
                })
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};


exports.getDayBurn = (req, res, next) => {

    const userId = req.userId;
    const userRole = req.userRole;

    const date = req.params.date;

    
    if (!date) {
        day = new Date()
    }
    else {
        day = new Date(date[0], date[1] - 1, date[2])
    }
    
    Burn.find(
        { user: userId,
            date: 
            {
                $gte: startOfDay(day),
                $lt: endOfDay(day)
            }
        }).populate('activity')
        .then(burn => {
            if (!burn) {
                return res.status(404).json({
                    message: 'no burn found'
                })
            } else {
                return res.status(200).json({
                    result: burn
                })
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};