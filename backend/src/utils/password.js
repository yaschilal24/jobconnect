const bcrypt = require('bcryptjs');
module.exports = {
  hashPassword: (pwd) => bcrypt.hash(pwd, 10),
  comparePassword: (pwd, hash) => bcrypt.compare(pwd, hash),
};