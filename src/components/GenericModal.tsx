import React from 'react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'date' | 'number' | 'textarea';
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  fullWidth?: boolean;
  required?: boolean;
  rows?: number;
}

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields?: readonly Field[];  
  formData?: any; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; 
  onSubmit?: (e: React.FormEvent) => void;  
  isEditing?: boolean;
  maxWidth?: string;
  children?: React.ReactNode; 
}

export function GenericModal({
  isOpen,
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  isEditing = false,
  maxWidth,
  children,
}: GenericModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div 
        className="modal-content" 
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {children ? (
          <div style={{ padding: '0 20px 20px 20px' }}>
            {children}
          </div>
        ) : fields && formData && onChange && onSubmit ? (
          <form onSubmit={onSubmit}>
            <div className="form-grid">
              {fields.map(field => (
                <div 
                  key={field.name} 
                  className={`form-group ${field.fullWidth ? 'full-width' : ''}`}
                >
                  <label>
                    {field.label}
                    {field.required && <span style={{ color: 'red' }}> *</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={onChange}
                      required={field.required}
                    >
                      <option value="">Seleccionar...</option>
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
                      value={formData[field.name] || ''}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      required={field.required}
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
        ) : null}
      </div>
    </div>
  );
}