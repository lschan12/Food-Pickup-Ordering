const db = require('../connection');

const getReceipt = (orderId) => {
  return db.query(`
  SELECT dishes.name as name, dishes.price as price, dishes.prep_time as time, COUNT(dishes.id) as qty
  FROM dishes
  JOIN order_dishes ON dishes.id = dish_id
  JOIN orders ON order_dishes.order_id = orders.id
  WHERE orders.id = $1
  GROUP BY dishes.name, dishes.price, dishes.prep_time;
  `, [orderId])
    .then((data) => {
      return data.rows;
    });
};

module.exports = { getReceipt };
