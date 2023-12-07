const { Schema, model } = require("mongoose");

const userProfileSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: String,
  balance: {
    type: Number,
    default: 0
  },
  lastDaily: {
    type: Date
  }
}, { timestamps: true });

module.exports = model("userProfile", userProfileSchema);