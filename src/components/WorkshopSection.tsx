// sections/WorkshopsSection.tsx
import { useState, useEffect, useCallback } from 'react';
import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import { api } from '../services/api';
import { showSuccessAlert, showErrorAlert, showConfirmDeleteAlert } from '../utils/alert';
import PlusIcon from '../assets/icons/plus.svg?react';
import type { Workshop, Service, ServiceFormData } from '../types/workshop';

// ─── CONFIGURACIONES ────────────────────────────────
const WORKSHOP_CONFIG = {
  endpoint: 'workshops',
  entityName: 'taller',
  idField: 'idWorkshop',
  initialFormData: {
    workshopName: '',
    address: '',
    phone: '',
    email: '',
    specialty: '',
    status: 'ACTIVO' as const,
  },
};

const WORKSHOP_COLUMNS = [
  { key: 'workshopName', header: 'Nombre' },
  { key: 'address', header: 'Dirección' },
  { key: 'phone', header: 'Teléfono' },
  { key: 'email', header: 'Email' },
  { key: 'specialty', header: 'Especialidad' },
  {
    key: 'status',
    header: 'Estado',
    render: (item: Workshop) => (
      <span className={`status-badge ${item.status.toLowerCase()}`}>
        {item.status}
      </span>
    ),
  },
];

const WORKSHOP_FIELDS = [
  { name: 'workshopName', label: 'Nombre del Taller', type: 'text' as const, placeholder: 'Ej: Taller Central' },
  { name: 'address', label: 'Dirección', type: 'text' as const, placeholder: 'Ej: Calle 50, Panamá' },
  { name: 'phone', label: 'Teléfono', type: 'text' as const, placeholder: 'Ej: 6123-4567' },
  { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'Ej: taller@correo.com' },
  { name: 'specialty', label: 'Especialidad', type: 'text' as const, placeholder: 'Ej: Mecánica general' },
  {
    name: 'status',
    label: 'Estado',
    type: 'select' as const,
    options: [
      { value: 'ACTIVO', label: 'Activo' },
      { value: 'INACTIVO', label: 'Inactivo' },
    ],
  },
] as const;

const SERVICE_COLUMNS = [
  { key: 'serviceName', header: 'Servicio', render: (item: Service) => <strong>{item.serviceName}</strong> },
  { key: 'description', header: 'Descripción', render: (item: Service) => item.description || 'Sin descripción' },
  {
    key: 'cost',
    header: 'Costo',
    render: (item: Service) => (
      <span style={{ fontWeight: 600, color: '#059669' }}>
        ${Number(item.cost).toFixed(2)}
      </span>
    ),
  },
  {
    key: 'durationMinutes',
    header: 'Duración',
    render: (item: Service) => (item.durationMinutes ? `${item.durationMinutes} min` : '-'),
  },
  {
    key: 'status',
    header: 'Estado',
    render: (item: Service) => (
      <span className={`status-badge ${item.status.toLowerCase()}`}>
        {item.status}
      </span>
    ),
  },
];

const SERVICE_FIELDS = [
  { name: 'serviceName', label: 'Nombre del Servicio', type: 'text' as const, placeholder: 'Ej: Cambio de aceite' },
  { name: 'description', label: 'Descripción', type: 'text' as const, placeholder: 'Descripción detallada', fullWidth: true },
  { name: 'cost', label: 'Costo ($)', type: 'number' as const, placeholder: '0.00' },
  { name: 'durationMinutes', label: 'Duración (minutos)', type: 'number' as const, placeholder: 'Ej: 60' },
  {
    name: 'status',
    label: 'Estado',
    type: 'select' as const,
    options: [
      { value: 'ACTIVO', label: 'Activo' },
      { value: 'INACTIVO', label: 'Inactivo' },
    ],
  },
] as const;

// ─── ESTADO INICIAL DEL FORMULARIO DE SERVICIO ──────
const INITIAL_SERVICE_FORM: ServiceFormData = {
  serviceName: '',
  description: '',
  cost: '',
  durationMinutes: '',
  status: 'ACTIVO',
};

