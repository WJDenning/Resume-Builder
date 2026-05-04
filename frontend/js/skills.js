document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("skillForm").addEventListener("submit", addSkill);
    loadSkills();
});

async function addSkill(e) {
    e.preventDefault();

    const name = document.getElementById("skillName").value;
    const proficiency = document.getElementById("skillProficiency").value;

    const res = await fetch("http://localhost:3000/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: 1,
            name,
            proficiency
        })
    });

    if (res.ok) {
        Swal.fire({
            icon: "success",
            title: "Skill Added"
        });

        document.getElementById("skillForm").reset();
        loadSkills();
    }
}

async function loadSkills() {
    const res = await fetch("http://localhost:3000/api/skills");
    const skills = await res.json();

    const list = document.getElementById("skillList");
    list.innerHTML = "";

    skills.forEach(skill => {
        const div = document.createElement("div");
        div.className = "border p-2 mb-2 d-flex justify-content-between align-items-center";

        const text = document.createElement("span");
        text.textContent = `${skill.name}${skill.proficiency ? ` - ${skill.proficiency}` : ""}`;

        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-primary btn-sm me-2";
        addBtn.textContent = "Add to Resume";

        addBtn.addEventListener("click", () => {
            addToResume("skill", skill.id);
        });

        const btn = document.createElement("button");
        btn.className = "btn btn-danger btn-sm";
        btn.textContent = "Delete";

        btn.addEventListener("click", () => deleteSkill(skill.id));

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

async function deleteSkill(id) {
    const result = await Swal.fire({
        title: "Delete skill?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
        await fetch(`http://localhost:3000/api/skills/${id}`, {
            method: "DELETE"
        });

        loadSkills();
    }
}