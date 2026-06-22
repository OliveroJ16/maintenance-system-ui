import React from 'react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'email';
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  fullWidth?: boolean;
}

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: readonly Field[];
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export function GenericModal({
  isOpen,
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  isEditing
}: GenericModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-grid">
            {fields.map(field => (
              <div 
                key={field.name} 
                className={`form-group ${field.fullWidth ? 'full-width' : ''}`}
              >
                <label>{field.label}</label>
                
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={onChange}
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={onChange}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}