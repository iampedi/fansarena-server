// app.js
// Load environment variables from .env file into process.env
require("dotenv").config();

// Initialize database connection
require("./db");

// Import and initialize Express application
const express = require("express");
const { authenticate } = require("./middleware/auth");
const app = express();

// Apply global middleware configuration (e.g., logger, body parser, CORS)
require("./config")(app);

// Define root route
app.use("/api", require("./routes/general.routes"));

// Define AUTH routes
app.use("/auth", require("./routes/auth.routes"));

// Define API routes
app.use("/api/countries", require("./routes/countries.routes"));
app.use("/api/cities", require("./routes/cities.routes"));
app.use("/api/clubs", require("./routes/clubs.routes"));
app.use("/api/competitions", require("./routes/competitions.routes"));
app.use("/api/users", require("./routes/user.routes"));

// Centralized error handling and 404 fallback
require("./error-handling")(app);

// Export the configured Express app
module.exports = app;
