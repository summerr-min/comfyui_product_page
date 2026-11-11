/* 컬러 칩 미리보기 */

(() => {
  const prefersReducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const hasNoHover = matchMedia("(hover: none)").matches;

  function runOnceWhenVisible(element, callback, threshold = 0.55) {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => {
          return entry.isIntersecting;
        });

        if (isVisible) {
          observer.disconnect();
          setTimeout(callback, 350);
        }
      },
      { threshold },
    );

    observer.observe(element);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  /* 표정 카드 표시 */

  const productCards = [...document.querySelectorAll("#s3 .pcard")];
  const faceCards = productCards.filter((card) => {
    return card.querySelector(".th .hover");
  });

  faceCards.forEach((card) => {
    const thumbnail = card.querySelector(".th");

    thumbnail.insertAdjacentHTML(
      "beforeend",
      '<span class="shots-ind" aria-hidden="true"><i></i><i></i></span>' +
        '<span class="shots-cnt" aria-hidden="true"></span>',
    );
  });

  /* 사이즈 가이드 안내 */

  const firstCompareBox = document.querySelector("#s5 .cmp");

  if (firstCompareBox) {
    firstCompareBox.insertAdjacentHTML(
      "beforeend",
      '<span class="knob-label" aria-hidden="true">← 끌어서 비교 →</span>',
    );

    const firstRange = firstCompareBox.querySelector("input");
    const userEvents = ["pointerdown", "keydown"];

    userEvents.forEach((eventName) => {
      firstRange.addEventListener(eventName, () => {
        firstCompareBox.classList.add("is-used");
      });
    });
  }

  if (prefersReducedMotion) {
    return;
  }

  /* 색상 칩 미리보기 */

  const colorBox = document.querySelector("[data-color-option]");
  const colorChips = colorBox && colorBox.querySelector(".co-chips");

  if (colorChips) {
    let shouldStopColorPreview = false;

    function stopColorPreview() {
      shouldStopColorPreview = true;
    }

    colorChips.addEventListener("pointerdown", stopColorPreview, {
      once: true,
    });
    colorChips.addEventListener("keydown", stopColorPreview, {
      once: true,
    });

    const colorRadios = [...colorChips.querySelectorAll("input")];
    const pickedColorText = colorBox.querySelector("[data-picked]");

    function showColor(radio) {
      radio.checked = true;
      colorBox.style.setProperty("--tint", radio.dataset.tint || "transparent");
      colorBox.style.setProperty("--blend", radio.dataset.blend || "color");
      pickedColorText.textContent = radio.value;
    }

    runOnceWhenVisible(colorBox, async () => {
      colorChips.classList.add("is-demo");

      // 다른 색을 모두 보여 준 뒤 첫 번째 색으로 돌아간다.
      const previewOrder = [...colorRadios.slice(1), colorRadios[0]];

      for (const radio of previewOrder) {
        if (shouldStopColorPreview) {
          break;
        }

        showColor(radio);
        await wait(850);
      }

      colorChips.classList.remove("is-demo");

      if (!shouldStopColorPreview) {
        showColor(colorRadios[0]);
      }
    });
  }

  /* 표정 카드 미리보기 */

  const productGrid = document.querySelector("#s3 .grid4");

  if (productGrid && faceCards.length > 0) {
    if (hasNoHover) {
      const touchHint = document.querySelector("#s3 .more-hd .h-touch");

      if (touchHint) {
        touchHint.textContent = "두 컷이 3초마다 번갈아 보여요";
      }

      runOnceWhenVisible(
        productGrid,
        () => {
          setInterval(() => {
            faceCards.forEach((card) => {
              card.classList.toggle("is-peek");
            });
          }, 3000);
        },
        0.3,
      );
    } else {
      let shouldStopFacePreview = false;

      function stopFacePreview() {
        shouldStopFacePreview = true;

        faceCards.forEach((card) => {
          card.classList.remove("is-peek");
        });
      }

      productGrid.addEventListener("pointerenter", stopFacePreview, {
        once: true,
      });

      runOnceWhenVisible(productGrid, async () => {
        for (const card of faceCards) {
          if (shouldStopFacePreview) {
            return;
          }

          card.classList.add("is-peek");
          await wait(1300);
          card.classList.remove("is-peek");
          await wait(250);
        }
      });
    }
  }

  /* 사이즈 가이드 미리보기 */

  const compareBox = document.querySelector("#s5 .cmp");

  if (compareBox) {
    const range = compareBox.querySelector("input");
    let shouldStopSizePreview = false;

    function stopSizePreview() {
      shouldStopSizePreview = true;
      compareBox.classList.add("is-used");
    }

    range.addEventListener("pointerdown", stopSizePreview);
    range.addEventListener("keydown", stopSizePreview);

    runOnceWhenVisible(compareBox, () => {
      const startTime = performance.now();
      const duration = 2600;

      function animateRange(currentTime) {
        if (shouldStopSizePreview) {
          return;
        }

        const progress = Math.min((currentTime - startTime) / duration, 1);

        // 막대를 50 → 78 → 22 → 50 순서로 왕복시킨다.
        const position = 50 + Math.sin(progress * Math.PI * 2) * 28;

        range.value = position;
        compareBox.style.setProperty("--pos", `${position}%`);

        if (progress < 1) {
          requestAnimationFrame(animateRange);
        }
      }

      requestAnimationFrame(animateRange);
    });
  }
})();
