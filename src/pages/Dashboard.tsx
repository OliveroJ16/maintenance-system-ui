import React, { useState } from 'react';
import { DriversSection } from '../components/DriversSection';
import { VehiclesSection } from '../components/VehicleSection';
import { UsersSection } from '../components/UsersSection';
import { WorkshopsSection } from '../components/WorkshopSection';
import { MaintenanceSection } from '../components/MaintenanceSection';
import { ReportsSection } from '../components/ReportsSection';
import { DashboardSection } from '../components/DashboardSection';
import { showSuccessAlert, showErrorAlert, showLogoutConfirmation } from '../utils/alert';
import { authService } from '../services/authService';

import LogoIcon from '../assets/icons/dashboard-logo.svg?react';
import DashboardIcon from '../assets/icons/dashboard-icon.svg?react';
import UsersIcon from '../assets/icons/users-icon.svg?react';
import DriversIcon from '../assets/icons/drivers-icon.svg?react';
import VehiclesIcon from '../assets/icons/vehicles-icon.svg?react';
import WorkshopIcon from '../assets/icons/workshop-icon.svg?react';
import MaintenanceIcon from '../assets/icons/maintenance-icon.svg?react';
import ReportsIcon from '../assets/icons/reports-icon.svg?react';
import LogoutIcon from '../assets/icons/logout-icon.svg?react';

const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  try {
    const result = await showLogoutConfirmation();

    if (result.isConfirmed) {
      authService.logout();
      sessionStorage.clear();
      showSuccessAlert('¡Sesión cerrada!', 'Has cerrado sesión correctamente');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
    
  } catch (error) {
    console.error('Error during logout:', error);
    localStorage.clear();
    sessionStorage.clear();
    showErrorAlert('Error', 'Ocurrió un error al cerrar sesión');
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <LogoIcon />
          </div>
          <div className="logo-text">
            <h3>Sistema Mantenimiento</h3>
            <p>Gestión Vehicular</p>
          </div>
        </div>

        <div className="menu-section">
          <div 
            className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveSection('dashboard')}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </div>

          <div 
            className={`menu-item ${activeSection === 'users' ? 'active' : ''}`} 
            onClick={() => setActiveSection('users')}
          >
            <UsersIcon />
            <span>Usuarios</span>
          </div>

          <div 
            className={`menu-item ${activeSection === 'drivers' ? 'active' : ''}`} 
            onClick={() => setActiveSection('drivers')}
          >
            <DriversIcon />
            <span>Choferes</span>
          </div>

          <div 
            className={`menu-item ${activeSection === 'vehicles' ? 'active' : ''}`} 
            onClick={() => setActiveSection('vehicles')}
          >
            <VehiclesIcon />
            <span>Vehículos</span>
          </div>

          <div 
            className={`menu-item ${activeSection === 'workshop' ? 'active' : ''}`} 
            onClick={() => setActiveSection('workshop')}
          >
            <WorkshopIcon />
            <span>Talleres</span>
          </div>

          <div 
            className={`menu-item ${activeSection === 'maintenance' ? 'active' : ''}`} 
            onClick={() => setActiveSection('maintenance')}
          >
            <MaintenanceIcon />
            <span>Mantenimientos</span>
          </div>

          <div 
            className={`menu-item ${activeSection === 'reports' ? 'active' : ''}`} 
            onClick={() => setActiveSection('reports')}
          >
            <ReportsIcon />
            <span>Historial y Reportes</span>
          </div>
        </div>

        <div className="logout-section">
          <form onSubmit={handleLogout}>
            <button type="submit" className="menu-item logout-btn">
              <LogoutIcon />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </div>

      <div className="main-content">
        <div className="content-area" style={{ padding: 0 }}>
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'drivers' && <DriversSection />}
          {activeSection === 'vehicles' && <VehiclesSection />}
          {activeSection === 'workshop' && <WorkshopsSection />}
          {activeSection === 'maintenance' && <MaintenanceSection />}
          {activeSection === 'reports' && <ReportsSection />}
        </div>
      </div>
    </div>
  );
}