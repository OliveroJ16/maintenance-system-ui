import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { showSuccessAlert, showErrorAlert } from '../utils/alert';

interface Vehicle {
  idVehicle: number;
  plate: string;
  brand: string;
  model: string;
}

interface Workshop {
  idWorkshop: number;
  workshopName: string;
}

interface MaintenanceFilters {
  startDate: string;
  endDate: string;
  status: string;
  vehicleId: string;
}

interface CostFilters {
  startDate: string;
  endDate: string;
  workshopId: string;
}

const initialMaintenanceFilters: MaintenanceFilters = {
  startDate: '',
  endDate: '',
  status: '',
  vehicleId: ''
};

const initialCostFilters: CostFilters = {
  startDate: '',
  endDate: '',
  workshopId: ''
};

export function ReportsSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [maintenanceFilters, setMaintenanceFilters] = useState<MaintenanceFilters>(initialMaintenanceFilters);
  const [costFilters, setCostFilters] = useState<CostFilters>(initialCostFilters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
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

  const loadWorkshops = async () => {
    try {
      const response = await api.get('/api/workshops');
      setWorkshops(response.data);
    } catch (error) {
      console.error('Error al cargar talleres:', error);
    }
  };

  const handleMaintenanceFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMaintenanceFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCostFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCostFilters(prev => ({ ...prev, [name]: value }));
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadMaintenancesReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (maintenanceFilters.startDate) params.append('startDate', maintenanceFilters.startDate);
      if (maintenanceFilters.endDate) params.append('endDate', maintenanceFilters.endDate);
      if (maintenanceFilters.status) params.append('status', maintenanceFilters.status);
      if (maintenanceFilters.vehicleId) params.append('vehicleId', maintenanceFilters.vehicleId);

      const response = await api.post(`/api/reports/maintenances/pdf?${params.toString()}`, null, {
        responseType: 'blob'
      });

      downloadBlob(response.data, `reporte-mantenimientos-${new Date().toISOString().split('T')[0]}.pdf`);
      showSuccessAlert('¡Descargado!', 'El reporte de mantenimientos se ha descargado correctamente.');
    } catch (error) {
      showErrorAlert('Error', 'No se pudo generar el reporte de mantenimientos.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCostsReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (costFilters.startDate) params.append('startDate', costFilters.startDate);
      if (costFilters.endDate) params.append('endDate', costFilters.endDate);
      if (costFilters.workshopId) params.append('workshopId', costFilters.workshopId);

      const response = await api.post(`/api/reports/costs/pdf?${params.toString()}`, null, {
        responseType: 'blob'
      });

      downloadBlob(response.data, `reporte-costos-${new Date().toISOString().split('T')[0]}.pdf`);
      showSuccessAlert('¡Descargado!', 'El reporte de costos se ha descargado correctamente.');
    } catch (error) {
      showErrorAlert('Error', 'No se pudo generar el reporte de costos.');
    } finally {
      setLoading(false);
    }
  };

  const downloadStatisticsReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/reports/statistics/pdf', null, {
        responseType: 'blob'
      });

      downloadBlob(response.data, `reporte-estadisticas-${new Date().toISOString().split('T')[0]}.pdf`);
      showSuccessAlert('¡Descargado!', 'El reporte de estadísticas se ha descargado correctamente.');
    } catch (error) {
      showErrorAlert('Error', 'No se pudo generar el reporte de estadísticas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">

      {/* Reporte de Mantenimientos */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Reporte de Mantenimientos</h2>
            <p>Historial de mantenimientos realizados y programados</p>
          </div>
        </div>

        <form onSubmit={downloadMaintenancesReport}>
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                name="startDate"
                value={maintenanceFilters.startDate}
                onChange={handleMaintenanceFilterChange}
              />
            </div>

            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                name="endDate"
                value={maintenanceFilters.endDate}
                onChange={handleMaintenanceFilterChange}
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                name="status"
                value={maintenanceFilters.status}
                onChange={handleMaintenanceFilterChange}
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="COMPLETADO">Completado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vehículo</label>
              <select
                name="vehicleId"
                value={maintenanceFilters.vehicleId}
                onChange={handleMaintenanceFilterChange}
              >
                <option value="">Todos los vehículos</option>
                {vehicles.map(v => (
                  <option key={v.idVehicle} value={v.idVehicle}>
                    {v.plate} - {v.brand} {v.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {loading ? 'Generando...' : 'Descargar Reporte PDF'}
            </button>
          </div>
        </form>
      </div>

      {/* Reporte de Costos */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Reporte de Costos</h2>
            <p>Análisis de costos de mantenimiento por taller</p>
          </div>
        </div>

        <form onSubmit={downloadCostsReport}>
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                name="startDate"
                value={costFilters.startDate}
                onChange={handleCostFilterChange}
              />
            </div>

            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                name="endDate"
                value={costFilters.endDate}
                onChange={handleCostFilterChange}
              />
            </div>

            <div className="form-group">
              <label>Taller</label>
              <select
                name="workshopId"
                value={costFilters.workshopId}
                onChange={handleCostFilterChange}
              >
                <option value="">Todos los talleres</option>
                {workshops.map(w => (
                  <option key={w.idWorkshop} value={w.idWorkshop}>
                    {w.workshopName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {loading ? 'Generando...' : 'Descargar Reporte PDF'}
            </button>
          </div>
        </form>
      </div>

      {/* Reporte de Estadísticas Completas */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Reporte de Estadísticas Completas</h2>
            <p>Resumen general del sistema con todas las métricas</p>
          </div>
        </div>

        <div className="report-description">
          <p>Este reporte incluye:</p>
          <ul>
            <li>Estadísticas completas de vehículos</li>
            <li>Estadísticas de mantenimientos por tipo</li>
            <li>Información sobre talleres registrados</li>
            <li>Estado general de la flota</li>
          </ul>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={downloadStatisticsReport}
            disabled={loading}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {loading ? 'Generando...' : 'Descargar Reporte PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}