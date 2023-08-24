const { ObjectId } = require("bson")
const mongoose = require("mongoose")
const { object } = require("webidl-conversions")

const sessionSchema = new mongoose.Schema(
    {
        tableNumber: { type: Number, required: true },
        orders: [{ orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" } }],
        totalAmount: { type: Number, default: 0 },
        status: { type: String, required: true },
        transactionID: { type: String }
    },
    { timestamps: true }
)

module.exports = mongoose.model("session", sessionSchema);