const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/receipt');

router.get('/:id', (req, res) => {
  orderQueries.getReceipt(req.params.id)
    .then(receipt => {
      res.json(receipt);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
