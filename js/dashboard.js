document.addEventListener("DOMContentLoaded", async () => {
  if (!requireLogin()) return;
  mountShell("Dashboard");
  const data = await fetchResume();
  const pct = updateProgress();
  document.getElementById("welcomeName").textContent = data.fullName || getUser()?.email || "there";
  document.querySelector("[data-progress]").style.width = pct + "%";
  document.querySelector("[data-progress-text]").textContent = pct + "%";
  const list = JSON.parse(localStorage.getItem("rc_saved_resumes") || "[]");
  document.getElementById("savedList").innerHTML = list.length ? list.map(x=>`
    <div class="card"><b>${escapeHTML(x.name)}</b><p class="muted">${new Date(x.savedAt).toLocaleString()}</p>
    <button type="button" data-load="${x.id}">Load this resume</button>
    <button type="button" class="danger" data-delete="${x.id}">Delete</button></div>`).join("") : `<p class="muted">No named resumes saved yet. Use Save a Copy to keep a version.</p>`;
  document.getElementById("saveCopy").addEventListener("click", async ()=>{
    const name = prompt("Name this resume version:");
    if (name?.trim()) { await saveNamedResume(name.trim()); location.reload(); }
  });
  document.getElementById("savedList").addEventListener("click", e=>{
    if (e.target.dataset.load) {
      const item=list.find(x=>String(x.id)===e.target.dataset.load);
      if(item){localStorage.setItem("rc_resume",JSON.stringify(item.data));location.href="preview.html";}
    }
    if (e.target.dataset.delete) {
      const updated=list.filter(x=>String(x.id)!==e.target.dataset.delete);
      localStorage.setItem("rc_saved_resumes",JSON.stringify(updated)); location.reload();
    }
  });
});
