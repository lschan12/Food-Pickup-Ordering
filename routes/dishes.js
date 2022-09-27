const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/login');

router.get('/', (req, res) => {
  if (req.session.user_id) {
    userQueries.getUserById(req.session.user_id)
      .then((response) => {
        const templateVars = {user: response};
        res.render('dishes', templateVars);
      });
  } else {
    res.redirect('../login');
  }
});

module.exports = router;

