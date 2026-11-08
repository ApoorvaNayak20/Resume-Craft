document.addEventListener("DOMContentLoaded", async () => {
  if (!requireLogin()) return;
  mountShell("Dashboard");
  const data = await fetchResume();
  const paper = document.getElementById("resumePaper");
  renderResume(paper, data);
  const edit = document.getElementById("editDetails");
  const change = document.getElementById("changeTemplate");
  if (edit) edit.addEventListener("click",()=>location.href="details.html");
  if (change) change.addEventListener("click",()=>location.href="templates.html");
});
function renderResume(el, d) {
  const template = localStorage.getItem("rc_template") || "classic";
  const accent = localStorage.getItem("rc_color") || "#172b4d";
  const font = localStorage.getItem("rc_font") || (template==="classic"?"Georgia":"Arial");
  el.dataset.template = template;
  el.style.setProperty("--resume-accent", accent);
  el.style.fontFamily = font;
  const contact = [d.email,d.phone,d.city,d.state,d.country].filter(Boolean).map(escapeHTML).join(" · ");
  const photo = d.photoData ? `<img class="resume-photo ${d.photoShape==="circle"?"circle":""}" src="${d.photoData}" alt="Profile photograph">` : "";
  const section = (title, body) => body ? `<section class="resume-section"><h2>${title}</h2>${body}</section>` : "";
  const edu = (d.education||[]).map(x=>`<p><span class="resume-item-title">${escapeHTML(x.qualification)}</span> — ${escapeHTML(x.institution)}${x.board?" · "+escapeHTML(x.board):""}${x.year?" · "+escapeHTML(x.year):""}${x.grade?" · "+escapeHTML(x.grade):""}</p>`).join("");
  const list = arr => arr?.length ? `<ul>${arr.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul>` : "";
  const projects = (d.projects||[]).map(x=>`<p><b>${escapeHTML(x.title)}</b>${x.description?" — "+escapeHTML(x.description):""}${x.technologies?"<br><span class='resume-small'>Technologies: "+escapeHTML(x.technologies)+"</span>":""}${x.contribution?"<br>"+escapeHTML(x.contribution):""}</p>`).join("");
  const achievements = (d.achievements||[]).map(x=>`<p><b>${escapeHTML(x.title)}</b>${x.award?" — "+escapeHTML(x.award):""}${x.year?" ("+escapeHTML(x.year)+")":""}</p>`).join("");
  const certs = (d.certifications||[]).map(x=>`<p><b>${escapeHTML(x.name)}</b>${x.issuer?" — "+escapeHTML(x.issuer):""}${x.year?" ("+escapeHTML(x.year)+")":""}</p>`).join("");
  const links = [d.linkedin,d.github,d.portfolio].filter(Boolean).map(escapeHTML).join(" · ");
  el.innerHTML = `
    <header class="resume-header"><div><h1>${escapeHTML(d.fullName||"Your Name")}</h1><div class="resume-contact">${contact}</div>${links?`<div class="resume-contact">${links}</div>`:""}</div>${photo}</header>
    ${section("Career Objective", d.objective?`<p>${escapeHTML(d.objective)}</p>`:"")}
    ${section("Education",edu)}
    ${section("Technical Skills",list(d.skills))}
    ${section("Projects",projects)}
    ${section("Achievements & Awards",achievements)}
    ${section("Certifications",certs)}
    ${section("Soft Skills",list(d.softSkills))}
    ${section("Interests",d.interests?`<p>${escapeHTML(d.interests)}</p>`:"")}
  `;
}
