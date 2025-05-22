// models/Competition.model.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const slugify = require("slugify");

const CompetitionSchema = new Schema(
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
    logoUrl: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      enum: ["domestic", "continental", "global"],
    },
    continent: {
      type: String,
      lowercase: true,
      enum: [
        "asia",
        "europe",
        "africa",
        "north america",
        "south america",
        "oceania",
      ],
      required: function () {
        return this.level === "continental";
      },
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: function () {
        return this.level === "domestic";
      },
    },
    winners: [
      {
        club: {
          type: Schema.Types.ObjectId,
          ref: "Club",
          required: true,
        },
        year: {
          type: Number,
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
    ],
  },
  {
    timestamps: true,
  }
);

CompetitionSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (!this.logoUrl) {
    this.logoUrl = `/images/competitions/${this.slug}.webp`;
  }
  next();
});

module.exports = model("Competition", CompetitionSchema);
