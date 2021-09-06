const Biometric = require('./biometric_model')
const Weight = require('../weight/weight_model')
const startOfDay = require('date-fns/startOfDay')
const endOfDay = require('date-fns/endOfDay')



exports.addBiometric = (req, res, next) => {

    const height = req.body.height;
    const male = req.body.male;
    const calorie = req.body.calorie;
    const protein = req.body.protein;
    const carb = req.body.protein;
    const fat = req.body.fat;
    const age = req.body.age;
    const weight = req.body.weight;

    const userId = req.userId;



    let date = new Date();


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
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })


    let biometricDoc = new Biometric({
        user: userId,
        height: height,
        age: age,
        male: male,
        calorie: calorie,
        protein: protein,
        carb: carb,
        fat: fat
    })
    biometricDoc
        .save()
        .then(result => {
            console.log(result)
            return res.status(201).json({
                message: 'biometric created',
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



exports.getBiometric = (req, res, next) => {

    const userId = req.userId;


    Biometric.findOne({ user: userId })
        .then(biometric => {
            if (!biometric) {
                return res.status(404).json({
                    message: 'no biometric found'
                })
            }
            else {
                return res.status(200).json({
                    result: biometric
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


exports.editBiometric = (req, res, next) => {

    const height = req.body.height;
    const male = req.body.male;
    const calorie = req.body.calorie;
    const protein = req.body.protein;
    const carb = req.body.protein;
    const fat = req.body.fat;
    const age = req.body.age;
    const weight = req.body.weight;


    const userId = req.userId;

    let date = new Date();

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
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

    let biometricDoc = {
        user: userId,
        height: height,
        age: age,
        male: male,
        calorie: calorie,
        protein: protein,
        carb: carb,
        fat: fat
    }

    Biometric.findOneAndUpdate({ user: userId }, biometricDoc, { new: true }, function (err, result) {
        if (err) return res.status(500).json({
            message: err
        });
        if (!result) return res.status(404).json({
            message: "not Found"
        });
        return res.status(200).json({
            result: result
        });
    });
};
