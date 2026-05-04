const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const router = express.Router();


// AI SUGGESTION ENDPOINT
router.post("/suggest", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Improve this resume bullet point for clarity and professionalism:\n\n${text}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const suggestion =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion returned.";

        res.json({ suggestion });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;