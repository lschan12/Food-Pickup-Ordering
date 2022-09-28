const db = require("../connection");

const getOrders = () => {
  return db.query(`
  SELECT orders.id as id, 
         orders.total_price as price,
         orders.order_time as time,
         orders.est_prep_time as estimated,
         orders.actual_prep_time as actual,
         users.first_name as first_name,
         users.phone_number as phone
  FROM orders
  JOIN users ON users.id = user_id;
  `).then(data => {
    return data.rows;
  });
};

const getOrderForPickup = (orderID) => {
  return db.query(`
  SELECT orders.id as id, 
         users.first_name as first_name,
         users.phone_number as phone
  FROM orders
  JOIN users ON users.id = user_id
  WHERE orders.id = $1;
  `,[orderID]).then(data => {
    return data.rows[0];
  });
};

const getOrder = (orderId) => {
  return db.query(`
  SELECT * FROM orders
  WHERE id = $1
  `, [orderId])
    .then((data) => {
      return data.rows[0];
    });
};

const updateOrderDishesTable = (dishIDs, orderID) => {
  let queryString = "INSERT INTO order_dishes (dish_id, order_id) VALUES ";
  dishIDs.forEach((id) => {
    queryString += `(${id}, ${orderID}), `;
  });
  queryString = queryString.slice(0, -2);
  queryString += " RETURNING *;";

  return db.query(queryString)
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const placeOrder = ({ userId, totalPrice, estimatedTime, dishIDs, status }) => {

  const queryString = `
    INSERT INTO orders (user_id, order_time, total_price, est_prep_time, status)
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4) RETURNING *;`;

  const queryParams = [userId, totalPrice, estimatedTime, status];
  return db.query(queryString, queryParams)
    .then((result) => {
      return updateOrderDishesTable(dishIDs, result.rows[0].id);
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

module.exports = { getOrders, getOrderForPickup, getOrder, placeOrder };
