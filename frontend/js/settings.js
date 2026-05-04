document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("apiKeyInput");
    const btn = document.getElementById("saveKeyBtn");

    input.value = localStorage.getItem("gemini_key") || "";

    btn.addEventListener("click", () => {
        localStorage.setItem("gemini_key", input.value);

        Swal.fire({
            icon: "success",
            title: "API Key Saved"
        });
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("libraryInfoBtn");

    btn.addEventListener("click", () => {
        Swal.fire({
            title: "External Libraries Used",
            icon: "info",
            html: `
                <ul style="text-align: left;">
                    <li><strong>Bootstrap</strong> - UI layout and responsive design system</li>
                    <li><strong>SweetAlert2</strong> - User-friendly alerts and notifications</li>
                    <li><strong>html2pdf.js</strong> - Converts resume HTML into downloadable PDF format</li>
                </ul>
                <hr>
                <small>All libraries are stored locally in /libs</small>
            `,
            confirmButtonText: "Got it"
        });
    });
});

document.getElementById("inputResumeName").addEventListener('change', () => {
    renderResumePreview()
})