/*
  치수 표에 포커스하면 같은 치수선을 강조
*/

document.querySelectorAll("[data-size-guide]").forEach((box) => {
  const compareBox = box.querySelector(".cmp");
  const range = box.querySelector(".cmp input");
  const hint = box.querySelector(".hint");

  if (!compareBox || !range) {
    return;
  }

  function setPosition(value) {
    compareBox.style.setProperty("--pos", `${value}%`);
  }

  range.addEventListener("input", () => {
    setPosition(range.value);

    if (hint) {
      hint.classList.add("is-used");
    }
  });

  box.querySelectorAll("[data-dim]").forEach((button) => {
    function showDimension() {
      box.dataset.on = button.dataset.dim;
    }

    function hideDimension() {
      delete box.dataset.on;
    }

    button.addEventListener("mouseenter", showDimension);
    button.addEventListener("focus", showDimension);
    button.addEventListener("click", showDimension);
    button.addEventListener("mouseleave", hideDimension);
    button.addEventListener("blur", hideDimension);
  });

  // 캡처할 막대 위치를 주소의 sg 값으로 고정할 수 있다. 예: ?sg=30
  const query = new URLSearchParams(location.search);
  const capturedPosition = query.get("sg");

  if (capturedPosition !== null) {
    const positionNumber = Number(capturedPosition);

    if (!Number.isNaN(positionNumber)) {
      range.value = positionNumber;
    }
  }

  setPosition(range.value);
});
