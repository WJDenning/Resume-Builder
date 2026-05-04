document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("awardForm").addEventListener("submit", addAward);
    document.getElementById("improveAwardDescription").addEventListener("click", () => improveText("awardDescription"));
    document.getElementById("undoAwardDescription").addEventListener("click", () => undoText("awardDescription"));
    loadAwards();
});

async function addAward(e) {
    e.preventDefault();

    const title = document.getElementById("awardTitle").value;
    const issuer = document.getElementById("awardIssuer").value;
    const date_received = document.getElementById("awardDate").value;
    const description = document.getElementById("awardDescription").value;

    const res = await fetch("http://localhost:3000/api/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, title, issuer, date_received, description })
    });

    if (res.ok) {
        Swal.fire({ icon: "success", title: "Award Added" });
        document.getElementById("awardForm").reset();
        loadAwards();
    }
}

async function loadAwards() {
    const res = await fetch("http://localhost:3000/api/awards");
    const data = await res.json();

    const list = document.getElementById("awardList");
    list.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "border p-2 mb-2 d-flex justify-content-between align-items-center";

        const text = document.createElement("span");
        text.innerHTML = `<strong>${item.title}</strong> - ${item.issuer}${item.date_received ? `<br><small>${item.date_received}</small>` : ""}${item.description ? `<br><small>${item.description}</small>` : ""}`;

        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-primary btn-sm me-2";
        addBtn.textContent = "Add to Resume";

        addBtn.addEventListener("click", () => {
            addToResume("award", item.id);
        });

        const btn = document.createElement("button");
        btn.className = "btn btn-danger btn-sm";
        btn.textContent = "Delete";

        btn.addEventListener("click", () => deleteAward(item.id));

        const textDiv = document.createElement("div");
        textDiv.appendChild(text);

        const btnDiv = document.createElement("div");
        btnDiv.className = "d-flex";
        btnDiv.appendChild(addBtn);
        btnDiv.appendChild(btn);

        div.appendChild(textDiv);
        div.appendChild(btnDiv);
        list.appendChild(div);
    });
}

async function deleteAward(id) {
    const result = await Swal.fire({
        title: "Delete award?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
        await fetch(`http://localhost:3000/api/awards/${id}`, {
            method: "DELETE"
        });

        loadAwards();
    }
}

let originalTextsAwards = {};

async function improveText(textareaId) {
    const textarea = document.getElementById(textareaId);
    const text = textarea.value.trim();

    if (!text) {
        Swal.fire({
            icon: "warning",
            title: "No text to improve"
        });
        return;
    }

    const key = localStorage.getItem("gemini_key");
    if (!key) {
        Swal.fire({
            icon: "error",
            title: "Missing API Key",
            text: "Please set your Gemini API key in the settings."
        });
        return;
    }

    // Store original text
    originalTextsAwards[textareaId] = text;

    try {
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

        if (res.ok) {
            textarea.value = data.suggestion;
            document.getElementById(`undo${textareaId.charAt(0).toUpperCase() + textareaId.slice(1)}`).style.display = "inline-block";
            Swal.fire({
                icon: "success",
                title: "Text improved!"
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "AI Error",
                text: data.error || "Failed to improve text"
            });
        }
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Failed to connect to AI service"
        });
    }
}

function undoText(textareaId) {
    const textarea = document.getElementById(textareaId);
    const undoBtn = document.getElementById(`undo${textareaId.charAt(0).toUpperCase() + textareaId.slice(1)}`);

    if (originalTextsAwards[textareaId]) {
        textarea.value = originalTextsAwards[textareaId];
        undoBtn.style.display = "none";
        delete originalTextsAwards[textareaId];
    }
}