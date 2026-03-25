import { useState, useCallback } from "react";
import { createChatBot, getBots, getBotById, deleteBot } from "@/services/chatBot";

export const useBots = () => {
    const [bot, setBot] = useState(null);
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(false);

    const createBot = useCallback(async (data) => {
        try {
            setLoading(true);
            const result = await createChatBot(data);
            setBot(result);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAll = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getBots();
            setBots(data);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getById = useCallback(async (id) => {
        try {
            setLoading(true);
            const data = await getBotById(id);
            setBot(data);
            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            setLoading(true);
            await deleteBot(id);
            setBots((prev) => prev.filter((bot) => bot._id !== id));
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        bot,
        bots,
        loading,
        remove,
        getById,
        getAll,
        createBot
    };
};