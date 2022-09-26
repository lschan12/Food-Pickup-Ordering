const db = require('../connection');

const getDishes = () => {
  const queryString = 
  'SELECT dishes.*, categories.name as category FROM dishes \
  JOIN categories ON category_id = categories.id;'
  
  return db.query(queryString)
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
