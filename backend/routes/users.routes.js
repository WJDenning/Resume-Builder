const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL USERS
router.get("/", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// GET SINGLE USER
router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM users WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        }
    );
});


// CREATE USER
router.post("/", (req, res) => {
    const { name, email, gemini_api_key } = req.body;

    db.run(
        `INSERT INTO users (name, email, gemini_api_key)
         VALUES (?, ?, ?)`,
        [name, email, gemini_api_key],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE USER
router.put("/:id", (req, res) => {
    const { name, email, gemini_api_key } = req.body;

    db.run(
        `UPDATE users 
         SET name = ?, email = ?, gemini_api_key = ?
         WHERE id = ?`,
        [name, email, gemini_api_key, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});


// DELETE USER
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM users WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        }
    );
});

module.exports = router;