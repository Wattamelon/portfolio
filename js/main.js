document.documentElement.dataset.app = "portfolio";

// Phase 01 keeps JavaScript minimal and only prepares stable hooks for later phases.
window.portfolioElements = {
  menuButton: document.querySelector("[data-menu-button]"),
  nav: document.querySelector("[data-nav]"),
  projectsGrid: document.querySelector("[data-projects-grid]"),
  projectsStatus: document.querySelector("[data-projects-status]"),
  contactForm: document.querySelector("[data-contact-form]"),
};
