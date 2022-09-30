const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = process.env.TWILIO_PHONE_NUMBER;
const restaurant = process.env.RESTAURANT_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

const restaurantName = 'Lighthouse Bistro';
const restaurantAddress = '7425 Rockwater Dr, Atwood Lake, BC T7E 0N3';

/**
   * Restaurant SMS # 1: Order Confirmation Notificaiton
  */

const restaurantSMS_1 = ({orderID, userName, userPhone, totalPrice }) => {

  let time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });

  const textString = `New order recieved at ${time} from ${userName} @ ${userPhone}.  Total Price: $${totalPrice / 100}.  Order ID: ${orderID}`;

  return client.messages
    .create({
      from: twilio,
      to: restaurant,
      body: textString,
    })
    .then(message => {
      return message.sid;
    });
};


/**
 * Customer SMS # 1: Order Placed Notification
*/

const customerSMS_1 = ({userName, userPhone, estimatedTime}) => {

  const textString = `Hello ${userName}, thank you for your order at ${restaurantName}!  Your estimated wait time is approx ${estimatedTime} minutes.\
  We will notify you once your order is ready for pickup!`
  return client.messages
    .create({
      from: twilio,
      to: userPhone,
      body: textString,
    })
    .then(message => {
      return message.sid;
    });
};


/**
 * Customer SMS # 2: ETA Update Notification
 * (only sent if the restaurant manually specifies an ETA different from the default ETA).
*/

const customerSMS_2 = ({first_name, phone, actual}) => {

  const textString = `Hello ${first_name}, we have an update on your order at Lighthouse Bistro!  Your order will be ready in approx ${actual} minutes.\
  We will notify you once your order is ready for pickup!`

  return client.messages
    .create({
      from: twilio,
      to: phone,
      body: textString,
    })
    .then(message => {
      return message.sid;
    });
};

/**
 * Customer SMS # 3: Order Ready for Pickup Notification
 * Sent when the ETA is expired, or when the restaurant manually clicks the "Order Ready" button
*/

const customerSMS_3 = ({first_name, phone}) => {

  const textString = `Hello ${first_name}, your order at ${restaurantName} is now ready for pickup!  Pickup location is at ${restaurantAddress}`

  return client.messages
    .create({
      from: twilio,
      to: phone,
      body: textString,
    })
    .then(message => {
      return message.sid;
    });
};

module.exports = { customerSMS_1, customerSMS_2, customerSMS_3, restaurantSMS_1 };
