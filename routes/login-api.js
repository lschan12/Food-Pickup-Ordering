const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/login');

router.post('/', (req, res) => {
  userQueries.getUserByPhone(req.body.phone)
    .then(data => {
      req.session.user_id = data.id;
      res.redirect('../');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
