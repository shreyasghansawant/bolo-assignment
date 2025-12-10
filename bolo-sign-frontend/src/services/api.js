import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function signPdf({ pdfUrl, pdfBase64, pdfId, signatureBase64, coords, userId }) {
  const response = await axios.post(`${API_BASE_URL}/sign-pdf`, {
    pdfUrl,
    pdfBase64,
    pdfId,
    signatureBase64,
    coords,
    userId
  });
  return response.data;
}

