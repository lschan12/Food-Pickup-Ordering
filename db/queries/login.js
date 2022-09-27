const db = require("../connection");

const getUserByPhone = (phone) => {
  return db.query(`
  SELECT * FROM users
  WHERE phone_number = $1;
  `, [phone])
    .then((data) => {
      return data.rows[0];
    });
};

const getUserById = (id) => {
  return db.query(`
  SELECT * FROM users
  WHERE users.id = $1;
  `, [id])
    .then((data) => {
      return data.rows[0];
    });
};

module.exports = { getUserByPhone, getUserById };
