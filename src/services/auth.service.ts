import axios from "axios";

export const authService = {
    login: async (username: string, password: string) => {
        const authHeader = "Basic " + btoa(`${username}:${password}`);

        const response = await axios.get("http://localhost:8080/api/users", {
            headers: {
                Authorization: authHeader,
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        return { data: response.data, authHeader };
    },

    logout: () => {
        sessionStorage.removeItem("auth");
    }
};