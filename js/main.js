document.documentElement.dataset.app = "portfolio";

const APP_VERSION = "v0.6.0";

window.portfolioElements = {
  menuButton: document.querySelector("[data-menu-button]"),
  nav: document.querySelector("[data-nav]"),
  navLinks: Array.from(document.querySelectorAll('[data-nav] a[href^="#"]')),
  languageButtons: Array.from(document.querySelectorAll("[data-language-button]")),
  projectsGrid: document.querySelector("[data-projects-grid]"),
  projectsStatus: document.querySelector("[data-projects-status]"),
  contactForm: document.querySelector("[data-contact-form]"),
  formStatus: document.querySelector("[data-form-status]"),
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
};

const {
  menuButton,
  nav,
  navLinks,
  languageButtons,
  themeToggle,
  scrollTopButton,
  header,
  buildBadge,
} = window.portfolioElements;

const THEME_KEY = "moon-portfolio-theme";
const LANGUAGE_KEY = "moon-portfolio-language";
const GITHUB_CONFIG = {
  username: "Wattamelon",
  perPage: 100,
  maxDisplay: 6,
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALE_MAP = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

const translations = {
  ko: {
    meta: { title: "Moon's Portfolio" },
    language: { switcherLabel: "언어 선택" },
    brand: { name: "Moon's Portfolio", ariaLabel: "홈으로 이동" },
    theme: {
      buttonLight: "Theme",
      buttonDark: "Light",
      toDark: "다크 모드로 전환",
      toLight: "라이트 모드로 전환",
    },
    menu: {
      button: "Menu",
      open: "메뉴 열기",
      close: "메뉴 닫기",
      navLabel: "주요 메뉴",
    },
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Web Core And Front-end",
      title: "기초를 쌓아 실제로 배포하는 프론트엔드 포트폴리오",
      text: "한국공학대학교 컴퓨터공학 기반 위에서 웹 기초를 다시 단단하게 쌓고 있습니다. 지금 이 페이지는 Codyssey 4-1 미션을 통해, 구조부터 반응형 레이아웃까지 단계적으로 완성해 가는 개인 포트폴리오 사이트입니다.",
      primaryAction: "View Projects",
      secondaryAction: "Contact",
      highlightsLabel: "핵심 요약",
      highlights: {
        degree: "컴퓨터공학부 소프트웨어공학과 학사",
        certificates: "SQLD 보유 / OPIC AL",
        bootcamp: "코디세이 부트캠프 진행 중",
      },
      panelLabel: "현재 진행 상태",
      phaseItems: {
        validation: "접근성과 키보드 사용성 점검",
        feedback: "README와 배포 정보 정리",
        realtime: "최종 UI와 인터랙션 마감",
      },
      meta: {
        research: "학부연구생 6개월",
        intern: "현장실습 인턴 2개월",
        australia: "호주 워킹홀리데이 11개월",
      },
    },
    about: {
      photoAlt: "문성온 프로필 사진",
      badges: { jlpt: "JLPT N3 준비" },
      eyebrow: "About",
      title: "기초를 다시 정확하게 다지며 성장 중인 개발자",
      text: "한국공학대학교 컴퓨터공학부 소프트웨어공학과를 졸업했고, 졸업작품 프로젝트와 학부연구생 경험을 거치며 소프트웨어를 끝까지 만들어보는 과정을 경험했습니다. 지금은 코디세이 부트캠프를 통해 HTML, CSS, JavaScript 기본기를 다시 정리하면서 실제로 배포 가능한 프론트엔드 포트폴리오를 만들고 있습니다.",
      info: {
        education: "학력: 한국공학대학교 컴퓨터공학부 소프트웨어공학과 학사, GPA 3.78 / 4.5",
        experience: "경험: 프로발 현장실습 인턴 2개월, 학부연구생 6개월",
        record: "기록: 학회 논문 투고 경험 1회, 졸업작품 프로젝트 경험",
        strength: "강점: 영어 커뮤니케이션(OPIC AL), 다양한 현장 경험, 꾸준한 학습력",
      },
      factLabel: "핵심 이력 요약",
      facts: {
        educationTitle: "Education",
        educationText: "컴퓨터공학 기반의 전공 학습과 졸업작품 경험",
        experienceTitle: "Experience",
        experienceText: "인턴, 연구실, 근로장학생, 아르바이트 경험을 통한 실무 적응력",
        globalTitle: "Global",
        globalText: "호주 워킹홀리데이 11개월과 미국 어학연수 경험",
      },
    },
    skills: {
      eyebrow: "Skills",
      title: "지금 포트폴리오에 담아갈 역량과 자산",
      listLabel: "기술 스택 목록",
      items: {
        webBasics: "HTML, CSS, JavaScript 기본기 정리",
        responsive: "Flexbox, Grid, 모바일 우선 레이아웃",
        data: "GitHub API, 상태 UI, DOM 렌더링",
        sqld: "데이터와 질의에 대한 기본 이해",
        communication: "OPIC AL, 해외 체류 경험 기반 소통 역량",
        consistency: "부트캠프와 다양한 현장 경험을 통한 꾸준함",
      },
    },
    projects: {
      eyebrow: "Projects",
      title: "실제 GitHub 저장소가 들어올 자리",
      loadingTitle: "Loading repositories...",
      loadingBody: "GitHub API에서 최신 저장소 목록을 가져오는 중입니다.",
      loadingWait: "Please wait",
      link: "Open Repository",
      updatedPrefix: "Updated",
      descriptionFallback: "저장소 설명이 아직 작성되지 않았습니다.",
      languageFallback: "Language N/A",
      emptyTitle: "표시할 프로젝트가 없습니다",
      emptyBody: "공개 저장소가 없거나 표시 조건에 맞는 프로젝트를 찾지 못했습니다.",
      errorTitle: "프로젝트를 불러오지 못했습니다",
      retry: "다시 시도",
      statusReady: "GitHub repositories ready to load",
      statusLoading: "Loading repositories...",
      statusEmpty: "No repositories found",
      statusLoaded: "Loaded {count} repositories",
      statusError: "Failed to load repositories",
      apiError: "GitHub API 요청 실패 ({status})",
      unknownError: "알 수 없는 오류가 발생했습니다.",
    },
    contact: {
      eyebrow: "Contact",
      title: "연락과 협업을 위한 기본 창구",
      text: "이 문의 영역은 이름, 이메일, 메시지를 입력할 수 있고, 잘못 입력했을 때는 바로 어떤 부분을 고쳐야 하는지 안내합니다. 정상 입력 시에는 제출 성공 메시지까지 확인할 수 있도록 구성했습니다.",
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        messageLabel: "Message",
        messagePlaceholder: "Write your message here",
        submit: "Send Message",
      },
      validation: {
        nameRequired: "이름을 입력해주세요.",
        nameShort: "이름은 2자 이상 입력해주세요.",
        emailRequired: "이메일을 입력해주세요.",
        emailInvalid: "올바른 이메일 형식으로 입력해주세요.",
        messageRequired: "메시지를 입력해주세요.",
        messageShort: "메시지는 10자 이상 입력해주세요.",
        submitError: "입력 내용을 확인한 뒤 다시 제출해주세요.",
        submitSuccess: "메시지가 정상적으로 준비되었습니다. 실제 전송 기능은 다음 단계에서 연결할 수 있습니다.",
      },
    },
    footer: {
      copyright: "© 2026 Moon's Portfolio",
      backToTop: "Back to Top",
      topButton: "Top",
      topButtonAria: "맨 위로 이동",
    },
  },
  en: {
    meta: { title: "Moon's Portfolio" },
    language: { switcherLabel: "Choose language" },
    brand: { name: "Moon's Portfolio", ariaLabel: "Go to home" },
    theme: {
      buttonLight: "Theme",
      buttonDark: "Light",
      toDark: "Switch to dark mode",
      toLight: "Switch to light mode",
    },
    menu: {
      button: "Menu",
      open: "Open menu",
      close: "Close menu",
      navLabel: "Main navigation",
    },
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Web Core And Front-end",
      title: "A front-end portfolio built on strong fundamentals and real deployment",
      text: "I am rebuilding my web foundations on top of a computer engineering background from Tech University of Korea. This page is my personal portfolio site, created through the Codyssey 4-1 mission and improved step by step from structure to responsive layout.",
      primaryAction: "View Projects",
      secondaryAction: "Contact",
      highlightsLabel: "Key highlights",
      highlights: {
        degree: "B.S. in Software Engineering",
        certificates: "SQLD / OPIC AL",
        bootcamp: "Currently in Codyssey Bootcamp",
      },
      panelLabel: "Current progress",
      phaseItems: {
        validation: "Checked accessibility and keyboard usability",
        feedback: "Organized README and deployment information",
        realtime: "Polished the final UI and interactions",
      },
      meta: {
        research: "6 months as undergraduate researcher",
        intern: "2 months internship",
        australia: "11 months working holiday in Australia",
      },
    },
    about: {
      photoAlt: "Profile photo of Moon Seong-on",
      badges: { jlpt: "Preparing for JLPT N3" },
      eyebrow: "About",
      title: "A developer growing by rebuilding the basics with precision",
      text: "I graduated in Software Engineering from Tech University of Korea, and I experienced end-to-end software development through a capstone project and undergraduate research. Now I am revisiting HTML, CSS, and JavaScript fundamentals through the Codyssey bootcamp while building a deployable front-end portfolio.",
      info: {
        education: "Education: B.S. in Software Engineering, Tech University of Korea, GPA 3.78 / 4.5",
        experience: "Experience: 2-month internship at Proval, 6 months as an undergraduate researcher",
        record: "Record: one academic paper submission and a graduation project",
        strength: "Strengths: English communication (OPIC AL), diverse field experience, steady learning habits",
      },
      factLabel: "Core background summary",
      facts: {
        educationTitle: "Education",
        educationText: "Computer engineering fundamentals with capstone project experience",
        experienceTitle: "Experience",
        experienceText: "Practical adaptability built through internships, lab work, student jobs, and part-time roles",
        globalTitle: "Global",
        globalText: "11 months of working holiday in Australia and language study experience in the U.S.",
      },
    },
    skills: {
      eyebrow: "Skills",
      title: "The strengths and assets I am building into this portfolio",
      listLabel: "Skill stack list",
      items: {
        webBasics: "Reinforcing HTML, CSS, and JavaScript fundamentals",
        responsive: "Flexbox, Grid, and mobile-first layout thinking",
        data: "GitHub API, state UI, and DOM rendering",
        sqld: "Basic understanding of data and querying",
        communication: "Communication backed by OPIC AL and overseas experience",
        consistency: "Steady habits built through bootcamp and field experience",
      },
    },
    projects: {
      eyebrow: "Projects",
      title: "Where live GitHub repositories appear",
      loadingTitle: "Loading repositories...",
      loadingBody: "Fetching the latest repositories from the GitHub API.",
      loadingWait: "Please wait",
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
      statusError: "Failed to load repositories",
      apiError: "GitHub API request failed ({status})",
      unknownError: "An unknown error occurred.",
    },
    contact: {
      eyebrow: "Contact",
      title: "A simple contact point for communication and collaboration",
      text: "This contact area lets visitors enter a name, email, and message. If something is entered incorrectly, the page immediately explains what needs to be fixed, and it also shows a success message when the input is valid.",
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        messageLabel: "Message",
        messagePlaceholder: "Write your message here",
        submit: "Send Message",
      },
      validation: {
        nameRequired: "Please enter your name.",
        nameShort: "Your name must be at least 2 characters long.",
        emailRequired: "Please enter your email.",
        emailInvalid: "Please enter a valid email address.",
        messageRequired: "Please enter your message.",
        messageShort: "Your message must be at least 10 characters long.",
        submitError: "Please review the form and try again.",
        submitSuccess: "Your message is ready. Real delivery can be connected in a later phase.",
      },
    },
    footer: {
      copyright: "© 2026 Moon's Portfolio",
      backToTop: "Back to Top",
      topButton: "Top",
      topButtonAria: "Back to top",
    },
  },
  ja: {
    meta: { title: "Moon's Portfolio" },
    language: { switcherLabel: "言語を選択" },
    brand: { name: "Moon's Portfolio", ariaLabel: "ホームへ移動" },
    theme: {
      buttonLight: "Theme",
      buttonDark: "Light",
      toDark: "ダークモードに切り替え",
      toLight: "ライトモードに切り替え",
    },
    menu: {
      button: "Menu",
      open: "メニューを開く",
      close: "メニューを閉じる",
      navLabel: "メインナビゲーション",
    },
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Web Core And Front-end",
      title: "基礎を積み上げて実際に公開するフロントエンドポートフォリオ",
      text: "韓国工学大学のコンピュータ工学の基盤の上で、Webの基礎をもう一度しっかり固めています。このページは Codyssey 4-1 ミッションを通して、構造からレスポンシブレイアウトまで段階的に完成させていく個人ポートフォリオサイトです。",
      primaryAction: "View Projects",
      secondaryAction: "Contact",
      highlightsLabel: "主なポイント",
      highlights: {
        degree: "ソフトウェア工学専攻 学士",
        certificates: "SQLD 保有 / OPIC AL",
        bootcamp: "Codyssey ブートキャンプ進行中",
      },
      panelLabel: "現在の進捗",
      phaseItems: {
        validation: "アクセシビリティとキーボード操作を点検",
        feedback: "README とデプロイ情報を整理",
        realtime: "最終 UI とインタラクションを仕上げ",
      },
      meta: {
        research: "学部研究生 6か月",
        intern: "現場実習インターン 2か月",
        australia: "オーストラリア ワーキングホリデー 11か月",
      },
    },
    about: {
      photoAlt: "ムン・ソンオンのプロフィール写真",
      badges: { jlpt: "JLPT N3 準備中" },
      eyebrow: "About",
      title: "基礎を正確に積み直しながら成長している開発者",
      text: "韓国工学大学のソフトウェア工学科を卒業し、卒業制作プロジェクトと学部研究生の経験を通して、ソフトウェアを最後まで作り上げる過程を経験しました。現在は Codyssey ブートキャンプを通して HTML、CSS、JavaScript の基礎を整理しながら、実際に公開できるフロントエンドポートフォリオを作っています。",
      info: {
        education: "学歴: 韓国工学大学 ソフトウェア工学科 学士、GPA 3.78 / 4.5",
        experience: "経験: Proval 現場実習インターン 2か月、学部研究生 6か月",
        record: "実績: 学会論文投稿 1回、卒業制作プロジェクト経験",
        strength: "強み: 英語でのコミュニケーション(OPIC AL)、多様な現場経験、継続的な学習習慣",
      },
      factLabel: "主要経歴の要約",
      facts: {
        educationTitle: "Education",
        educationText: "コンピュータ工学の基礎学習と卒業制作の経験",
        experienceTitle: "Experience",
        experienceText: "インターン、研究室、学内アルバイトなどを通じた実務適応力",
        globalTitle: "Global",
        globalText: "オーストラリアでのワーキングホリデー 11か月と米国語学研修経験",
      },
    },
    skills: {
      eyebrow: "Skills",
      title: "このポートフォリオに込めていく強みと資産",
      listLabel: "技術スタック一覧",
      items: {
        webBasics: "HTML、CSS、JavaScript の基礎を整理",
        responsive: "Flexbox、Grid、モバイルファーストのレイアウト",
        data: "GitHub API、状態 UI、DOM レンダリング",
        sqld: "データとクエリに対する基本理解",
        communication: "OPIC AL と海外経験に基づくコミュニケーション力",
        consistency: "ブートキャンプと現場経験を通じた継続力",
      },
    },
    projects: {
      eyebrow: "Projects",
      title: "実際の GitHub リポジトリが表示される場所",
      loadingTitle: "Loading repositories...",
      loadingBody: "GitHub API から最新のリポジトリ一覧を取得しています。",
      loadingWait: "Please wait",
      link: "Open Repository",
      updatedPrefix: "Updated",
      descriptionFallback: "このリポジトリにはまだ説明がありません。",
      languageFallback: "Language N/A",
      emptyTitle: "表示できるプロジェクトがありません",
      emptyBody: "公開リポジトリがないか、表示条件に合うプロジェクトが見つかりませんでした。",
      errorTitle: "プロジェクトを読み込めませんでした",
      retry: "再試行",
      statusReady: "GitHub repositories ready to load",
      statusLoading: "Loading repositories...",
      statusEmpty: "No repositories found",
      statusLoaded: "Loaded {count} repositories",
      statusError: "Failed to load repositories",
      apiError: "GitHub API リクエストに失敗しました ({status})",
      unknownError: "不明なエラーが発生しました。",
    },
    contact: {
      eyebrow: "Contact",
      title: "連絡と協業のための基本窓口",
      text: "このお問い合わせ欄では名前、メールアドレス、メッセージを入力できます。入力に問題がある場合は、どこを直せばよいかをすぐに案内し、正常な入力時には成功メッセージも表示します。",
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        messageLabel: "Message",
        messagePlaceholder: "Write your message here",
        submit: "Send Message",
      },
      validation: {
        nameRequired: "名前を入力してください。",
        nameShort: "名前は2文字以上で入力してください。",
        emailRequired: "メールアドレスを入力してください。",
        emailInvalid: "正しいメールアドレス形式で入力してください。",
        messageRequired: "メッセージを入力してください。",
        messageShort: "メッセージは10文字以上で入力してください。",
        submitError: "入力内容を確認してからもう一度送信してください。",
        submitSuccess: "メッセージの入力は正常に完了しました。実際の送信機能は次の段階で接続できます。",
      },
    },
    footer: {
      copyright: "© 2026 Moon's Portfolio",
      backToTop: "Back to Top",
      topButton: "Top",
      topButtonAria: "一番上へ移動",
    },
  },
};

