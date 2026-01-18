const projectsData = [
  {
    title: "Лендинг",
    tech: "HTML",
    level: "easy"
  },
  {
    title: "Интерактивная галерея",
    tech: "JavaScript",
    level: "medium"
  },
  {
    title: "SPA приложение",
    tech: "React",
    level: "hard"
  },
  {
    title: "CSS-анимации",
    tech: "CSS",
    level: "medium"
  }
];

const techFilter = document.getElementById("techFilter");
const levelFilter = document.getElementById("levelFilter");
const projectsContainer = document.getElementById("projects");

// Загрузка фильтров из LocalStorage
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
