const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL JOBS
router.get("/", (req, res) => {
    db.all("SELECT * FROM jobs", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// GET SINGLE JOB
router.get("/:id", (req, res) => {
    db.get("SELECT * FROM jobs WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});


// CREATE JOB
router.post("/", (req, res) => {
    const { user_id, company, title, location, start_date, end_date, description } = req.body;

    db.run(
        `INSERT INTO jobs (user_id, company, title, location, start_date, end_date, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, company, title, location, start_date, end_date, description],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE JOB
router.put("/:id", (req, res) => {
    const { company, title, location, start_date, end_date, description } = req.body;

    db.run(
        `UPDATE jobs 
         SET company = ?, title = ?, location = ?, start_date = ?, end_date = ?, description = ?
         WHERE id = ?`,
        [company, title, location, start_date, end_date, description, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ updated: this.changes });
        }
    );
});


// DELETE JOB
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM jobs WHERE id = ?", [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});


module.exports = router;