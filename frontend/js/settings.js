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