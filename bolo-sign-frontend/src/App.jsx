import { useState, useRef, useEffect } from 'react';
import PdfViewer from './components/PdfViewer';
import FieldPalette from './components/FieldPalette';
import './App.css';

function App() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signatureText, setSignatureText] = useState('Signature');
  const [signatureMode, setSignatureMode] = useState('text');
  const [signatureImage, setSignatureImage] = useState(null);
  const fileInputRef = useRef(null);
  const signatureImageInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      x: 0.2,
      y: 0.2,
      w: 0.2,
      h: 0.08,
      page: 1
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const updateField = (id, updates) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedField === id) setSelectedField(null);
  };

  const handleImageUpload = (fieldId, imageBase64) => {
    updateField(fieldId, { imageData: imageBase64 });
  };

  const handlePdfSigned = (signedUrl) => {
    setSignedPdfUrl(signedUrl);
    setShowSuccessModal(true);
  };

  const handleDownloadPdf = async () => {
    if (!signedPdfUrl) return;
    try {
      if (signedPdfUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = signedPdfUrl;
        link.download = pdfFile ? `signed_${pdfFile.name}` : 'signed_document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      const response = await fetch(signedPdfUrl);
      if (!response.ok) throw new Error('Failed to fetch signed PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile ? `signed_${pdfFile.name}` : 'signed_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF: ' + error.message);
      window.open(signedPdfUrl, '_blank');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleSignatureImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureImage(reader.result);
      setSignatureMode('image');
    };
    reader.onerror = () => {
      alert('Error reading signature image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureImageUploadClick = () => {
    signatureImageInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
      const url = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfUrl(url);
      setFields([]);
      setSelectedField(null);
      setSignedPdfUrl(null);
      setShowSuccessModal(false);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-bar">
          <h1>BoloForms Signature Engine</h1>
          <div className="header-actions">
            <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
            <button onClick={handleUploadClick}>{pdfFile ? pdfFile.name : 'Upload PDF'}</button>
            {signedPdfUrl && <button onClick={handleDownloadPdf}>Download Signed PDF</button>}
          </div>
        </div>
      </header>
      <div className="container">
        <div className="sidebar">
          <FieldPalette onAddField={addField} />
          <div className="signature-panel">
            <h4>Signature Options</h4>
            <div className="signature-options">
              <label>
                <input type="radio" name="signatureMode" value="text" checked={signatureMode === 'text'} onChange={() => setSignatureMode('text')} />
                Use text
              </label>
              {signatureMode === 'text' && (
                <input type="text" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} placeholder="Enter signature text" />
              )}
              <label>
                <input type="radio" name="signatureMode" value="image" checked={signatureMode === 'image'} onChange={() => setSignatureMode('image')} />
                Use uploaded image
              </label>
              {signatureMode === 'image' && (
                <div className="signature-image">
                  <div className="signature-image-actions">
                    <button onClick={handleSignatureImageUploadClick}>{signatureImage ? 'Change Image' : 'Upload Image'}</button>
                    {signatureImage && <button onClick={() => setSignatureImage(null)}>Remove</button>}
                  </div>
                  {signatureImage && <img src={signatureImage} alt="Signature preview" />}
                  <input ref={signatureImageInputRef} type="file" accept="image/*" onChange={handleSignatureImageChange} style={{ display: 'none' }} />
                </div>
              )}
            </div>
          </div>
        </div>
        {pdfUrl ? (
          <PdfViewer
            pdfFile={pdfFile}
            pdfUrl={pdfUrl}
            fields={fields}
            selectedField={selectedField}
            onSelectField={setSelectedField}
            onUpdateField={updateField}
            onDeleteField={deleteField}
            pdfScale={pdfScale}
            onScaleChange={setPdfScale}
            onImageUpload={handleImageUpload}
            onPdfSigned={handlePdfSigned}
            signatureConfig={{
              mode: signatureMode,
              text: signatureText,
              imageData: signatureImage
            }}
          />
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Please upload a PDF file to get started</p>
            <button
              onClick={handleUploadClick}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Upload PDF
            </button>
          </div>
        )}
      </div>
      
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ marginTop: 0 }}>PDF Signed Successfully</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Your PDF has been signed. You can download it now or continue editing.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Continue Editing
              </button>
              <button
                onClick={handleDownloadPdf}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

