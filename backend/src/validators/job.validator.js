const { body, query } = require('express-validator');

const createJobRules = [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('description').trim().isLength({ min: 20 }),
  body('employmentType').isIn(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT']),
  body('experienceLevel').optional().isIn(['ENTRY', 'MID', 'SENIOR']),
  body('salaryMin').optional().isInt({ min: 0 }),
  body('salaryMax').optional().isInt({ min: 0 }),
];

const searchJobRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];

module.exports = { createJobRules, searchJobRules };