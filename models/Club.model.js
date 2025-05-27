// models/Club.model.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const slugify = require("slugify");

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
    logoUrl: {
      type: String,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    founded: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    arena: {
      type: String,
      trim: true,
    },
    colors: [
      {
        type: String,
        trim: true,
      },
    ],
    website: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/.+/.test(v),
        message: "Website must be a valid URL",
      },
    },
    trophies: {
      type: Number,
      default: 0,
      min: 0,
    },
    fans: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug & logoUrl
ClubSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (!this.logoUrl) {
    this.logoUrl = `/images/clubs/${this.slug}.png`;
  }
  next();
});

module.exports = model("Club", ClubSchema);
