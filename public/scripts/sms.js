const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = process.env.TWILIO_PHONE_NUMBER;
const customer = process.env.CUSTOMER_PHONE_NUMBER;
const restaurant = process.env.RESTAURANT_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

/** 
 * Customer SMS # 1: Order Confirmation
*/

const customerSMS_1 = ({customerName, estimatedTime}) => {

    // TO DO: we need a restaurant name
    const restaurantName = 'Lighthouse Bistro';

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
   * Restaurant SMS # 1: Order Confirmation
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

  module.exports = { customerSMS_1, restaurantSMS_1 };