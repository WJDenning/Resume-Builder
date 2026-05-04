const express = require("express");
const db = require("../db");

const router = express.Router();


// GET RESPONSIBILITIES BY JOB
router.get("/job/:jobId", (req, res) => {
    db.all(
        "SELECT * FROM responsibilities WHERE job_id = ?",
        [req.params.jobId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});


// CREATE RESPONSIBILITY
router.post("/", (req, res) => {
    const { job_id, content } = req.body;

    db.run(
        "INSERT INTO responsibilities (job_id, content) VALUES (?, ?)",
        [job_id, content],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE RESPONSIBILITY
router.put("/:id", (req, res) => {
    const { content, ai_suggested_edit } = req.body;

    db.run(
        `UPDATE responsibilities 
         SET content = ?, ai_suggested_edit = ?
         WHERE id = ?`,
        [content, ai_suggested_edit, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ updated: this.changes });
        }
    );
});


// DELETE RESPONSIBILITY
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM responsibilities WHERE id = ?", [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});


module.exports = router;