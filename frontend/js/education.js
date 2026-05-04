document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("educationForm").addEventListener("submit", addEducation);
    document.getElementById("improveEducationDescription").addEventListener("click", () => improveText("educationDescription"));
    document.getElementById("undoEducationDescription").addEventListener("click", () => undoText("educationDescription"));
    loadEducation();
});

async function addEducation(e) {
    e.preventDefault();

    const school = document.getElementById("schoolName").value;
    const degree = document.getElementById("degree").value;
    const field_of_study = document.getElementById("fieldOfStudy").value;
    const end_date = document.getElementById("educationDate").value;
    const gpa = document.getElementById("gpa").value;
    const description = document.getElementById("educationDescription").value;

    const res = await fetch("http://localhost:3000/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, school, degree, field_of_study, end_date, gpa, description })
    });

    if (res.ok) {
        Swal.fire({ icon: "success", title: "Education Added" });
        document.getElementById("educationForm").reset();
        loadEducation();
    }
}

async function loadEducation() {
    const res = await fetch("http://localhost:3000/api/education");
    const data = await res.json();

    const list = document.getElementById("educationList");
    list.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "border p-2 mb-2 d-flex justify-content-between align-items-center";

        const text = document.createElement("span");
        text.innerHTML = `<strong>${item.school}</strong><br>${item.degree}${item.field_of_study ? ` in ${item.field_of_study}` : ""}${item.gpa ? ` | GPA: ${item.gpa}` : ""}${item.end_date ? `<br><small>${item.end_date}</small>` : ""}${item.description ? `<br><small>${item.description}</small>` : ""}`;

        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-primary btn-sm me-2";
        addBtn.textContent = "Add to Resume";

        addBtn.addEventListener("click", () => {
            addToResume("education", item.id);
        });

        const btn = document.createElement("button");
        btn.className = "btn btn-danger btn-sm";
        btn.textContent = "Delete";

        btn.addEventListener("click", () => deleteEducation(item.id));

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

async function deleteEducation(id) {
    const result = await Swal.fire({
        title: "Delete education?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
        await fetch(`http://localhost:3000/api/education/${id}`, {
            method: "DELETE"
        });

        loadEducation();
    }
}

let originalTextsEducation = {};

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
    originalTextsEducation[textareaId] = text;

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

    if (originalTextsEducation[textareaId]) {
        textarea.value = originalTextsEducation[textareaId];
        undoBtn.style.display = "none";
        delete originalTextsEducation[textareaId];
    }
}