const db = require('../connection');

const getUsers = (id) => {
  return db.query(`
  SELECT * FROM users
  WHERE users.id = $1;
  `, [id])
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { getUsers };
