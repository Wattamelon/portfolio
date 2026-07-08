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
