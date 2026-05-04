document.addEventListener("DOMContentLoaded", () => {
    renderResumePreview();
});

function formatBulletPoints(text) {
    if (!text) return "";
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return "";
    if (lines.length === 1) return `<div style="margin: 0.05in 0;">${lines[0]}</div>`;
    return `<ul style="margin: 0.05in 0 0.05in 0; padding-left: 0.25in;">
        ${lines.map(line => `<li style="margin: 0.02in 0;">${line.trim()}</li>`).join("")}
    </ul>`;
}

async function renderResumePreview() {

    const res = await fetch(`http://localhost:3000/api/resumes/${selectedResumeId}/build`);
    const data = await res.json();

    const container = document.getElementById("resumePreview");

    const jobs = data.jobs || [];
    const skills = data.skills || [];
    const education = data.education || [];
    const awards = data.awards || [];
    const certifications = data.certifications || [];

    container.innerHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 8.5in;">
            <h2 style="text-align: center; margin-bottom: 0.5in; border-bottom: 2px solid #333; padding-bottom: 0.25in;">RESUME</h2>

            ${jobs.length > 0 ? `
            <div style="margin-bottom: 0.3in;">
                <h3 style="background-color: #f0f0f0; padding: 0.1in 0.15in; margin: 0 0 0.15in 0; font-size: 1.1em;">EXPERIENCE</h3>
                ${jobs.map(j => `
                    <div style="margin-bottom: 0.25in;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <div><strong>${j.title}</strong></div>
                            <div style="text-align: right; font-size: 0.95em;">${j.start_date ? `${j.start_date}${j.end_date ? ` – ${j.end_date}` : ""}` : ""}</div>
                        </div>
                        <div style="font-style: italic; margin: 0.05in 0 0.1in 0;">${j.company}${j.location ? ` • ${j.location}` : ""}</div>
                        ${j.description ? formatBulletPoints(j.description) : ""}
                    </div>
                `).join("")}
            </div>
            ` : ""}

            ${education.length > 0 ? `
            <div style="margin-bottom: 0.3in;">
                <h3 style="background-color: #f0f0f0; padding: 0.1in 0.15in; margin: 0 0 0.15in 0; font-size: 1.1em;">EDUCATION</h3>
                ${education.map(e => `
                    <div style="margin-bottom: 0.25in;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <div><strong>${e.school}</strong></div>
                            <div style="text-align: right; font-size: 0.95em;">${e.end_date ? `${e.end_date}` : ""}</div>
                        </div>
                        <div style="margin: 0.05in 0 0.1in 0;">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}${e.gpa ? ` • GPA: ${e.gpa}` : ""}</div>
                        ${e.description ? formatBulletPoints(e.description) : ""}
                    </div>
                `).join("")}
            </div>
            ` : ""}

            ${skills.length > 0 ? `
            <div style="margin-bottom: 0.3in;">
                <h3 style="background-color: #f0f0f0; padding: 0.1in 0.15in; margin: 0 0 0.15in 0; font-size: 1.1em;">SKILLS</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1in;">
                    ${skills.map(s => `<span>${s.name}${s.proficiency ? ` – ${s.proficiency}` : ""}</span>`).join("")}
                </div>
            </div>
            ` : ""}

            ${certifications.length > 0 ? `
            <div style="margin-bottom: 0.3in;">
                <h3 style="background-color: #f0f0f0; padding: 0.1in 0.15in; margin: 0 0 0.15in 0; font-size: 1.1em;">CERTIFICATIONS</h3>
                ${certifications.map(c => `
                    <div style="margin-bottom: 0.2in;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <div><strong>${c.name}</strong></div>
                            <div style="text-align: right; font-size: 0.9em;">
                                ${c.issue_date ? `${c.issue_date}` : ""}
                            </div>
                        </div>
                        <div style="font-style: italic; margin: 0.05in 0;">${c.issuer}</div>
                    </div>
                `).join("")}
            </div>
            ` : ""}

            ${awards.length > 0 ? `
            <div style="margin-bottom: 0.3in;">
                <h3 style="background-color: #f0f0f0; padding: 0.1in 0.15in; margin: 0 0 0.15in 0; font-size: 1.1em;">AWARDS</h3>
                ${awards.map(a => `
                    <div style="margin-bottom: 0.2in;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <div><strong>${a.title}</strong></div>
                            <div style="text-align: right; font-size: 0.95em;">${a.date_received ? `${a.date_received}` : ""}</div>
                        </div>
                        <div style="font-style: italic; margin: 0.05in 0 0.05in 0;">${a.issuer}</div>
                        ${a.description ? formatBulletPoints(a.description) : ""}
                    </div>
                `).join("")}
            </div>
            ` : ""}
        </div>
    `;
}