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
        "SELECT * FROM resume_items WHERE resume_id = ?",
        [resumeId],
        (err, items) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!items.length) {
                return res.json({
                    resume_id: resumeId,
                    sections: {}
                });
            }

            const result = {
                resume_id: resumeId,
                jobs: [],
                skills: [],
                education: [],
                certifications: [],
                awards: []
            };

            let pending = items.length;

            items.forEach(item => {
                const { item_type, item_id } = item;

                let table = "";

                switch (item_type) {
                    case "job":
                        table = "jobs";
                        break;
                    case "skill":
                        table = "skills";
                        break;
                    case "education":
                        table = "education";
                        break;
                    case "certification":
                        table = "certifications";
                        break;
                    case "award":
                        table = "awards";
                        break;
                    default:
                        pending--;
                        return;
                }

                db.get(
                    `SELECT * FROM ${table} WHERE id = ?`,
                    [item_id],
                    (err, row) => {
                        if (!err && row) {
                            result[table].push(row);
                        }

                        pending--;

                        if (pending === 0) {
                            res.json(result);
                        }
                    }
                );
            });
        }
    );
});

module.exports = router;