// ─── COMPONENTE PRINCIPAL ──────────────────────────
export function WorkshopsSection() {
  const workshopCrud = useCrud<Workshop>(WORKSHOP_CONFIG);

  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [managementSearch, setManagementSearch] = useState('');
  const [filteredManagementServices, setFilteredManagementServices] = useState<Service[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>(INITIAL_SERVICE_FORM);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

  const loadServices = useCallback(async (workshopId: number) => {
    setLoadingServices(true);
    try {
      const response = await api.get(`/api/workshops/${workshopId}/services`);
      setServices(response.data);
      setFilteredManagementServices(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setServices([]);
      setFilteredManagementServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    if (managementSearch.trim() === '') {
      setFilteredManagementServices(services);
    } else {
      const lower = managementSearch.toLowerCase();
      setFilteredManagementServices(
        services.filter(
          (s) =>
            s.serviceName.toLowerCase().includes(lower) ||
            (s.description && s.description.toLowerCase().includes(lower))
        )
      );
    }
  }, [managementSearch, services]);

  const handleWorkshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!workshopCrud.editingItem;
    const dataToSend = { ...workshopCrud.formData };

    try {
      if (isEditing && workshopCrud.editingItem) {
        const id = (workshopCrud.editingItem as Workshop).idWorkshop;
        if (!id) {
          showErrorAlert('Error', 'No se pudo identificar el taller a editar.');
          return;
        }
        await api.put(`/api/workshops/${id}`, dataToSend);
      } else {
        await api.post('/api/workshops', dataToSend);
      }

      showSuccessAlert(
        isEditing ? '¡Actualizado!' : '¡Registrado!',
        `El taller se ha ${isEditing ? 'actualizado' : 'guardado'} correctamente.`
      );

      workshopCrud.setIsModalOpen(false);
      workshopCrud.fetchItems();
    } catch (error) {
      showErrorAlert('Error', 'Error de conexión con el servidor.');
    }
  };

  const handleOpenServiceModal = (service: Service | null = null) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({
        serviceName: service.serviceName,
        description: service.description || '',
        cost: service.cost?.toString() || '',
        durationMinutes: service.durationMinutes?.toString() || '',
        status: service.status,
      });
    } else {
      setEditingService(null);
      setServiceFormData(INITIAL_SERVICE_FORM);
    }
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setEditingService(null);
    setServiceFormData(INITIAL_SERVICE_FORM);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshop?.idWorkshop) return;

    const dataToSend = {
      serviceName: serviceFormData.serviceName,
      description: serviceFormData.description,
      cost: parseFloat(serviceFormData.cost) || 0,
      durationMinutes: serviceFormData.durationMinutes
        ? parseInt(serviceFormData.durationMinutes)
        : null,
      status: serviceFormData.status,
    };

    try {
      if (editingService) {
        if (!editingService.idService) {
          showErrorAlert('Error', 'No se pudo identificar el servicio a editar.');
          return;
        }
        await api.put(`/api/services/${editingService.idService}`, dataToSend);
      } else {
        await api.post(`/api/services?workshopId=${selectedWorkshop.idWorkshop}`, dataToSend);
      }

      showSuccessAlert(
        editingService ? '¡Actualizado!' : '¡Registrado!',
        `El servicio se ha ${editingService ? 'actualizado' : 'guardado'} correctamente.`
      );

      handleCloseServiceModal();
      loadServices(selectedWorkshop.idWorkshop);
    } catch (error) {
      console.error('Error detallado:', error);
      showErrorAlert('Error', 'Error de conexión con el servidor.');
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!service.idService) {
      showErrorAlert('Error', 'No se pudo identificar el servicio a eliminar.');
      return;
    }

    const result = await showConfirmDeleteAlert(
      '¿Eliminar servicio?',
      `¿Estás seguro de eliminar "${service.serviceName}"?`
    );

    if (result.isConfirmed && selectedWorkshop?.idWorkshop) {
      try {
        await api.delete(`/api/services/${service.idService}`);
        showSuccessAlert('¡Eliminado!', 'El servicio se ha eliminado correctamente.');
        loadServices(selectedWorkshop.idWorkshop);
      } catch (error) {
        showErrorAlert('Error', 'No se pudo eliminar el servicio.');
      }
    }
  };

  const handleOpenManagementModal = async (workshop: Workshop) => {
    if (!workshop.idWorkshop) {
      showErrorAlert('Error', 'No se pudo identificar el taller.');
      return;
    }

    setSelectedWorkshop(workshop);
    setIsManagementModalOpen(true);
    setManagementSearch('');
    await loadServices(workshop.idWorkshop);
  };

  const handleCloseManagementModal = () => {
    setIsManagementModalOpen(false);
    setSelectedWorkshop(null);
  };

  return (
    <div className="content-area">
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Gestión de Talleres</h2>
            <p>Registrar, actualizar y administrar talleres con sus servicios</p>
          </div>
          <button className="btn btn-primary" onClick={workshopCrud.handleOpenCreateModal}>
            <PlusIcon />
            Nuevo Taller
          </button>
        </div>

        <SearchBar
          value={workshopCrud.searchTerm}
          onChange={(e) => workshopCrud.setSearchTerm(e.target.value)}
          placeholder="Buscar taller..."
        />

        {/* Tabla de Talleres: renderActions para el 3er botón */}
        <GenericTable
          data={workshopCrud.items}
          columns={WORKSHOP_COLUMNS}
          onEdit={workshopCrud.handleOpenEditModal}
          onDelete={(item) => workshopCrud.handleDelete(item)}
          idField="idWorkshop"
          renderActions={(item) => (
            <button
              className="icon-btn edit"
              onClick={() => handleOpenManagementModal(item)}
              title="Gestionar servicios"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </button>
          )}
        />
      </div>

      <GenericModal
        isOpen={workshopCrud.isModalOpen}
        onClose={() => workshopCrud.setIsModalOpen(false)}
        title={workshopCrud.editingItem ? 'Editar Taller' : 'Nuevo Taller'}
        fields={WORKSHOP_FIELDS}
        formData={workshopCrud.formData}
        onChange={workshopCrud.handleInputChange}
        onSubmit={handleWorkshopSubmit}
        isEditing={!!workshopCrud.editingItem}
      />

      <GenericModal
        isOpen={isManagementModalOpen}
        onClose={handleCloseManagementModal}
        title={`Servicios de ${selectedWorkshop?.workshopName || ''}`}
        maxWidth="1200px"
      >
        <div>
          <div style={{ marginBottom: '20px', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={() => handleOpenServiceModal(null)}>
              <PlusIcon />
              Nuevo Servicio
            </button>
          </div>

          <SearchBar
            value={managementSearch}
            onChange={(e) => setManagementSearch(e.target.value)}
            placeholder="Buscar servicio..."
          />

          {loadingServices ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando servicios...</p>
            </div>
          ) : filteredManagementServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <p>
                {services.length === 0
                  ? 'No hay servicios registrados para este taller'
                  : 'No se encontraron servicios'}
              </p>
            </div>
          ) : (
            <div className="table-container">
              <GenericTable
                data={filteredManagementServices}
                columns={SERVICE_COLUMNS}
                onEdit={(item) => handleOpenServiceModal(item)}
                onDelete={(item) => handleDeleteService(item)}
                idField="idService"
              />
            </div>
          )}

          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseManagementModal}>
              Cerrar
            </button>
          </div>
        </div>
      </GenericModal>

      <GenericModal
        isOpen={isServiceModalOpen}
        onClose={handleCloseServiceModal}
        title={editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
        fields={SERVICE_FIELDS}
        formData={serviceFormData}
        onChange={(e) => {
          const { name, value } = e.target;
          setServiceFormData((prev) => ({ ...prev, [name]: value }));
        }}
        onSubmit={handleServiceSubmit}
        isEditing={!!editingService}
      />
    </div>
  );
}