function Controls({ pageNumber, numPages, onPageChange, pdfScale, onScaleChange }) {
  return (
    <div style={{ background: '#fff', padding: '0.75rem 1rem', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={() => onPageChange(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Prev</button>
        <span style={{ fontSize: '0.9rem', color: '#666', minWidth: '60px', textAlign: 'center' }}>{pageNumber} / {numPages || 0}</span>
        <button onClick={() => onPageChange(Math.min(numPages || 1, pageNumber + 1))} disabled={pageNumber >= (numPages || 1)} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Next</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={() => onScaleChange(Math.max(0.5, pdfScale - 0.1))} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>-</button>
        <span style={{ fontSize: '0.9rem', color: '#666', minWidth: '60px', textAlign: 'center' }}>{Math.round(pdfScale * 100)}%</span>
        <button onClick={() => onScaleChange(Math.min(2, pdfScale + 0.1))} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>+</button>
      </div>
    </div>
  );
}

export default Controls;

