const { ObjectId } = require("bson")
const mongoose = require("mongoose")
const { object } = require("webidl-conversions")

const productsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        cost: { type: Number, required: true },
        desc: { type: String }
    }
);

module.exports = mongoose.model("products", productsSchema);