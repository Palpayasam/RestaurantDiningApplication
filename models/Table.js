const { ObjectId } = require("bson")
const mongoose = require("mongoose")
const { object } = require("webidl-conversions")

const tableSchema = new mongoose.Schema(
    {
        num: { type: Number, required: true },
        active: { type: Boolean, required: true, default: false },
        sessionID: { type: ObjectId },
    },
)

module.exports = mongoose.model("Table", tableSchema);