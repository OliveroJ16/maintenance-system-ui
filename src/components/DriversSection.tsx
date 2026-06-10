import React, { useState, useEffect } from 'react';
import { type Driver } from '../types/driver';
import { showSuccessAlert, showConfirmDeleteAlert, showErrorAlert } from '../utils/alert';

export function DriversSection() {
  // ESTADOS
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Estado para controlar los campos del formulario único
  const [formData, setFormData] = useState<Driver>({
    firstName: '',
    lastName: '',
    idCard: '',
    phone: '',
    email: '',
    licenseCategory: 'TIPO_B', // Pon aquí un valor por defecto de tu Enum en Java
    licenseExpirationDate: '',
    status: 'ACTIVO'
  });

  // 1. Cargar datos de la API de Spring Boot al montar el componente
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/drivers');

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      showErrorAlert('Error', 'No se pudieron cargar los choferes');
    }
  };

  // 2. Manejar cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Abrir modal para Crear Nuevo
  const handleOpenCreateModal = () => {
    setEditingDriver(null);
    setFormData({
      firstName: '',
      lastName: '',
      idCard: '',
      phone: '',
      email: '',
      licenseCategory: 'TIPO_B',
      licenseExpirationDate: '',
      status: 'ACTIVO'
    });
    setIsModalOpen(true);
  };

  // 4. Abrir modal para Editar cargando los datos correspondientes
  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData(driver); // Rellenamos el formulario con los datos del chofer seleccionado
    setIsModalOpen(true);
  };

  // 5. Guardar o Actualizar Chofer (Submit del Formulario)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingDriver;
    const url = isEditing ? `/api/drivers/${editingDriver.idDriver}` : '/api/drivers';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSuccessAlert(
          isEditing ? '¡Actualizado!' : '¡Registrado!',
          `El chofer se ha ${isEditing ? 'actualizado' : 'guardado'} correctamente.`
        );
        setIsModalOpen(false);
        fetchDrivers(); // Refrescar la tabla
      } else {
        showErrorAlert('Error', 'Ocurrió un problema al procesar la solicitud.');
      }
    } catch (error) {
      showErrorAlert('Error', 'Error de conexión con el servidor.');
    }
  };

  // 6. Eliminar Chofer usando tu Helper de SweetAlert2
  const handleDelete = async (id: number) => {
    const result = await showConfirmDeleteAlert('¿Eliminar chofer?', 'Esta acción no se puede deshacer.');

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
        if (response.ok) {
          showSuccessAlert('¡Eliminado!', 'El chofer ha sido removido del sistema.');
          fetchDrivers();
        } else {
          showErrorAlert('Error', 'No se pudo eliminar al chofer.');
        }
      } catch (error) {
        showErrorAlert('Error', 'Error de red al intentar eliminar.');
      }
    }
  };

  // 7. Filtrar choferes localmente mediante la barra de búsqueda
  const filteredDrivers = drivers.filter(d =>
    `${d.firstName} ${d.lastName} ${d.idCard}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title">
          <h2>Gestión de Choferes</h2>
          <p>Consultar, registrar y administrar choferes</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          Nuevo Chofer
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar chofer por nombre o cédula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Licencia</th>
              <th>Expiración</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((d) => (
              <tr key={d.idDriver}>
                <td>{d.firstName}</td>
                <td>{d.lastName}</td>
                <td>{d.idCard}</td>
                <td>{d.phone}</td>
                <td>{d.email}</td>
                <td>{d.licenseCategory}</td>
                <td>{d.licenseExpirationDate}</td>
                <td>
                  <span className={`status-badge ${d.status.toLowerCase()}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit" onClick={() => handleOpenEditModal(d)}>
                      Editar
                    </button>
                    <button className="icon-btn delete" onClick={() => d.idDriver && handleDelete(d.idDriver)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL ÚNICO DE REACT (REUTILIZABLE PARA CREAR Y EDITAR) */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingDriver ? 'Editar Chofer' : 'Nuevo Chofer'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Cédula</label>
                  <input type="text" name="idCard" value={formData.idCard} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Licencia</label>
                  <select name="licenseCategory" value={formData.licenseCategory} onChange={handleInputChange}>
                    <option value="TIPO_B">Tipo B</option>
                    <option value="TIPO_C">Tipo C</option>
                    <option value="TIPO_D">Tipo D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha Expiración</label>
                  <input type="date" name="licenseExpirationDate" value={formData.licenseExpirationDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editingDriver ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}