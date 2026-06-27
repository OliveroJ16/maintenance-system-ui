import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import { api } from '../services/api';
import { showSuccessAlert, showErrorAlert } from '../utils/alert';
import PlusIcon from '../assets/icons/plus.svg?react';
import type { MaintenanceConfiguration, Vehicle, MaintenanceType } from '../types/maintenance';

const CONFIG_CONFIG = {
  endpoint: 'maintenance-configurations',
  entityName: 'configuración',
  idField: 'idMaintenanceConfig',
  initialFormData: {
    frequencyKm: 0,
    frequencyMonths: 0,
    description: ''
  }
};

const CONFIG_COLUMNS = [
  { 
    key: 'vehicle', 
    header: 'Vehículo',
    render: (item: MaintenanceConfiguration) => item.vehicle?.plate || '—'
  },
  { 
    key: 'maintenanceType', 
    header: 'Tipo Mantenimiento',
    render: (item: MaintenanceConfiguration) => item.maintenanceType?.typeName || '—'
  },
  { 
    key: 'frequencyKm', 
    header: 'Frecuencia KM',
    render: (item: MaintenanceConfiguration) => item.frequencyKm ? `${item.frequencyKm} km` : '—'
  },
  { 
    key: 'frequencyMonths', 
    header: 'Frecuencia Meses',
    render: (item: MaintenanceConfiguration) => item.frequencyMonths ? `${item.frequencyMonths} meses` : '—'
  },
  { 
    key: 'description', 
    header: 'Descripción',
    render: (item: MaintenanceConfiguration) => item.description || '—'
  }
];

export function ConfigurationsTab() {
  const crud = useCrud<MaintenanceConfiguration>(CONFIG_CONFIG);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([]);

  useEffect(() => {
    loadVehicles();
    loadMaintenanceTypes();
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
      console.error('Error al cargar tipos:', error);
    }
  };

  const getVehicleOptions = () => 
    vehicles.map(v => ({ 
      value: v.idVehicle?.toString() || '', 
      label: `${v.plate} - ${v.brand} ${v.model}` 
    }));

  const getTypeOptions = () => 
    maintenanceTypes.map(mt => ({ 
      value: mt.idMaintenanceType?.toString() || '', 
      label: mt.typeName 
    }));

  const CONFIG_FIELDS = [
    { name: 'vehicle', label: 'Vehículo', type: 'select' as const, required: true, options: getVehicleOptions() },
    { name: 'maintenanceType', label: 'Tipo de Mantenimiento', type: 'select' as const, required: true, options: getTypeOptions() },
    { name: 'frequencyKm', label: 'Frecuencia en KM', type: 'number' as const, placeholder: 'ej: 5000' },
    { name: 'frequencyMonths', label: 'Frecuencia en Meses', type: 'number' as const, placeholder: 'ej: 6' },
    { name: 'description', label: 'Descripción', type: 'textarea' as const, placeholder: 'Agregar descripción de la configuración', fullWidth: true }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = { ...crud.formData } as Record<string, any>;
    
    const payload = {
      ...formData,
      vehicle: vehicles.find(v => v.idVehicle?.toString() === formData.vehicle) || null,
      maintenanceType: maintenanceTypes.find(mt => mt.idMaintenanceType?.toString() === formData.maintenanceType) || null
    };

    try {
      if (crud.editingItem) {
        await api.put(`/api/${CONFIG_CONFIG.endpoint}/${crud.editingItem.idMaintenanceConfig}`, payload);
        showSuccessAlert('¡Actualizado!', 'La configuración ha sido actualizada.');
      } else {
        await api.post(`/api/${CONFIG_CONFIG.endpoint}`, payload);
        showSuccessAlert('¡Creado!', 'La configuración ha sido creada.');
      }
      crud.setIsModalOpen(false);
      crud.fetchItems();
    } catch (error: any) {
      showErrorAlert('Error', error.response?.data?.message || 'No se pudo guardar.');
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title">
          <h2>Configuraciones de Mantenimiento</h2>
          <p>Frecuencias por vehículo y tipo</p>
        </div>
        <button className="btn btn-primary" onClick={crud.handleOpenCreateModal}>
          <PlusIcon />
          Nueva Configuración
        </button>
      </div>

      <SearchBar
        value={crud.searchTerm}
        onChange={e => crud.setSearchTerm(e.target.value)}
        placeholder="Buscar configuración..."
      />

      <GenericTable
        data={crud.items}
        columns={CONFIG_COLUMNS}
        onEdit={crud.handleOpenEditModal}
        onDelete={(item) => crud.handleDelete(item)}
        idField="idMaintenanceConfig"
      />

      <GenericModal
        isOpen={crud.isModalOpen}
        onClose={() => crud.setIsModalOpen(false)}
        title={crud.editingItem ? 'Editar Configuración' : 'Nueva Configuración'}
        fields={CONFIG_FIELDS}
        formData={crud.formData}
        onChange={crud.handleInputChange}
        onSubmit={handleSubmit}
        isEditing={!!crud.editingItem}
      />
    </div>
  );
}