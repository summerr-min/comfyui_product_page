/* 페이지 순서, 스크롤 진행률, 현재 목차, 맨 위로 버튼을 관리한다. */

(() => {
  // 긴 HTML 구조는 유지하고 결과 섹션만 화면의 첫 순서로 옮긴다.
  const main = document.querySelector(".doc main");
  const result = document.querySelector("#shop");

  if (main && result) {
    main.prepend(result);
  }

  const progressBar = document.querySelector(".progress");
  const toTopButton = document.querySelector(".to-top");
  const links = [
    ...document.querySelectorAll(".toc a, .top nav a, .section-map a"),
  ];

  const sectionIds = links.map((link) => {
    return link.getAttribute("href");
  });
  const uniqueSectionIds = [...new Set(sectionIds)];
  const sections = uniqueSectionIds
    .map((id) => {
      return document.querySelector(id);
    })
    .filter(Boolean);

  // 스크롤 중 같은 화면에서 계산이 여러 번 예약되지 않게 한다.
  let isScrollUpdatePending = false;

  function updateScrollUi() {
    if (isScrollUpdatePending) {
      return;
    }

    isScrollUpdatePending = true;

    requestAnimationFrame(() => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (progressBar) {
        const progress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        progressBar.style.setProperty("--p", progress);
      }

      if (toTopButton) {
        const shouldShowButton = window.scrollY > window.innerHeight;
        toTopButton.classList.toggle("is-show", shouldShowButton);
      }

      isScrollUpdatePending = false;
    });
  }

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  updateScrollUi();

  function markCurrentSection(sectionId) {
    links.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("is-on", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markCurrentSection(entry.target.id);
        }
      });
    },
    {
      // 화면 위쪽의 좁은 판정선을 지난 섹션을 현재 위치로 본다.
      rootMargin: "-30% 0px -65% 0px",
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  if (toTopButton) {
    toTopButton.addEventListener("click", () => {
      const prefersReducedMotion = matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }
})();
