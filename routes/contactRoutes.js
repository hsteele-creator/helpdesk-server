const express = require("express");
const router = express.Router();
const db = require("../db");


// Get contacts by company
router.get('/contacts/:company', async (req, res) => {
    const {company} = req.params
    try {
      const results= await db.query('SELECT * FROM contacts WHERE company = $1', [company]);
      return res.json(results.rows)
    }
    catch(e) {
      console.error(e)
    }
})

// Add new contact
router.post('/add-contact', async (req, res) => {
  const {first_name, last_name, email, phone, company} = req.body
  try {
    const results = await db.query('INSERT INTO contacts (first_name, last_name, email, phone, company) VALUES ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, email, phone, company]);
    return res.json(results.rows[0])
  } catch(e) {
    res.json({detail : e.detail})
    console.error(e)
  }
})

module.exports = router