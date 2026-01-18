const projectsData = [
  {
    title: "Сайт, который работает",
    tech: "HTML",
    level: "easy",
    rotate: "-2deg"
  },
  {
    title: "Интерактив ради интерактива",
    tech: "JavaScript",
    level: "medium",
    rotate: "1.5deg"
  },
  {
    title: "CSS, но зачем",
    tech: "CSS",
    level: "medium",
    rotate: "-1deg"
  },
  {
    title: "Проект, который я боюсь",
    tech: "JavaScript",
    level: "hard",
    rotate: "2deg"
  }
];

const techFilter = document.getElementById("techFilter");
const levelFilter = document.getElementById("levelFilter");
const projectsContainer = document.getElementById("projects");

techFilter.value = localStorage.getItem("tech") || "all";
levelFilter.value = localStorage.getItem("level") || "all";

function renderProjects() {
  projectsContainer.innerHTML = "";

  const tech = techFilter.value;
  const level = levelFilter.value;

  localStorage.setItem("tech", tech);
  localStorage.setItem("level", level);

  const filtered = projectsData.filter(p =>
    (tech === "all" || p.tech === tech) &&
    (level === "all" || p.level === level)
  );

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--rotate", p.rotate);

    card.innerHTML = `
      <h3>${p.title}</h3>
      <div class="tags">
        <span>${p.tech}</span>
        <span>${p.level}</span>
      </div>
    `;

    projectsContainer.appendChild(card);
  });
}

techFilter.addEventListener("change", renderProjects);
levelFilter.addEventListener("change", renderProjects);

renderProjects();
