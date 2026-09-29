const target = document.getElementById("morse-line");
const audio = document.getElementById("bgm");
const volumeSlider = document.getElementById("volume-slider");
const volumeReadout = document.getElementById("volume-readout");
const phaseMarks = Array.from(document.querySelectorAll(".phase-mark"));

const phrases = [
  "ー ・・・・ ・・ ・・・   ーー ・ ・・・ ・・・ ・ー ーー・ ・",
  "・・ ・・・   ・・ー・ ーーー ・ー・   ー・ーー ーーー ・・ー",
  "・ー ー・ ー・・   ーーー ー・ ・ー・・ ー・ーー   ー・ーー ーーー ・・ー",
  "・ー ・ー・・ ・ーー ・ー ー・ーー ・・・   ー・ーー ーーー ・・ー",
  "・・ー・ ーーー ・ー・ ・ ・・・ー ・ ・ー・   ー・ーー ーーー ・・ー",
  "・・   ・ー・・ ーーー ・・・ー ・   ー・ーー ーーー ・・ー",
];

const pauseFor = (chars) => {
  if (chars >= 6) return 1200;
  if (chars >= 4) return 780;
  if (chars >= 2) return 420;
  return 160;
};

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function setVolume(value) {
  if (!audio) return;
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  audio.volume = normalized / 100;
  if (volumeSlider) {
    volumeSlider.value = String(normalized);
    volumeSlider.style.setProperty("--volume-fill", `${normalized}%`);
  }
  if (volumeReadout) volumeReadout.textContent = `${normalized}%`;
}

async function attemptPlay() {
  if (!audio) return;
  setVolume(volumeSlider ? volumeSlider.value : 50);
  try {
    await audio.play();
  } catch (_) {
    return;
  }
}

function bindFirstGesture() {
  const onFirstGesture = async () => {
    await attemptPlay();
    window.removeEventListener("pointerdown", onFirstGesture);
    window.removeEventListener("pointermove", onFirstGesture);
    window.removeEventListener("keydown", onFirstGesture);
    window.removeEventListener("wheel", onFirstGesture);
    window.removeEventListener("touchstart", onFirstGesture);
  };
  window.addEventListener("pointerdown", onFirstGesture, { once: true });
  window.addEventListener("pointermove", onFirstGesture, { once: true });
  window.addEventListener("keydown", onFirstGesture, { once: true });
  window.addEventListener("wheel", onFirstGesture, { once: true });
  window.addEventListener("touchstart", onFirstGesture, { once: true });
}

async function playLoop() {
  while (target) {
    for (const [phraseIndex, sequence] of phrases.entries()) {
      target.replaceChildren();
      target.classList.remove("is-fading");
      phaseMarks.forEach((mark, index) => {
        mark.classList.toggle("is-active", index === phraseIndex);
      });
      let index = 0;

      while (index < sequence.length) {
        const current = sequence[index];

        if (current === " ") {
          let spaces = 0;
          while (sequence[index + spaces] === " ") spaces += 1;
          const spacer = document.createElement("span");
          spacer.className = `morse-symbol space${spaces >= 4 ? " word" : ""}`;
          spacer.setAttribute("aria-hidden", "true");
          target.appendChild(spacer);
          index += spaces;
          await sleep(pauseFor(spaces));
          continue;
        }

        const symbol = document.createElement("span");
        symbol.className = `morse-symbol ${current === "ー" ? "dash" : "dot"}`;
        symbol.setAttribute("aria-hidden", "true");
        target.appendChild(symbol);
        index += 1;
        await sleep(current === "ー" ? 240 : 180);
      }

      await sleep(900);
      target.classList.add("is-fading");
      await sleep(480);
    }
  }
}

playLoop();

if (audio) {
  setVolume(volumeSlider ? volumeSlider.value : 50);
  attemptPlay();
  bindFirstGesture();
}

if (volumeSlider) {
  volumeSlider.addEventListener("input", async () => {
    setVolume(volumeSlider.value);
    if (audio && audio.paused) {
      await attemptPlay();
    }
  });
}

document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && audio && audio.paused) {
    await attemptPlay();
  }
});
