"use strict";
const express = require("express");
const router = express.Router();
const geocodeController = require("../controller/geocodeController");

// Geocode route
router.get("/geocode", geocodeController.geocode);
router.post("/geocode", geocodeController.geocode);

module.exports = router;
