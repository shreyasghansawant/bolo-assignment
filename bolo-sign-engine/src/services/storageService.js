const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function storeBufferLocal(buffer, filename = 'signed.pdf') {
  const storageDir = path.join(__dirname, '../../storage');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(4).toString('hex');
  const ext = path.extname(filename) || '.pdf';
  const baseName = path.basename(filename, ext);
  const uniqueFilename = `${timestamp}-${randomHash}-${baseName}${ext}`;
  const filePath = path.join(storageDir, uniqueFilename);

  fs.writeFileSync(filePath, buffer);
  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
  return `${baseUrl}/storage/${uniqueFilename}`;
}

module.exports = { storeBufferLocal };
