const Activity = require('./activity_model')
const Burn = require('../profile/burn/burn_model')


exports.createActivity = (req, res, next) => {

    const name = req.body.name;
    const desc = req.body.desc;
    const caloriePerMinute = req.body.caloriePerMinute;

    const userId = req.userId;

    activity = new Activity( {
        name: name,
        desc: desc,
        caloriePerMinute: caloriePerMinute,
        creator: userId,
    })
    
    Activity.countDocuments({creator: userId}).then( (count) => {
        if (count >= 50) {
            return res.status(403).json({
                message: "شما به حد نصاب تعداد فعالیت ها رسیده‌اید"
                })
        }
    })

    activity.save()
    .then(result => {
        return res.status(201).json({
            message: 'Activity Creted',
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
exports.editActivity = (req, res, next) => {

    const newData = req.body;
    delete newData.creator;

    const activityId = req.params.activityId;

    const userId = req.userId;
    const userRole = req.userRole;


    // insures that users can't modify their or other's activities validity afther creating them 
    // callback vs. promise?
    if (!['admin','mod'].includes(userRole)) {
        delete newData.verified;

        Activity.findOneAndUpdate({_id: activityId , creator: userId }, newData, { new: true}, function(err, doc) {
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
        Activity.findByIdAndUpdate(activityId, newData, { new: true}, function(err, doc) {
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

exports.deleteActivity = (req, res, next) => {

    const user = req.userId;

    const activityId = req.params.activityId


    // can i use delete() insted? 
    Activity.findById(activityId)
    .then(activity => {
        if (!activity) {
            return res.status(404).json({
                message: 'فعالیتی پیدا نشد'
            })
        } else {
            if ( (activity.creator.toString() != user)   ) {
                return res.status(403).json({
                    message: 'شما نمی‌توانید این فعالیت را حذف کنید'
                })
            } else {
                activity.delete()
                res.status(202).json({
                    message: 'فعالیت حذف شد'
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

exports.getActivity = (req, res , next) => {
    
    const userId = req.userId;
    const userRole = req.userRole

    const activityId = req.params.activityId

    Activity.findOne({ _id: activityId , $or : [ {public: true} , {creator: userId} ]})
    .then(activity => {
        if (!activity) {
            return res.status(404).json({
                message: 'no activity found'
            })
        } else if ( (activity.creator.toString() != userId) && (!['admin','mod'].includes(userRole)) && (activity.public == false)) { // activity is not made public by the creator
            return res.status(403).json({
                message: 'no activity found'
            })
        }
        else {
            return res.status(200).json({
                result: activity
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

exports.searchActivity = (req, res , next) => {
    let activityName= new RegExp(req.params.activityname,'i'); 

    Activity.find({name:activityName  , $or : [ {public: true} , {creator: userId} ]})
    .then(activities => {
        console.log(activities)

        if (!activities) {
            return res.status(404).json({
                message: 'فعالیتی پیدا نشد'
            })
        }
        else {
            return res.status(200).json({
                result: activities
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


exports.myActivities = (req, res , next) => {
    const userId = req.userId;
    Activity.find({creator: userId})
    .then(activities => {

        if (!activities) {
            return res.status(404).json({
                message: 'فعالیتی پیدا نشد'
            })
        }
        else {
            return res.status(200).json({
                result: activities
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


exports.deleteActivityWarning = (req, res , next) => {
    
    const foodId = req.params.foodId;
    Burn.countDocuments({food:foodId})
    .then( (count) => {
        if (count > 0) {
            res.status(200).json({
                message: `این فعالیت ${count} بار انجام شده است. حذف شود؟`
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