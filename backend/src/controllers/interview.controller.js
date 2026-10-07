// const asyncHandler = require('../utils/asyncHandler');
// const svc = require('../services/interview.service');

// exports.schedule = asyncHandler(async (req, res) => {
//   const interview = await svc.schedule(req.user.id, req.body);
//   res.status(201).json({ success: true, interview });
// });

// exports.mine = asyncHandler(async (req, res) => {
//   const interviews = await svc.myInterviews(req.user.id, req.user.role);
//   res.json({ success: true, interviews });
// });

// exports.cancel = asyncHandler(async (req, res) => {
//   const interview = await svc.cancel(req.params.id, req.user.id);
//   res.json({ success: true, interview });
// });

// exports.reschedule = asyncHandler(async (req, res) => {
//   const interview = await svc.reschedule(req.params.id, req.user.id, req.body.scheduledAt);
//   res.json({ success: true, interview });
// });



const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/interview.service');

exports.schedule = asyncHandler(async (req, res) => {
  const interview = await svc.schedule(req.user.id, req.body);
  res.status(201).json({ success: true, interview });
});

exports.mine = asyncHandler(async (req, res) => {
  const interviews = await svc.myInterviews(req.user.id, req.user.role);
  res.json({ success: true, interviews });
});

exports.cancel = asyncHandler(async (req, res) => {
  const interview = await svc.cancel(req.params.id, req.user.id);
  res.json({ success: true, interview });
});

exports.reschedule = asyncHandler(async (req, res) => {
  const interview = await svc.reschedule(
    req.params.id,
    req.user.id,
    req.body.scheduledAt
  );
  res.json({ success: true, interview });
});

exports.getById = asyncHandler(async (req, res) => {
  const interview = await svc.getById(req.params.id, req.user.id, req.user.role);
  res.json({ success: true, interview });
});