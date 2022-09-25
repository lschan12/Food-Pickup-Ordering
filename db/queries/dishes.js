const db = require('../connection');

const getDishes = () => {
  return db.query('SELECT * FROM dishes;')
    .then(data => {
      return data.rows;
    });
};

const getDish = (productId) => {
  return db.query(`
  SELECT * FROM dishes
  WHERE id = $1
  `, [productId])
    .then((data) => {
      return data.rows[0];
    });
};

module.exports = { getDishes, getDish };
