const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/login');

router.post('/', (req, res) => {
  console.log(req.body);
  userQueries.getUserByPhone(req.body.phone)
    .then(data => {
      console.log(data);
      req.session.user_id = data.id;
      if (data.admin) {
        res.redirect('../orders');
      } else {
        res.redirect('../dishes');
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
