import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { showErrorAlert } from '../utils/alert';
import type { Maintenance } from '../types/maintenance';

interface AlertSummary {
  urgentes: number;
  notificadas: number;
  noVistas: number;
}

export function DashboardSection() {
  const [activeVehicles, setActiveVehicles] = useState(0);
  const [pendingMaintenances, setPendingMaintenances] = useState(0);
  const [alertSummary, setAlertSummary] = useState<AlertSummary>({
    urgentes: 0,
    notificadas: 0,
    noVistas: 0
  });
  const [upcomingMaintenances, setUpcomingMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Cargar vehículos activos
      const vehiclesResponse = await api.get('/api/vehicles');
      const activeVehiclesCount = vehiclesResponse.data.filter(
        (v: any) => v.status === 'ACTIVO'
      ).length;
      setActiveVehicles(activeVehiclesCount);

      // Cargar mantenimientos
      const maintenancesResponse = await api.get('/api/maintenance');
      const pendingCount = maintenancesResponse.data.filter(
        (m: any) => m.status === 'PENDIENTE' || m.status === 'EN_PROCESO'
      ).length;
      setPendingMaintenances(pendingCount);

      // Mantenimientos próximos
      const upcoming = maintenancesResponse.data
        .filter((m: any) => m.status === 'PENDIENTE')
        .sort((a: any, b: any) => 
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        )
        .slice(0, 5);
      setUpcomingMaintenances(upcoming);

      // Cargar resumen de alertas
      const alertsSummaryResponse = await api.get('/api/alerts/summary');
      setAlertSummary(alertsSummaryResponse.data);

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      showErrorAlert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      'PENDIENTE': 'pendiente',
      'EN_PROCESO': 'en-progreso',
      'COMPLETADO': 'completado',
      'CANCELADO': 'inactivo'
    };
    return statusMap[status] || 'pendiente';
  };

  const getStatusLabel = (status: string): string => {
    const labelMap: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'EN_PROCESO': 'En proceso',
      'COMPLETADO': 'Completado',
      'CANCELADO': 'Cancelado'
    };
    return labelMap[status] || status;
  };

  const formatDate = (date: string): string => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatKm = (km: number): string => {
    if (!km && km !== 0) return '—';
    return km.toLocaleString('es-ES') + ' km';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        padding: '24px'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Cargando dashboard...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Vehículos Activos</h3>
            <div className="stat-value">{activeVehicles}</div>
          </div>
          <div className="stat-icon blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Mantenimientos Pendientes</h3>
            <div className="stat-value">{pendingMaintenances}</div>
          </div>
          <div className="stat-icon orange">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Alertas Urgentes</h3>
            <div className="stat-value">{alertSummary.urgentes}</div>
          </div>
          <div className="stat-icon red">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Próximos Mantenimientos */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <h2>Mantenimientos Próximos</h2>
            <p>Últimos mantenimientos programados</p>
          </div>
          <button className="btn btn-secondary" onClick={loadDashboardData}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualizar
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Tipo Man.</th>
                <th>Fecha Prog.</th>
                <th>KM Prog.</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMaintenances.length > 0 ? (
                upcomingMaintenances.map((maintenance) => (
                  <tr key={maintenance.idMaintenance}>
                    <td>
                      <div>
                        <strong>{maintenance.vehicle?.plate || '—'}</strong>
                        <small style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {maintenance.vehicle?.brand} {maintenance.vehicle?.model}
                        </small>
                      </div>
                    </td>
                    <td>{maintenance.maintenanceType?.typeName || '—'}</td>
                    <td>{formatDate(maintenance.scheduledDate)}</td>
                    <td>{formatKm(maintenance.scheduledKm)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(maintenance.status)}`}>
                        {getStatusLabel(maintenance.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px', opacity: 0.3 }}>✅</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      No hay mantenimientos pendientes
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}