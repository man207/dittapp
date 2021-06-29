const Burn = require('./burn_model')
const jalaali = require('jalaali-js')
const startOfDay = require('date-fns/startOfDay')
const endOfDay = require('date-fns/endOfDay')


exports.createBurn = (req, res, next) => {

    const activity = req.body.activity;
    const minutes = req.body.minutes;

    if (req.body.date) {
        const date = req.body.date;
    } else {
        const date = Date.now();
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


    Burn.findOneAndUpdate({ _id: burnId, user: userId }, newData, { new: true }, function (err, doc) {
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
    const userRole = req.userRole;

    const burnId = req.params.burnId


    Burn.findById(burnId)
        .then(burn => {
            if (!burn) {
                return res.status(404).json({
                    message: 'no burn found'
                })
            } else {
                if ((burn.user.toString() != user) || (userRole != "admin")) {
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

    Burn.findById(burnId)
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

    const date = req.body.date;

    
    if (!date) {
        day = new Date()
    }
    else {
        day = jalaali.toGregorian(date[0], date[1], date[2])
        day = new Date(day.gy, day.gm - 1, day.gd)
    }
    
    burnBurn.find(
        { user: userId,
            date: 
            {
                $gte: startOfDay(new Date(day.gy, day.gm - 1, day.gd)),
                $lt: endOfDay(new Date(day.gy, day.gm - 1, day.gd))
            }
        })
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