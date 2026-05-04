const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL CERTIFICATIONS
router.get("/", (req, res) => {
    db.all("SELECT * FROM certifications", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// CREATE CERTIFICATION
router.post("/", (req, res) => {
    const {
        user_id,
        name,
        issuer,
        issue_date,
        expiration_date,
        credential_id
    } = req.body;

    db.run(
        `INSERT INTO certifications 
        (user_id, name, issuer, issue_date, expiration_date, credential_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, name, issuer, issue_date, expiration_date, credential_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE CERTIFICATION
router.put("/:id", (req, res) => {
    const {
        name,
        issuer,
        issue_date,
        expiration_date,
        credential_id
    } = req.body;

    db.run(
        `UPDATE certifications
         SET name = ?, issuer = ?, issue_date = ?, expiration_date = ?, credential_id = ?
         WHERE id = ?`,
        [
            name,
            issuer,
            issue_date,
            expiration_date,
            credential_id,
            req.params.id
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});


// DELETE CERTIFICATION
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM certifications WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        }
    );
});

module.exports = router;