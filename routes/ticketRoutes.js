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
      "SELECT first_name, last_name, email, phone FROM contacts WHERE email = $1",
      [contact_email]
    );

    const results = await db.query(
      "INSERT INTO tickets (subject, contact_first, contact_last, email, phone, type, priority, status, agent, company, date, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)RETURNING *",
      [
        subject,
        contact_id.rows[0].first_name,
        contact_id.rows[0].last_name,
        contact_id.rows[0].email,
        contact_id.rows[0].phone,
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
    console.log(response.rows);
    res.json(response.rows);
  } catch (e) {
    console.error(e);
  }
});

// Get ticket by id
router.get("/get-ticket/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await db.query("SELECT * FROM tickets WHERE id = $1", [
      id,
    ]);
    res.json(response.rows[0]);
  } catch (e) {
    console.error(e);
  }
});

// Edit a ticket
router.patch("/edit-ticket-properties", async (req, res) => {
  const { status, type, agent, priority, id } = req.body;
  try {
    const response = await db.query(
      "UPDATE tickets SET status = $1, type = $2, agent = $3, priority = $4 WHERE id = $5 RETURNING *",
      [status, type, agent, priority, id]
    );
    res.json(response.rows);
  } catch (e) {
    console.error(e);
  }
});

// Add a response
router.post("/add-response", async (req, res) => {
  const { type, incoming, date, content, ticket_id, firstName, lastName, agent} = req.body;
  console.log(date, type, incoming, content, ticket_id, firstName, lastName, agent);

  try {
    const response = await db.query(
      "INSERT INTO responses (type, incoming, date, ticket_id, content, firstName, lastName, agent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [type, incoming, date, ticket_id, content, firstName, lastName, agent]
    );
    res.json(response.rows[0]);
  } catch (e) {
    console.error(e);
  }
});

// Get Responses by ticket id
router.get('/responses/:ticketid', async (req, res) => {
  const {ticketid} = req.params
  try {
    const response = await db.query('SELECT * FROM responses WHERE ticket_id = $1', [ticketid]);
    res.json(response.rows)
  } catch(e) {
    console.error(e)
  }
})

module.exports = router;
