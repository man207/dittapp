const Weight = require('./weight_model')


exports.createWeight = (req, res, next) => {

    const weight = req.body.weight;

    if (req.body.date) {
        const date = req.body.date;
    } else {
        const date = Date.now();
    }

    const user = req.userId;

    weight = new Weight({
        activity: activity,
        user: user,
        minutes: minutes,
        date: date
    })


    weight
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
};


//only can change weight
exports.editWeight = (req, res, next) => {

    const newData = {};

    if (req.body.weight) {
        newData.weight = req.body.weight
    }

    const weightId = req.params.weightId;

    const userId = req.userId;


    Weight.findOneAndUpdate({ _id: weightId, user: userId }, newData, { new: true }, function (err, doc) {
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
                if ((weight.creator.toString() != user) || (userRole != "admin")) {
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
            } else if ((weight.creator.toString() != userId) && (!['admin', 'mod'].includes(userRole))) {
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