let currentLanguage = "ko";

function getTranslation(key, language = currentLanguage) {
  return key
    .split(".")
    .reduce((value, segment) => value?.[segment], translations[language]);
}

function interpolate(message, values = {}) {
  if (typeof message !== "string") return "";
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message
  );
}

function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  const label = getTranslation("menu.open");
  if (label) {
    menuButton.setAttribute("aria-label", label);
  }
}

function toggleMenu() {
  if (!menuButton || !nav) return;
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  const label = getTranslation(isOpen ? "menu.close" : "menu.open");
  if (label) {
    menuButton.setAttribute("aria-label", label);
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;

  const isDark = theme === "dark";
  const textKey = isDark
    ? themeToggle.dataset.i18nDark
    : themeToggle.dataset.i18nLight;
  const ariaKey = isDark
    ? themeToggle.dataset.i18nAriaDark
    : themeToggle.dataset.i18nAriaLight;

  if (textKey) {
    const text = getTranslation(textKey);
    if (text) {
      themeToggle.textContent = text;
    }
  }

  if (ariaKey) {
    const label = getTranslation(ariaKey);
    if (label) {
      themeToggle.setAttribute("aria-label", label);
    }
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

function updateLanguageButtons() {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.languageButton === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = getTranslation("meta.title") || document.title;

  if (buildBadge) {
    buildBadge.textContent = `Build ${APP_VERSION}`;
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(element.dataset.i18n);
    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nPlaceholder);
    if (typeof value === "string") {
      element.setAttribute("placeholder", value);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nAriaLabel);
    if (typeof value === "string") {
      element.setAttribute("aria-label", value);
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nAlt);
    if (typeof value === "string") {
      element.setAttribute("alt", value);
    }
  });

  updateLanguageButtons();
  applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
}

function initLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  currentLanguage = translations[savedLanguage] ? savedLanguage : "ko";
  applyTranslations();
}

