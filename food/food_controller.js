const Food = require('./food_model')
const Consume = require('../profile/consume/consume_model')


exports.createFood = (req, res, next) => {

    const name = req.body.name;
    const desc = req.body.desc;
    const calorie = req.body.calorie;
    const protein = req.body.protein;
    const carb = req.body.protein;
    const fat = req.body.fat;
    const unit = req.body.unit;
    const serving = req.body.serving;
    
    const userId = req.userId;

    food = new Food( {
        name: name,
        desc: desc,
        calorie: calorie,
        protein: protein,
        carb: carb,
        fat: fat,
        unit: unit,
        creator: userId,
        serving: serving,
    })


    Food.countDocuments({creator: userId}).then( (count) => {
        if (count => 50) {
            return res.status(403).json({
                message: "شما به حد نصاب تعداد غذاها رسیده‌اید"
                })
        }
    })

    food
    .save()
    .then(result => {
        return res.status(201).json({
            message: 'غذا ثبت شد',
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
    delete newData.creator;

    const foodId = req.params.foodId;

    const userId = req.userId;
    const userRole = req.userRole;


    // insures that users can't modify their or other's foods afther creating them 
    // callback vs. promise?
    if (!['admin','mod'].includes(userRole)) {
        delete newData.verified;

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


    const foodId = req.params.foodId


    

    // can i use delete() insted? 
    Food.findById(foodId)
    .then(food => {
        if (!food) {
            return res.status(404).json({
                message: 'no food found'
            })
        } else {
            if ( (food.creator.toString() != user)) {
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

    const foodId = req.params.foodId

    Food.findOne({_id: foodId, $or : [ {public: true} , {creator: userId} ]})
    .then(food => {
        if (!food) {
            return res.status(404).json({
                message: 'این غذا وجود ندارد'
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
    const userId = req.userId;

    let foodName= new RegExp(req.params.foodname,'i'); 
    Food.find({name:foodName , $or : [ {public: true} , {creator: userId} ] })
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


exports.myFoods = (req, res , next) => {
    const userId = req.userId;
    Food.find({creator: userId})
    .then(foods => {

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


exports.deleteFoodWarning = (req, res , next) => {
    
    const foodId = req.params.foodId;
    Consume.countDocuments({food:foodId})
    .then( (count) => {
        if (count > 0) {
            res.status(200).json({
                message: `این غذا ${count} بار مصرف شده است. حذف شود؟`
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
