import { useState } from 'react';
import { MaintenancesTab } from './MaintenanceTab';
import { MaintenanceTypesTab } from './MaintenanceTypesTab';
import { ConfigurationsTab } from './ConfigurationTab';

export function MaintenanceSection() {
  const [activeTab, setActiveTab] = useState<'maintenances' | 'types' | 'configs'>('maintenances');

  return (
    <div className="content-area">
      <div className="header">
        <div className="header-left">
          <h1>Mantenimientos</h1>
          <p>Gestión de mantenimientos programados</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          className={`btn tab-btn ${activeTab === 'maintenances' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('maintenances')}
        >
          Mantenimientos
        </button>
        <button
          className={`btn tab-btn ${activeTab === 'types' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('types')}
        >
          Tipos de mantenimiento
        </button>
        <button
          className={`btn tab-btn ${activeTab === 'configs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('configs')}
        >
          Configuraciones
        </button>
      </div>

      {activeTab === 'maintenances' && <MaintenancesTab />}
      {activeTab === 'types' && <MaintenanceTypesTab />}
      {activeTab === 'configs' && <ConfigurationsTab />}
    </div>
  );
}