// models/Winner.model.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WinnerSchema = new Schema(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1800,
      max: new Date().getFullYear(),
    },
    season: {
      type: String,
    },
    rank: {
      type: String,
      enum: ["1st", "2nd", "3rd"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Winner", WinnerSchema);
