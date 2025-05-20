// models/User.model.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
    },
    city: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favoriteClubs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Club",
        },
      ],
      validate: {
        validator: function (val) {
          return val.length <= 2;
        },
        message: "You can only choose up to 2 favorite clubs.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
