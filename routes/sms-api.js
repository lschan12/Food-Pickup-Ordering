const express = require("express");
const router = express.Router();
const {
  customerSMS_1,
  customerSMS_2,
  customerSMS_3,
  restaurantSMS_1,
} = require("../public/scripts/sms");

/**
 * POST # 1: Order Confirmation Notification
 * Triggered by 'Place Order' button click
 * Restaurant and Customer both recieve SMS
 */

router.post("/1", (req, res) => {
  return restaurantSMS_1(req.body)
    .then((restaurantSID) => {
      customerSMS_1(req.body)
        .then((customerSID) => {
          res.send(customerSID);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
      return res.send(restaurantSID);
    })
    .catch((err) => {
      console.log("Error message: ",err);
      res.status(500).json({ error: err.message });
    });
});

/**
 * POST # 2: ETA Notification
 * Triggered by restaurant when they specify their own 'custom ETA'.  If default ETA is used, this message is not sent.
 * Customer recieves SMS
 */

router.post("/2", (req, res) => {
  return customerSMS_2(req.body)
    .then((messageID) => {
      return res.send(messageID);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * POST # 3: 'Order Ready for Pickup' Notification
 * Can be triggered: EITHER (1) manually on 'Order Ready' button click, OR (2) when ETA runs out)
 * Customer recieves SMS
 */

router.post("/3", (req, res) => {
  return customerSMS_3(req.body)
    .then((messageID) => {
      return res.send(messageID);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
