const { body } = require('express-validator');

const updateProfileRules = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('location').optional().trim(),
  body('headline').optional().trim(),
  body('bio').optional().trim(),
];

const educationRules = [
  body('institution').trim().notEmpty().withMessage('Institution required'),
  body('degree').optional().trim(),
  body('field').optional().trim(),
  body('startYear').optional().isInt({ min: 1950, max: 2100 }),
  body('endYear').optional().isInt({ min: 1950, max: 2100 }),
];

const experienceRules = [
  body('company').trim().notEmpty(),
  body('position').trim().notEmpty(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
];

const skillRules = [body('name').trim().notEmpty()];

module.exports = { updateProfileRules, educationRules, experienceRules, skillRules };