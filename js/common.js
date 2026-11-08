const STORAGE_KEYS = {
  user: "rc_user",
  resume: "rc_resume",
  template: "rc_template",
  resumes: "rc_saved_resumes"
};

function getUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"); }
  catch { return null; }
}
function getResume() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.resume) || "{}"); }
  catch { return {}; }
}
function saveResume(data) {
  localStorage.setItem(STORAGE_KEYS.resume, JSON.stringify(data));
  updateProgress();
}
function updateProgress() {
  const data = getResume();
  const checks = [
    !!data.fullName, !!data.email, !!data.phone, !!data.city,
    !!data.objective, !!data.education?.some(x => x.qualification && x.institution),
    !!data.skills?.length, !!data.projects?.some(x => x.title),
    !!data.achievements?.some(x => x.title)
  ];
  const pct = Math.round(checks.filter(Boolean).length / checks.length * 100);
  document.querySelectorAll("[data-progress]").forEach(el => el.style.width = pct + "%");
  document.querySelectorAll("[data-progress-text]").forEach(el => el.textContent = pct + "%");
  return pct;
}
function requireLogin() {
  const user = getUser();
  if (!user) { location.href = "login.html"; return false; }
  document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = user.email || "");
  return true;
}
function logout() {
  localStorage.removeItem(STORAGE_KEYS.user);
  location.href = "login.html";
}
function nav(active = "") {
  const items = [
    ["Home","index.html"],["Dashboard","dashboard.html"],["Templates","templates.html"],
    ["Samples","samples.html"],["About","about.html"],["Help","help.html"]
  ];
  return `<header class="topbar"><div class="container nav">
    <a class="brand" href="index.html">Resume <span>Craft</span></a>
    <nav class="navlinks">${items.map(([n,u])=>`<a class="${active===n?'active':''}" href="${u}">${n}</a>`).join("")}
    <a href="dashboard.html">My Workspace</a><a href="#" id="logoutLink">Logout</a></nav>
  </div></header>`;
}
function sidebar(active = "") {
  const items = [
    ["Overview","dashboard.html"],["Personal & Education","details.html"],
    ["Templates","templates.html"],["Preview","preview.html"],
    ["Download","download.html"],["My Resumes","dashboard.html#saved"]
  ];
  return `<aside class="panel sidebar">${items.map(([n,u])=>`<a class="${active===n?'active':''}" href="${u}">${n}</a>`).join("")}</aside>`;
}
function mountShell(active) {
  const header = document.getElementById("siteHeader");
  if (header) header.innerHTML = nav(active);
  const out = document.getElementById("logoutLink");
  if (out) out.addEventListener("click", e => { e.preventDefault(); logout(); });
  const foot = document.getElementById("siteFooter");
  if (foot) foot.innerHTML = `<footer class="footer"><div class="container">© ${new Date().getFullYear()} Resume Craft · Build a resume that tells your story.</div></footer>`;
}
function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function nilValue(value) { return !value || value === "__NIL__" ? "" : value; }
function loadPhoto(data) {
  return data.photoData || "";
}
