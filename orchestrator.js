(() => {
  "use strict";

  const routeContract = window.OrchestratorRoute;
  if (!routeContract) throw new Error("Orchestrator route contract failed to load");

  const LANES = Object.freeze({
    hero1: {
      panel: "panel-hero1",
      label: "财务模型已就绪",
      boundary: "当前：现场建模 · 观众选公司 · 拆清假设、联动三表、逐期配平",
    },
    hero2: {
      panel: "panel-hero2",
      label: "监管雷达已就绪",
      boundary: "当前：监管雷达 · 跟踪 HKEX / CSRC 官方披露 → Banker 定口径 → 每日 5/3/3 复核",
    },
    hero3: {
      panel: "panel-hero3",
      label: "先例检索已就绪",
      boundary: "当前：先例检索 + RAG · 观众选问题 · 找候选、比较事实、核对原文与页码",
    },
    hero4: {
      panel: "panel-hero4",
      label: "控制论方法页已就绪",
      boundary: "当前：控制与反馈 · 定要求、查结果、找原因、修复后重跑原检查",
    },
    hero5: {
      panel: "panel-hero5",
      label: "Q&A 页面已就绪",
      boundary: "当前：Question & Answer · 现场提问；扫码带走完整演示",
    },
  });

  const tabs = [...document.querySelectorAll("[data-scene]")];
  const frames = [...document.querySelectorAll("[data-lane-frame]")];
  const status = document.getElementById("orchestrator-status");
  const boundary = document.getElementById("orchestrator-boundary");
  let activeScene = "hero1";
  let cinemaTrigger = null;
  const cinemaButtons = [...document.querySelectorAll("[data-model-cinema]")];
  cinemaButtons.forEach((button) => button.addEventListener("click", () => {
    const frame = document.querySelector('[data-lane-frame="hero1"]');
    if (activeScene !== "hero1" || !frame?.contentWindow?.ModelCinema) return;
    const trigger = frame.contentDocument?.querySelector('[data-h1-teach="' + button.dataset.modelCinema + '"]');
    if (!trigger) { status.textContent = "动画暂未就绪，请重载当前演示"; return; }
    cinemaTrigger = button;
    trigger.click();
  }));

  function injectEmbedChrome(frame, scene) {
    let doc;
    try {
      doc = frame.contentDocument;
    } catch (_error) {
      return;
    }
    if (!doc || !doc.head || doc.getElementById("orchestrator-embed-style")) return;
    const style = doc.createElement("style");
    style.id = "orchestrator-embed-style";
    style.textContent = scene === "hero2"
      ? ".rr-back{display:none!important}.rr-app{min-height:100vh}.rr-topbar{top:0}"
      : ".topbar{display:none!important}.shell{grid-template-rows:minmax(0,1fr)!important;min-height:100vh!important;height:100vh!important}main{min-height:0!important;height:100vh!important}.toast-stack{top:12px!important}";
    doc.head.appendChild(style);
    doc.documentElement.dataset.orchestratedEmbed = "true";
  }

  function currentFrameUrl(frame) {
    try {
      const liveHref = frame.contentWindow && frame.contentWindow.location.href;
      if (liveHref && liveHref !== "about:blank") return new URL(liveHref, window.location.href);
    } catch (_error) {
      // Fall back to the last assigned source if a frame is not same-origin.
    }
    const assigned = frame.getAttribute("src");
    return assigned ? new URL(assigned, window.location.href) : null;
  }

  function currentFrameState(scene) {
    const frame = document.querySelector(`[data-lane-frame="${scene}"]`);
    const current = currentFrameUrl(frame);
    const state = current ? current.searchParams.get("state") : null;
    return routeContract.resolve(scene, state).state;
  }

  function frameSource(scene, state) {
    const frame = document.querySelector(`[data-lane-frame="${scene}"]`);
    const resolved = routeContract.resolve(scene, state);
    const source = new URL(frame.dataset.src, window.location.href);
    if (scene === "hero1" || scene === "hero3") {
      source.searchParams.set("scene", scene);
      source.searchParams.set("state", resolved.state);
    }
    return source;
  }

  function ensureLoaded(scene, state, forceState) {
    const frame = document.querySelector(`[data-lane-frame="${scene}"]`);
    if (!frame) return;
    if (!frame.dataset.loadBound) {
      frame.dataset.loadBound = "true";
      frame.addEventListener("load", () => {
        injectEmbedChrome(frame, scene);
        if (scene === "hero1") cinemaButtons.forEach((button) => { button.disabled = !frame.contentWindow?.ModelCinema; });
        if (scene === "hero1") document.body.classList.remove("model-cinema-open");
        frame.contentWindow?.postMessage({ type: "LANE_VISIBILITY", active: scene === activeScene }, window.location.origin);
        if (scene === activeScene) status.textContent = LANES[scene].label;
      });
    }
    const desired = frameSource(scene, state);
    const current = currentFrameUrl(frame);
    const loading = !current || (forceState && current.href !== desired.href);
    if (loading) frame.setAttribute("src", desired.href);
    return loading;
  }

  function writeRoute(scene, state, replace) {
    const route = routeContract.applyToUrl(window.location.href, scene, state);
    window.history[replace ? "replaceState" : "pushState"](null, "", route);
  }

  function activateScene(scene, options = {}) {
    const resolved = routeContract.resolve(scene, options.state);
    const normalized = resolved.scene;
    const hasExplicitState = options.state !== undefined && options.state !== null;
    const effectiveState = hasExplicitState ? resolved.state : currentFrameState(normalized);
    activeScene = normalized;
    document.body.classList.remove("model-cinema-open");
    frames.forEach((frame) => frame.contentWindow?.postMessage({ type: "LANE_VISIBILITY", active: frame.dataset.laneFrame === normalized }, window.location.origin));
    tabs.forEach((tab) => {
      const selected = tab.dataset.scene === normalized;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll(".lane-panel").forEach((panel) => {
      const selected = panel.id === LANES[normalized].panel;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
    });
    document.body.dataset.scene = normalized;
    status.textContent = "正在打开当前演示…";
    boundary.textContent = LANES[normalized].boundary;
    const loading = ensureLoaded(normalized, effectiveState, hasExplicitState);
    if (!loading) status.textContent = LANES[normalized].label;
    if (options.writeRoute !== false) writeRoute(normalized, effectiveState, Boolean(options.replace));
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateScene(tab.dataset.scene));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + tabs.length) % tabs.length;
      tabs[next].focus();
      activateScene(tabs[next].dataset.scene);
    });
  });

  document.getElementById("orchestrator-reset").addEventListener("click", () => {
    const frame = document.querySelector(`[data-lane-frame="${activeScene}"]`);
    if (!frame) return;
    const state = currentFrameState(activeScene);
    const source = frameSource(activeScene, state);
    source.searchParams.set("orchestrator_reload", String(Date.now()));
    status.textContent = "正在重新载入当前演示…";
    writeRoute(activeScene, state, true);
    frame.setAttribute("src", source.href);
  });

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    activateScene(params.get("scene"), { state: params.get("state"), replace: true });
  });

  frames.forEach((frame) => {
    frame.addEventListener("error", () => {
      if (frame.dataset.laneFrame === activeScene) status.textContent = "当前演示加载失败";
    });
  });

  const initial = new URLSearchParams(window.location.search);
  window.addEventListener("message", (event) => {
    const frame = document.querySelector('[data-lane-frame="hero1"]');
    if (event.origin !== window.location.origin || event.source !== frame?.contentWindow) return;
    if (event.data?.type !== "MODEL_CINEMA_STATE" || typeof event.data.open !== "boolean") return;
    document.body.classList.toggle("model-cinema-open", event.data.open && activeScene === "hero1");
    if (!event.data.open && activeScene === "hero1" && cinemaTrigger) {
      cinemaTrigger.focus({ preventScroll: true });
      cinemaTrigger = null;
    }
  });
  activateScene(initial.get("scene"), { state: initial.get("state"), replace: true });
})();
