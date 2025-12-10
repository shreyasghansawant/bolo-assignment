import { useState, useEffect } from 'react';
import './FieldBox.css';

function FieldBox({ field, isSelected, onSelect, onMove, onResize, onDelete, onSign, onImageUpload, pageWidth, pageHeight, scale }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!pageWidth || !pageHeight) return null;

  const x = field.x * pageWidth * scale;
  const y = field.y * pageHeight * scale;
  const w = field.w * pageWidth * scale;
  const h = field.h * pageHeight * scale;

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - x, y: e.clientY - y });
    onSelect();
    e.preventDefault();
  };

  const handleResizeStart = (e) => {
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        onMove(field.id, e.clientX - dragStart.x - x, e.clientY - dragStart.y - y);
      } else if (isResizing) {
        onResize(field.id, e.clientX - dragStart.x, e.clientY - dragStart.y);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, x, y, field.id, onMove, onResize]);

  return (
    <div
      className={`field-box ${isSelected ? 'selected' : ''} ${field.type}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="field-label">
        {field.imageData ? (
          <img src={field.imageData} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          field.type
        )}
      </div>
      {isSelected && (
        <>
          <div className="resize-handle resize-handle-se" onMouseDown={handleResizeStart} />
          <div className="action-buttons">
            {(field.type === 'signature' || field.type === 'image') && (
              <button className="sign-button" onClick={() => onSign(field.id)}>
                Sign
              </button>
            )}
            {field.type === 'image' && (
              <button className="sign-button" onClick={() => onImageUpload(field.id)}>
                {field.imageData ? 'Change Image' : 'Upload Image'}
              </button>
            )}
            <button className="delete-button" onClick={() => onDelete(field.id)}>
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FieldBox;

