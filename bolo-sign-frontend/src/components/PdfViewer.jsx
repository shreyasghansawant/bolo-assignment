import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import FieldBox from './FieldBox';
import Controls from './Controls';
import { normalizeCoords } from '../utils/coords';
import { signPdf } from '../services/api';
import './PdfViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfViewer({ pdfFile, pdfUrl, fields, selectedField, onSelectField, onUpdateField, onDeleteField, pdfScale, onScaleChange, onImageUpload, onPdfSigned, signatureConfig }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(800);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onDocumentLoadSuccess = (pdf) => {
    const pages = pdf.numPages || (pdf._pdfInfo && pdf._pdfInfo.numPages);
    if (pages) setNumPages(pages);
    setLoadError(null);
  };

  const onPageLoadSuccess = (page) => {
    if (page?.getViewport) {
      const viewport = page.getViewport({ scale: 1 });
      setPageWidth(viewport.width);
      setPageHeight(viewport.height);
    }
  };

  const onDocumentLoadError = (error) => {
    setLoadError(error.message || 'Failed to load PDF file');
  };

  const handleFieldMove = (id, deltaX, deltaY) => {
    const field = fields.find(f => f.id === id);
    if (!field || !pageWidth || !pageHeight) return;
    
    const currentScale = (containerWidth / pageWidth) * pdfScale;
    const normalizedDeltaX = deltaX / (pageWidth * currentScale);
    const normalizedDeltaY = deltaY / (pageHeight * currentScale);
    
    onUpdateField(id, {
      x: Math.max(0, Math.min(1 - field.w, field.x + normalizedDeltaX)),
      y: Math.max(0, Math.min(1 - field.h, field.y + normalizedDeltaY))
    });
  };

  const handleFieldResize = (id, deltaW, deltaH) => {
    const field = fields.find(f => f.id === id);
    if (!field || !pageWidth || !pageHeight) return;
    
    const currentScale = (containerWidth / pageWidth) * pdfScale;
    const normalizedDeltaW = deltaW / (pageWidth * currentScale);
    const normalizedDeltaH = deltaH / (pageHeight * currentScale);
    
    onUpdateField(id, {
      w: Math.max(0.05, Math.min(1 - field.x, field.w + normalizedDeltaW)),
      h: Math.max(0.02, Math.min(1 - field.y, field.h + normalizedDeltaH))
    });
  };

  const getSignatureBase64 = (field) => {
    const { mode = 'text', text = 'Signature', imageData } = signatureConfig || {};
    if (field.type === 'image') return field.imageData;
    if (mode === 'image') return imageData || field.imageData;
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.font = '28px Arial';
    ctx.fillText(text || 'Signature', 10, 38);
    return canvas.toDataURL('image/png');
  };

  const handleSign = async (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || (field.type !== 'signature' && field.type !== 'image')) return;
    if (!pdfFile) {
      alert('No PDF file available');
      return;
    }

    const signatureBase64 = getSignatureBase64(field);
    if (!signatureBase64) {
      alert(field.type === 'image' ? 'Please upload an image to this field before signing.' : 'Please upload a signature image first.');
      return;
    }

    const coords = normalizeCoords(field);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result.includes(',') ? reader.result.split(',')[1] : reader.result;
          const result = await signPdf({
            pdfBase64: base64String,
            pdfId: pdfFile.name,
            signatureBase64,
            coords,
            userId: 'user-123'
          });
          // Prefer base64 URL for immediate download, fallback to server URL
          const pdfUrl = result.signedPdfBase64 || result.signedPdfUrl;
          if (onPdfSigned && pdfUrl) onPdfSigned(pdfUrl);
          else alert(`PDF signed! Download: ${pdfUrl}`);
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      };
      reader.onerror = () => alert('Error reading PDF file');
      reader.readAsDataURL(pdfFile);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleImageUpload = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || field.type !== 'image') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageBase64 = reader.result;
          onImageUpload(fieldId, imageBase64);
        };
        reader.onerror = () => {
          alert('Error reading image file');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const scale = pageWidth > 0 ? containerWidth / pageWidth : 1;

  return (
    <div className="pdf-viewer-container">
      <Controls
        pageNumber={pageNumber}
        numPages={numPages}
        onPageChange={setPageNumber}
        pdfScale={pdfScale}
        onScaleChange={onScaleChange}
      />
      <div ref={containerRef} className="pdf-container">
        <Document
          file={pdfUrl || pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="loading">Loading PDF...</div>}
          error={<div className="error-message">{loadError || 'Failed to load PDF file'}</div>}
        >
          <div className="page-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <Page
              pageNumber={pageNumber}
              scale={scale * pdfScale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={onPageLoadSuccess}
            />
            {fields
              .filter(f => f.page === pageNumber)
              .map(field => (
                <FieldBox
                  key={field.id}
                  field={field}
                  isSelected={selectedField === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onMove={handleFieldMove}
                  onResize={handleFieldResize}
                  onDelete={onDeleteField}
                  onSign={handleSign}
                  onImageUpload={handleImageUpload}
                  pageWidth={pageWidth}
                  pageHeight={pageHeight}
                  scale={scale * pdfScale}
                />
              ))}
          </div>
        </Document>
      </div>
    </div>
  );
}

export default PdfViewer;

