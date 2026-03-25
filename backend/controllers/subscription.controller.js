import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Subscription from "../models/subscription.model.js";
import { logger } from "../config/logger.js";

// Plan definitions — source of truth on the backend
export const PLANS = {
    starter: { name: "Starter", priceInr: 0, chatbots: 1, documents: 50, messages: 500 },
    pro: { name: "Pro", priceInr: 3999, chatbots: 5, documents: 500, messages: 10000 },
    enterprise: { name: "Enterprise", priceInr: 14999, chatbots: Infinity, documents: Infinity, messages: Infinity },
};

/**
 * GET /api/v1/subscription/plans
 * Returns all plans (public, for landing page)
 */
export const getPlans = (req, res) => {
    return res.status(200).json({ data: PLANS });
};

/**
 * GET /api/v1/subscription/me
 * Returns the currently logged-in user's subscription
 */
export const getMySubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        let sub = await Subscription.findOne({ user: userId });
        if (!sub) {
            // Auto-create a free Starter subscription
            sub = await Subscription.create({ user: userId, plan: "starter", status: "active" });
        }
        return res.status(200).json({ data: sub });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: "Error fetching subscription" });
    }
};

/**
 * POST /api/v1/subscription/create-order
 * Creates a Razorpay order for a given plan
 * Body: { plan: "pro" | "enterprise" }
 */
export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const planData = PLANS[plan];
        if (!planData || planData.priceInr === 0) {
            return res.status(400).json({ message: "Invalid plan or plan is free" });
        }

        const order = await razorpay.orders.create({
            amount: planData.priceInr * 100, // Razorpay takes paise
            currency: "INR",
            receipt: `rcpt_${req.user._id}_${Date.now()}`,
            notes: { userId: req.user._id.toString(), plan }
        });

        return res.status(200).json({ data: order });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: "Error creating order" });
    }
};

/**
 * POST /api/v1/subscription/verify
 * Verifies Razorpay payment signature and activates the plan
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }
 */
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
        const userId = req.user._id;

        // 1. Verify the signature
        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSig !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed. Signature mismatch." });
        }

        // 2. Calculate next billing date (30 days)
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

        // 3. Upsert the subscription
        const sub = await Subscription.findOneAndUpdate(
            { user: userId },
            {
                plan,
                status: "active",
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                currentPeriodEnd
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({ message: "Payment verified. Plan activated!", data: sub });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: "Error verifying payment" });
    }
};

/**
 * POST /api/v1/subscription/cancel
 * Cancels the user's current subscription (downgrades to Starter at period end)
 */
export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        const sub = await Subscription.findOneAndUpdate(
            { user: userId },
            { status: "cancelled" },
            { new: true }
        );
        if (!sub) return res.status(404).json({ message: "No subscription found" });
        return res.status(200).json({ message: "Subscription cancelled. Access continues until period end.", data: sub });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: "Error cancelling subscription" });
    }
};
