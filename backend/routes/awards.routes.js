const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL AWARDS
router.get("/", (req, res) => {
    db.all("SELECT * FROM awards", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// CREATE AWARD
router.post("/", (req, res) => {
    const {
        user_id,
        title,
        issuer,
        date_received,
        description
    } = req.body;

    db.run(
        `INSERT INTO awards 
        (user_id, title, issuer, date_received, description)
        VALUES (?, ?, ?, ?, ?)`,
        [user_id, title, issuer, date_received, description],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE AWARD
router.put("/:id", (req, res) => {
    const {
        title,
        issuer,
        date_received,
        description
    } = req.body;

    db.run(
        `UPDATE awards
         SET title = ?, issuer = ?, date_received = ?, description = ?
         WHERE id = ?`,
        [
            title,
            issuer,
            date_received,
            description,
            req.params.id
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});


// DELETE AWARD
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM awards WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        }
    );
});

module.exports = router;