const Food = require('../models/food')


exports.createFood = (req, res, next) => {

    const name = req.body.name;
    const desc = req.body.desc;
    const company = req.body.company;
    const calorie = req.body.calorie;
    const protein = req.body.protein;
    const carb = req.body.protein;
    const fat = req.body.fat;
    const unit = req.body.unit;
    const perAmount = req.body.perAmount;
    const secondaryUnits = req.body.secondaryUnits;
    const public = req.body.public;
    
    
    const user = req.userId;

    food = new Food( {
        name: name,
        desc: desc,
        company: company,
        calorie: calorie / perAmount,
        protein: protein / perAmount,
        carb: carb / perAmount,
        fat: fat / perAmount,
        unit: unit,
        creator: user,
        public: public ? true : false
    })
    
    secondaryUnits.forEach(element => {
        food.secondaryUnits.push(element)
    });

    food
    .save()
    .then(result => {
        return res.status(201).json({
            message: 'food created',
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


exports.editFood = (req, res, next) => {

    const name = req.body.name;
    const desc = req.body.desc;
    const company = req.body.company;
    const calorie = req.body.calorie;
    const protein = req.body.protein;
    const carb = req.body.protein;
    const fat = req.body.fat;
    const unit = req.body.unit;
    const perAmount = req.body.perAmount;
    const secondaryUnits = req.body.secondaryUnits;
    const public = req.body.public;
        
    const user = req.userId;
    const userRole = req.userRole

    const foodId = req.params.foodId

    Food.findById(foodId)
    .then(food => {
        if (!food) {
            return res.status(404).json({
                message: 'No Food Found'
            })
        } else {
            if ( (food.creator.toString() != user) || (userRole != "admin") ) {
                return res.status(403).json({
                    message: 'You cannot edit this food'
                })
            } else {
                food.name = name;
                food.desc = desc;
                food.company = company;
                food.calorie = calorie / perAmount;
                food.protein = protein / perAmount;
                food.fat = fat / perAmount;
                food.carb = carb / perAmount;
                food.unit = unit;
                food.secondaryUnits = secondaryUnits;
                food.public = public;

                food.save().then(result => {
                    return res.status(201).json({
                        result: result,
                        message: 'Food Edited!'
                    })
                })
                .catch(err  =>  {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                      }
                      next(err);
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

exports.deleteFood = (req, res, next) => {

    const user = req.userId;

    const foodId = req.params.foodId


    // can i use delete() insted? 
    Food.findById(foodId)
    .then(food => {
        if (!food) {
            return res.status(404).json({
                message: 'no food found'
            })
        } else {
            if ( (food.creator.toString() != user) || (userRole != "admin") ) {
                return res.status(403).json({
                    message: 'You Cannot delete this food'
                })
            } else {
                food.delete()
                res.status(202).json({
                    message: 'Food deleted'
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

