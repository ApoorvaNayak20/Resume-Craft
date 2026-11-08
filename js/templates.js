const templates = [
  {id:"classic",name:"Classic Professional",desc:"Traditional typography and clean sections.",color:"#172b4d"},
  {id:"modern",name:"Modern Minimal",desc:"Simple modern layout with a strong accent.",color:"#315b91"},
  {id:"sidebar",name:"Elegant Blue",desc:"Elegant headings and balanced spacing.",color:"#245a68"},
  {id:"corporate",name:"Corporate Charcoal",desc:"Formal dark-grey professional look.",color:"#424b57"},
  {id:"burgundy",name:"Burgundy Classic",desc:"Subtle burgundy accent.",color:"#743b4b"},
  {id:"forest",name:"Forest Green",desc:"Muted green accent and classic layout.",color:"#35634b"},
  {id:"teal",name:"Teal Minimal",desc:"Clean teal highlights.",color:"#26727a"},
  {id:"sand",name:"Warm Neutral",desc:"Warm neutral colour palette.",color:"#806c52"},
  {id:"slate",name:"Slate Executive",desc:"Cool slate headings.",color:"#475569"},
  {id:"mono",name:"Monochrome",desc:"Black-and-white, highly restrained.",color:"#222222"},
  {id:"academic",name:"Academic",desc:"Education-first layout.",color:"#3d4d70"},
  {id:"tech",name:"Technical Fresher",desc:"Skills and projects are easy to scan.",color:"#2f5e83"},
  {id:"simple",name:"Simple One Page",desc:"Compact layout for concise resumes.",color:"#34495e"},
  {id:"navy",name:"Navy Standard",desc:"Classic navy professional design.",color:"#1d3557"},
  {id:"olive",name:"Olive Professional",desc:"Muted olive accent.",color:"#626b3f"}
];
document.addEventListener("DOMContentLoaded", () => {
  if (!requireLogin()) return;
  mountShell("Templates");
  const grid = document.getElementById("templateGrid");
  const chosen = localStorage.getItem("rc_template") || "classic";
  const color = localStorage.getItem("rc_color") || "";
  grid.innerHTML = templates.map(t => `
    <article class="template-card ${chosen===t.id?'selected':''}" data-id="${t.id}">
      <div class="template-thumb" style="--accent:${t.color}">
        <div class="t-name">Your Name</div><div class="t-line short"></div>
        <div class="t-rule"></div><b>EDUCATION</b><div class="t-line"></div><div class="t-line mid"></div>
        <br><b>SKILLS</b><div class="t-line mid"></div><div class="t-line"></div>
      </div><h3>${t.name}</h3><p class="muted">${t.desc}</p>
      <button type="button" data-select="${t.id}">${chosen===t.id?"Selected":"Select design"}</button>
    </article>`).join("");
  grid.addEventListener("click", e => {
    const id = e.target.dataset.select;
    if (!id) return;
    localStorage.setItem("rc_template", id);
    document.querySelectorAll(".template-card").forEach(c => {
      c.classList.toggle("selected", c.dataset.id===id);
      c.querySelector("button").textContent = c.dataset.id===id ? "Selected" : "Select design";
    });
  });
  document.getElementById("accentColor").value = color || templates.find(t=>t.id===chosen).color;
  document.getElementById("fontChoice").value = localStorage.getItem("rc_font") || "Arial";
  document.getElementById("accentColor").addEventListener("input", e=>localStorage.setItem("rc_color",e.target.value));
  document.getElementById("fontChoice").addEventListener("change", e=>localStorage.setItem("rc_font",e.target.value));
});
