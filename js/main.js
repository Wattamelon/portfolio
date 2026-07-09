document.documentElement.dataset.app = "portfolio";

const APP_VERSION = "v0.9.0";

window.portfolioElements = {
  menuButton: document.querySelector("[data-menu-button]"),
  nav: document.querySelector("[data-nav]"),
  navLinks: Array.from(document.querySelectorAll('[data-nav] a[href^="#"]')),
  projectsGrid: document.querySelector("[data-projects-grid]"),
  projectsStatus: document.querySelector("[data-projects-status]"),
  projectFilters: document.querySelector("[data-project-filters]"),
  contactForm: document.querySelector("[data-contact-form]"),
  formStatus: document.querySelector("[data-form-status]"),
  submitButton: document.querySelector("[data-submit-button]"),
  contactFields: {
    name: document.querySelector("#name"),
    email: document.querySelector("#email"),
    message: document.querySelector("#message"),
  },
  fieldErrors: {
    name: document.querySelector('[data-error-for="name"]'),
    email: document.querySelector('[data-error-for="email"]'),
    message: document.querySelector('[data-error-for="message"]'),
  },
  themeToggle: document.querySelector("[data-theme-toggle]"),
  scrollTopButton: document.querySelector("[data-scroll-top]"),
  header: document.querySelector(".site-header"),
  buildBadge: document.querySelector(".build-badge"),
  typingTitle: document.querySelector("[data-typing-text]"),
  typingOutput: document.querySelector("[data-typing-output]"),
};

const {
  menuButton,
  nav,
  navLinks,
  themeToggle,
  scrollTopButton,
  header,
  buildBadge,
} = window.portfolioElements;

const THEME_KEY = "moon-portfolio-theme";
const GITHUB_CONFIG = {
  username: "Wattamelon",
  perPage: 100,
  maxDisplay: 6,
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMSPREE_ENDPOINT_PATTERN =
  /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
const PROJECT_MESSAGES = {
  loadingTitle: "Loading repositories...",
  loadingBody: "Fetching the latest repositories from the GitHub API.",
  link: "Open Repository",
  updatedPrefix: "Updated",
  descriptionFallback: "This repository does not have a description yet.",
  languageFallback: "Language N/A",
  emptyTitle: "No projects to display",
  emptyBody: "There are no public repositories or none matched the display conditions.",
  errorTitle: "Could not load projects",
  retry: "Retry",
  statusReady: "GitHub repositories ready to load",
  statusLoading: "Loading repositories...",
  statusEmpty: "No repositories found",
  statusLoaded: "Loaded {count} repositories",
  statusFiltered: "Showing {count} {language} repositories",
  filterEmptyTitle: "No {language} projects found",
  filterEmptyBody: "Try another language or select All to see every project.",
  statusError: "Failed to load repositories",
  apiError: "GitHub API request failed ({status})",
  unknownError: "An unknown error occurred.",
};
const ALL_PROJECTS_FILTER = "All";
let projectRepos = [];
let activeProjectFilter = ALL_PROJECTS_FILTER;
const CONTACT_MESSAGES = {
  nameRequired: "Please enter your name.",
  nameShort: "Your name must be at least 2 characters long.",
  emailRequired: "Please enter your email.",
  emailInvalid: "Please enter a valid email address.",
  messageRequired: "Please enter your message.",
  messageShort: "Your message must be at least 10 characters long.",
  submitError: "Please review the form and try again.",
  submitSuccess: "Your message has been sent successfully.",
  submitPending: "Sending your message...",
  submitFailure: "Your message could not be sent. Please try again.",
  networkFailure: "A network error occurred. Please check your connection and try again.",
  configurationError: "The contact form is not connected yet. Please contact me through GitHub.",
};
const TYPING_INTERVAL = 70;

function initTypingEffect() {
  const { typingTitle, typingOutput } = window.portfolioElements;
  if (!typingTitle || !typingOutput) return;

  const text = typingTitle.dataset.typingText || "";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!text || prefersReducedMotion) {
    typingOutput.textContent = text;
    typingTitle.classList.add("is-typing-complete");
    return;
  }

  const characters = Array.from(text);
  let characterIndex = 0;
  typingOutput.textContent = "";
  typingTitle.classList.add("is-typing");

  const typeNextCharacter = () => {
    typingOutput.textContent += characters[characterIndex];
    characterIndex += 1;

    if (characterIndex < characters.length) {
      window.setTimeout(typeNextCharacter, TYPING_INTERVAL);
      return;
    }

    typingTitle.classList.remove("is-typing");
    typingTitle.classList.add("is-typing-complete");
  };

  window.setTimeout(typeNextCharacter, 300);
}

function interpolate(message, values = {}) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message
  );
}

