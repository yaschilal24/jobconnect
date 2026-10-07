const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  updateProfileRules, educationRules, experienceRules, skillRules,
} = require('../validators/user.validator');
const { upload } = require('../middleware/upload.middleware');

router.use(authenticate);
router.get('/me', ctrl.me);
router.patch('/me', validate(updateProfileRules), ctrl.update);
router.post('/me/educations', authorize('JOB_SEEKER'), validate(educationRules), ctrl.addEducation);
router.delete('/me/educations/:id', authorize('JOB_SEEKER'), ctrl.removeEducation);
router.post('/me/experiences', authorize('JOB_SEEKER'), validate(experienceRules), ctrl.addExperience);
router.delete('/me/experiences/:id', authorize('JOB_SEEKER'), ctrl.removeExperience);
router.post('/me/skills', authorize('JOB_SEEKER'), validate(skillRules), ctrl.addSkill);
router.delete('/me/skills/:skillId', authorize('JOB_SEEKER'), ctrl.removeSkill);
router.post('/me/resume', authorize('JOB_SEEKER'), upload.single('resume'), ctrl.uploadResume);
router.post('/me/avatar', authorize('JOB_SEEKER'), upload.single('avatar'), ctrl.uploadAvatar);

module.exports = router;