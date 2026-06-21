import React, { useState, useEffect } from 'react';
import { type Driver } from '../types/driver';
import { api } from '../services/api';
import {
  showSuccessAlert,
  showConfirmDeleteAlert,
  showErrorAlert
} from '../utils/alert';

import DeleteIcon from '../assets/icons/delete.svg?react';
import EditIcon from '../assets/icons/edit.svg?react';

export function DriversSection() {
  // =========================
  // ESTADOS
  // =========================
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState<Driver>({
    firstName: '',
    lastName: '',
    idCard: '',
    phone: '',
    email: '',
    licenseCategory: 'B',
    licenseExpirationDate: '',
    status: 'ACTIVO'
  });

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      showErrorAlert('Error', 'No se pudieron cargar los choferes');
    }
  };

  // =========================
  // INPUT HANDLER
  // =========================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // =========================
  // OPEN CREATE MODAL
  // =========================
  const handleOpenCreateModal = () => {
    setEditingDriver(null);
    setFormData({
      firstName: '',
      lastName: '',
      idCard: '',
      phone: '',
      email: '',
      licenseCategory: 'B',
      licenseExpirationDate: '',
      status: 'ACTIVO'
    });
    setIsModalOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver);

    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      idCard: driver.idCard,
      phone: driver.phone,
      email: driver.email,
      licenseCategory: driver.licenseCategory,
      licenseExpirationDate: driver.licenseExpirationDate,
      status: driver.status
    });

    setIsModalOpen(true);
  };

  // =========================
  // SAVE (CREATE / UPDATE)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!editingDriver;

    try {
      if (isEditing) {
        await api.put(`/api/drivers/${editingDriver!.idDriver}`, formData);
      } else {
        await api.post('/api/drivers', formData);
      }

      showSuccessAlert(
        isEditing ? '¡Actualizado!' : '¡Registrado!',
        `El chofer se ha ${isEditing ? 'actualizado' : 'guardado'} correctamente.`
      );

      setIsModalOpen(false);
      fetchDrivers();
    } catch (error) {
      showErrorAlert('Error', 'Error de conexión con el servidor.');
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: number) => {
    const result = await showConfirmDeleteAlert(
      '¿Eliminar chofer?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/drivers/${id}`);

        showSuccessAlert('¡Eliminado!', 'El chofer ha sido eliminado.');
        fetchDrivers();
      } catch (error) {
        showErrorAlert('Error', 'No se pudo eliminar al chofer.');
      }
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredDrivers = drivers.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.idCard}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // =========================
  // UI
  // =========================
  return (
    <div className="content-area">

      {/* HEADER */}
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

        {/* SEARCH */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar chofer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
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

                      <button
                        className="icon-btn edit"
                        onClick={() => handleOpenEditModal(d)}
                        title="Editar"
                      >
                        <EditIcon />
                      </button>

                      <button
                        className="icon-btn delete"
                        onClick={() => d.idDriver && handleDelete(d.idDriver)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (UI ORIGINAL RESTAURADA) */}
      {/* MODAL */}
{isModalOpen && (
  <div className="modal">
    <div className="modal-content">

      <div className="modal-header">
        <h3>{editingDriver ? 'Editar Chofer' : 'Nuevo Chofer'}</h3>

        <button
          className="close-btn"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* Fila 1: Nombre + Apellido */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Ej: Juan"
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Ej: Pérez"
            />
          </div>

          {/* Fila 2: Cédula + Teléfono */}
          <div className="form-group">
            <label>Cédula</label>
            <input
              name="idCard"
              value={formData.idCard}
              onChange={handleInputChange}
              placeholder="Ej: 8-1234-5678"
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ej: 6123-4567"
            />
          </div>

          {/* Fila 3: Email (ancho completo) */}
          <div className="form-group full-width">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ej: juan@correo.com"
            />
          </div>

          {/* Fila 4: Licencia + Expiración */}
          <div className="form-group">
            <label>Licencia</label>
            <select
              name="licenseCategory"
              value={formData.licenseCategory}
              onChange={handleInputChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>
          </div>

          <div className="form-group">
            <label>Expiración</label>
            <input
              type="date"
              name="licenseExpirationDate"
              value={formData.licenseExpirationDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Fila 5: Estado */}
          <div className="form-group">
            <label>Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>

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