function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {
  if (!menuButton || !nav) return;
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;

  if (theme === "dark") {
    themeToggle.textContent = "Light";
    themeToggle.setAttribute("aria-label", "Switch to light mode");
    return;
  }

  themeToggle.textContent = "Theme";
  themeToggle.setAttribute("aria-label", "Switch to dark mode");
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
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
  }
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
  return new Intl.DateTimeFormat("en-US", {
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
    repo.description || PROJECT_MESSAGES.descriptionFallback;

  const footer = document.createElement("div");
  footer.className = "project-card__footer";

  const meta = document.createElement("div");
  meta.className = "project-card__meta";

  const language = document.createElement("span");
  language.className = "project-card__pill";
  language.textContent = repo.language || PROJECT_MESSAGES.languageFallback;

  const stars = document.createElement("span");
  stars.className = "project-card__pill";
  stars.textContent = `Star ${repo.stargazers_count}`;

  const updated = document.createElement("span");
  updated.textContent = `${PROJECT_MESSAGES.updatedPrefix} ${formatDate(repo.pushed_at)}`;

  meta.append(language, stars, updated);

  const link = document.createElement("a");
  link.className = "project-card__link";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = PROJECT_MESSAGES.link;
  link.setAttribute("aria-label", `${repo.name} repository`);

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
  const article = createStateCard(PROJECT_MESSAGES.errorTitle, message, "error");
  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "retry-button";
  retryButton.textContent = PROJECT_MESSAGES.retry;
  retryButton.addEventListener("click", onRetry);
  article.append(retryButton);
  return article;
}

function selectRepos(repos) {
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
}

function filterReposByLanguage(repos, language) {
  if (language === ALL_PROJECTS_FILTER) {
    return repos;
  }

  return repos.filter((repo) => repo.language === language);
}

function renderProjects() {
  const grid = window.portfolioElements.projectsGrid;
  if (!grid) return;

  const filteredRepos = filterReposByLanguage(
    projectRepos,
    activeProjectFilter
  ).slice(0, GITHUB_CONFIG.maxDisplay);

  if (filteredRepos.length === 0) {
    grid.replaceChildren(
      createStateCard(
        interpolate(PROJECT_MESSAGES.filterEmptyTitle, {
          language: activeProjectFilter,
        }),
        PROJECT_MESSAGES.filterEmptyBody,
        "empty"
      )
    );
    setProjectsStatus(PROJECT_MESSAGES.statusEmpty);
    return;
  }

  grid.replaceChildren(...filteredRepos.map(createProjectCard));

  const statusMessage =
    activeProjectFilter === ALL_PROJECTS_FILTER
      ? PROJECT_MESSAGES.statusLoaded
      : PROJECT_MESSAGES.statusFiltered;
  setProjectsStatus(
    interpolate(statusMessage, {
      count: filteredRepos.length,
      language: activeProjectFilter,
    })
  );
}

function setActiveProjectFilter(language) {
  activeProjectFilter = language;

  window.portfolioElements.projectFilters
    ?.querySelectorAll("[data-project-filter]")
    .forEach((button) => {
      const isActive = button.dataset.projectFilter === language;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

  renderProjects();
}

function createProjectFilterButton(language) {
  const button = document.createElement("button");
  button.className = "project-filter";
  button.type = "button";
  button.dataset.projectFilter = language;
  button.textContent = language;
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => setActiveProjectFilter(language));
  return button;
}

function renderProjectFilters(repos) {
  const filters = window.portfolioElements.projectFilters;
  if (!filters) return;

  const languages = [
    ...new Set(repos.map((repo) => repo.language).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const allButton = createProjectFilterButton(ALL_PROJECTS_FILTER);
  allButton.classList.add("is-active");
  allButton.setAttribute("aria-pressed", "true");
  filters.replaceChildren(
    allButton,
    ...languages.map(createProjectFilterButton)
  );
}

async function loadProjects() {
  const grid = window.portfolioElements.projectsGrid;
  if (!grid) return;

  grid.replaceChildren(
    createStateCard(
      PROJECT_MESSAGES.loadingTitle,
      PROJECT_MESSAGES.loadingBody,
      "empty"
    )
  );
  setProjectsStatus(PROJECT_MESSAGES.statusLoading, "loading");

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_CONFIG.username}/repos?sort=updated&per_page=${GITHUB_CONFIG.perPage}`
    );

    if (!response.ok) {
      throw new Error(
        interpolate(PROJECT_MESSAGES.apiError, { status: response.status })
      );
    }

    const repos = await response.json();
    const selectedRepos = selectRepos(repos);

    if (selectedRepos.length === 0) {
      grid.replaceChildren(
        createStateCard(
          PROJECT_MESSAGES.emptyTitle,
          PROJECT_MESSAGES.emptyBody,
          "empty"
        )
      );
      setProjectsStatus(PROJECT_MESSAGES.statusEmpty);
      return;
    }

    projectRepos = selectedRepos;
    activeProjectFilter = ALL_PROJECTS_FILTER;
    renderProjectFilters(projectRepos);
    renderProjects();
  } catch (error) {
    grid.replaceChildren(
      createErrorCard(
        error.message || PROJECT_MESSAGES.unknownError,
        loadProjects
      )
    );
    setProjectsStatus(PROJECT_MESSAGES.statusError, "error");
  }
}

function setFormStatus(message, state = "idle") {
  const status = window.portfolioElements.formStatus;
  if (!status) return;
  status.textContent = message;
  status.classList.remove("is-error", "is-success");
  if (state === "error") status.classList.add("is-error");
  if (state === "success") status.classList.add("is-success");
}

function setFieldError(fieldName, message = "") {
  const field = window.portfolioElements.contactFields[fieldName];
  const messageNode = window.portfolioElements.fieldErrors[fieldName];
  if (!field || !messageNode) return;

  messageNode.textContent = message;
  field.classList.remove("is-invalid", "is-valid");
  field.removeAttribute("aria-invalid");

  if (message) {
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    return;
  }

  if (field.value.trim()) {
    fie