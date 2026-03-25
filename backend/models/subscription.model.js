import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // one active subscription per user
    },
    plan: {
        type: String,
        enum: ["starter", "pro", "enterprise"],
        default: "starter"
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySubscriptionId: { type: String },
    currentPeriodEnd: { type: Date }
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
