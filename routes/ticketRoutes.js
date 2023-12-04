const express = require("express");
const router = express.Router();
const db = require("../db");

// Add a new ticket
router.post("/add-ticket", async (req, res) => {
  const {
    subject,
    contact_email,
    type,
    priority,
    status,
    agent,
    company,
    description,
    date,
  } = req.body;

  try {
    // Get contacts id by email
    const contact_id = await db.query(
      "SELECT first_name, last_name FROM contacts WHERE email = $1",
      [contact_email]
    );

    const results = await db.query(
      "INSERT INTO tickets (subject, contact_first, contact_last, type, priority, status, agent, company, date, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)RETURNING *",
      [
        subject,
        contact_id.rows[0].first_name,
        contact_id.rows[0].last_name,
        type,
        priority,
        status,
        agent,
        company,
        date,
        description,
      ]
    );

    res.send(results.rows[0]);
  } catch (e) {
    console.error(e);
    res.json({ detail: e.detail });
  }
});

// Get tickets by company

router.get("/tickets/:company", async (req, res) => {
  const { company } = req.params;

  try {
    const response = await db.query(
      "SELECT * FROM tickets WHERE company = $1",
      [company]
    );
    res.json(response.rows);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
