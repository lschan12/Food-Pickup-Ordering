// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const myPhoneNumber = process.env.MY_PHONE_NUMBER;
const accountSid = 'AC166b5cc937045efaa597b0e15624731f';
const authToken = '2ee1824f0455c624b7e996936db0cd19';
const twilioPhoneNumber = '+15878017269';
const myPhoneNumber = '+14035813161';

const client = require('twilio')(accountSid, authToken);

const sendFirstSMS = (smsData) => {

    const textString = `Hi ${smsData.name}! Your order will be ready in ${smsData.est_order_time} minutes.\
    We will notify you once your order is ready for pickup! 🍔`

client.messages
  .create({
     body: textString,
     from: twilioPhoneNumber,
     to: myPhoneNumber
   })
  .then(message => console.log(message.sid));
}

sendFirstSMS({
    name: 'Richard',
    est_order_time: 45
})
    
    
    // client.messages.create({
    //     to: myPhoneNumber,
    //     from: twilioPhoneNumber,
    //     body: textString,
    // })
    // .then(message => console.log(message.sid));

// }

// module.exports = {
//     sendFirstSMS
// }