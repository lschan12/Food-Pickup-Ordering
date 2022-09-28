const express = require('express');
const router  = express.Router();
const { getDishes, getDish } = require('../db/queries/dishes');

router.get('/', (req, res) => {
  getDishes()
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
  getDish(req.params.id)
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
