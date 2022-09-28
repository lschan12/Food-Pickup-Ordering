const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/receipt');
const calculateEstimatedETA = (cartItems, sum = false) => {
  if (sum) {
    return cartItems.reduce((acc, obj) => acc + obj.time, 0);
  };
  const factor = 1 + ((cartItems.length - 1) * 0.05);
  const longestETA = cartItems.reduce((acc, obj) => acc < obj.time ? obj.time : acc, 0);
  const estimatedETA = Math.ceil((( longestETA * factor) / 5)) * 5;
  return estimatedETA;
};

router.get('/:id', (req, res) => {
  orderQueries.getReceipt(req.params.id)
    .then(data => {
      const templateVars = {user: req.session.user_id};
      templateVars["itemArr"] = data;
      data.forEach(item => item.price*=1);
      data.forEach(item => item.qty*=1);
      let totalPrice = data.reduce((sum, {price, qty}) => sum + price * qty, 0);
      let totalTime = calculateEstimatedETA(data);
      templateVars["totalPrice"] = totalPrice / 100;
      templateVars["totalTime"] = totalTime;
      res.render('receipt', templateVars);
    });
});

module.exports = router;
