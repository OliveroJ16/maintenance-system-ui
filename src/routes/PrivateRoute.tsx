import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<Props> = ({ children }) => {
    const isAuth = localStorage.getItem("auth");

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};