const http = require('http');
const app = require('./app');
const { initSocket } = require('./config/socket');
const { PORT } = require('./config/env');
require('./config/db');

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 JobConnect API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});