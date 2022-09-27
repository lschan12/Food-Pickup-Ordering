const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/receipt');

router.get('/:id', (req, res) => {
  orderQueries.getReceipt(req.params.id)
    .then(data => {
      const templateVars = {user: req.session.user_id};
      templateVars["itemArr"] = data;
      data.forEach(item => item.price*=1);
      data.forEach(item => item.qty*=1);
      let totalPrice = data.reduce((sum, {price, qty}) => sum + price * qty, 0);
      let totalTime = data.reduce((sum, {time, qty}) => sum + time * qty, 0);
      templateVars["totalPrice"] = totalPrice / 100;
      templateVars["totalTime"] = totalTime;
      console.log(templateVars);
      res.render('receipt', templateVars);
    });
});

module.exports = router;
