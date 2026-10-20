(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  const header = document.querySelector("[data-header]");

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeButton?.setAttribute(
      "aria-label",
      theme === "dark" ? "切换到浅色主题" : "切换到深色主题"
    );
    themeButton?.setAttribute("title", theme === "dark" ? "浅色主题" : "深色主题");
  };

  const savedTheme = localStorage.getItem("personal-site-theme");
  const preferredTheme =
    savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(preferredTheme);

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("personal-site-theme", nextTheme);
  });

  const closeMenu = () => {
    navLinks?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("is-open") || false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const postCards = Array.from(document.querySelectorAll("[data-post-card]"));
  const searchInput = document.querySelector("[data-post-search]");
  const emptyState = document.querySelector("[data-empty-state]");
  let activeFilter = "all";

  const filterPosts = () => {
    if (!postCards.length) return;
    const query = searchInput?.value.trim().toLocaleLowerCase("zh-CN") || "";
    let visibleCount = 0;

    postCards.forEach((card) => {
      const categories = (card.dataset.categories || "").split(" ");
      const haystack = `${card.dataset.search || ""} ${card.textContent}`.toLocaleLowerCase("zh-CN");
      const matchesCategory = activeFilter === "all" || categories.includes(activeFilter);
      const matchesQuery = !query || haystack.includes(query);
      const isVisible = matchesCategory && matchesQuery;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyState?.classList.toggle("is-visible", visibleCount === 0);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      filterPosts();
    });
  });

  searchInput?.addEventListener("input", filterPosts);

  const progressBar = document.querySelector("[data-reading-progress]");
  const articleBody = document.querySelector("[data-article-body]");
  if (progressBar && articleBody) {
    const updateProgress = () => {
      const articleTop = articleBody.getBoundingClientRect().top + window.scrollY;
      const articleHeight = articleBody.scrollHeight;
      const viewportHeight = window.innerHeight;
      const travelled = window.scrollY - articleTop + viewportHeight * 0.35;
      const progress = Math.min(1, Math.max(0, travelled / (articleHeight || 1)));
      progressBar.style.width = `${progress * 100}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
})();
