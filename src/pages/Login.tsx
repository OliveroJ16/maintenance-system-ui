import React from "react";
import { LoginLeftPanel } from "../components/LoginLeftPanel";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import "../styles/Login.css";

export const Login: React.FC = () => {

    const {
        username,
        password,
        errorMessage,
        isLoading,
        setUsername,
        setPassword,
        login
    } = useAuth();

    return (
        <div className="login-page-wrapper">
            <div className="login-container">

                <LoginLeftPanel />

                <div className="login-right">

                    <div className="login-header">
                        <h2>Iniciar Sesión</h2>
                        <p>
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="alert error">
                            {errorMessage}
                        </div>
                    )}

                    <LoginForm
                        username={username}
                        password={password}
                        isLoading={isLoading}
                        onUsernameChange={setUsername}
                        onPasswordChange={setPassword}
                        onSubmit={login}
                    />

                </div>

            </div>
        </div>
    );
};