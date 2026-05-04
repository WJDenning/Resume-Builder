const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize DB FIRST (important)
require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/jobs", require("./routes/jobs.routes"));
app.use("/api/education", require("./routes/education.routes"));
app.use("/api/skills", require("./routes/skills.routes"));
app.use("/api/certifications", require("./routes/certifications.routes"));
app.use("/api/awards", require("./routes/awards.routes"));
app.use("/api/resumes", require("./routes/resume.routes"));
app.use("/api/ai", require("./routes/ai.routes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});