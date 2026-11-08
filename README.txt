RESUME CRAFT — STARTER PROJECT
==============================

TECHNOLOGY
- HTML, CSS, Vanilla JavaScript
- Firebase Authentication + Cloud Firestore (optional until configured)
- html2pdf.js and html2canvas (CDN) for export

RUN LOCALLY
1. Extract this folder.
2. Open the folder in VS Code.
3. Install the "Live Server" extension.
4. Right-click login.html and choose "Open with Live Server".
5. Use the demo login if Firebase has not been configured:
   Email: demo@example.com
   Password: demo123

IMPORTANT DEMO MODE
- Demo mode is only for local testing.
- It stores a demo session and resume data in this browser's localStorage.
- It is NOT secure authentication and does not create an online account.
- Never use demo mode for real users or sensitive information.

ENABLE REAL AUTHENTICATION AND DATABASE
1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web App to the project.
3. Enable Authentication > Sign-in method > Email/Password.
4. Enable Google sign-in if desired.
5. Create a Cloud Firestore database.
6. Copy your Firebase web configuration into js/firebase-config.js.
7. In js/firebase-config.js, replace the placeholder values and set
   FIREBASE_ENABLED = true.
8. Publish the Firestore security rules below.
9. Serve the website over localhost or HTTPS (not file://).

YAHOO
Yahoo email addresses can be used with the email/password account flow if
the user registers that email address. This does not mean the site asks for
or receives a Yahoo account password. Yahoo OAuth requires separate provider
configuration and is not included in this starter.

SUGGESTED FIRESTORE SECURITY RULES
----------------------------------
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
      match /resumes/{resumeId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }
  }
}

Before publishing, review security rules, Firebase billing limits, privacy
requirements, and test access using two separate accounts.

PAGES
-----
login.html       Login / registration
index.html       Welcome page
dashboard.html   Dashboard
details.html     Resume information form
templates.html   Template and colour selection
preview.html     Resume preview
download.html    Export PDF / PNG
samples.html     Sample resume examples
about.html       About Resume Craft
help.html        Help and contact

NOTES
-----
- The project uses separate pages as requested.
- The resume preview is a clean, text-first format suitable as a starting
  point for ATS-friendly resumes. Some decorative templates may not be
  parsed equally well by every applicant tracking system.
- The AI assistant is a rule-based starter helper, not a connected AI model.
- The score measures completeness only; it does not guarantee interview
  success or ATS acceptance.
