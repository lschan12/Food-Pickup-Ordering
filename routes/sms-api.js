const express = require('express');
const router  = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const myPhoneNumber = process.env.MY_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

const sendFirstSMS = (smsData) => {

  const textString = `Hi ${smsData.name}! Your order will be ready in ${smsData.est_order_time} minutes.\
  We will notify you once your order is ready for pickup! 🍔`

return client.messages
.create({
   body: textString,
   from: twilioPhoneNumber,
   to: myPhoneNumber
 })
.then(message => {
  return message.sid;
});
};

router.get('/', (req, res) => {
  sendFirstSMS({
    name: 'Richard',
    est_order_time: 45
  })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;