const Food = require('./food_model')


exports.createFood = (req, res, next) => {

    const name = req.body.name;
    const desc = req.body.desc;
    const company = req.body.company;
    const calorie = req.body.calorie;
    const protein = req.body.protein;
    const carb = req.body.protein;
    const fat = req.body.fat;
    const unit = req.body.unit;
    const serving = req.body.serving;
    const perAmount = req.body.perAmount
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
        serving: serving,
    })
    
        
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


  //findandupdate doesn't concern with extra arguments
exports.editFood = (req, res, next) => {

    const newData = req.body;

    const foodId = req.params.foodId;

    const userId = req.userId;
    const userRole = req.userRole;


    // insures that users can't modify their or other's foods afther creating them 
    // callback vs. promise?
    if (!['admin','mod'].includes(userRole)) {
        delete newData.verified;
        delete newData.creator;

        Food.findOneAndUpdate({_id: foodId , creator: userId }, newData, { new: true}, function(err, doc) {
            if (err) return res.status(500).json({
                message: err
                });
            if (!doc) return res.status(404).json({
                message: "not Found"
                });
            return res.status(200).json({
                resault: doc
            });
        });
    } else {
        Food.findByIdAndUpdate(foodId, newData, { new: true}, function(err, doc) {
            if (err) return res.status(500).json({
                message: err
            });
            if (!doc) return res.status(404).json({
                message: "not Found"
                });
            return res.status(200).json({
                resault: doc
            });
        });
    }


    
  };

exports.deleteFood = (req, res, next) => {

    const user = req.userId;
    const userRole = req.userRole

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
                res.status(200).json({
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

exports.getFood = (req, res , next) => {
    
    const userId = req.userId;
    const userRole = req.userRole

    const foodId = req.params.foodId

    Food.findById(foodId)
    .then(food => {
        if (!food) {
            return res.status(404).json({
                message: 'no food found'
            })
        }
        else {
            return res.status(200).json({
                result: food
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

exports.searchFood = (req, res , next) => {
    let foodName= new RegExp(req.params.foodname,'i'); 
    Food.find({name:foodName})
    .then(foods => {
        console.log(foods)

        if (!foods) {
            return res.status(404).json({
                message: 'غذایی پیدا نشد'
            })
        }
        else {
            return res.status(200).json({
                result: foods
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