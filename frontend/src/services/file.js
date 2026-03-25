import { api } from "./api.js";

export const uploadFile = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/api/v1/create/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFiles = async (id) => {
  try {
    const response = await api.get(`/api/v1/files/${id}`);
    return { data: response.data.data };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getFileById = async (id) => {
  try {
    const response = await api.get(`/api/v1/file/${id}`);
    return response.data.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteFile = async (id) => {
  try {
    await api.delete(`/api/v1/file/${id}`);
  } catch (error) {
    return Promise.reject(error);
  }
};
