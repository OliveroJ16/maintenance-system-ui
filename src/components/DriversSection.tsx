import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import type { Driver } from '../types/driver';

const DRIVER_CONFIG = {
  endpoint: 'drivers',
  entityName: 'chofer',
  idField: 'idDriver',
  initialFormData: {
    firstName: '',
    lastName: '',
    idCard: '',
    phone: '',
    email: '',
    licenseCategory: 'B',
    licenseExpirationDate: '',
    status: 'ACTIVO' as const
  }
};

const DRIVER_COLUMNS = [
  { key: 'firstName', header: 'Nombre' },
  { key: 'lastName', header: 'Apellido' },
  { key: 'idCard', header: 'Cédula' },
  { key: 'phone', header: 'Teléfono' },
  { key: 'email', header: 'Email' },
  { key: 'licenseCategory', header: 'Licencia' },
  { key: 'licenseExpirationDate', header: 'Expiración' },
  { 
    key: 'status', 
    header: 'Estado',
    render: (item: Driver) => (
      <span className={`status-badge ${item.status.toLowerCase()}`}>
        {item.status}
      </span>
    )
  }
];

const DRIVER_FIELDS = [
  { name: 'firstName', label: 'Nombre', type: 'text', placeholder: 'Ej: Juan' },
  { name: 'lastName', label: 'Apellido', type: 'text', placeholder: 'Ej: Pérez' },
  { name: 'idCard', label: 'Cédula', type: 'text', placeholder: 'Ej: 8-1234-5678' },
  { name: 'phone', label: 'Teléfono', type: 'text', placeholder: 'Ej: 6123-4567' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Ej: juan@correo.com', fullWidth: true },
  { 
    name: 'licenseCategory', 
    label: 'Licencia', 
    type: 'select',
    options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
      { value: 'E', label: 'E' },
      { value: 'F', label: 'F' }
    ]
  },
  { name: 'licenseExpirationDate', label: 'Expiración', type: 'date' },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'ACTIVO', label: 'Activo' },
      { value: 'INACTIVO', label: 'Inactivo' }
    ]
  }
] as const;

export function DriversSection() {
  const crud = useCrud<Driver>(DRIVER_CONFIG);

  return (
    <div className="content-area">
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Gestión de Choferes</h2>
            <p>Consultar, registrar y administrar choferes</p>
          </div>
          <button className="btn btn-primary" onClick={crud.handleOpenCreateModal}>
            Nuevo Chofer
          </button>
        </div>

        <SearchBar 
          value={crud.searchTerm}
          onChange={e => crud.setSearchTerm(e.target.value)}
          placeholder="Buscar chofer..."
        />

        <GenericTable
          data={crud.items}
          columns={DRIVER_COLUMNS}
          onEdit={crud.handleOpenEditModal}
          onDelete={(item) => crud.handleDelete(item)}
          idField="idDriver"
        />
      </div>

      <GenericModal
        isOpen={crud.isModalOpen}
        onClose={() => crud.setIsModalOpen(false)}
        title={crud.editingItem ? 'Editar Chofer' : 'Nuevo Chofer'}
        fields={DRIVER_FIELDS}
        formData={crud.formData}
        onChange={crud.handleInputChange}
        onSubmit={crud.handleSubmit}
        isEditing={!!crud.editingItem}
      />
    </div>
  );
}