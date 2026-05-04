document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("generateResumeBtn")
        .addEventListener("click", exportResumePDF);
});

function exportResumePDF() {
    const element = document.getElementById("resumePreview");

    if (!element) {
        alert("No resume content found.");
        return;
    }

    const opt = {
        margin: 0.3,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
}