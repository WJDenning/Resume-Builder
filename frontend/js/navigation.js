document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("[data-section]").forEach(btn => {
        btn.addEventListener("click", () => {
            showSection(btn.dataset.section);
        });
    });

});

function showSection(id) {
    document.querySelectorAll(".content-section").forEach(sec => {
        sec.classList.add("d-none");
    });

    document.getElementById(id).classList.remove("d-none");
}