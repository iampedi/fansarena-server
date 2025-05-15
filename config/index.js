// Express framework - required to parse request bodies
const express = require("express");

// HTTP request logger middleware (shows info in terminal)
const logger = require("morgan");

// Parses cookies attached to the client request object
const cookieParser = require("cookie-parser");

// Enables Cross-Origin Resource Sharing
const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

// Middleware setup
module.exports = (app) => {
  // Trust the first proxy (e.g., when deployed on platforms like Heroku)
  app.set("trust proxy", 1);

  // Allow requests only from the defined frontend origin
  app.use(
    cors({
      origin: [FRONTEND_URL],
      credentials: true, // allows cookies and auth headers to be sent
    })
  );

  // Log HTTP requests in dev-friendly format
  app.use(logger("dev"));

  // Parse incoming requests with JSON payloads
  app.use(express.json());

  // Parse URL-encoded data (e.g., form submissions)
  app.use(express.urlencoded({ extended: false }));

  // Parse cookies in incoming requests
  app.use(cookieParser());
};
