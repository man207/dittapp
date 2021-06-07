const persianDate = require('persian-date');


const Day = require('../models/day');

exports.getDay = (req, res, next) => {
  const dayDate = req.params.date.split('-').map(x => +x);
  date = new persianDate(dayDate) //this is not compatible with Date() for some reason. (hours and minues are not 00:00)
  Day.findOne({ date, user: req.userId })
    .then(day => {
      if (!day) {
        const error = new Error('day not found for this user.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ day });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.createDay = (req, res, next) => {
  const dayDate = req.params.date.split('-').map(x => +x);;
  date = new persianDate(dayDate)
  Day.findOne({ date: date, user: req.userId })
    .then(day => {
      if (!day) {
        const day = new Day({
          date: date,
          user: req.userId
        });
        day.save().then(result => {
          return res.status(201).json({
            message: 'day created',
            result: result
          })
        }).catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        })
      } else {
        return res.status(201).json({
          message: 'day already exists',
          result: day
        })
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateMeal = (req, res, next) => {
  const dayDate = req.params.date.split('-').map(x => +x);;
  date = new persianDate(dayDate)
  const meal = req.params.meal;
  Day.findOne({ date: date, user: req.userId })
    .then(day => {
      if (!day) { //creates the day if it does not exist. wonder if it can be modular
        const day = new Day({
          date: date,
          user: req.userId
        });
        day.meals[meal].foods.req.body.foods;
        day.meals[meal].time = req.body.time;
        day.save().then(result => {
          return res.status(201).json({
            message: 'day created and meal saved',
            result: result
          })
        }).catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        })
      } else {
        day.meals[meal].foods = req.body.foods;
        day.meals[meal].time = req.body.time;
        day.save().then(result => {
          return res.status(201).json({
            message: 'meal saved',
            result: result
          })
        })
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getMeal = (req, res, next) => {
  const dayDate = req.params.date.split('-').map(x => +x);;
  date = new persianDate(dayDate)
  const meal = req.params.meal;
  Day.findOne({ date: date, user: req.userId })
  .populate({path: `meals.${meal}.foods.food`})
  .exec((err,day) => {
    if (!day) {
      return res.status(404).json({
        message: 'no day'
      })
    }
    return res.status(200).json({
      result: day.meals[meal]
    })
  })
};

