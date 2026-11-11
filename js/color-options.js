/* 선택한 색상 칩의 색과 혼합 방식을 사진 위 레이어에 적용 */

document.querySelectorAll("[data-color-option]").forEach((box) => {
  const radios = box.querySelectorAll(".co-chips input");
  const pickedColor = box.querySelector("[data-picked]");
  const hint = box.querySelector(".hint");

  function applyColor(radio) {
    const tint = radio.dataset.tint || "transparent";
    const blend = radio.dataset.blend || "color";

    box.style.setProperty("--tint", tint);
    box.style.setProperty("--blend", blend);

    if (pickedColor) {
      pickedColor.textContent = radio.value;
    }
  }

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      applyColor(radio);

      if (hint) {
        hint.classList.add("is-used");
      }
    });
  });

  // 캡처할 색상을 주소의 c 값으로 고정할 수 있다. 예: ?c=2
  const query = new URLSearchParams(location.search);
  const capturedColor = query.get("c");

  if (capturedColor !== null) {
    const colorIndex = Number(capturedColor);
    const capturedRadio = radios[colorIndex];

    if (capturedRadio) {
      capturedRadio.checked = true;
      applyColor(capturedRadio);
    }
  }
});
