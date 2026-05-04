document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("aiButton").addEventListener("click", improveText);
});

async function improveText() {
    const text = document.getElementById("aiInput").value;
    const key = localStorage.getItem("gemini_key");

    if (!key) {
        Swal.fire({
            icon: "error",
            title: "Missing API Key"
        });
        return;
    }

    const res = await fetch("http://localhost:3000/api/ai/suggest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text,
            apiKey: key
        })
    });

    const data = await res.json();

    document.getElementById("aiOutput").innerText = data.suggestion;

    Swal.fire({
        icon: "success",
        title: "AI Suggestion Ready"
    });
}