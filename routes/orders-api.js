const express = require("express");
const router = express.Router();
const { placeOrder } = require("../db/queries/orders");

router.post("/", (req, res) => {
  console.log(req.body);
  placeOrder(req.body)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

module.exports = router;
