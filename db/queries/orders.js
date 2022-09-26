const db = require("../connection");

const updateOrderDishesTable = (dishIDs, orderID) => {
  let queryString = "INSERT INTO order_dishes (dish_id, order_id) VALUES ";
  dishIDs.forEach((id) => {
    queryString += `(${id}, ${orderID}), `;
  });
  queryString = queryString.slice(0, -2);
  queryString += " RETURNING *;";

  return db.query(queryString)
    .then((data) => {
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const placeOrder = ({ orderTotal, orderTime, dishIDs }) => {
  // TO DO: replace '1' with actual userID once we have login auth
  const userId = "1";

  // TO DO: add 'actual_prep_time' once we have that functionality built
  const queryString = `
    INSERT INTO orders (user_id, order_time, total_price, est_prep_time)
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING *;`;

  const queryParams = [userId, orderTotal, orderTime];
  return db.query(queryString, queryParams)
    .then((result) => {
      return updateOrderDishesTable(dishIDs, result.rows[0].id);
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

module.exports = { placeOrder };
