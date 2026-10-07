const { body } = require('express-validator');

const companyRules = [
  body('name').trim().isLength({ min: 2, max: 200 }),
  body('description').trim().isLength({ min: 20 }),
  body('location').trim().isLength({ min: 2 }),
  body('website').optional({ checkFalsy: true }).isURL(),
  body('email').optional({ checkFalsy: true }).isEmail(),
  body('website').optional({ checkFalsy: true }).isURL(),
body('email').optional({ checkFalsy: true }).isEmail(),
];

module.exports = { companyRules };