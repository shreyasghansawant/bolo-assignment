const { PDFDocument } = require('pdf-lib');

async function burnSignatureToPdf(pdfBuffer, signatureBase64, coords) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pageIndex = Math.max(0, (coords.page || 1) - 1);
  const page = pdfDoc.getPages()[pageIndex];
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const x_points = coords.x * pageWidth;
  const width_points = coords.w * pageWidth;
  const height_points = coords.h * pageHeight;
  const y_points_from_bottom = (1 - coords.y - coords.h) * pageHeight;

  const imageBytes = base64ToUint8Array(signatureBase64);
  const isPng = isPngImage(signatureBase64);
  const embeddedImage = isPng
    ? await pdfDoc.embedPng(imageBytes)
    : await pdfDoc.embedJpg(imageBytes);

  const { width: imgWidth, height: imgHeight } = embeddedImage.scale(1);
  const scale = Math.min(width_points / imgWidth, height_points / imgHeight);
  const renderWidth = imgWidth * scale;
  const renderHeight = imgHeight * scale;
  const renderX = x_points + (width_points - renderWidth) / 2;
  const renderY = y_points_from_bottom + (height_points - renderHeight) / 2;

  page.drawImage(embeddedImage, {
    x: renderX,
    y: renderY,
    width: renderWidth,
    height: renderHeight
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function base64ToUint8Array(base64String) {
  const data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
  return new Uint8Array(Buffer.from(data, 'base64'));
}

function isPngImage(base64String) {
  if (base64String.includes('data:image/png')) return true;
  const data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
  try {
    const bytes = Buffer.from(data, 'base64');
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  } catch {
    return false;
  }
}

module.exports = { burnSignatureToPdf };
