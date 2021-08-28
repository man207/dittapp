const Weight = require('./weight_model')
const startOfDay = require('date-fns/startOfDay')
const endOfDay = require('date-fns/endOfDay')

exports.addWeight = (req, res, next) => {

    const weight = req.body.weight;
    const userId = req.userId;

    if (req.body.date) {
        var date = new Date(req.body.date);
    } else {
        var date = new Date();
    }


    
    console.log(date)


    

    Weight.findOne(
        {
            user: userId,
            date:
            {
                $gte: startOfDay(date),
                $lt: endOfDay(date)
            }
        })
        .then(doc => {
            if (!doc) {
                let weightDoc = new Weight({
                    user: userId,
                    weight: weight,
                    date: date
                });
                weightDoc
                    .save()
                    .then(result => {
                        return res.status(201).json({
                            message: 'weight created',
                            result: result
                        })
                    })
                    .catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    })
            } else {
                doc.weight = weight;
                doc.save();
                return res.status(200).json({
                    result: weight
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


exports.deleteWeight = (req, res, next) => {

    const user = req.userId;

    const weightId = req.params.weightId


    Weight.findById(weightId)
        .then(weight => {
            if (!weight) {
                return res.status(404).json({
                    message: 'no weight found'
                })
            } else {
                if (weight.user.toString() != user) {
                    return res.status(403).json({
                        message: 'You Cannot delete this weight'
                    })
                } else {
                    weight.delete()
                    res.status(200).json({
                        message: 'Weight deleted'
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

exports.getWeight = (req, res, next) => {

    const userId = req.userId;
    const userRole = req.userRole

    const weightId = req.params.weightId

    Weight.findById(weightId)
        .then(weight => {
            if (!weight) {
                return res.status(404).json({
                    message: 'no weight found'
                })
            } else if ((weight.user.toString() != userId) && (!['admin', 'mod'].includes(userRole))) {
                return res.status(403).json({
                    message: 'no weight found'
                })
            }
            else {
                return res.status(200).json({
                    result: weight
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

exports.getLatestWeight = (req, res, next) => {

    const userId = req.userId;


    const date = req.params.date;
    

    if (!date) {
        var day = new Date()
    }
    else {
        var day = new Date(date[0], date[1] - 1, date[2])
    }

    Weight.find(
        {
            user: userId,
            date:
            {
                $lte: endOfDay(day)
            }
        }).sort({ date: -1 }).limit(1)
        .then(weight => {
            if (!weight) {
                return res.status(404).json({
                    message: 'no weight found'
                })
            } else {

                return res.status(200).json({
                    result: weight[0]
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