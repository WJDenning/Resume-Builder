# Resume Builder

### Author  
Will Denning  

### GitHub Repository  
https://github.com/WJDenning/Resume-Builder  

---

## Project Overview  

Resume Builder is a single-page web application designed to help users create professional, customizable resumes without needing to worry about formatting. The application allows users to focus on content while dynamically generating both a digital and print-ready resume layout.

Users can store and manage structured resume data such as work experience, education, skills, certifications, and awards. When generating a resume, users can selectively include specific entries and tailor their resume for different job applications.

The application also integrates generative AI to provide feedback and suggestions on user-entered content, improving clarity, wording, and overall professionalism.

---

## Features  

- Single Page Application (SPA) built with HTML, CSS, and JavaScript  
- Node.js + Express RESTful backend  
- SQLite database for persistent data storage  
- Dynamic resume generation with selectable content sections  
- Print-friendly resume layout  
- AI-powered suggestions for improving resume content  
- Local-first application (runs entirely on the user's machine)  
- Modular code structure for maintainability  
- Accessibility-focused design (target Lighthouse score ≥ 93)  

---

## Technologies Used  

### Frontend  
- HTML5  
- CSS3 (Bootstrap and limited custom CSS)  
- Vanilla JavaScript (no frameworks)  

### Backend  
- Node.js  
- Express.js  

### Database  
- SQLite  

### AI Integration  
- Google Gemini API (user-provided API key)  

---

## Project Structure  

The project is organized to separate concerns and maintain readability:

- `/frontend` – HTML, CSS, and client-side JavaScript  
- `/backend` – Express server and API routes  
- `/database` – SQLite database and schema  
- `/libs` – Local copies of third-party libraries (no CDN usage)  
- `/assets` – Icons, images, and branding  

---

## External Libraries  

All external libraries are stored locally within the project directory (no CDN usage):

- SweetAlert2  

- Bootstrap v 5.2.3

Additional libraries, if added, will be documented and attributed within the application.

---

## Installation and Setup  

1. Clone the repository  

       git clone https://github.com/WJDenning/Resume-Builder.git
       cd Resume-Builder

2. Install backend dependencies  

        npm install express sqlite3 cors dotenv

3. Configure environment variables  

   Create a `.env` file in the root directory and add:

       GEMINI_API_KEY=your_api_key_here

4. Start the server  

       node server.js

5. Open the application  

   Navigate to:

       http://localhost:3000

---

## Usage  

- Add and manage resume data (jobs, skills, education, etc.)  
- Use AI suggestions to refine descriptions  
- Select which entries to include in a resume  
- Generate and preview a formatted resume  
- Export or print the resume as a PDF  

---

## Accessibility  

This application is designed with accessibility in mind and aims to meet or exceed a Lighthouse accessibility score of 93. Documentation of testing results will be included in the final submission.

---

## AI Usage Documentation  

This project incorporates generative AI tools to assist in development and content improvement.

### Tools Used  
- ChatGPT  
- GitHub Copilot  
- Claude Code  

### How AI Was Used  
- Generating code suggestions and boilerplate  
- Assisting with layout and formatting logic  
- Improving UI/UX structure  
- Providing resume content feedback via Gemini API integration  

---

## Build Notes  

- This application is intended to run locally  
- No external CDNs are used; all dependencies are bundled within the project  
- Future improvements may include packaging as an Electron application  