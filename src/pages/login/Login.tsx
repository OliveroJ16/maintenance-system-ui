import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const response = await axios.get("http://localhost:8080/api/users", {
                auth: {
                    username,
                    password
                }
            });

            console.log("Login exitoso:", response.data);
            alert("¡Inicio de sesión correcto!");
            window.localStorage.setItem("auth", "true");
            window.location.href = "/dashboard";

        } catch (error: any) {
            console.error("Error login:", error);
            setErrorMessage("Usuario o contraseña incorrectos");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="login-left">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                            </svg>
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

                {/* RIGHT PANEL */}
                <div className="login-right">

                    <div className="login-header">
                        <h2>Iniciar Sesión</h2>
                        <p>Ingresa tus credenciales</p>
                    </div>
                    {errorMessage && (
                        <div className="login-alert error">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Usuario</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        {/* BUTTON */}
                        <button type="submit" disabled={isLoading} className="login-btn">
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};