function setLanguage(language) {
  if (!translations[language]) return;
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  applyTranslations();
  closeMenu();
  loadProjects();
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
  return new Intl.DateTimeFormat(LOCALE_MAP[currentLanguage] || LOCALE_MAP.ko, {
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
    repo.description || getTranslation("projects.descriptionFallback");

  const footer = document.createElement("div");
  footer.className = "project-card__footer";

  const meta = document.createElement("div");
  meta.className = "project-card__meta";

  const language = document.createElement("span");
  language.className = "project-card__pill";
  language.textContent = repo.language || getTranslation("projects.languageFallback");

  const stars = document.createElement("span");
  stars.className = "project-card__pill";
  stars.textContent = `★ ${repo.stargazers_count}`;

  const updated = document.createElement("span");
  updated.textContent = `${getTranslation("projects.updatedPrefix")} ${formatDate(repo.pushed_at)}`;

  meta.append(language, stars, updated);

  const link = document.createElement("a");
  link.className = "project-card__link";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = getTranslation("projects.link");
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
  const article = createStateCard(getTranslation("projects.errorTitle"), message, "error");
  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "retry-button";
  retryButton.textContent = getTranslation("projects.retry");
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
      getTranslation("projects.loadingTitle"),
      getTranslation("projects.loadingBody"),
      "empty"
    )
  );
  setProjectsStatus(getTranslation("projects.statusLoading"), "loading");

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_CONFIG.username}/repos?sort=updated&per_page=${GITHUB_CONFIG.perPage}`
    );

    if (!response.ok) {
      throw new Error(
        interpolate(getTranslation("projects.apiError"), { status: response.status })
      );
    }

    const repos = await response.json();
    const selectedRepos = selectRepos(repos);

    if (selectedRepos.length === 0) {
      grid.replaceChildren(
        createStateCard(
          getTranslation("projects.emptyTitle"),
          getTranslation("projects.emptyBody"),
          "empty"
        )
      );
      setProjectsStatus(getTranslation("projects.statusEmpty"));
      return;
    }

    grid.replaceChildren(...selectedRepos.map(createProjectCard));
    setProjectsStatus(
      interpolate(getTranslation("projects.statusLoaded"), {
        count: selectedRepos.length,
      })
    );
  } catch (error) {
    grid.replaceChildren(
      createErrorCard(
        error.message || getTranslation("projects.unknownError"),
        loadProjects
      )
    );
    setProjectsStatus(getTranslation("projects.statusError"), "error");
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
    setFieldError("name", getTranslation("contact.validation.nameRequired"));
    return false;
  }

  if (value.length < 2) {
    setFieldError("name", getTranslation("contact.validation.nameShort"));
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
    setFieldError("email", getTranslation("contact.validation.emailRequired"));
    return false;
  }

  if (!EMAIL_PATTERN.test(value)) {
    setFieldError("email", getTranslation("contact.validation.emailInvalid"));
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
    setFieldError("message", getTranslation("contact.validation.messageRequired"));
    return false;
  }

  if (value.length < 10) {
    setFieldError("message", getTranslation("contact.validation.messageShort"));
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

function handleContactSubmit(event) {
  event.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    setFormStatus(getTranslation("contact.validation.submitError"), "error");
    focusFirstInvalidField();
    return;
  }

  setFormStatus(getTranslation("contact.validation.submitSuccess"), "success");
  window.portfolioElements.contactForm?.reset();
  ["name", "email", "message"].forEach((fieldName) => setFieldError(fieldName));
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
  setFormStatus(getTranslation("contact.validation.submitError"), "error");
}

if (menuButton) {
  menuButton.addEventListener("click", toggleMenu);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.languageButton);
  });
});

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

initLanguage();
initTheme();
handleScrollState();
setProjectsStatus(getTranslation("projects.statusReady"));
loadProjects();
