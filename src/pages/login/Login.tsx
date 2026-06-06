import React, { useState } from 'react';
import './Login.css';

export const Login: React.FC = () => {
    // Estados para capturar las credenciales en tiempo real
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    // Estados para manejar errores o mensajes de carga
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Función que procesará el formulario al dar click en el botón
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue al estilo tradicional HTML
        setErrorMessage(null);
        setIsLoading(true);

        try {
            // Aquí haremos la petición POST con Axios hacia tu Spring Boot más adelante.
            console.log('Enviando datos al backend:', { username, password });
            
            // Simulación temporal de espera
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Ejemplo de control si falla (esto vendrá del backend después)
            if (username !== 'admin' || password !== 'admin') {
                throw new Error('Usuario o contraseña incorrectos');
            }
            
            alert('¡Sesión iniciada correctamente!');
            
        } catch (error: any) {
            setErrorMessage(error.message || 'Ocurrió un error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                {/* Left Panel */}
                <div className="login-left">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            <h1>Sistema Mantenimiento</h1>
                            <p>Gestión Vehicular</p>
                        </div>
                    </div>

                    <div className="welcome-text">
                        <h2>Bienvenido de nuevo</h2>
                        <p>Accede a tu sistema de gestión vehicular y mantén el control total de tu flota</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="login-right">
                    <div className="login-header">
                        <h2>Iniciar Sesión</h2>
                        <p>Ingresa tus credenciales para continuar</p>
                    </div>

                    {/* Mensaje de error renderizado de forma condicional con React */}
                    {errorMessage && (
                        <div className="login-alert error">
                            {errorMessage}
                        </div>
                    )}

                    <form id="loginForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    id="username" 
                                    placeholder="Nombre de usuario" 
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};