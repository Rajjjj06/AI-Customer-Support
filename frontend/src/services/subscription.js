import { api } from "./api";

export const getMySubscription = async () => {
    const res = await api.get("/api/v1/subscription/me");
    return res.data.data;
};

export const createOrder = async (plan) => {
    const res = await api.post("/api/v1/subscription/create-order", { plan });
    return res.data.data;
};

export const verifyPayment = async (payload) => {
    const res = await api.post("/api/v1/subscription/verify", payload);
    return res.data;
};

export const cancelSubscription = async () => {
    const res = await api.post("/api/v1/subscription/cancel");
    return res.data;
};
