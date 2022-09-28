const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/login');

router.get('/', (req, res) => {
  if (req.session.user_id) {
    userQueries.getUserById(req.session.user_id)
      .then((data) => {
        if (data.admin) {
          res.redirect('../orders');
        } else {
          res.redirect('../dishes');
        }
      });
  } else {
    const templateVars = {user: null};
    res.render('login', templateVars);
  }
});


module.exports = router;
