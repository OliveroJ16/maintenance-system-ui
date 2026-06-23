import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import { GenericTable } from './GenericTable';
import { GenericModal } from './GenericModal';
import { SearchBar } from './SearchBar';
import { api } from '../services/api';
import { showSuccessAlert, showErrorAlert } from '../utils/alert';
import PlusIcon from '../assets/icons/plus.svg?react';
import type { User } from '../types/user';
import type { Driver } from '../types/driver';

// Tipo para el formulario que incluye driver.idDriver como string
interface UserFormData extends Omit<User, 'driver'> {
  password?: string;
  'driver.idDriver'?: string;
  driver?: { idDriver: number } | null;
}

const USER_CONFIG = {
  endpoint: 'users',
  entityName: 'usuario',
  idField: 'idUser',
  initialFormData: {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ADMINISTRADOR' as const,
    email: '',
    'driver.idDriver': ''
  } as UserFormData
};

export function UsersSection() {
  const crud = useCrud<UserFormData>(USER_CONFIG);
  
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await api.get('/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error al cargar choferes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!crud.editingItem;

    const dataToSend: any = { ...crud.formData };

    // Convertir driver.idDriver a objeto driver
    if (dataToSend['driver.idDriver'] && dataToSend['driver.idDriver'] !== '') {
      dataToSend.driver = { idDriver: parseInt(dataToSend['driver.idDriver']) };
    } else {
      dataToSend.driver = null;
    }
    delete dataToSend['driver.idDriver'];

    // Si es edición y no hay contraseña, eliminarla
    if (isEditing && !dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      if (isEditing && crud.editingItem) {
        await api.put(`/api/users/${(crud.editingItem as any).idUser}`, dataToSend);
      } else {
        await api.post('/api/users', dataToSend);
      }

      showSuccessAlert(
        isEditing ? '¡Actualizado!' : '¡Registrado!',
        `El usuario se ha ${isEditing ? 'actualizado' : 'guardado'} correctamente.`
      );

      crud.setIsModalOpen(false);
      crud.fetchItems();
    } catch (error) {
      showErrorAlert('Error', 'Error de conexión con el servidor.');
    }
  };

  const USER_COLUMNS = [
    { key: 'username', header: 'Usuario' },
    { key: 'firstName', header: 'Nombre' },
    { key: 'lastName', header: 'Apellido' },
    { 
      key: 'role', 
      header: 'Rol',
      render: (item: UserFormData) => (
        <span className={`status-badge ${item.role === 'ADMINISTRADOR' ? 'activo' : 'inactivo'}`}>
          {item.role === 'ADMINISTRADOR' ? 'Administrador' : 'Supervisor'}
        </span>
      )
    },
    { key: 'email', header: 'Email' },
    { 
  key: 'driver', 
  header: 'Chofer',
  render: (item: any) => (
    item.driver?.firstName ? (
      <span className="driver-badge">
        {item.driver.firstName} {item.driver.lastName}
      </span>
    ) : (
      <span className="no-driver">Sin asignar</span>
    )
  )
},
    { 
      key: 'registrationDate', 
      header: 'Fecha Registro',
      render: (item: UserFormData) => (
        (item as any).registrationDate 
          ? new Date((item as any).registrationDate).toLocaleString('es-PA', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '-'
      )
    }
  ];

  const driverOptions = [
    { value: '', label: 'Sin asignar' },
    ...drivers
      .filter(d => d.idDriver != null)
      .map(d => ({
        value: d.idDriver!.toString(),
        label: `${d.firstName} ${d.lastName} - ${d.idCard}`
      }))
  ];

  const CREATE_USER_FIELDS = [
    { name: 'username', label: 'Nombre de Usuario', type: 'text' as const, placeholder: 'Ej: juan123' },
    { name: 'password', label: 'Contraseña', type: 'text' as const, placeholder: 'Contraseña' },
    { name: 'firstName', label: 'Nombre', type: 'text' as const, placeholder: 'Ej: Juan' },
    { name: 'lastName', label: 'Apellido', type: 'text' as const, placeholder: 'Ej: Pérez' },
    { 
      name: 'role', 
      label: 'Rol', 
      type: 'select' as const,
      options: [
        { value: 'ADMINISTRADOR', label: 'Administrador' },
        { value: 'SUPERVISOR', label: 'Supervisor' }
      ]
    },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'Ej: juan@correo.com' },
    { 
      name: 'driver.idDriver', 
      label: 'Chofer Asignado', 
      type: 'select' as const,
      options: driverOptions
    }
  ];

  const EDIT_USER_FIELDS = [
    { name: 'username', label: 'Nombre de Usuario', type: 'text' as const, placeholder: 'Ej: juan123' },
    { name: 'firstName', label: 'Nombre', type: 'text' as const, placeholder: 'Ej: Juan' },
    { name: 'lastName', label: 'Apellido', type: 'text' as const, placeholder: 'Ej: Pérez' },
    { 
      name: 'role', 
      label: 'Rol', 
      type: 'select' as const,
      options: [
        { value: 'ADMINISTRADOR', label: 'Administrador' },
        { value: 'SUPERVISOR', label: 'Supervisor' }
      ]
    },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'Ej: juan@correo.com' },
    { 
      name: 'driver.idDriver', 
      label: 'Chofer Asignado', 
      type: 'select' as const,
      options: driverOptions
    }
  ];

  return (
    <div className="content-area">
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Gestión de Usuarios</h2>
            <p>Consultar, registrar y administrar usuarios</p>
          </div>
          <button className="btn btn-primary" onClick={crud.handleOpenCreateModal}>
            <PlusIcon />
            Nuevo Usuario
          </button>
        </div>

        <SearchBar 
          value={crud.searchTerm}
          onChange={e => crud.setSearchTerm(e.target.value)}
          placeholder="Buscar usuario..."
        />

        <GenericTable
          data={crud.items as any}
          columns={USER_COLUMNS}
          onEdit={(item: any) => {
            crud.setFormData({
              ...item,
              'driver.idDriver': item.driver?.idDriver?.toString() || ''
            });
            crud.setEditingItem(item);
            crud.setIsModalOpen(true);
          }}
          onDelete={(item) => crud.handleDelete(item)}
          idField="idUser"
        />
      </div>

      <GenericModal
        isOpen={crud.isModalOpen}
        onClose={() => crud.setIsModalOpen(false)}
        title={crud.editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}
        fields={crud.editingItem ? EDIT_USER_FIELDS : CREATE_USER_FIELDS}
        formData={crud.formData}
        onChange={crud.handleInputChange}
        onSubmit={handleSubmit}
        isEditing={!!crud.editingItem}
      />
    </div>
  );
}