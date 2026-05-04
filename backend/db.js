const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database", "database.sqlite");
const initPath = path.join(__dirname, "database", "init.sql");

const db = new sqlite3.Database(dbPath);

// Initialize DB schema on startup
const initSQL = fs.readFileSync(initPath, "utf-8");

db.exec(initSQL, (err) => {
    if (err) {
        console.error("Error initializing database:", err.message);
    } else {
        console.log("Database initialized successfully.");
    }
});

module.exports = db;