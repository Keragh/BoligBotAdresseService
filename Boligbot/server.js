const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");
const fetch = require("node-fetch"); // v2
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HTTPS Geocoding server is running" });
});

// FREE geocoding endpoint using Nominatim (OpenStreetMap)
app.get("/geocode", async (req, res) => {
  const address = req.query.address || (req.body && req.body.address);

  if (!address) {
    return res.status(400).json({
      error: "missing_address",
      message: "Please provide an 'address' query parameter or JSON body",
    });
  }

  const nominatimUrl =
    "https://nominatim.openstreetmap.org/search?" +
    "format=json&addressdetails=1&extratags=1&namedetails=1&limit=1&" +
    "q=" +
    encodeURIComponent(address);

  try {
    const response = await fetch(nominatimUrl, {
      headers: {
        // OpenStreetMap require a certificate consisting of projectname and valid email, I've used my personal.
        // If certificate isn't accepted, it'll return 403 (Forbidden)
        "User-Agent": "BoligStudentProject/1.0 (jannickmh@hotmail.dk)",
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "upstream_error",
        message: `Nominatim HTTP error: ${response.status}`,
      });
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({
        error: "no_results",
        message: "No matching address found",
      });
    }

    const result = data[0];

    // Our Json configuration.
    const json = {
      query: address,
      source: "nominatim",
      displayName: result.display_name,
      position: {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      },
      boundingBox: result.boundingbox || null,
      type: result.type || null,
      importance: result.importance || null,
      osm: {
        id: result.osm_id || null,
        type: result.osm_type || null,
      },
      address: result.address || {},
      extratags: result.extratags || {},
      namedetails: result.namedetails || {},
      raw: result,
    };

    res.json(json);
    // Catch to catch status errors from our side. if status error from openstreetmap, it'll say 403 (forbiddden). 
  } catch (err) {
    console.error("Geocoding error:", err);
    res.status(500).json({
      error: "internal_error",
      message: "Failed to contact Nominatim",
      details: err.message,
    });
  }
});
const options = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
};
const PORT = process.env.PORT || 3000;
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`HTTPS Geocoding server running on https://localhost:${PORT}`);
});
