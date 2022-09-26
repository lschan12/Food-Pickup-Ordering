const db = require("../connection");

const placeOrder = ({orderTotal, orderTime}) => {

  const queryString =`
    INSERT INTO orders (user_id, order_time, total_price, est_prep_time)
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING *;`;

  // TO DO: replace '1' with actual userID once we have login auth
  const queryParams = ['1', orderTotal, orderTime] 

  return db.query(queryString, queryParams)
  .then((result) => {
    console.log("New order created with data: ",result.rows)
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  });;
};

module.exports = { placeOrder };
