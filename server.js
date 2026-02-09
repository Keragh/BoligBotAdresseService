"use strict";

const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");

const geocodeRoutes = require("./mvc/routes/geocodeRoutes");

const app = express();
app.use(express.json());

// Serve static files from outlook-addin directory
app.use("/outlook-addin", express.static(path.join(__dirname, "outlook-addin")));

// Use our routes
app.use("/", geocodeRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Geocoding Server!");
});

// HTTPS options
const options = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
};

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  try {
    const server = https.createServer(options, app);

    server.listen(PORT, () => {
      console.log(
        `HTTPS Geocoding server running on https://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

module.exports = app;
