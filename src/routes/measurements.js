const express = require("express");
const router = express.Router();
const measurementsController = require("../controllers/measurements");

router.get("/measurements", measurementsController.allMeasurements);

module.exports = router;
