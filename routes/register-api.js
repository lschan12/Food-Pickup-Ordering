const express = require("express");
const router = express.Router();
const { registerUser } = require("../db/queries/register");

router.post("/", (req, res) => {
  registerUser(req.body)
    .then((response) => {
      req.session.user_id = response.id;
      console.log(req.session.user_id);
      res.redirect('../');
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
