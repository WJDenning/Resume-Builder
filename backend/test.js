const db = require("./db");

db.all("SELECT * FROM resumes", [], (err, rows) => {
    if (err) console.error(err);
    else console.log("Resumes:", rows);
    db.all("SELECT * FROM resume_items", [], (err, rows) => {
        if (err) console.error(err);
        else console.log("Resume items:", rows);
        process.exit(0);
    });
});