const levels = ['error', 'warn', 'info', 'debug'];
const currentLevel = process.env.LOG_LEVEL || 'info';

const log = (level, ...args) => {
  if (levels.indexOf(level) > levels.indexOf(currentLevel)) return;
  const ts = new Date().toISOString();
  console[level === 'debug' ? 'log' : level](`[${ts}] [${level.toUpperCase()}]`, ...args);
};

module.exports = {
  error: (...a) => log('error', ...a),
  warn: (...a) => log('warn', ...a),
  info: (...a) => log('info', ...a),
  debug: (...a) => log('debug', ...a),
};