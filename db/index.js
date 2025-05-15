// Mongoose handles the connection between the app and MongoDB
const mongoose = require("mongoose");

// Get MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Attempt to connect to the MongoDB database
mongoose
  .connect(MONGO_URI)
  .then((mongooseInstance) => {
    const dbName = mongooseInstance.connection.name;
    console.log(`✅ Connected to MongoDB — Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
  });
