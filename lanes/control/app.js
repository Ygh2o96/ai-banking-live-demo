(() => {
  "use strict";

  const stage = document.getElementById("loop-stage");
  const nodes = Array.from(document.querySelectorAll("[data-loop-node]"));
  const packet = document.getElementById("loop-packet");
  const status = document.getElementById("loop-status");
  const pauseButton = document.getElementById("loop-pause");
  const speedButton = document.getElementById("loop-speed");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const labels = [
    "目标已定",
    "正在看实际",
    "偏差已找到",
    "修上游，再跑一遍"
  ];

  let activeIndex = 0;
  let paused = false;
  let slow = true;
  let motionOptIn = false;
  let timer = 0;

  function fullMotionEnabled() {
    return !reducedMotion.matches || motionOptIn;
  }

  function nodeCentre(node) {
    const stageBox = stage.getBoundingClientRect();
    const nodeBox = node.getBoundingClientRect();
    return {
      x: nodeBox.left - stageBox.left + nodeBox.width / 2 - packet.offsetWidth / 2,
      y: nodeBox.top - stageBox.top + nodeBox.height / 2 - packet.offsetHeight / 2
    };
  }

  function placePacket(index, immediate = false) {
    if (!fullMotionEnabled() || window.matchMedia("(max-width: 720px)").matches) return;
    const point = nodeCentre(nodes[index]);
    packet.style.setProperty("--travel-ms", immediate ? "0ms" : `${slow ? 2400 : 1200}ms`);
    packet.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
    packet.style.opacity = "1";
  }

  function paint(index) {
    nodes.forEach((node, nodeIndex) => {
      node.classList.toggle("is-active", nodeIndex === index);
      node.classList.toggle("is-done", nodeIndex < index);
    });
    status.textContent = labels[index];
    placePacket(index);
  }

  function schedule() {
    window.clearTimeout(timer);
    if (paused || !fullMotionEnabled()) return;
    timer = window.setTimeout(() => {
      activeIndex = (activeIndex + 1) % nodes.length;
      paint(activeIndex);
      schedule();
    }, slow ? 3200 : 1700);
  }

  function setPaused(nextPaused) {
    paused = nextPaused;
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.textContent = paused ? "继续" : "暂停";
    if (paused) {
      window.clearTimeout(timer);
      packet.style.opacity = ".45";
    } else {
      packet.style.opacity = "1";
      schedule();
    }
  }

  function setReducedMotion() {
    if (reducedMotion.matches && !motionOptIn) {
      window.clearTimeout(timer);
      nodes.forEach((node) => node.classList.add("is-done"));
      nodes.forEach((node) => node.classList.remove("is-active"));
      status.textContent = "闭环四步已展开";
      pauseButton.disabled = true;
      speedButton.disabled = false;
      speedButton.textContent = "播放完整演示动效";
      speedButton.setAttribute("aria-pressed", "false");
      return;
    }
    pauseButton.disabled = false;
    speedButton.disabled = false;
    paint(activeIndex);
    schedule();
  }

  pauseButton.addEventListener("click", () => setPaused(!paused));

  speedButton.addEventListener("click", () => {
    if (reducedMotion.matches && !motionOptIn) {
      motionOptIn = true;
      document.body.classList.add("control-motion-opt-in");
      activeIndex = 0;
      slow = true;
      speedButton.setAttribute("aria-pressed", "true");
      speedButton.textContent = "慢速讲解";
      pauseButton.disabled = false;
      paint(activeIndex);
      placePacket(activeIndex, true);
      schedule();
      return;
    }
    slow = !slow;
    speedButton.setAttribute("aria-pressed", String(slow));
    speedButton.textContent = slow ? "慢速讲解" : "正常速度";
    placePacket(activeIndex, true);
    schedule();
  });

  window.addEventListener("resize", () => placePacket(activeIndex, true), { passive: true });
  reducedMotion.addEventListener("change", setReducedMotion);

  window.requestAnimationFrame(() => {
    placePacket(activeIndex, true);
    setReducedMotion();
  });
})();
