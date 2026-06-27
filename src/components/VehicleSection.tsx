import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import { api } from '../services/api';
import { showSuccessAlert, showErrorAlert, showConfirmDeleteAlert } from '../utils/alert';
import AssignDriverIcon from '../assets/icons/assign-driver.svg?react';
import PlusIcon from '../assets/icons/plus.svg?react';
import type { Vehicle } from '../types/vehicle';
import type { Driver } from '../types/driver';
import type { AssignmentRequest } from '../types/assignmentRequest';

const VEHICLE_CONFIG = {
  endpoint: 'vehicles',
  entityName: 'vehículo',
  idField: 'idVehicle',
  initialFormData: {
    plate: '',
    brand: '',
    model: '',
    vehicleType: 'SEDAN' as const,
    serialNumber: '',
    mileage: 0,
    fuelType: 'GASOLINA' as const,
    acquisitionDate: '',
    status: 'ACTIVO' as const
  }
};

export function VehiclesSection() {
  const crud = useCrud<Vehicle>(VEHICLE_CONFIG);
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicleDrivers, setVehicleDrivers] = useState<Map<number, string>>(new Map());
  const [assignData, setAssignData] = useState({
    vehicleId: 0,
    vehiclePlate: '',
    driverId: '',
    assignmentDate: new Date().toISOString().split('T')[0],
    hasDriver: false
  });

  useEffect(() => {
    loadDrivers();
    loadVehicleDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await api.get('/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error al cargar choferes:', error);
      showErrorAlert('Error', 'No se pudieron cargar los choferes');
    }
  };

  const loadVehicleDrivers = async () => {
    try {
      const response = await api.get('/api/vehicle-assignments/driver-names');
      const driverMap = new Map<number, string>();
      Object.entries(response.data).forEach(([key, value]) => {
        driverMap.set(parseInt(key), value as string);
      });
      setVehicleDrivers(driverMap);
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    }
  };

  const refreshData = async () => {
    crud.fetchItems();
    await loadVehicleDrivers();
  };

  const handleOpenAssignModal = (vehicle: Vehicle) => {
    const currentDriverId = vehicleDrivers.has(vehicle.idVehicle || 0) 
      ? findDriverIdByName(vehicleDrivers.get(vehicle.idVehicle || 0) || '')
      : '';

    setAssignData({
      vehicleId: vehicle.idVehicle || 0,
      vehiclePlate: vehicle.plate,
      driverId: currentDriverId,
      assignmentDate: new Date().toISOString().split('T')[0],
      hasDriver: vehicleDrivers.has(vehicle.idVehicle || 0)
    });
    setIsAssignModalOpen(true);
  };

  const findDriverIdByName = (driverName: string): string => {
    const driver = drivers.find(d => 
      `${d.firstName} ${d.lastName}` === driverName
    );
    return driver?.idDriver?.toString() || '';
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setAssignData({
      vehicleId: 0,
      vehiclePlate: '',
      driverId: '',
      assignmentDate: new Date().toISOString().split('T')[0],
      hasDriver: false
    });
  };

  const handleAssignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Si seleccionó "Sin asignar" (driverId vacío)
      if (!assignData.driverId || assignData.driverId === '') {
        if (assignData.hasDriver) {
          const result = await showConfirmDeleteAlert(
            '¿Eliminar asignación?',
            'Se quitará el conductor asignado a este vehículo.'
          );
          if (!result.isConfirmed) return;
          
          await api.delete(`/api/vehicle-assignments/${assignData.vehicleId}`);
          showSuccessAlert('¡Eliminada!', 'La asignación ha sido eliminada.');
        } else {
          // No tenía conductor y sigue sin asignar, solo cerrar
          handleCloseAssignModal();
          return;
        }
      } else {
        // Asignar o reasignar
        const assignmentRequest: AssignmentRequest = {
          vehicleId: assignData.vehicleId,
          driverId: parseInt(assignData.driverId),
          assignmentDate: assignData.assignmentDate
        };

        await api.post('/api/vehicle-assignments', assignmentRequest);
        showSuccessAlert(
          '¡Éxito!',
          assignData.hasDriver 
            ? 'La reasignación se completó correctamente.'
            : 'La asignación se completó correctamente.'
        );
      }

      handleCloseAssignModal();
      await refreshData();
    } catch (error: any) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.message || 'No se pudo completar la operación.';
      showErrorAlert('Error', errorMsg);
    }
  };

  const VEHICLE_COLUMNS = [
    { key: 'plate', header: 'Placa' },
    { key: 'brand', header: 'Marca' },
    { key: 'model', header: 'Modelo' },
    { key: 'vehicleType', header: 'Tipo' },
    { key: 'mileage', header: 'Kilometraje' },
    { key: 'fuelType', header: 'Combustible' },
    { 
      key: 'assignedDriver', 
      header: 'Conductor Asignado',
      render: (item: Vehicle) => {
        const driverName = vehicleDrivers.get(item.idVehicle || 0);
        
        return driverName ? (
          <span className="driver-badge">{driverName}</span>
        ) : (
          <span className="no-driver">Sin asignar</span>
        );
      }
    },
    { 
      key: 'status', 
      header: 'Estado',
      render: (item: Vehicle) => (
        <span className={`status-badge ${item.status.toLowerCase()}`}>
          {item.status}
        </span>
      )
    }
  ];

  const VEHICLE_FIELDS = [
    { name: 'plate', label: 'Placa', type: 'text', placeholder: 'Ej: ABC-1234' },
    { name: 'serialNumber', label: 'Número de Serie', type: 'text', placeholder: 'Ej: VIN123456789' },
    { name: 'brand', label: 'Marca', type: 'text', placeholder: 'Ej: Toyota' },
    { name: 'model', label: 'Modelo', type: 'text', placeholder: 'Ej: Hilux' },
    { 
      name: 'vehicleType', 
      label: 'Tipo', 
      type: 'select',
      options: [
        { value: 'SEDAN', label: 'Sedán' },
        { value: 'SUV', label: 'SUV' },
        { value: 'CAMIONETA', label: 'Camioneta' },
        { value: 'VAN', label: 'Van' },
        { value: 'CAMION', label: 'Camión' },
        { value: 'OTRO', label: 'Otro' }
      ]
    },
    { name: 'mileage', label: 'Kilometraje', type: 'text', placeholder: 'Ej: 50000' },
    { 
      name: 'fuelType', 
      label: 'Combustible', 
      type: 'select',
      options: [
        { value: 'GASOLINA', label: 'Gasolina' },
        { value: 'DIESEL', label: 'Diesel' },
        { value: 'ELECTRICO', label: 'Eléctrico' },
        { value: 'HIBRIDO', label: 'Híbrido' },
        { value: 'OTRO', label: 'Otro' }
      ]
    },
    { name: 'acquisitionDate', label: 'Fecha de Adquisición', type: 'date' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'ACTIVO', label: 'Activo' },
        { value: 'INACTIVO', label: 'Inactivo' },
        { value: 'MANTENIMIENTO', label: 'En Mantenimiento' }
      ]
    }
  ] as const;

  return (
    <div className="content-area">
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Gestión de Vehículos</h2>
            <p>Consultar, registrar y administrar vehículos</p>
          </div>
          <button className="btn btn-primary" onClick={crud.handleOpenCreateModal}>
            <PlusIcon />
            Nuevo Vehículo
          </button>
        </div>

        <SearchBar 
          value={crud.searchTerm}
          onChange={e => crud.setSearchTerm(e.target.value)}
          placeholder="Buscar vehículo..."
        />

        <GenericTable
          data={crud.items}
          columns={VEHICLE_COLUMNS}
          onEdit={crud.handleOpenEditModal}
          onDelete={(item) => crud.handleDelete(item)}
          idField="idVehicle"
          renderActions={(item) => (
            <button
              className="icon-btn edit"
              onClick={() => handleOpenAssignModal(item)}
              title={vehicleDrivers.has(item.idVehicle || 0) ? 'Reasignar Conductor' : 'Asignar Conductor'}
            >
              <AssignDriverIcon />
            </button>
          )}
        />
      </div>

      <GenericModal
        isOpen={crud.isModalOpen}
        onClose={() => crud.setIsModalOpen(false)}
        title={crud.editingItem ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        fields={VEHICLE_FIELDS}
        formData={crud.formData}
        onChange={crud.handleInputChange}
        onSubmit={crud.handleSubmit}
        isEditing={!!crud.editingItem}
      />

      {/* Modal de Asignación de Conductor */}
      {isAssignModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{assignData.hasDriver ? 'Reasignar Conductor' : 'Asignar Conductor'}</h3>
              <button className="close-btn" onClick={handleCloseAssignModal}>&times;</button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="form-group">
                <label>Vehículo</label>
                <input 
                  type="text" 
                  value={assignData.vehiclePlate} 
                  readOnly 
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Conductor</label>
                <select 
                  name="driverId" 
                  value={assignData.driverId} 
                  onChange={handleAssignInputChange}
                >
                  <option value="">Sin asignar</option>
                  {drivers
                    .filter(d => d.idDriver != null)
                    .map(driver => (
                      <option key={driver.idDriver} value={driver.idDriver}>
                        {driver.firstName} {driver.lastName} - {driver.idCard}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label>Fecha de Asignación</label>
                <input 
                  type="date" 
                  name="assignmentDate" 
                  value={assignData.assignmentDate} 
                  onChange={handleAssignInputChange} 
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAssignModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {assignData.hasDriver ? 'Reasignar' : 'Asignar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}