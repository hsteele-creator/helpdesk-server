const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/todos/:company", async (req, res) => {
  const { company } = req.params;
  try {
    const results = await db.query("SELECT * from todos WHERE company =$1", [
      company,
    ]);
    res.json(results.rows);
  } catch (e) {
    console.error(e);
  }
});

router.post("/add-todo", async (req, res) => {
  const { name, completed, company } = req.body;
  try {
    const results = await db.query(
      "INSERT INTO todos (name, completed, company) VALUES ($1, $2, $3) RETURNING *    ",
      [name, completed, company]
    );
    return res.json(results.rows);
  } catch (e) {
    console.error(e);
  }
});

router.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const results = await db.query("UPDATE todos SET name = $1 WHERE id =$2", [
      name,
      id,
    ]);
    res.json(results.rows)
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
