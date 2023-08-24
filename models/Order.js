const { ObjectId } = require("bson")
const mongoose = require("mongoose")
const { object } = require("webidl-conversions")

const orderSchema = new mongoose.Schema(
    {
        tableNumber: { type: Number, required: true },
        products: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
        }],
        amount: { type: Number },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);