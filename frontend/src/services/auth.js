import {api} from "./api";

export const loginGoogle = async (firebaseIdToken) => {
  try {
    const response = await api.post("/api/v1/login", { token: firebaseIdToken });
    const { token } = response.data.data;
    
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/api/v1/me");
    return response.data.user;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};