import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {
    const auth = sessionStorage.getItem("auth");

    if (auth) {
        config.headers.Authorization = auth;
    }

    return config;
});