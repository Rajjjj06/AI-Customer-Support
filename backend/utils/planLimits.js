import Subscription from "../models/subscription.model.js";
import { PLANS } from "../controllers/subscription.controller.js";

/**
 * Fetches the user's plan limits.
 * Returns the PLANS config for their current subscription.
 */
export async function getPlanLimits(userId) {
    const sub = await Subscription.findOne({ user: userId });
    const plan = sub?.plan || "starter";
    return { plan, limits: PLANS[plan] };
}
