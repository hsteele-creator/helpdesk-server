const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

// Register a user
router.post("/Register", async (req, res) => {
  const { first_name, last_name, email, password, company } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const results = await db.query(
      "INSERT INTO agents (first_name, last_name, email, password, company) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email, hashedPassword, company]
    );

    const token = jwt.sign(
      { id: results.rows[0].id, first_name, last_name, company },
      "secret-key",
      { expiresIn: "1hr" }
    );

    res.json({ first_name, last_name, company, token });
  } catch (e) {
    console.error(e);
    if (e) {
      res.json({ detail: e.detail });
    }
  }
});

// Login a user
router.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const results = await db.query("SELECT * FROM agents WHERE email = $1", [
      email,
    ]);

    if (results.rows.length === 0) {
      res.json("User does not exist or password is incorrect");
    }

    if (await bcrypt.compare(password, results.rows[0].password)) {
      const token = jwt.sign(
        { id: results.rows[0].id, first_name : results.rows[0].first_name, last_name : results.rows[0].last_name, company: results.rows[0].company },
        "secret-key",
        { expiresIn: "1hr" }
      );

      return res.json({
        first_name: results.rows[0].first_name,
        last_name: results.rows[0].last_name,
        company: results.rows[0].company,
        token,
      });
    } else {
      res.json("User does not exist or password is incorrect");
    }
  } catch (e) {
    console.error(e);
    if (e) {
      res.json({ detail: e.detail });
    }
  }
});

module.exports = router;
