const express = require("express");
const router = express.Router();
const { getOrders, getOrderForPickup, getOrder, placeOrder, changeOrderStatus } = require("../db/queries/orders");

router.get('/', (req, res) => {
  getOrders()
    .then(orders => {
      res.json(orders);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  getOrder(req.params.id)
    .then(order=> {
      res.json(order);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/pickup/:id', (req, res) => {
  getOrderForPickup(req.params.id)
    .then(order=> {
      res.json(order);
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
      console.log("response", response);
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/:id', (req, res) => {
  changeOrderStatus(req.params.id)
    .then(order=> {
      res.json(order);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
