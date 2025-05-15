const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CountrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      uppercase: true,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 3,
    },
    continent: {
      type: String,
      lowercase: true,
      required: true,
      enum: [
        "asia",
        "europe",
        "africa",
        "north america",
        "south america",
        "oceania",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Country", CountrySchema);
