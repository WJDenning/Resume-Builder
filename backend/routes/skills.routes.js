const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL SKILLS
router.get("/", (req, res) => {
    db.all("SELECT * FROM skills", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// CREATE SKILL
router.post("/", (req, res) => {
    const { user_id, category_id, name, proficiency } = req.body;

    db.run(
        `INSERT INTO skills (user_id, category_id, name, proficiency)
         VALUES (?, ?, ?, ?)`,
        [user_id, category_id, name, proficiency],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE SKILL
router.put("/:id", (req, res) => {
    const { name, proficiency } = req.body;

    db.run(
        `UPDATE skills SET name = ?, proficiency = ? WHERE id = ?`,
        [name, proficiency, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});


// DELETE SKILL
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM skills WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

module.exports = router;