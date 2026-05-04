document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("certForm").addEventListener("submit", addCert);
    loadCerts();
});

async function addCert(e) {
    e.preventDefault();

    const name = document.getElementById("certName").value;
    const issuer = document.getElementById("certIssuer").value;
    const issue_date = document.getElementById("certDate").value;

    const res = await fetch("http://localhost:3000/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, name, issuer, issue_date })
    });

    if (res.ok) {
        Swal.fire({ icon: "success", title: "Certification Added" });
        document.getElementById("certForm").reset();
        loadCerts();
    }
}

async function loadCerts() {
    const res = await fetch("http://localhost:3000/api/certifications");
    const data = await res.json();

    const list = document.getElementById("certList");
    list.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "border p-2 mb-2 d-flex justify-content-between align-items-center";

        const text = document.createElement("span");
        text.innerHTML = `<strong>${item.name}</strong> - ${item.issuer}${item.issue_date ? `<br><small>${item.issue_date}</small>` : ""}`;

        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-primary btn-sm me-2";
        addBtn.textContent = "Add to Resume";

        addBtn.addEventListener("click", () => {
            addToResume("certification", item.id);
        });

        const btn = document.createElement("button");
        btn.className = "btn btn-danger btn-sm";
        btn.textContent = "Delete";

        btn.addEventListener("click", () => deleteCert(item.id));

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

async function deleteCert(id) {
    const result = await Swal.fire({
        title: "Delete certification?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
        await fetch(`http://localhost:3000/api/certifications/${id}`, {
            method: "DELETE"
        });

        loadCerts();
    }
}