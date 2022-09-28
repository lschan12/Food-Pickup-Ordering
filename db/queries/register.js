const db = require("../connection");

// const updateOrderDishesTable = (dishIDs, orderID) => {
//   let queryString = "INSERT INTO order_dishes (dish_id, order_id) VALUES ";
//   dishIDs.forEach((id) => {
//     queryString += `(${id}, ${orderID}), `;
//   });
//   queryString = queryString.slice(0, -2);
//   queryString += " RETURNING *;";

//   return db.query(queryString)
//     .then((data) => {
//       return data.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });
// };

// const placeOrder = ({ customerID, totalPrice, estimatedTime, dishIDs }) => {

//   // TO DO: add 'actual_prep_time' once we have that functionality built
//   const queryString = `
//     INSERT INTO orders (user_id, order_time, total_price, est_prep_time)
//     VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING *;`;

//   const queryParams = [customerID, totalPrice, estimatedTime];
//   return db.query(queryString, queryParams)
//     .then((result) => {
//       return updateOrderDishesTable(dishIDs, result.rows[0].id);
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });
// };

const registerUser = ({firstName, lastName, password, phone}) => {
  return db.query(`
  INSERT INTO users (first_name, last_name, password, phone_number, admin)
  VALUES ($1, $2, $3, $4, FALSE)
  RETURNING *;
  `, [firstName, lastName, password, phone])
    .then((data) => {
      return data.rows[0];
    });
};

module.exports = { registerUser };
