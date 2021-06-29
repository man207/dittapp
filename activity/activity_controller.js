const Activity = require('./activity_model')


exports.createActivity = (req, res, next) => {

    const name = req.body.name;
    const desc = req.body.desc;
    const caloriePerMinute = req.body.caloriePerMinute;
    const public = req.body.public;

    const user = req.userId;

    activity = new Activity( {
        name: name,
        desc: desc,
        caloriePerMinute: caloriePerMinute,
        creator: user,
        public: public ? true : false //just to make it works with 0 and 1
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

    const activityId = req.params.activityId;

    const userId = req.userId;
    const userRole = req.userRole;


    // insures that users can't modify their or other's activitys validity afther creating them 
    // callback vs. promise?
    if (!['admin','mod'].includes(userRole)) {
        delete newData.verified;
        delete newData.creator; //this is redundent

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
    const userRole = req.userRole

    const activityId = req.params.activityId


    // can i use delete() insted? 
    Activity.findById(activityId)
    .then(activity => {
        if (!activity) {
            return res.status(404).json({
                message: 'no activity found'
            })
        } else {
            if ( (activity.creator.toString() != user) || (userRole != "admin") ) {
                return res.status(403).json({
                    message: 'You Cannot delete this activity'
                })
            } else {
                activity.delete()
                res.status(202).json({
                    message: 'Activity deleted'
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

    Activity.findById(activityId)
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