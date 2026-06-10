import React, { useState } from 'react';
import { DriversSection } from '../components/DriversSection';

export function Dashboard() {
  // Estado para saber qué vista renderizar en el contenedor principal
  const [activeSection, setActiveSection] = useState<string>('drivers');

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí disparas tu lógica de logout (borrar JWT, redireccionar, etc.)
    console.log("Cerrando sesión...");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
            </svg>
          </div>
          <div className="logo-text">
            <h3>Sistema Mantenimiento</h3>
            <p>Gestión Vehicular</p>
          </div>
        </div>

        <div className="menu-section">
          <div className={`menu-item ${activeSection === 'alerts' ? 'active' : ''}`} onClick={() => setActiveSection('alerts')}>
            {/* SVG de Dashboard */}
            Dashboard
          </div>

          <div className={`menu-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')}>
            Usuarios
          </div>

          <div className={`menu-item ${activeSection === 'drivers' ? 'active' : ''}`} onClick={() => setActiveSection('drivers')}>
            Choferes
          </div>

          <div className={`menu-item ${activeSection === 'vehicles' ? 'active' : ''}`} onClick={() => setActiveSection('vehicles')}>
            Vehículos
          </div>
        </div>

        <div className="logout-section">
          <form onSubmit={handleLogout}>
            <button type="submit" className="menu-item logout-btn">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DINÁMICO */}
      <div className="main-content">
        <div className="content-area">
          {activeSection === 'drivers' && <DriversSection />}
          {activeSection === 'alerts' && <div>Contenido de Alertas/Dashboard</div>}
          {activeSection === 'users' && <div>Contenido de Usuarios</div>}
          {/* Agrega las demás secciones mapeadas a sus componentes aquí */}
        </div>
      </div>
    </div>
  );
}