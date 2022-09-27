const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('../');
  } else {
    const templateVars = {user: null};
    res.render('login', templateVars);
  }
});


module.exports = router;
