const db = require("../connection");

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
