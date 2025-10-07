
const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.post("/payment", processPayment);

module.exports = router;
