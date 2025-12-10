const express = require('express');
const axios = require('axios');
const Audit = require('../models/Audit');
const { sha256Hex } = require('../services/hashService');
const { burnSignatureToPdf } = require('../services/pdfService');
const { storeBufferLocal } = require('../services/storageService');

const router = express.Router();

const badRequest = (res, error, message) => res.status(400).json({ error, message });

const normalizeBase64 = (value) => value.includes(',') ? value.split(',')[1] : value;

const validateCoords = (coords) => {
  if (!coords) return { ok: false, error: 'missing_required_params', message: 'signatureBase64 and coords are required' };
  const { x, y, w, h } = coords;
  if ([x, y, w, h].some(v => typeof v !== 'number')) {
    return { ok: false, error: 'invalid_coords', message: 'coords must contain numeric x, y, w, h values' };
  }
  if (x < 0 || x > 1 || y < 0 || y > 1 || w <= 0 || w > 1 || h <= 0 || h > 1) {
    return { ok: false, error: 'invalid_coord_range', message: 'coords must be normalized values between 0 and 1' };
  }
  return { ok: true };
};

const loadPdfBuffer = async (pdfBase64, pdfUrl) => {
  if (pdfBase64) return Buffer.from(normalizeBase64(pdfBase64), 'base64');
  if (!pdfUrl) {
    const err = new Error('Either pdfUrl or pdfBase64 must be provided');
    err.code = 'missing_pdf';
    throw err;
  }
  try {
    const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer', timeout: 30000 });
    return Buffer.from(pdfResponse.data);
  } catch (fetchError) {
    const err = new Error(`Failed to fetch PDF from URL: ${fetchError.message}`);
    err.code = 'pdf_fetch_failed';
    throw err;
  }
};

router.post('/', async (req, res) => {
  try {
    const { pdfUrl, pdfBase64, pdfId, signatureBase64, coords, userId } = req.body;

    if (!signatureBase64 || !coords) {
      return badRequest(res, 'missing_required_params', 'signatureBase64 and coords are required');
    }

    const coordCheck = validateCoords(coords);
    if (!coordCheck.ok) return badRequest(res, coordCheck.error, coordCheck.message);

    let originalBuffer;
    try {
      originalBuffer = await loadPdfBuffer(pdfBase64, pdfUrl);
    } catch (err) {
      return badRequest(res, err.code || 'invalid_pdf', err.message);
    }

    if (!originalBuffer?.length) {
      return badRequest(res, 'invalid_pdf', 'PDF buffer is empty or invalid');
    }

    const originalHash = sha256Hex(originalBuffer);

    let signedBuffer;
    try {
      signedBuffer = await burnSignatureToPdf(originalBuffer, signatureBase64, coords);
    } catch (burnError) {
      return badRequest(res, 'signature_burn_failed', `Failed to add signature to PDF: ${burnError.message}`);
    }

    const signedHash = sha256Hex(signedBuffer);
    
    // Store file locally (for audit trail)
    const storageUrl = await storeBufferLocal(signedBuffer, 'signed.pdf');
    
    // Also return PDF as base64 for immediate download
    const signedPdfBase64 = `data:application/pdf;base64,${signedBuffer.toString('base64')}`;

    let audit = null;
    try {
      audit = await Audit.create({
        pdfId: pdfId || pdfUrl || 'unknown',
        userId: userId || null,
        action: 'sign',
        originalHash,
        signedHash,
        coords,
        page: coords.page || 1,
        storageUrl,
        createdAt: new Date()
      });
      console.log('Audit record created:', audit._id);
    } catch (dbError) {
      console.error('Failed to create audit record:', dbError);
      // Continue even if audit fails - return the signed PDF
    }

    const response = {
      success: true,
      signedPdfUrl: storageUrl,
      signedPdfBase64: signedPdfBase64, // Add base64 for immediate download
      auditId: audit?._id || null,
      originalHash,
      signedHash
    };
    
    console.log('Returning response with base64:', !!response.signedPdfBase64);
    console.log('Storage URL:', storageUrl);
    
    return res.json(response);

  } catch (err) {
    console.error('Error in /sign-pdf:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({
      error: 'server_error',
      message: 'An internal server error occurred',
      details: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? err.message : undefined
    });
  }
});

module.exports = router;
