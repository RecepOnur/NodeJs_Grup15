const express = require("express");
const router = express.Router();
const db = require("../database.js");
const { authenticateToken } = require("./authController.js");

router.post("/students", authenticateToken, async (req, res) => {
  const { name, email, deptid } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO ogrenci (name, email, deptid) VALUES ($1, $2, $3) RETURNING *",
      [name, email, deptid]
    );

    const studentId = result.rows[0].id;

    await db.query(
      "INSERT INTO ogrenci_bolum (user_id, dept_id) VALUES ($1, $2)",
      [studentId, deptid]
    );

    await db.query("UPDATE ogrenci_sayac SET sayac = sayac + 1");

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

router.delete("/students/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM ogrenci WHERE id=$1", [id]);

    await db.query(
      "UPDATE ogrenci_sayac SET sayac = CASE WHEN sayac > 0 THEN sayac - 1 ELSE 0 END"
    );

    res.status(201).json({
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

router.put("/students/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, deptid } = req.body;

  try {
    const result = await db.query(
      "UPDATE ogrenci SET name = $1, email = $2, deptid = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [name, email, deptid, id]
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

module.exports = router;
