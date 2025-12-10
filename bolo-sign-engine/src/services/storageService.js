const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function storeBufferLocal(buffer, filename = 'signed.pdf') {
  try {
    const storageDir = path.join(__dirname, '../../storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
      console.log('Created storage directory:', storageDir);
    }

    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(filename) || '.pdf';
    const baseName = path.basename(filename, ext);
    const uniqueFilename = `${timestamp}-${randomHash}-${baseName}${ext}`;
    const filePath = path.join(storageDir, uniqueFilename);

    fs.writeFileSync(filePath, buffer);
    console.log('File saved to:', filePath);
    
    // Get base URL - prioritize RENDER_EXTERNAL_URL (auto-set by Render)
    const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.BASE_URL || 'http://localhost:4000';
    const fileUrl = `${baseUrl}/storage/${uniqueFilename}`;
    console.log('File URL:', fileUrl);
    console.log('BASE_URL env:', process.env.BASE_URL);
    console.log('RENDER_EXTERNAL_URL env:', process.env.RENDER_EXTERNAL_URL);
    return fileUrl;
  } catch (error) {
    console.error('Error storing file:', error);
    throw error;
  }
}

module.exports = { storeBufferLocal };
