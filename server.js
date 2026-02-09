"use strict";

const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");

const geocodeRoutes = require("./mvc/routes/geocodeRoutes");

const app = express();
app.use(express.json());

// Serve static files from outlook-addin directory with proper configuration
app.use("/outlook-addin", express.static(path.join(__dirname, "outlook-addin"), {
  setHeaders: (res, filePath) => {
    // Set cache control headers for static assets
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    // Prevent directory listing
    res.setHeader('X-Content-Type-Options', 'nosniff');
  },
  dotfiles: 'deny',
  index: false
}));

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
