document.documentElement.dataset.app = "portfolio";

const APP_VERSION = "v0.10.2";

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
const SYSTEM_THEME_QUERY = window.matchMedia("(prefers-color-scheme: dark)");
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
const TYPING_TYPE_INTERVAL = 70;
const TYPING_DELETE_INTERVAL = 32;
const TYPING_HOLD_DELAY = 1000;
const TYPING_RESTART_DELAY = 300;

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
  let isDeleting = false;
  typingOutput.textContent = "";
  typingTitle.classList.add("is-typing");

  const renderFrame = () => {
    typingOutput.textContent = characters.slice(0, characterIndex).join("");

    if (!isDeleting && characterIndex < characters.length) {
      characterIndex += 1;
      window.setTimeout(renderFrame, TYPING_TYPE_INTERVAL);
      return;
    }

    if (!isDeleting && characterIndex === characters.length) {
      isDeleting = true;
      typingTitle.classList.add("is-typing-complete");
      window.setTimeout(renderFrame, TYPING_HOLD_DELAY);
      return;
    }

    if (isDeleting && characterIndex > 0) {
      characterIndex -= 1;
      typingTitle.classList.remove("is-typing-complete");
      window.setTimeout(renderFrame, TYPING_DELETE_INTERVAL);
      return;
    }

    isDeleting = false;
    typingTitle.classList.remove("is-typing-complete");
    window.setTimeout(renderFrame, TYPING_RESTART_DELAY);
  };

  window.setTimeout(renderFrame, TYPING_RESTART_DELAY);
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
    themeToggle.textContent = "☀️";
    themeToggle.setAttribute("aria-label", "Switch to light mode");
    return;
  }

  themeToggle.textContent = "🌙";
  themeToggle.setAttribute("aria-label", "Switch to dark mode");
}

function getSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "";
  } catch {
    return "";
  }
}

function getSystemTheme() {
  return SYSTEM_THEME_QUERY.matches ? "dark" : "light";
}

function initTheme() {
  applyTheme(getSavedTheme() || getSystemTheme());
}

function toggleTheme() {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch {
    // The theme still works for this page when browser storage is unavailable.
  }
  applyTheme(nextTheme);
}

function handleSystemThemeChange() {
  if (getSavedTheme()) return;
  applyTheme(getSystemTheme());
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
    field.classList.add("is-valid");
  }
}

function focusFirstInvalidField() {
  const firstInvalidField = Object.values(window.portfolioElements.contactFields).find(
    (field) => field?.classList.contains("is-invalid")
  );

  if (firstInvalidField) {
    firstInvalidField.focus();
  }
}

function validateName() {
  const field = window.portfolioElements.contactFields.name;
  if (!field) return true;
  const value = field.value.trim();

  if (!value) {
    setFieldError("name", CONTACT_MESSAGES.nameRequired);
    return false;
  }

  if (value.length < 2) {
    setFieldError("name", CONTACT_MESSAGES.nameShort);
    return false;
  }

  setFieldError("name");
  return true;
}

function validateEmail() {
  const field = window.portfolioElements.contactFields.email;
  if (!field) return true;
  const value = field.value.trim();

  if (!value) {
    setFieldError("email", CONTACT_MESSAGES.emailRequired);
    return false;
  }

  if (!EMAIL_PATTERN.test(value)) {
    setFieldError("email", CONTACT_MESSAGES.emailInvalid);
    return false;
  }

  setFieldError("email");
  return true;
}

function validateMessage() {
  const field = window.portfolioElements.contactFields.message;
  if (!field) return true;
  const value = field.value.trim();

  if (!value) {
    setFieldError("message", CONTACT_MESSAGES.messageRequired);
    return false;
  }

  if (value.length < 10) {
    setFieldError("message", CONTACT_MESSAGES.messageShort);
    return false;
  }

  setFieldError("message");
  return true;
}

function validateForm() {
  const nameValid = validateName();
  const emailValid = validateEmail();
  const messageValid = validateMessage();
  return nameValid && emailValid && messageValid;
}

function getFormspreeEndpoint() {
  const endpoint = window.PORTFOLIO_CONFIG?.formspreeEndpoint?.trim() || "";
  return FORMSPREE_ENDPOINT_PATTERN.test(endpoint) ? endpoint : "";
}

function setFormSubmitting(isSubmitting) {
  const { contactForm, submitButton } = window.portfolioElements;
  if (contactForm) {
    contactForm.setAttribute("aria-busy", String(isSubmitting));
  }
  if (!submitButton) return;

  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Sending..." : "Send Message";
}

async function getSubmissionError(response) {
  try {
    const result = await response.json();
    const message = result.errors?.[0]?.message || result.error;
    return typeof message === "string" ? message : CONTACT_MESSAGES.submitFailure;
  } catch {
    return CONTACT_MESSAGES.submitFailure;
  }
}

async function handleContactSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    setFormStatus(CONTACT_MESSAGES.submitError, "error");
    focusFirstInvalidField();
    return;
  }

  const endpoint = getFormspreeEndpoint();
  const form = window.portfolioElements.contactForm;
  if (!endpoint || !form) {
    setFormStatus(CONTACT_MESSAGES.configurationError, "error");
    return;
  }

  setFormSubmitting(true);
  setFormStatus(CONTACT_MESSAGES.submitPending);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      setFormStatus(await getSubmissionError(response), "error");
      return;
    }

    setFormStatus(CONTACT_MESSAGES.submitSuccess, "success");
    form.reset();
    ["name", "email", "message"].forEach((fieldName) => setFieldError(fieldName));
  } catch {
    setFormStatus(CONTACT_MESSAGES.networkFailure, "error");
  } finally {
    setFormSubmitting(false);
  }
}

function handleFieldFeedback(event) {
  const fieldName = event.target.name;
  if (fieldName === "name") validateName();
  if (fieldName === "email") validateEmail();
  if (fieldName === "message") validateMessage();

  if (window.portfolioElements.formStatus?.classList.contains("is-error")) {
    setFormStatus("");
  }
}

function handleInvalidField(event) {
  event.preventDefault();
  const fieldName = event.target.dataset.validateField;
  if (fieldName === "name") validateName();
  if (fieldName === "email") validateEmail();
  if (fieldName === "message") validateMessage();
  setFormStatus(CONTACT_MESSAGES.submitError, "error");
}

if (buildBadge) {
  buildBadge.textContent = `Build ${APP_VERSION}`;
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

SYSTEM_THEME_QUERY.addEventListener("change", handleSystemThemeChange);

if (window.portfolioElements.contactForm) {
  window.portfolioElements.contactForm.addEventListener("submit", handleContactSubmit);
}

Object.values(window.portfolioElements.contactFields).forEach((field) => {
  if (!field) return;
  field.addEventListener("input", handleFieldFeedback);
  field.addEventListener("blur", handleFieldFeedback);
  field.addEventListener("invalid", handleInvalidField);
});

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
initTypingEffect();
handleScrollState();
setProjectsStatus(PROJECT_MESSAGES.statusReady);
loadProjects();
