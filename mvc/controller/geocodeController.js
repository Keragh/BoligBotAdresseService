"use strict";

const geocodeModel = require("../models/geocodeModel");

exports.healthCheck = (req, res) => {
  res.json({ status: "ok", message: "HTTPS Geocoding server is running" });
};

exports.geocode = async (req, res) => {
  const address = req.query.address || (req.body && req.body.address);

  if (!address) {
    return res.status(400).json({
      error: "missing_address",
      message: "Please provide an 'address' query parameter or JSON body",
    });
  }

  try {
    // Ask the "model" to query Nominatim
    const data = await geocodeModel.geocodeAddress(address);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({
        error: "no_results",
        message: "No matching address found",
      });
    }

    const result = data[0];

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
  } catch (err) {
    // If the error came from Nominatim status code
    if (err.isUpstreamError) {
      return res.status(502).json({
        error: "upstream_error",
        message: `Nominatim HTTP error: ${err.statusCode}`,
      });
    }

    console.error("Geocoding error:", err);
    res.status(500).json({
      error: "internal_error",
      message: "Failed to contact Nominatim",
      details: err.message,
    });
  }
};
