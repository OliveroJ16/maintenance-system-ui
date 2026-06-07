import LogoIcon from '../assets/icons/logo.svg?react';

export const LoginLeftPanel: React.FC = () => (
    <div className="login-left">
        <div className="logo-section">
            <div className="logo-icon">
                <LogoIcon aria-label="logo" />
            </div>
            <div className="logo-text">
                <h1>Sistema Mantenimiento</h1>
                <p>Gestión Vehicular</p>
            </div>
        </div>
        <div className="welcome-text">
            <h2>Bienvenido de nuevo</h2>
            <p>Accede a tu sistema de gestión vehicular</p>
        </div>
    </div>
);