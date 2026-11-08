document.addEventListener("DOMContentLoaded", async () => {
  if (!requireLogin()) return;
  mountShell("Dashboard");
  const data = await fetchResume();
  const form = document.getElementById("resumeForm");
  const simple = ["fullName","email","phone","city","state","country","objective","linkedin","github","portfolio","dob"];
  ["linkedin","github","portfolio","dob"].forEach(id => {
    const choice = document.getElementById(id + "Nil");
    if (choice) {
      choice.value = data[id + "Nil"] || "value";
      document.getElementById(id).disabled = choice.value === "nil";
      choice.addEventListener("change", () => {
        document.getElementById(id).disabled = choice.value === "nil";
        if (choice.value === "nil") document.getElementById(id).value = "";
      });
    }
  });
  simple.forEach(id => { const el = document.getElementById(id); if (el && data[id]) el.value = data[id]; });
  document.getElementById("fatherName").value = data.fatherName || "";
  document.getElementById("motherName").value = data.motherName || "";
  document.getElementById("photoShape").value = data.photoShape || "rect";
  if (data.photoData) {
    const img = document.getElementById("photoPreview");
    img.src = data.photoData; img.classList.remove("hidden");
    img.classList.toggle("circle", data.photoShape === "circle");
  }
  const education = data.education || [];
  document.getElementById("education").innerHTML = "";
  (education.length ? education : [{}]).forEach(addEducation);
  const skills = data.skills || [];
  document.getElementById("skills").value = skills.join(", ");
  document.getElementById("projects").value = (data.projects || []).map(x => [x.title,x.description,x.technologies,x.contribution].join(" | ")).join("\n");
  document.getElementById("achievements").value = (data.achievements || []).map(x => [x.title,x.award,x.year].join(" | ")).join("\n");
  document.getElementById("certifications").value = (data.certifications || []).map(x => [x.name,x.issuer,x.year].join(" | ")).join("\n");
  document.getElementById("softSkills").value = (data.softSkills || []).join(", ");
  document.getElementById("interests").value = data.interests || "";
  document.getElementById("photo").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 2 * 1024 * 1024) return alert("Please choose an image smaller than 2 MB.");
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById("photoPreview");
      img.src = reader.result; img.classList.remove("hidden");
      img.classList.toggle("circle", document.getElementById("photoShape").value === "circle");
      img.dataset.data = reader.result;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("photoShape").addEventListener("change", e => {
    document.getElementById("photoPreview").classList.toggle("circle", e.target.value === "circle");
  });
  document.getElementById("addEducation").addEventListener("click", () => addEducation({}));
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const required = ["fullName","email","phone","city","country","objective"];
    for (const id of required) {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.focus(); return alert("Please complete: " + id); }
    }
    const edu = [...document.querySelectorAll(".edu-row")].map(row => ({
      qualification: row.querySelector(".edu-qualification").value,
      institution: row.querySelector(".edu-institution").value,
      board: row.querySelector(".edu-board").value,
      year: row.querySelector(".edu-year").value,
      grade: row.querySelector(".edu-grade").value
    })).filter(x => x.qualification && x.institution);
    if (!edu.length) return alert("Please add at least one educational qualification.");
    const parseLines = (str, keys) => str.split("\n").map(line => {
      const vals = line.split("|").map(x => x.trim());
      return Object.fromEntries(keys.map((k,i)=>[k, vals[i] || ""]));
    }).filter(obj => Object.values(obj).some(Boolean));
    const old = getResume();
    const result = {
      ...old,
      ...Object.fromEntries(simple.map(id => [id, nilValue(document.getElementById(id).value.trim())])),
      linkedinNil: document.getElementById("linkedinNil").value,
      githubNil: document.getElementById("githubNil").value,
      portfolioNil: document.getElementById("portfolioNil").value,
      dobNil: document.getElementById("dobNil").value,
      fatherName: document.getElementById("fatherName").value.trim(),
      motherName: document.getElementById("motherName").value.trim(),
      education: edu,
      skills: document.getElementById("skills").value.split(",").map(x=>x.trim()).filter(Boolean),
      projects: parseLines(document.getElementById("projects").value, ["title","description","technologies","contribution"]),
      achievements: parseLines(document.getElementById("achievements").value, ["title","award","year"]),
      certifications: parseLines(document.getElementById("certifications").value, ["name","issuer","year"]),
      softSkills: document.getElementById("softSkills").value.split(",").map(x=>x.trim()).filter(Boolean),
      interests: document.getElementById("interests").value.trim(),
      photoShape: document.getElementById("photoShape").value,
      photoData: document.getElementById("photoPreview").dataset.data || old.photoData || ""
    };
    await persistResume(result);
    alert("Your resume information has been saved.");
    location.href = "preview.html";
  });
});
function addEducation(item) {
  const row = document.createElement("div");
  row.className = "edu-row panel";
  row.innerHTML = `
    <div class="form-grid">
      <div class="field"><label>Qualification *</label><input class="edu-qualification" placeholder="SSLC / PUC / B.E." required></div>
      <div class="field"><label>Institution *</label><input class="edu-institution" placeholder="School or college" required></div>
      <div class="field"><label>Board / University</label><input class="edu-board" placeholder="Board or university"></div>
      <div class="field"><label>Year of completion</label><input class="edu-year" placeholder="2026"></div>
      <div class="field"><label>Percentage / CGPA (optional)</label><input class="edu-grade" placeholder="NIL or leave blank"></div>
    </div><button type="button" class="danger remove-edu" style="margin-top:12px">Remove qualification</button>`;
  row.querySelector(".edu-qualification").value = item.qualification || "";
  row.querySelector(".edu-institution").value = item.institution || "";
  row.querySelector(".edu-board").value = item.board || "";
  row.querySelector(".edu-year").value = item.year || "";
  row.querySelector(".edu-grade").value = item.grade || "";
  row.querySelector(".remove-edu").addEventListener("click",()=>row.remove());
  document.getElementById("education").appendChild(row);
}
