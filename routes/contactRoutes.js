const express = require("express");
const router = express.Router();
const db = require("../db");

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

module.exports = router