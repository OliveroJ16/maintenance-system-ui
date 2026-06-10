import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useAuth = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const login = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage(null);
        setIsLoading(true);

        try {
            const result = await authService.login(
                username,
                password
            );

            sessionStorage.setItem(
                "auth",
                result.authHeader
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setErrorMessage(
                "Usuario o contraseña incorrectos"
            );

        } finally {

            setIsLoading(false);

        }
    };

    return {
        username,
        password,
        errorMessage,
        isLoading,

        setUsername,
        setPassword,

        login
    };
};