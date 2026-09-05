const STORAGE_KEY = "abdulmageed_atef_mep_portfolio_v2";
const PROJECTS_KEY = "abdulmageed_atef_mep_projects_v2";

let editMode = false;

const defaults = {
  heroEyebrow: "Mechanical MEP Engineer • Saudi Arabia",
  name: "Abdulmageed Atef",
  headline: "Mechanical MEP Engineer | Healthcare, Laboratories & Commercial Projects",
  heroText: "4 years of hands-on experience across HVAC, Plumbing, Fire Fighting, Medical Gas, BMS and Clean Room Systems, with a strong focus on site execution, design review, coordination, testing & commissioning, and code compliance.",
  years: "4+",
  about: "Mechanical MEP Engineer with experience in Healthcare, Laboratory, and Commercial Projects in Saudi Arabia. My work spans site execution, technical coordination, design and drawing review, testing & commissioning, documentation, consultant coordination, and project delivery. I am continuously strengthening my technical knowledge in MEP design, codes, and standards with the goal of progressing toward a Senior MEP Engineer role.",
  role: "Mechanical MEP Engineer",
  location: "Saudi Arabia",
  email: "your.email@example.com",
  linkedin: "Add LinkedIn URL",
  contactLocation: "Saudi Arabia"
};

const defaultProjects = [
  {
    id: crypto.randomUUID(),
    name: "Healthcare / Laboratory Project",
    sector: "Healthcare & Laboratory",
    role: "Mechanical MEP Engineer",
    systems: ["HVAC","Plumbing","Fire Fighting","Medical Gas","Clean Rooms"],
    description: "MEP execution, supervision, technical coordination, drawing review, inspections, testing & commissioning and consultant handover in a technically demanding healthcare environment."
  },
  {
    id: crypto.randomUUID(),
    name: "Commercial MEP Project",
    sector: "Commercial",
    role: "Mechanical MEP Engineer",
    systems: ["HVAC","Plumbing","Fire Fighting","BMS"],
    description: "MEP coordination and site execution with focus on constructability, code compliance, material approvals, quality control and project delivery."
  }
];

function loadData(){
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return {...defaults, ...saved};
}

function saveData(){
  const data = {};
  document.querySelectorAll(".editable[data-key]").forEach(el=>{
    data[el.dataset.key] = el.innerText.trim();
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  syncLinks(data);
  alert("Changes saved on this device.");
}

function applyData(){
  const data = loadData();
  document.querySelectorAll(".editable[data-key]").forEach(el=>{
    const key = el.dataset.key;
    if(data[key] !== undefined) el.innerText = data[key];
  });
  document.getElementById("brandName").innerText = data.name;
  document.getElementById("footerName").innerText = data.name;
  syncLinks(data);
}

function syncLinks(data){
  const emailEl = document.getElementById("emailLink");
  emailEl.href = data.email && data.email.includes("@") ? `mailto:${data.email}` : "#";

  const linkedinEl = document.getElementById("linkedinLink");
  linkedinEl.href = data.linkedin && data.linkedin.startsWith("http") ? data.linkedin : "#";

  document.getElementById("brandName").innerText = data.name || "Abdulmageed Atef";
  document.getElementById("footerName").innerText = data.name || "Abdulmageed Atef";
}

function toggleEdit(on){
  editMode = on;
  document.querySelectorAll(".editable").forEach(el=>{
    el.contentEditable = on ? "true" : "false";
    el.classList.toggle("editing", on);
  });
  document.getElementById("editBar").classList.toggle("hidden", !on);
  document.querySelectorAll(".admin-only").forEach(el=>el.classList.toggle("hidden", !on));
  document.getElementById("editToggle").textContent = on ? "Editing…" : "Edit Mode";
}

function getProjects(){
  const saved = localStorage.getItem(PROJECTS_KEY);
  if(!saved){
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }
  return JSON.parse(saved);
}

function setProjects(projects){
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  renderProjects();
}

function renderProjects(){
  const grid = document.getElementById("projectsGrid");
  const projects = getProjects();
  grid.innerHTML = "";
  projects.forEach(project=>{
    const card = document.createElement("article");
    card.className = "card project-card";
    const systems = project.systems.map(x=>`<span>${escapeHtml(x)}</span>`).join("");
    card.innerHTML = `
      <div class="project-meta">${escapeHtml(project.sector || "MEP Project")}</div>
      <h3>${escapeHtml(project.name)}</h3>
      <strong>${escapeHtml(project.role || "")}</strong>
      <p>${escapeHtml(project.description || "")}</p>
      <div class="project-systems">${systems}</div>
      <div class="project-actions admin-only ${editMode ? "" : "hidden"}">
        <button class="btn btn-secondary" data-edit-project="${project.id}">Edit</button>
        <button class="btn btn-outline" data-delete-project="${project.id}">Delete</button>
      </div>`;
    grid.appendChild(card);
  });
}

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function openProjectModal(project=null){
  document.getElementById("projectModal").classList.remove("hidden");
  document.getElementById("modalTitle").textContent = project ? "Edit Project" : "Add Project";
  document.getElementById("projectId").value = project?.id || "";
  document.getElementById("projectName").value = project?.name || "";
  document.getElementById("projectSector").value = project?.sector || "";
  document.getElementById("projectRole").value = project?.role || "Mechanical MEP Engineer";
  document.getElementById("projectSystems").value = project?.systems?.join(", ") || "";
  document.getElementById("projectDescription").value = project?.description || "";
}

function closeProjectModal(){
  document.getElementById("projectModal").classList.add("hidden");
}

document.getElementById("editToggle").addEventListener("click",()=>toggleEdit(true));
document.getElementById("exitEditBtn").addEventListener("click",()=>toggleEdit(false));
document.getElementById("saveBtn").addEventListener("click",saveData);
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("Reset all editable text and project data to the original version?")){
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    applyData();
    renderProjects();
  }
});

document.getElementById("addProjectBtn").addEventListener("click",()=>openProjectModal());

document.addEventListener("click",e=>{
  const editId = e.target.dataset.editProject;
  const deleteId = e.target.dataset.deleteProject;
  if(editId){
    const p = getProjects().find(x=>x.id===editId);
    if(p) openProjectModal(p);
  }
  if(deleteId){
    if(confirm("Delete this project?")){
      setProjects(getProjects().filter(x=>x.id!==deleteId));
    }
  }
  if(e.target.hasAttribute("data-close-modal")) closeProjectModal();
});

document.getElementById("projectForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id = document.getElementById("projectId").value || crypto.randomUUID();
  const project = {
    id,
    name: document.getElementById("projectName").value.trim(),
    sector: document.getElementById("projectSector").value.trim(),
    role: document.getElementById("projectRole").value.trim(),
    systems: document.getElementById("projectSystems").value.split(",").map(x=>x.trim()).filter(Boolean),
    description: document.getElementById("projectDescription").value.trim()
  };
  let projects = getProjects();
  const idx = projects.findIndex(x=>x.id===id);
  if(idx>=0) projects[idx]=project; else projects.unshift(project);
  setProjects(projects);
  closeProjectModal();
});

document.getElementById("year").textContent = new Date().getFullYear();
applyData();
renderProjects();
