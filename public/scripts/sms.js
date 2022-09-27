const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = process.env.TWILIO_PHONE_NUMBER;
const customer = process.env.CUSTOMER_PHONE_NUMBER;
const restaurant = process.env.RESTAURANT_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

// TO DO: we need a restaurant name (remove the fake one below)
const restaurantName = 'Lighthouse Bistro';

/** 
   * Restaurant SMS # 1: Order Confirmation Notificaiton
  */
  
 const restaurantSMS_1 = ({orderID, customerName, customerPhone, totalPrice }) => {
  
  let time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });

  const textString = `New order recieved at ${time} from ${customerName} @ ${customerPhone}.  Total Price: $${totalPrice / 100}.  Order ID: ${orderID}`;

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

const customerSMS_1 = ({customerName, estimatedTime}) => {

    const textString = `Hello ${customerName}, thank you for your order at ${restaurantName}!  Your estimated wait time is approx ${estimatedTime} minutes.\
    We will notify you once your order is ready for pickup!`
  
    return client.messages
    .create({
      from: twilio,
      to: customer,
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

const customerSMS_2 = ({customerName, actualTime}) => {

  const textString = `Hello ${customerName}, we have an update on your order at ${restaurantName}!  Your order will be ready in approx ${actualTime} minutes.\
  We will notify you once your order is ready for pickup!`

  return client.messages
  .create({
    from: twilio,
    to: customer,
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

const customerSMS_3 = ({customerName, restaurantAddress}) => {

  const textString = `Hello ${customerName}, your order at ${restaurantName} is now ready for pickup!  Pickup location is at ${restaurantAddress}`

  return client.messages
  .create({
    from: twilio,
    to: customer,
    body: textString,
  })
  .then(message => {
    return message.sid;
  });
};

module.exports = { customerSMS_1, customerSMS_2, customerSMS_3, restaurantSMS_1 };