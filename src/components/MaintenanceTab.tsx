import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import { api } from '../services/api';
import { showSuccessAlert, showErrorAlert, showConfirmDeleteAlert } from '../utils/alert';
import PlusIcon from '../assets/icons/plus.svg?react';
import type { Maintenance, Vehicle, MaintenanceType, Workshop } from '../types/maintenance';

const MAINTENANCE_CONFIG = {
  endpoint: 'maintenance',
  entityName: 'mantenimiento',
  idField: 'idMaintenance',
  initialFormData: {
    scheduledDate: '',
    scheduledKm: 0,
    executionDate: '',
    executionKm: 0,
    status: 'PENDIENTE' as const,
    description: ''
  }
};

const MAINTENANCE_COLUMNS = [
  { key: 'scheduledDate', header: 'Fecha Programada' },
  { key: 'scheduledKm', header: 'KM Programado' },
  { 
    key: 'executionDate', 
    header: 'Fecha Ejecución',
    render: (item: Maintenance) => item.executionDate || '—'
  },
  { 
    key: 'executionKm', 
    header: 'KM Ejecución',
    render: (item: Maintenance) => item.executionKm || '—'
  },
  { 
    key: 'status', 
    header: 'Estado',
    render: (item: Maintenance) => (
      <span className={`status-badge ${item.status.toLowerCase()}`}>
        {item.status.replace('_', ' ')}
      </span>
    )
  },
  { 
    key: 'vehicle', 
    header: 'Vehículo',
    render: (item: Maintenance) => item.vehicle?.plate || '—'
  },
  { 
    key: 'maintenanceType', 
    header: 'Tipo Mantenimiento',
    render: (item: Maintenance) => item.maintenanceType?.typeName || '—'
  },
  { 
    key: 'workshop', 
    header: 'Taller',
    render: (item: Maintenance) => item.workshop?.workshopName || 'No asignado'
  }
];

export function MaintenancesTab() {
  const crud = useCrud<Maintenance>(MAINTENANCE_CONFIG);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    loadVehicles();
    loadMaintenanceTypes();
    loadWorkshops();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await api.get('/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    }
  };

  const loadMaintenanceTypes = async () => {
    try {
      const response = await api.get('/api/maintenance-types');
      setMaintenanceTypes(response.data);
    } catch (error) {
      console.error('Error al cargar tipos de mantenimiento:', error);
    }
  };

  const loadWorkshops = async () => {
    try {
      const response = await api.get('/api/workshops');
      setWorkshops(response.data);
    } catch (error) {
      console.error('Error al cargar talleres:', error);
    }
  };

  const getVehicleOptions = () => 
    vehicles.map(v => ({ 
      value: v.idVehicle?.toString() || '', 
      label: `${v.plate} - ${v.brand} ${v.model}` 
    }));

  const getMaintenanceTypeOptions = () => 
    maintenanceTypes.map(mt => ({ 
      value: mt.idMaintenanceType?.toString() || '', 
      label: mt.typeName 
    }));

  const getWorkshopOptions = () => 
    workshops.map(w => ({ 
      value: w.idWorkshop?.toString() || '', 
      label: w.workshopName 
    }));

  const MAINTENANCE_FIELDS = [
    { name: 'scheduledDate', label: 'Fecha Programada', type: 'date' as const, required: true },
    { name: 'scheduledKm', label: 'KM Programado', type: 'number' as const, placeholder: 'ej: 50000', required: true },
    { name: 'executionDate', label: 'Fecha de Ejecución', type: 'date' as const },
    { name: 'executionKm', label: 'KM de Ejecución', type: 'number' as const, placeholder: 'ej: 50100' },
    { 
      name: 'status', 
      label: 'Estado', 
      type: 'select' as const,
      required: true,
      options: [
        { value: 'PENDIENTE', label: 'Pendiente' },
        { value: 'EN_PROCESO', label: 'En Proceso' },
        { value: 'COMPLETADO', label: 'Completado' },
        { value: 'CANCELADO', label: 'Cancelado' }
      ]
    },
    { name: 'vehicle', label: 'Vehículo', type: 'select' as const, required: true, options: getVehicleOptions() },
    { name: 'maintenanceType', label: 'Tipo de Mantenimiento', type: 'select' as const, required: true, options: getMaintenanceTypeOptions() },
    { name: 'workshop', label: 'Taller', type: 'select' as const, required: true, options: getWorkshopOptions() },
    { name: 'description', label: 'Descripción', type: 'textarea' as const, placeholder: 'Agregar descripción del mantenimiento', fullWidth: true, rows: 3 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = { ...crud.formData } as Record<string, any>;
    
    const payload = {
      ...formData,
      vehicle: vehicles.find(v => v.idVehicle?.toString() === formData.vehicle) || null,
      maintenanceType: maintenanceTypes.find(mt => mt.idMaintenanceType?.toString() === formData.maintenanceType) || null,
      workshop: workshops.find(w => w.idWorkshop?.toString() === formData.workshop) || null
    };

    try {
      if (crud.editingItem) {
        await api.put(`/api/${MAINTENANCE_CONFIG.endpoint}/${crud.editingItem.idMaintenance}`, payload);
        showSuccessAlert('¡Actualizado!', 'El mantenimiento ha sido actualizado.');
      } else {
        await api.post(`/api/${MAINTENANCE_CONFIG.endpoint}`, payload);
        showSuccessAlert('¡Creado!', 'El mantenimiento ha sido creado.');
      }
      crud.setIsModalOpen(false);
      crud.fetchItems();
    } catch (error: any) {
      showErrorAlert('Error', error.response?.data?.message || 'No se pudo guardar el mantenimiento.');
    }
  };

  const handleDelete = async (item: Maintenance) => {
    const result = await showConfirmDeleteAlert(
      '¿Eliminar mantenimiento?',
      'Esta acción no se puede deshacer.'
    );
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/${MAINTENANCE_CONFIG.endpoint}/${item.idMaintenance}`);
        showSuccessAlert('¡Eliminado!', 'El mantenimiento ha sido eliminado.');
        crud.fetchItems();
      } catch (error: any) {
        showErrorAlert('Error', error.response?.data?.message || 'No se pudo eliminar.');
      }
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title">
          <h2>Gestión de Mantenimientos</h2>
          <p>Consultar, programar y administrar mantenimientos</p>
        </div>
        <button className="btn btn-primary" onClick={crud.handleOpenCreateModal}>
          <PlusIcon />
          Nuevo Mantenimiento
        </button>
      </div>

      <SearchBar
        value={crud.searchTerm}
        onChange={e => crud.setSearchTerm(e.target.value)}
        placeholder="Buscar mantenimiento..."
      />

      <GenericTable
        data={crud.items}
        columns={MAINTENANCE_COLUMNS}
        onEdit={crud.handleOpenEditModal}
        onDelete={handleDelete}
        idField="idMaintenance"
      />

      <GenericModal
        isOpen={crud.isModalOpen}
        onClose={() => crud.setIsModalOpen(false)}
        title={crud.editingItem ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
        fields={MAINTENANCE_FIELDS}
        formData={crud.formData}
        onChange={crud.handleInputChange}
        onSubmit={handleSubmit}
        isEditing={!!crud.editingItem}
      />
    </div>
  );
}