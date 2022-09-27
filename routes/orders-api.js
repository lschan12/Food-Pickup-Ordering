const express = require("express");
const router = express.Router();
const ordersQueries = require('../db/queries/orders');
const { placeOrder } = require("../db/queries/orders");

router.get('/', (req, res) => {
  ordersQueries.getOrders()
    .then(orders => {
      res.json(orders);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post("/", (req, res) => {
  placeOrder(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

module.exports = router;
