const db = require('../connection');

const getDishes = () => {
  return db.query('SELECT * FROM dishes;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getDishes };
