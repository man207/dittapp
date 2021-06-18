const Consume = require('./consume_model')


exports.createConsume = (req, res, next) => {

    const food = req.body.food;
    const serving = req.body.serving;
    const amount = req.body.amount;

    if (req.body.date) {
        var date = req.body.date;
    } else {
        var date = Date.now();
    }

    const user = req.userId;

    consume = new Consume({
        food: food,
        user: user,
        serving: serving,
        amount: amount,
        date: date
    })


    consume
        .save()
        .then(result => {
            return res.status(201).json({
                message: 'consume created',
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


//only can change amount and serving
//admin can't change this
exports.editConsume = (req, res, next) => {

    const newData = {};

    if (req.body.amount) {
        newData.amount = req.body.amount
    }
    if (req.body.serving !== undefined) {
        newData.serving = req.body.serving
    }

    const consumeId = req.params.consumeId;

    const userId = req.userId;


    Consume.findOneAndUpdate({ _id: consumeId, user: userId }, newData, { new: true }, function (err, doc) {
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

exports.deleteConsume = (req, res, next) => {

    const user = req.userId;
    const userRole = req.userRole;

    const consumeId = req.params.consumeId


    // can i use delete() insted? 
    Consume.findById(consumeId)
        .then(consume => {
            if (!consume) {
                return res.status(404).json({
                    message: 'no consume found'
                })
            } else {
                if ((consume.user.toString() != user) && (userRole != "admin")) {
                    return res.status(403).json({
                        message: 'You Cannot delete this consume'
                    })
                } else {
                    consume.delete()
                    res.status(200).json({
                        message: 'Consume deleted'
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

exports.getConsume = (req, res, next) => {

    const userId = req.userId;
    const userRole = req.userRole;

    const consumeId = req.params.consumeId;

    Consume.findById(consumeId).populate('food')
        .then(consume => {
            if (!consume) {
                return res.status(404).json({
                    message: 'no consume found'
                })
            } else if ((consume.user.toString() != userId) && (!['admin', 'mod'].includes(userRole))) {
                return res.status(403).json({
                    message: 'no consume found'
                })
            }
            else {
                return res.status(200).json({
                    result: consume
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