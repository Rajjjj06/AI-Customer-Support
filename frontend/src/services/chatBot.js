import { api } from "./api";

export const createChatBot = async (data) => {
    try {
        const response = await api.post("/api/v1/create", data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const getBots = async () => {
    try {
        const response = await api.get("/api/v1/bots");
        return response.data.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getBotById = async (id) => {
    try {
        const response = await api.get(`/api/v1/bot/${id}`);
        return response.data.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteBot = async (id) => {
    try {
        const response = await api.delete(`/api/v1/bot/${id}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const chatWithBot = async (id, data) => {
    try {
        const response = await api.post(`/api/v1/bot/${id}/chat`, data);
        return response.data; // Since the backend returns res.json({ answer })
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAnalytics = async (id) => {
    try {
        const response = await api.get(`/api/v1/bot/${id}/analytics`);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};