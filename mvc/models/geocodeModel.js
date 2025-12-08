"use strict";

const fetch = require("node-fetch"); // v2

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

async function geocodeAddress(address) {
  const url =
    NOMINATIM_BASE_URL +
    "?format=json&addressdetails=1&extratags=1&namedetails=1&limit=1&q=" +
    encodeURIComponent(address);

  const response = await fetch(url, {
    headers: {
      // OpenStreetMap require a certificate consisting of project name and valid email
      "User-Agent": "BoligStudentProject/1.0 (jannickmh@hotmail.dk)",
    },
  });

  if (!response.ok) {
    const error = new Error(`Nominatim HTTP error: ${response.status}`);
    error.statusCode = response.status;
    error.isUpstreamError = true;
    throw error;
  }

  const data = await response.json();
  return data;
}

module.exports = {
  geocodeAddress,
};
