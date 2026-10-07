// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const routes = require('./routes');
// const { notFound, errorHandler } = require('./middleware/error.middleware');
// //const { writeAudit } = require('./middleware/audit.middleware');
// const { apiLimiter } = require('./middleware/rateLimit.middleware');
// const { CLIENT_URL } = require('./config/env');

// const app = express();

// app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(cors({ origin: CLIENT_URL, credentials: true }));
// //app.use('/api', apiLimiter, writeAudit, routes);
// app.use(express.json({ limit: '1mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// app.use((req, _res, next) => {
//   if (req.query) {
//     for (const k in req.query) {
//       if (typeof req.query[k] === 'string') {
//         req.query[k] = req.query[k].replace(/[\$\{\}]/g, '');
//       }
//     }
//   }
//   next();
// });

// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use('/api', apiLimiter, writeAudit, routes);

// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const { writeAudit } = require('./middleware/audit.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const { CLIENT_URL } = require('./config/env');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Strip obvious injection characters from query params (defense in depth)
app.use((req, _res, next) => {
  if (req.query) {
    for (const k in req.query) {
      if (typeof req.query[k] === 'string') {
        req.query[k] = req.query[k].replace(/[\$\{\}]/g, '');
      }
    }
  }
  next();
});

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// All API routes
app.use('/api', apiLimiter, writeAudit, routes);

// 404 + error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;