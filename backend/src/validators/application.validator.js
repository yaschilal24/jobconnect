const { body } = require('express-validator');

const applyRules = [
  body('jobId').isUUID().withMessage('Valid job ID required'),
  body('coverLetter').trim().isLength({ min: 20 }).withMessage('Cover letter min 20 chars'),
];

const statusRules = [
  body('status').isIn(['APPLIED','UNDER_REVIEW','SHORTLISTED','INTERVIEW','SELECTED','REJECTED','WITHDRAWN']),
];

module.exports = { applyRules, statusRules };