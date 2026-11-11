/*
  입체배너 다리부분만 골라내기 위해 만든 마스크 이미지
*/

document.querySelectorAll("[data-depth-banner]").forEach((banner) => {
  const foreground = banner.querySelector(".db-fg");
  const hint = banner.querySelector(".hint");

  if (!foreground) {
    return;
  }

  const MAX_MOVE_X = 20;
  const IDLE_DELAY = 2000;
  const AUTO_SPEED = 1400;
  const AUTO_RANGE = 0.8;
  const EASING = 0.06;

  function moveForeground(position) {
    const distance = position * MAX_MOVE_X;
    foreground.setAttribute("transform", `translate(${distance} 0)`);
  }

  // 캡처용 주소 예시: page.html?mx=-1
  const query = new URLSearchParams(location.search);

  if (query.has("mx")) {
    const fixedPosition = Number(query.get("mx"));

    if (!Number.isNaN(fixedPosition)) {
      moveForeground(fixedPosition);
    }

    if (hint) {
      hint.hidden = true;
    }

    return;
  }

  const prefersReducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    if (hint) {
      hint.hidden = true;
    }

    return;
  }

  let targetPosition = 0;
  let currentPosition = 0;
  let lastPointerMoveTime = -IDLE_DELAY;

  function draw(time) {
    // 2초간 입력이 없으면 자동으로 천천히 왕복한다.
    if (time - lastPointerMoveTime > IDLE_DELAY) {
      targetPosition = Math.sin(time / AUTO_SPEED) * AUTO_RANGE;
    }

    currentPosition += (targetPosition - currentPosition) * EASING;
    moveForeground(currentPosition);
    requestAnimationFrame(draw);
  }

  banner.addEventListener("pointermove", (event) => {
    const bannerRect = banner.getBoundingClientRect();

    // 배너 안의 포인터 위치를 -1~1 범위로 바꾼다.
    targetPosition =
      ((event.clientX - bannerRect.left) / bannerRect.width) * 2 - 1;
    lastPointerMoveTime = performance.now();

    if (hint) {
      hint.classList.add("is-used");
    }
  });

  requestAnimationFrame(draw);
});
