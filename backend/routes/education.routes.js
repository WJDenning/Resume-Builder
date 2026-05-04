const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL EDUCATION
router.get("/", (req, res) => {
    db.all("SELECT * FROM education", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// GET SINGLE EDUCATION ENTRY
router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM education WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        }
    );
});


// CREATE EDUCATION ENTRY
router.post("/", (req, res) => {
    const {
        user_id,
        school,
        degree,
        field_of_study,
        start_date,
        end_date,
        gpa,
        description
    } = req.body;

    db.run(
        `INSERT INTO education 
        (user_id, school, degree, field_of_study, start_date, end_date, gpa, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, school, degree, field_of_study, start_date, end_date, gpa, description],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// UPDATE EDUCATION ENTRY
router.put("/:id", (req, res) => {
    const {
        school,
        degree,
        field_of_study,
        start_date,
        end_date,
        gpa,
        description
    } = req.body;

    db.run(
        `UPDATE education 
         SET school = ?, degree = ?, field_of_study = ?, start_date = ?, end_date = ?, gpa = ?, description = ?
         WHERE id = ?`,
        [
            school,
            degree,
            field_of_study,
            start_date,
            end_date,
            gpa,
            description,
            req.params.id
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});


// DELETE EDUCATION ENTRY
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM education WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        }
    );
});

module.exports = router;