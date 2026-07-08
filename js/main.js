document.documentElement.dataset.app = "portfolio";

window.portfolioElements = {
  menuButton: document.querySelector("[data-menu-button]"),
  nav: document.querySelector("[data-nav]"),
  navLinks: Array.from(document.querySelectorAll('[data-nav] a[href^="#"]')),
  projectsGrid: document.querySelector("[data-projects-grid]"),
  projectsStatus: document.querySelector("[data-projects-status]"),
  contactForm: document.querySelector("[data-contact-form]"),
  themeToggle: document.querySelector("[data-theme-toggle]"),
  scrollTopButton: document.querySelector("[data-scroll-top]"),
  header: document.querySelector(".site-header"),
};

const {
  menuButton,
  nav,
  navLinks,
  themeToggle,
  scrollTopButton,
  header,
} = window.portfolioElements;

const THEME_KEY = "moon-portfolio-theme";
const GITHUB_CONFIG = {
  username: "Wattamelon",
  perPage: 100,
  maxDisplay: 6,
};

function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!menuButton || !nav) return;
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;
  if (theme === "dark") {
    themeToggle.textContent = "Light";
    themeToggle.setAttribute("aria-label", "라이트 모드로 전환");
  } else {
    themeToggle.textContent = "Theme";
    themeToggle.setAttribute("aria-label", "다크 모드로 전환");
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

function toggleTheme() {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
}

function scrollToTarget(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleScrollState() {
  const scrollY = window.scrollY;

  if (header) {
    header.classList.toggle("is-scrolled", scrollY > 40);
  }

  if (scrollTopButton) {
    scrollTopButton.classList.toggle("is-visible", scrollY > 300);
  }
}

function handleOutsideClick(event) {
  if (!nav || !menuButton || window.innerWidth > 720) return;
  const isInside = nav.contains(event.target) || menuButton.contains(event.target);
  if (!isInside) {
    closeMenu();
  }
}

function setProjectsStatus(text, state = "idle") {
  const status = window.portfolioElements.projectsStatus;
  if (!status) return;
  status.textContent = text;
  status.classList.remove("is-loading", "is-error");
  if (state === "loading") status.classList.add("is-loading");
  if (state === "error") status.classList.add("is-error");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function createProjectCard(repo) {
  const article = document.createElement("article");
  article.className = "project-card";

  const title = document.createElement("h3");
  title.textContent = repo.name;

  const description = document.createElement("p");
  description.textContent =
    repo.description || "저장소 설명이 아직 작성되지 않았습니다.";

  const footer = document.createElement("div");
  footer.className = "project-card__footer";

  const meta = document.createElement("div");
  meta.className = "project-card__meta";

  const language = document.createElement("span");
  language.className = "project-card__pill";
  language.textContent = repo.language || "Language N/A";

  const stars = document.createElement("span");
  stars.className = "project-card__pill";
  stars.textContent = `★ ${repo.stargazers_count}`;

  const updated = document.createElement("span");
  updated.textContent = `Updated ${formatDate(repo.pushed_at)}`;

  meta.append(language, stars, updated);

  const link = document.createElement("a");
  link.className = "project-card__link";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "Open Repository";

  footer.append(meta, link);
  article.append(title, description, footer);
  return article;
}

function createStateCard(titleText, bodyText, kind = "empty") {
  const article = document.createElement("article");
  article.className = `project-card project-card--${kind}`;

  const title = document.createElement("h3");
  title.textContent = titleText;

  const description = document.createElement("p");
  description.textContent = bodyText;

  article.append(title, description);
  return article;
}

function createErrorCard(message, onRetry) {
  const article = createStateCard("프로젝트를 불러오지 못했습니다", message, "error");
  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "retry-button";
  retryButton.textContent = "다시 시도";
  retryButton.addEventListener("click", onRetry);
  article.append(retryButton);
  return article;
}

function selectRepos(repos) {
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, GITHUB_CONFIG.maxDisplay);
}

async function loadProjects() {
  const grid = window.portfolioElements.projectsGrid;
  if (!grid) return;

  grid.replaceChildren(
    createStateCard(
      "Loading repositories...",
      "GitHub API에서 저장소 목록을 가져오는 중입니다.",
      "empty"
    )
  );
  setProjectsStatus("Loading repositories...", "loading");

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_CONFIG.username}/repos?sort=updated&per_page=${GITHUB_CONFIG.perPage}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API 요청 실패 (${response.status})`);
    }

    const repos = await response.json();
    const selectedRepos = selectRepos(repos);

    if (selectedRepos.length === 0) {
      grid.replaceChildren(
        createStateCard(
          "표시할 프로젝트가 없습니다",
          "공개 저장소가 없거나 표시 조건에 맞는 프로젝트를 찾지 못했습니다.",
          "empty"
        )
      );
      setProjectsStatus("No repositories found");
      return;
    }

    grid.replaceChildren(...selectedRepos.map(createProjectCard));
    setProjectsStatus(`Loaded ${selectedRepos.length} repositories`);
  } catch (error) {
    grid.replaceChildren(
      createErrorCard(
        error.message || "알 수 없는 오류가 발생했습니다.",
        loadProjects
      )
    );
    setProjectsStatus("Failed to load repositories", "error");
  }
}

if (menuButton) {
  menuButton.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash) return;
    event.preventDefault();
    scrollToTarget(hash);
    closeMenu();
  });
});

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.addEventListener("scroll", handleScrollState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMenu();
  }
});
document.addEventListener("click", handleOutsideClick);

initTheme();
handleScrollState();
loadProjects();
