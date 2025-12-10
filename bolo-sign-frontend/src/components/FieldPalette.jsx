import './FieldPalette.css';

const fieldTypes = [
  { type: 'signature', label: 'Signature' },
  { type: 'image', label: 'Image' }
];

function FieldPalette({ onAddField }) {
  return (
    <div className="field-palette">
      <h3>Fields</h3>
      <div className="field-list">
        {fieldTypes.map(item => (
          <button
            key={item.type}
            className="field-button"
            onClick={() => onAddField(item.type)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FieldPalette;

