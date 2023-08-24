const { ObjectId } = require("bson")
const mongoose = require("mongoose")
const { boolean } = require("webidl-conversions")

const userSchema = new mongoose.Schema(
    {
        phone: { type: Number },
        sessions: { type: Array }
    }
)

module.exports = mongoose.model("user", userSchema);