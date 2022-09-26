const express = require('express');
const router  = express.Router();
const dishesQueries = require('../db/queries/dishes');

router.get('/', (req, res) => {
  dishesQueries.getDishes()
    .then(dishes => {
      res.json(dishes);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  dishesQueries.getDish(req.params.id)
    .then(dish => {
      res.json(dish);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
