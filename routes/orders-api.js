const express = require("express");
const router = express.Router();
const { placeOrder, updateOrderDishesTable } = require("../db/queries/orders");

router.post("/", (req, res) => {
  placeOrder(req.body)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

module.exports = router;
