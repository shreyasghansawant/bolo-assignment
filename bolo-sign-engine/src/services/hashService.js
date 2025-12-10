const crypto = require('crypto');

module.exports = {
  sha256Hex: (buffer) => crypto.createHash('sha256').update(buffer).digest('hex')
};