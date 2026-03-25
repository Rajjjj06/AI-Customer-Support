import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
    baseURL: backendURL,
    headers:{
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use(async (config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.authorization = `Bearer ${token}`
    }
    return config;
},
(error)=>{
    return Promise.reject(error) // Fixed: added return
}
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Auto-logout on expired/invalid token
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)