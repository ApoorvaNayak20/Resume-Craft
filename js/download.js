document.addEventListener("DOMContentLoaded", async () => {
  if (!requireLogin()) return;
  mountShell("Dashboard");
  const data = await fetchResume();
  const paper = document.getElementById("resumePaper");
  renderResume(paper, data);
  document.getElementById("pdfBtn").addEventListener("click", async () => {
    if (!window.html2pdf) return alert("PDF library did not load. Check your internet connection.");
    const name = (data.fullName || "Resume").replace(/[^a-z0-9_-]/gi,"_");
    await html2pdf().set({
      margin: 8, filename: name + "_Resume.pdf",
      image: {type:"jpeg",quality:0.98},
      html2canvas: {scale:2,useCORS:true},
      jsPDF: {unit:"mm",format:"a4",orientation:"portrait"},
      pagebreak: {mode:["css","legacy"]}
    }).from(paper).save();
  });
  document.getElementById("pngBtn").addEventListener("click", async () => {
    if (!window.html2canvas) return alert("Image library did not load. Check your internet connection.");
    const canvas = await html2canvas(paper,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
    const a = document.createElement("a");
    a.download = (data.fullName || "Resume").replace(/[^a-z0-9_-]/gi,"_") + "_Resume.png";
    a.href = canvas.toDataURL("image/png"); a.click();
  });
  document.getElementById("printBtn").addEventListener("click",()=>window.print());
});
