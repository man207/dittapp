const { param } = require('express-validator')


const dayParamValidationRules = () => {
    return [
      param('date')
      .optional()
      .isString()
      .customSanitizer(value => {
        x = value.split('-').map(x => +x);
        if (!(x.length === 3)) {
          throw new Error('Date is not correct');
        }
        if (x.includes(NaN)) {
          throw new Error('dates must be numbers');
        }
        if (x[0] < 1370 || !Number.isInteger(x[0])) {  //the time is not correct (not bad tho)
          throw new Error('year is off');
        }
        if (x[1] < 1 || x[1] > 12 || !Number.isInteger(x[1]))  {  //the time is not correct (not bad tho)
          throw new Error('month is off');
        }
        if (x[2] < 1 || x[2] > 31 || !Number.isInteger(x[2])) {  //the time is not correct (not bad tho)
          throw new Error('day is off');
        }
        return x
      })
    ]
  }

  module.exports = {
    dayParamValidationRules
  }