const mongoose = require("mongoose");
const Country = require("../models/Country");
require("dotenv").config();

async function normalizeCountries() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const countries = await Country.find();
    console.log(`🔍 Found ${countries.length} countries.`);

    for (const country of countries) {
      let updated = false;

      // فقط name و continent رو lowercase کن
      if (
        typeof country.name === "string" &&
        country.name !== country.name.toLowerCase()
      ) {
        country.name = country.name.toLowerCase();
        updated = true;
      }

      if (
        typeof country.continent === "string" &&
        country.continent !== country.continent.toLowerCase()
      ) {
        country.continent = country.continent.toLowerCase();
        updated = true;
      }

      if (updated) {
        await country.save();
        console.log(`✅ Updated: ${country.name}`);
      }
    }

    console.log("🎉 All countries normalized.");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.disconnect();
  }
}

normalizeCountries();
