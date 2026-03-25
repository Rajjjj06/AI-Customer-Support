import {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
} from "../services/file.js";
import { useState, useCallback } from "react";

export const useFile = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file, id) => {
    setLoading(true);
    try {
      const response = await uploadFile(file, id);
      setFiles((prev) => [...prev, response.data]);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  const getAll = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getFiles(id);
      setFiles(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  const getFile = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getFileById(id);
      setFile(response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((file) => file._id !== id));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  return {
    files,
    loading,
    file,
    error,
    upload,
    getAll,
    getFile,
    remove,
  };
};
