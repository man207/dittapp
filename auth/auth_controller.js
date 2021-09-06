const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./user');

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  bcrypt
    .hash(password, 10)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        firstName: firstName,
        lastName: lastName
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        'somesupersecretsecret',
        { expiresIn: '24h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString(), expiresIn: 86400 });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.changePassword = (req, res, next) => {

  const userId = req.userId

  const password = req.body.password;
  const oldPassword = req.body.oldPassword;

  let loadedUser;

  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('A user could not be found.');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      isEqual = bcrypt.compareSync(oldPassword, user.password);
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      bcrypt
        .hash(password, 10)
        .then(hashedPw => {
          user.password = hashedPw;
          user.save();
          return res.status(201).json({
            message: 'Password Changed',
        }) 
        })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
