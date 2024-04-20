const express = require("express");
const router = express.Router();
const db = require("../database.js");

router.post("/departments", async (req, res) => {
  const { name, dept_std_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO bolum (name, dept_std_id) VALUES ($1, $2) RETURNING *",
      [name, dept_std_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/departments/:id", async (req, res) => {
  const { id } = req.params;
  const { name, dept_std_id } = req.body;

  try {
    const result = await db.query(
      "UPDATE bolum SET name = $1, dept_std_id = $2 WHERE id = $3 RETURNING *",
      [name, dept_std_id, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/departments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM bolum WHERE id = $1", [id]);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
