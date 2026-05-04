document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("jobForm").addEventListener("submit", addJob);
    document.getElementById("improveJobDescription").addEventListener("click", () => improveText("jobDescription"));
    document.getElementById("undoJobDescription").addEventListener("click", () => undoText("jobDescription"));
    loadJobs();
});

async function addJob(e) {
    e.preventDefault();

    const company = document.getElementById("jobCompany").value;
    const title = document.getElementById("jobTitle").value;
    const location = document.getElementById("jobLocation").value;
    const start_date = document.getElementById("jobStartDate").value;
    const end_date = document.getElementById("jobEndDate").value;
    const description = document.getElementById("jobDescription").value;

    const res = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, company, title, location, start_date, end_date, description })
    });

    if (res.ok) {
        Swal.fire({
            icon: "success",
            title: "Job Added"
        });

        document.getElementById("jobForm").reset();
        loadJobs();
    }
}

async function loadJobs() {
    const res = await fetch("http://localhost:3000/api/jobs");
    const jobs = await res.json();

    const list = document.getElementById("jobList");
    list.innerHTML = "";

    jobs.forEach(job => {
        const div = document.createElement("div");
        div.className = "border p-2 mb-2 d-flex justify-content-between align-items-center";

        const text = document.createElement("span");
        text.innerHTML = `<strong>${job.title}</strong> at ${job.company}${job.location ? ` (${job.location})` : ""}${job.start_date ? `<br><small>${job.start_date}${job.end_date ? ` to ${job.end_date}` : ""}</small>` : ""}`;

        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-primary btn-sm me-2";
        addBtn.textContent = "Add to Resume";

        addBtn.addEventListener("click", () => {
            addToResume("job", job.id);
        });

        const btn = document.createElement("button");
        btn.className = "btn btn-danger btn-sm";
        btn.textContent = "Delete";

        btn.addEventListener("click", () => deleteJob(job.id));

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

async function deleteJob(id) {

    const result = await Swal.fire({
        title: "Delete job?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
        await fetch(`http://localhost:3000/api/jobs/${id}`, {
            method: "DELETE"
        });

        loadJobs();
    }

}

let originalTexts = {};

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
    originalTexts[textareaId] = text;

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

    if (originalTexts[textareaId]) {
        textarea.value = originalTexts[textareaId];
        undoBtn.style.display = "none";
        delete originalTexts[textareaId];
    }
}