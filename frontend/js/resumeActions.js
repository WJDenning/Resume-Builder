document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generateResumeBtn").addEventListener("click", generateResume);
});

async function addToResume(type, id) {

    // Check if resume exists, create if not
    const checkRes = await fetch(`http://localhost:3000/api/resumes/${selectedResumeId}`);
    if (!checkRes.ok) {
        const createRes = await fetch("http://localhost:3000/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: 1, name: "My Resume" })
        });
        if (!createRes.ok) {
            Swal.fire({ icon: "error", title: "Failed to create resume" });
            return;
        }
    }

    // update local state
    resumeState[type + "s"].add(id);

    const res = await fetch(`http://localhost:3000/api/resumes/${selectedResumeId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            item_type: type,
            item_id: id
        })
    });

    if (!res.ok) {
        Swal.fire({ icon: "error", title: "Failed to add to resume" });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Added to Resume"
    });

    renderResumePreview();
}

async function generateResume() {
    const checkRes = await fetch(`http://localhost:3000/api/resumes/${selectedResumeId}`);
    if (checkRes.ok) {
        renderResumePreview();
        return;
    }

    const createRes = await fetch("http://localhost:3000/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, name: "My Resume" })
    });

    if (createRes.ok) {
        renderResumePreview();
    } else {
        Swal.fire({ icon: "error", title: "Failed to create resume" });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generateResumeBtn").addEventListener("click", generateResume);
});

async function generateResume() {
    // Check if resume exists
    const checkRes = await fetch("http://localhost:3000/api/resumes/1");
    if (checkRes.ok) {
        renderResumePreview();
        return;
    }
    
    // Create resume if not exists
    const createRes = await fetch("http://localhost:3000/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, name: "My Resume" })
    });
    
    if (createRes.ok) {
        renderResumePreview();
    }
}