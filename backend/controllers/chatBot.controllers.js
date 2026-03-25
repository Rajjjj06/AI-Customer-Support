import ChatBot from "../models/chat.mode.js";
import Analytics from "../models/analytics.model.js";
import { logger } from "../config/logger.js";
import { generateEmbedding } from "../utils/embed.js";
import { getToCollection } from "../utils/chroma.js";
import groq from "../config/groq.js";
import { getPlanLimits } from "../utils/planLimits.js";

export const createChatBot = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({
                message: "Authenticate to create chatbot"
            })
        }
        const { name, companyName, description } = req.body;
        if (!name || !companyName) {
            return res.status(400).json({
                message: "They are both required"
            })
        }

        // Enforce chatbot plan limit
        const { limits } = await getPlanLimits(userId);
        if (limits.chatbots !== Infinity) {
            const existingBots = await ChatBot.countDocuments({ user: userId });
            if (existingBots >= limits.chatbots) {
                return res.status(403).json({
                    message: `Your plan allows a maximum of ${limits.chatbots} chatbot(s). Please upgrade to create more.`,
                    code: "CHATBOT_LIMIT_REACHED"
                });
            }
        }
        const chatBot = new ChatBot({
            name,
            companyName,
            user: userId,
            description
        })
        await chatBot.save();

        return res.status(201).json({
            message: "Created",
            data: chatBot
        })
    } catch (error) {
        logger.error(error)
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const getBots = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({
                message: "Can't proceed"
            })
        }
        const chatBots = await ChatBot.find({ user: userId })
        return res.status(200).json({
            data: chatBots
        })
    } catch (error) {
        logger.error(error)
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const getBotById = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const { id: botId } = req.params;
        if (!botId) {
            return res.status(400).json({
                message: "No bots found"
            })
        }
        const bot = await ChatBot.findOne({ _id: botId, user: userId })
        if (!bot) {
            return res.status(404).json({
                message: "No bots found"
            })
        }
        return res.status(200).json({
            data: bot
        })
    } catch (error) {
        logger.error(error)
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const deleteBot = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({
                message: "Not authorized"
            })
        }
        const botId = req.params.id;
        if (!botId) {
            return res.status(400).json({
                message: "BotId not there"
            })
        }
        const bot = await ChatBot.findOne({ _id: botId, user: userId })
        if (!bot) {
            return res.status(404).json({
                message: "Not found"
            })
        }
        await bot.deleteOne();

        return res.status(200).json({
            message: "Deleted"
        })

    } catch (error) {
        logger.error(error)
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const chatWithBot = async (req, res) => {
    try {
        const botId = req.params.id;
        const { question, history = [] } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        // Check the bot owner's message limit for the current month
        const ChatBot = (await import("../models/chat.mode.js")).default;
        const bot = await ChatBot.findById(botId);
        if (bot) {
            const { limits } = await getPlanLimits(bot.user);
            if (limits.messages !== Infinity) {
                const startOfMonth = new Date();
                startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
                const msgCount = await Analytics.countDocuments({
                    chatBot: botId,
                    createdAt: { $gte: startOfMonth }
                });
                if (msgCount >= limits.messages) {
                    return res.status(429).json({
                        message: "Monthly message limit reached. The bot owner needs to upgrade their plan.",
                        code: "MESSAGE_LIMIT_REACHED"
                    });
                }
            }
        }

        // 1. Convert user's question into an embedding
        const questionEmbedding = await generateEmbedding(question);

        // 2. Query ChromaDB for the Top chunks matching this specific Bot
        const collection = await getToCollection("documents");
        const results = await collection.query({
            queryEmbeddings: [questionEmbedding],
            nResults: 4,
            where: { botId: botId.toString() }
        });

        // 3. Extract the actual text from Chroma's results
        let relevantContextChunks = "";
        if (results.documents && results.documents.length > 0 && results.documents[0].length > 0) {
            relevantContextChunks = results.documents[0].join("\n\n");
        }

        // 4. Construct the Prompt for Groq
        const promptContext = "You are a helpful AI Support Copilot. Answer the user's question based strictly on the provided context. If the answer is not in the context, say 'I don't have enough information to answer that based on the provided documents.'\n\nCONTEXT:\n" + relevantContextChunks;

        // 5. Call Groq
        const messages = [
            { role: "system", content: promptContext },
            ...history,
            { role: "user", content: question }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.1-8b-instant",
        });

        const answer = chatCompletion.choices[0]?.message?.content || "No response generated.";

        // Capture where the request came from 
        const origin = req.headers.origin || req.headers.referer || "Internal Dashboard / Unknown";
        
        // Log to Analytics DB
        const analyticsRecord = new Analytics({
            chatBot: botId,
            question: question,
            answer: answer,
            origin: origin
        });
        await analyticsRecord.save();

        return res.status(200).json({ answer });

    } catch (error) {
        logger.error(error);
        console.log(error);
        return res.status(500).json({ message: "Error chatting with bot" });
    }
}

export const getAnalytics = async (req, res) => {
    try {
        const botId = req.params.id;
        
        // Only return analytics for this bot. Sorted by newest first.
        const analyticsCount = await Analytics.countDocuments({ chatBot: botId });
        const history = await Analytics.find({ chatBot: botId }).sort({ createdAt: -1 });
        
        return res.status(200).json({ 
            data: {
                totalInteractions: analyticsCount,
                history
            }
        });
    } catch (error) {
        logger.error(error);
        console.log(error);
        return res.status(500).json({ message: "Error fetching analytics" });
    }
}