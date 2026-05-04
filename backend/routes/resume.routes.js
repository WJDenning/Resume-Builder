const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL RESUMES
router.get("/", (req, res) => {
    db.all("SELECT * FROM resumes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// GET SINGLE RESUME
router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM resumes WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        }
    );
});


// CREATE RESUME
router.post("/", (req, res) => {
    const { user_id, name } = req.body;

    db.run(
        `INSERT INTO resumes (user_id, name)
         VALUES (?, ?)`,
        [user_id, name],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// DELETE RESUME
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM resumes WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        }
    );
});


// GET ITEMS IN A RESUME
router.get("/:id/items", (req, res) => {
    db.all(
        "SELECT * FROM resume_items WHERE resume_id = ? ORDER BY order_index",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});


// ADD ITEM TO RESUME
router.post("/:id/items", (req, res) => {
    const { item_type, item_id, order_index } = req.body;

    db.run(
        `INSERT INTO resume_items (resume_id, item_type, item_id, order_index)
         VALUES (?, ?, ?, ?)`,
        [req.params.id, item_type, item_id, order_index || 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// REMOVE ITEM FROM RESUME
router.delete("/items/:id", (req, res) => {
    db.run(
        "DELETE FROM resume_items WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        }
    );
});


// RESUME ENDPOINT
router.get("/:id/build", (req, res) => {
    const resumeId = req.params.id;

    db.all(
        "SELECT * FROM resume_items WHERE resume_id = ? ORDER BY order_index",
        [resumeId],
        (err, items) => {
            if (err) return res.status(500).json({ error: err.message });

            // Always return consistent structure
            const result = {
                resume_id: resumeId,
                jobs: [],
                skills: [],
                education: [],
                certifications: [],
                awards: []
            };

            if (!items.length) {
                return res.json(result);
            }

            // Group IDs by type
            const grouped = {
                job: [],
                skill: [],
                education: [],
                certification: [],
                award: []
            };

            items.forEach(item => {
                if (grouped[item.item_type]) {
                    grouped[item.item_type].push(item.item_id);
                }
            });

            let queriesRemaining = 5;

            function checkDone() {
                queriesRemaining--;
                if (queriesRemaining === 0) {
                    res.json(result);
                }
            }

            // JOBS
            if (grouped.job.length) {
                db.all(
                    `SELECT * FROM jobs WHERE id IN (${grouped.job.map(() => "?").join(",")})`,
                    grouped.job,
                    (err, rows) => {
                        if (!err) result.jobs = rows;
                        checkDone();
                    }
                );
            } else checkDone();

            // SKILLS
            if (grouped.skill.length) {
                db.all(
                    `SELECT * FROM skills WHERE id IN (${grouped.skill.map(() => "?").join(",")})`,
                    grouped.skill,
                    (err, rows) => {
                        if (!err) result.skills = rows;
                        checkDone();
                    }
                );
            } else checkDone();

            // EDUCATION
            if (grouped.education.length) {
                db.all(
                    `SELECT * FROM education WHERE id IN (${grouped.education.map(() => "?").join(",")})`,
                    grouped.education,
                    (err, rows) => {
                        if (!err) result.education = rows;
                        checkDone();
                    }
                );
            } else checkDone();

            // CERTIFICATIONS
            if (grouped.certification.length) {
                db.all(
                    `SELECT * FROM certifications WHERE id IN (${grouped.certification.map(() => "?").join(",")})`,
                    grouped.certification,
                    (err, rows) => {
                        if (!err) result.certifications = rows;
                        checkDone();
                    }
                );
            } else checkDone();

            // AWARDS
            if (grouped.award.length) {
                db.all(
                    `SELECT * FROM awards WHERE id IN (${grouped.award.map(() => "?").join(",")})`,
                    grouped.award,
                    (err, rows) => {
                        if (!err) result.awards = rows;
                        checkDone();
                    }
                );
            } else checkDone();
        }
    );
});
module.exports = router;