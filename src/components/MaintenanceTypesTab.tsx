import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import PlusIcon from '../assets/icons/plus.svg?react';
import type { MaintenanceType } from '../types/maintenance';

const TYPE_CONFIG = {
  endpoint: 'maintenance-types',
  entityName: 'tipo de mantenimiento',
  idField: 'idMaintenanceType',
  initialFormData: {
    typeName: '',
    description: '',
    category: 'PREVENTIVO' as const,
    priority: 'MEDIA' as const
  }
};

const TYPE_COLUMNS = [
  { 
    key: 'typeName', 
    header: 'Nombre',
    render: (item: MaintenanceType) => <strong>{item.typeName}</strong>
  },
  { key: 'category', header: 'Categoría' },
  { key: 'priority', header: 'Prioridad' },
  { 
    key: 'description', 
    header: 'Descripción',
    render: (item: MaintenanceType) => item.description || '—'
  }
];

const TYPE_FIELDS = [
  { name: 'typeName', label: 'Nombre del Tipo', type: 'text' as const, required: true, placeholder: 'Ej: Cambio de Aceite' },
  { 
    name: 'category', 
    label: 'Categoría', 
    type: 'select' as const,
    required: true,
    options: [
      { value: 'PREVENTIVO', label: 'Preventivo' },
      { value: 'CORRECTIVO', label: 'Correctivo' }
    ]
  },
  { 
    name: 'priority', 
    label: 'Prioridad', 
    type: 'select' as const,
    required: true,
    options: [
      { value: 'BAJA', label: 'Baja' },
      { value: 'MEDIA', label: 'Media' },
      { value: 'ALTA', label: 'Alta' }
    ]
  },
  { 
    name: 'description', 
    label: 'Descripción', 
    type: 'textarea' as const, 
    rows: 3, 
    fullWidth: true,
    placeholder: 'Agregar descripción del tipo de mantenimiento'
  }
];
export function MaintenanceTypesTab() {
  const crud = useCrud<MaintenanceType>(TYPE_CONFIG);

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title">
          <h2>Tipos de Mantenimiento</h2>
          <p>Gestiona los tipos usados en los mantenimientos</p>
        </div>
        <button className="btn btn-primary" onClick={crud.handleOpenCreateModal}>
          <PlusIcon />
          Nuevo Tipo
        </button>
      </div>

      <SearchBar
        value={crud.searchTerm}
        onChange={e => crud.setSearchTerm(e.target.value)}
        placeholder="Buscar tipo..."
      />

      <GenericTable
        data={crud.items}
        columns={TYPE_COLUMNS}
        onEdit={crud.handleOpenEditModal}
        onDelete={(item) => crud.handleDelete(item)}
        idField="idMaintenanceType"
      />

      <GenericModal
        isOpen={crud.isModalOpen}
        onClose={() => crud.setIsModalOpen(false)}
        title={crud.editingItem ? 'Editar Tipo de Mantenimiento' : 'Nuevo Tipo de Mantenimiento'}
        fields={TYPE_FIELDS}
        formData={crud.formData}
        onChange={crud.handleInputChange}
        onSubmit={crud.handleSubmit}
        isEditing={!!crud.editingItem}
      />
    </div>
  );
}