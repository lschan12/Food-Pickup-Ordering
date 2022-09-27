const express = require('express');
const router  = express.Router();
const { customerSMS_1, restaurantSMS_1 } = require('../public/scripts/sms');

/** 
 * POST # 1: Order Confirmation Notification
 * Triggered by 'Place Order' button click 
 * Restaurant and Customer both recieve SMS
*/

router.post('/1', (req, res) => {
  restaurantSMS_1(req.body)
    .then(response => {
      console.log('Text message sent to restaurant, message ID: ', response.sid);})
    .then(customerSMS_1(req.body)
      .then(response => {
        console.log('Text message sent to customer, message ID: ', response.sid);})
      .catch(err => {
      res.status(500).json({ error: err.message });
      })
    )
});

/** 
 * POST # 2: ETA Notification
 * Triggered by restaurant (when they EITHER (1) select default 'estimated ETA', OR (2) they specify their own 'custom ETA') 
 * Customer recieves SMS
*/

router.post('/2', (req, res) => {});


/** 
 * POST # 3: 'Order Ready for Pickup' Notification
 * Can be triggered: EITHER (1) manually if we have an 'Order Ready' button for restaurant to click, OR (2) when ETA runs out) 
 * Customer recieves SMS
*/

router.post('/3', (req, res) => {});

module.exports = router;