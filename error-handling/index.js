module.exports = (app) => {
  // Handle 404 - Route not found
  app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Handle all other errors (server errors, thrown exceptions, etc.)
  app.use((err, req, res, next) => {
    // Log the error details to the console for debugging
    console.error("❌ ERROR:", req.method, req.path, err);

    // Check if headers are already sent (avoid double responses)
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error. Please check the server logs.",
      });
    }
  });
};
