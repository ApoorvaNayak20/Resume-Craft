document.addEventListener("DOMContentLoaded",()=>{
  mountShell("Help");
  const log=document.getElementById("chatLog");
  document.getElementById("chatForm").addEventListener("submit",e=>{
    e.preventDefault();
    const q=document.getElementById("chatInput").value.trim();
    if(!q)return;
    log.innerHTML+=`<div class="chatmsg"><b>You:</b> ${escapeHTML(q)}</div>`;
    const s=q.toLowerCase();
    let answer="Please use the Help page contact form for this issue. You can also review the project README for setup instructions.";
    if(s.includes("pdf")) answer="Open Preview, choose Download, then select Download PDF. If export fails, check your internet connection because the PDF library loads from a CDN.";
    else if(s.includes("photo")) answer="Open Personal & Education, upload a JPG or PNG under 2 MB, then choose circular or passport-style shape.";
    else if(s.includes("template")) answer="Open Templates, select a design, and adjust the accent colour and font. Then return to Preview.";
    else if(s.includes("save")) answer="Your draft is saved in browser storage in demo mode. Configure Firebase to sync it to your account online.";
    else if(s.includes("login")||s.includes("password")) answer="Use your registered email and password. Demo mode uses demo@example.com / demo123. Real login requires Firebase setup.";
    log.innerHTML+=`<div class="chatmsg"><b>Resume Craft:</b> ${answer}</div>`;
    document.getElementById("chatInput").value="";
    log.scrollTop=log.scrollHeight;
  });
  document.getElementById("contactForm").addEventListener("submit",e=>{
    e.preventDefault();
    alert("Thank you. This demo form does not send email yet; connect a backend or form service to receive submissions.");
    e.target.reset();
  });
});
