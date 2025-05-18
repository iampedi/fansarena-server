const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ClubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
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

    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    stadium: {
      type: String,
      required: false,
      trim: true,
    },

    founded: {
      type: Number,
      required: false,
    },

    founder: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ClubSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  }
  next();
});

module.exports = model("Club", ClubSchema);
