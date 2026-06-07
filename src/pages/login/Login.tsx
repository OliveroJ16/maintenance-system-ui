import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { LoginLeftPanel } from "../../components/LoginLeftPanel";
import { LoginForm } from "../../components/LoginForm";
import { LoginAlert } from "../../components/LoginAlert";
import "./Login.css";

export const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const result = await authService.login(username, password);
            sessionStorage.setItem("auth", result.authHeader);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setErrorMessage("Usuario o contraseña incorrectos");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <LoginLeftPanel />
                <div className="login-right">
                    <div className="login-header">
                        <h2>Iniciar Sesión</h2>
                        <p>Ingresa tus credenciales</p>
                    </div>
                    {errorMessage && <LoginAlert message={errorMessage} />}
                    <LoginForm
                        username={username}
                        password={password}
                        isLoading={isLoading}
                        onUsernameChange={setUsername}
                        onPasswordChange={setPassword}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};