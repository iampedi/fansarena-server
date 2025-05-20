// models/City.model.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("City", CitySchema);
