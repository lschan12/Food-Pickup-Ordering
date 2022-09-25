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

module.exports = { getDishes };
