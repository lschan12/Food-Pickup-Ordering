const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/login');

router.get('/', (req, res) => {
  userQueries.getUserById(req.session.user_id)
    .then((data) => {
      const templateVars = {user: data};
      res.render('orders', templateVars);
    });
});

module.exports = router;

