(() => {
  "use strict";

  const data = window.__RR_PIPELINE__;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const nodeMap = new Map(data.nodes.map((node) => [node.id, node]));
  const edgeMap = new Map(data.edges.map((edge) => [edge[0], edge]));
  const actorNames = Object.fromEntries(Object.entries(data.actors).map(([key, value]) => [key, value.label]));
  const actorCodes = { source: "SRC", script: "RUN", model: "CHECK", human: "BANKER", control: "CTRL", evidence: "EVID" };
  const dailyGateKeys = ["source", "exception", "identity", "policy", "qc", "unresolved", "qa", "release"];
  const stateLabels = {
    pass: "完成",
    reviewed: "已复核",
    released: "已更新",
    attention: "需注意",
    candidate: "候选",
    authorized: "自动核对",
    failed: "发现问题",
    hold: "HOLD",
  };

  let rrScenario = "daily";
  let rrRunToken = 0;
  let rrPaused = false;
  let rrHostActive = true;
  let rrPageVisible = !document.hidden;
  let rrVisibilityVersion = 0;
  let rrPlaybackRate = 1;
  let rrMotionEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let rrGateResolver = null;
  let rrEvents = [];
  let rrProgress = 0;
  let rrTotal = 0;
  let rrHumanHold = false;
  let rrCycleNumber = 1;
  let rrRunSerial = 0;
  let rrCurrentBranch = "daily";
  const rrDailyApprovedGates = new Set();
  let rrZoom = 1;
  const RR_ZOOM_MIN = .6;
  const RR_ZOOM_MAX = 1.4;
  const RR_ZOOM_STEP = .1;
  const RR_SPEED_MIN = .03;
  const RR_SPEED_MAX = 1;
  const RR_SPEED_DEFAULT = 1;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function edgePath(from, to) {
    const fromWidth = from.w || 142;
    const toWidth = to.w || 142;
    const fromHeight = 63;
    const toHeight = 63;
    if (to.x >= from.x) {
      const x1 = from.x + fromWidth;
      const y1 = from.y + fromHeight / 2;
      const x2 = to.x;
      const y2 = to.y + toHeight / 2;
      const bend = Math.max(36, Math.min(116, (x2 - x1) * .46));
      return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
    }
    const x1 = from.x;
    const y1 = from.y + fromHeight / 2;
    const x2 = to.x + toWidth;
    const y2 = to.y + toHeight / 2;
    const bend = Math.max(44, Math.min(126, (x1 - x2) * .46));
    return `M ${x1} ${y1} C ${x1 - bend} ${y1}, ${x2 + bend} ${y2}, ${x2} ${y2}`;
  }

  function renderNetwork() {
    const svg = $("#rr-network");
    const layer = $("#rr-node-layer");
    const wires = [];
    const charges = [];
    const travelers = [];
    for (const [id, fromId, toId, kind] of data.edges) {
      const from = nodeMap.get(fromId);
      const to = nodeMap.get(toId);
      if (!from || !to) continue;
      const d = edgePath(from, to);
      wires.push(`<path class="rr-wire" d="${d}" data-rr-wire="${escapeHtml(id)}"></path>`);
      charges.push(`<path class="rr-charge rr-edge-${escapeHtml(kind)}" d="${d}" data-rr-edge="${escapeHtml(id)}"></path>`);
      charges.push(`<path class="rr-charge rr-charge-echo rr-edge-${escapeHtml(kind)}" d="${d}" data-rr-edge="${escapeHtml(id)}"></path>`);
      travelers.push(`<path class="rr-traveler rr-edge-${escapeHtml(kind)}" pathLength="1" d="${d}" data-rr-traveler="${escapeHtml(id)}"></path>`);
    }
    svg.innerHTML = wires.join("") + charges.join("") + travelers.join("");
    layer.innerHTML = data.nodes.map((node) => `
      <button class="rr-node rr-node-${escapeHtml(node.actor)}" data-rr-node="${escapeHtml(node.id)}"
        style="--rr-x:${node.x}px;--rr-y:${node.y}px;--rr-w:${node.w || 142}px"
        aria-label="${escapeHtml(node.title)}：${escapeHtml(node.meta)}">
        <small>${escapeHtml(actorNames[node.actor])}</small>
        <strong>${escapeHtml(node.title)}</strong>
        <span>${escapeHtml(node.meta)}</span>
        <i class="rr-node-progress" aria-hidden="true"></i>
      </button>`).join("");
    $$(".rr-node", layer).forEach((button) => button.addEventListener("click", () => showInspector(button.dataset.rrNode)));
  }

  function scenarioInventory(scenario) {
    const nodeIds = new Set();
    const edgeIds = new Set();
    for (const phase of scenario.phases) {
      if (phase.items) {
        for (const [nodeId, , edges] of phase.items) {
          nodeIds.add(nodeId);
          edges.forEach((edgeId) => edgeIds.add(edgeId));
        }
      }
      if (phase.gate) {
        nodeIds.add(data.gates[phase.gate].node);
        (phase.edges || []).forEach((edgeId) => edgeIds.add(edgeId));
      }
    }
    return { nodeIds, edgeIds };
  }

  function clearRuntimeState() {
    $$(".rr-node").forEach((node) => {
      node.classList.remove("is-charging", "is-pass", "is-reviewed", "is-released", "is-attention", "is-candidate", "is-failed", "is-hold", "is-waiting", "is-authorized", "is-just-completed", "is-visited", "is-muted");
      node.removeAttribute("aria-busy");
      node.style.removeProperty("--rr-node-progress");
      node.style.removeProperty("--rr-completion-y");
      node.style.removeProperty("--rr-completion-scale");
      node.style.removeProperty("--rr-completion-brightness");
    });
    $$(".rr-charge").forEach((edge) => {
      edge.classList.remove("is-charging", "is-complete", "is-failed", "is-muted");
      edge.style.removeProperty("--rr-edge-restrained-opacity");
    });
    $$(".rr-traveler").forEach((edge) => {
      edge.classList.remove("is-traversing", "is-alerting");
      edge.style.removeProperty("--rr-edge-progress");
      edge.style.removeProperty("stroke-dashoffset");
    });
    document.body.classList.toggle("rr-paused", rrPaused);
  }

  function applyScenarioFocus(scenario) {
    const { nodeIds, edgeIds } = scenarioInventory(scenario);
    $$(".rr-node").forEach((node) => node.classList.toggle("is-muted", !nodeIds.has(node.dataset.rrNode)));
    $$(".rr-charge").forEach((edge) => edge.classList.toggle("is-muted", !edgeIds.has(edge.dataset.rrEdge)));
  }

  function renderIdleDecision() {
    $("#rr-decision-panel").innerHTML = `
      <div class="rr-decision-idle">
        <span>需要你来判断</span>
        <strong>真正需要项目经验的地方，流程才会停下来等人。</strong>
        <div class="rr-expectation-grid">
          <p><b>模型先整理</b> 全量检查、5/3/3 抽查和根因候选</p>
          <p><b>Banker 再决定</b> 问题是否成立、谁修上游、能否放行</p>
          <p><b>硬控制不变</b> 有异常就锁；对不上原始来源就继续留旧版本</p>
        </div>
      </div>`;
  }

  function setStatus(text, state) {
    $("#rr-status-text").textContent = text;
    $("#rr-status-lamp").className = state ? `is-${state}` : "";
    $("#rr-announcer").textContent = text;
  }

  function updateProgress() {
    $("#rr-progress").textContent = `DAY ${String(rrCycleNumber).padStart(2, "0")} · ${rrProgress} / ${rrTotal}`;
  }

  function setCadence(branch = "daily") {
    rrCurrentBranch = branch;
    const copy = {
      daily: "主线正在跑",
      spot: "每日 Spot Check 正在跑",
      weekly: "每周 Eval 正在跑",
    };
    $$('[data-rr-track]').forEach((track) => track.classList.toggle("is-active", track.dataset.rrTrack === branch));
    $("#rr-cycle-day").textContent = branch === "weekly" ? `WEEK · DAY ${String(rrCycleNumber).padStart(2, "0")}` : `DAY ${String(rrCycleNumber).padStart(2, "0")}`;
    $("#rr-cycle-mode").textContent = copy[branch] || copy.daily;
    $("#rr-terminal-branch").textContent = `BRANCH ${branch.toUpperCase()}`;
  }

  function appendEvent(nodeId, state, detail, human = false) {
    const node = nodeMap.get(nodeId);
    const timestamp = new Intl.DateTimeFormat("zh-HK", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
    rrEvents.push({ nodeId, state, detail, human, timestamp, branch: rrCurrentBranch });
    rrProgress += 1;
    updateProgress();
    const visible = rrEvents.slice(-12);
    $("#rr-log").innerHTML = visible.map((event, index) => {
      const eventNode = nodeMap.get(event.nodeId);
      const absoluteIndex = rrEvents.length - visible.length + index + 1;
      const rowClass = event.human ? "is-human" : event.state === "failed" ? "is-failed" : "";
      const code = actorCodes[eventNode?.actor] || "SYS";
      return `<div class="rr-log-row ${rowClass}">
        <time>${escapeHtml(event.timestamp)}<small>${String(absoluteIndex).padStart(3, "0")}</small></time>
        <div><div class="rr-log-command"><code>[${escapeHtml(code)}]</code><b>${escapeHtml(eventNode?.title || event.nodeId)}</b><em>${escapeHtml(stateLabels[event.state] || event.state)}</em></div>
        <strong>&gt; ${escapeHtml(event.detail)}</strong>
        <span>${escapeHtml(event.branch.toUpperCase())} :: ${escapeHtml(eventNode?.meta || "记录已写入")} :: TRACE-${String(absoluteIndex).padStart(4, "0")}</span></div>
      </div>`;
    }).join("");
    $("#rr-log").scrollTop = $("#rr-log").scrollHeight;
  }

  function setEdges(edgeIds, state) {
    for (const edgeId of edgeIds || []) {
      const charges = $$(`.rr-charge[data-rr-edge="${CSS.escape(edgeId)}"]`);
      const travelers = $$(`.rr-traveler[data-rr-traveler="${CSS.escape(edgeId)}"]`);
      for (const edge of charges) {
        edge.classList.remove("is-charging", "is-complete", "is-failed");
        if (state === "charging") edge.classList.add("is-charging");
        if (state === "complete") edge.classList.add("is-complete");
        if (state === "failed") edge.classList.add("is-failed");
        if (state === "gate-failed") edge.classList.add("is-charging", "is-failed");
      }
      for (const edge of travelers) {
        edge.classList.toggle("is-traversing", state === "charging" || state === "gate-failed");
        edge.classList.toggle("is-alerting", state === "gate-failed");
      }
    }
  }

  function setNodeState(nodeId, state) {
    const node = $(`.rr-node[data-rr-node="${CSS.escape(nodeId)}"]`);
    if (!node) return;
    node.classList.remove("is-charging", "is-pass", "is-reviewed", "is-released", "is-attention", "is-candidate", "is-failed", "is-hold", "is-waiting", "is-authorized", "is-just-completed");
    if (state) node.classList.add(`is-${state}`);
    if (state && !["charging", "waiting"].includes(state)) node.classList.add("is-visited");
    node.setAttribute("aria-busy", String(state === "charging"));
  }

  function scrollToNode(nodeId) {
    if (!rrMotionEnabled) return;
    const node = nodeMap.get(nodeId);
    if (!node) return;
    const map = $("#rr-map");
    const target = Math.max(0, Math.min(data.canvas.width * rrZoom - map.clientWidth, node.x * rrZoom - map.clientWidth * .48));
    map.scrollTo({ left: target, behavior: "smooth" });
  }

  function setZoom(value, options = {}) {
    const map = $("#rr-map");
    const stage = $("#rr-zoom-stage");
    const canvas = $("#rr-canvas");
    if (!map || !stage || !canvas) return;
    const next = Math.max(RR_ZOOM_MIN, Math.min(RR_ZOOM_MAX, Number(value.toFixed(2))));
    const old = rrZoom;
    const anchorX = options.anchorX ?? map.clientWidth / 2;
    const anchorY = options.anchorY ?? map.clientHeight / 2;
    const contentX = (map.scrollLeft + anchorX) / old;
    const contentY = (map.scrollTop + anchorY) / old;
    rrZoom = next;
    stage.style.width = `${Math.round(data.canvas.width * next)}px`;
    stage.style.height = `${Math.round(data.canvas.height * next)}px`;
    canvas.style.setProperty("--rr-zoom", String(next));
    $("#rr-zoom-level").textContent = `${Math.round(next * 100)}%`;
    $("#rr-zoom-out").disabled = next <= RR_ZOOM_MIN;
    $("#rr-zoom-in").disabled = next >= RR_ZOOM_MAX;
    window.requestAnimationFrame(() => {
      map.scrollTo({
        left: Math.max(0, contentX * next - anchorX),
        top: Math.max(0, contentY * next - anchorY),
        behavior: "auto",
      });
    });
  }

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function syncPlaybackVisibility() {
    rrVisibilityVersion += 1;
    document.body.classList.toggle("rr-suspended", !rrHostActive || !rrPageVisible);
  }

  document.addEventListener("visibilitychange", () => {
    rrPageVisible = !document.hidden;
    syncPlaybackVisibility();
  });
  window.addEventListener("message", (event) => {
    if (window.parent === window || event.source !== window.parent || event.origin !== window.location.origin) return;
    if (event.data?.type !== "LANE_VISIBILITY" || typeof event.data.active !== "boolean") return;
    if (rrHostActive === event.data.active) return;
    rrHostActive = event.data.active;
    syncPlaybackVisibility();
  });
  syncPlaybackVisibility();

  function runPlaybackProgress(workMilliseconds, token, onProgress = () => {}) {
    if (token !== rrRunToken) return Promise.resolve(false);
    if (workMilliseconds <= 0) {
      onProgress(1);
      return Promise.resolve(token === rrRunToken);
    }
    return new Promise((resolve) => {
      let progress = 0;
      let previous = performance.now();
      let visibilityVersion = rrVisibilityVersion;
      onProgress(0);
      const frame = (now) => {
        if (token !== rrRunToken) {
          resolve(false);
          return;
        }
        // Never count time spent in another page, including the first frame back.
        const elapsed = visibilityVersion === rrVisibilityVersion ? Math.min(80, Math.max(0, now - previous)) : 0;
        visibilityVersion = rrVisibilityVersion;
        previous = now;
        if (!rrPaused && rrHostActive && rrPageVisible) {
          progress = Math.min(1, progress + (elapsed * rrPlaybackRate) / workMilliseconds);
          onProgress(progress);
        }
        if (progress >= 1) {
          resolve(true);
          return;
        }
        window.requestAnimationFrame(frame);
      };
      window.requestAnimationFrame(frame);
    });
  }

  function rrWait(workMilliseconds, token) {
    return runPlaybackProgress(workMilliseconds, token);
  }

  function edgeTravelWork(edgeId) {
    const traveler = $(`.rr-traveler[data-rr-traveler="${CSS.escape(edgeId)}"]`);
    const length = traveler?.getTotalLength?.() || 0;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    // At the 0.09× default these work units reproduce the deliberate demo
    // envelope: desktop 5.5–13s and mobile 3.6–9s per visible edge.
    const floor = mobile ? 324 : 495;
    const ceiling = mobile ? 810 : 1170;
    const pixelsPerSecondAtOneX = mobile ? 945 : 720;
    const visibleLength = length * rrZoom;
    const distanceWork = visibleLength ? (visibleLength / pixelsPerSecondAtOneX) * 1000 : floor;
    return Math.round(Math.min(ceiling, Math.max(floor, distanceWork)));
  }

  function setEdgeProgress(edgeId, progress) {
    const bounded = Math.max(0, Math.min(1, progress));
    $$(`.rr-traveler[data-rr-traveler="${CSS.escape(edgeId)}"]`).forEach((traveler) => {
      traveler.style.setProperty("--rr-edge-progress", bounded.toFixed(4));
      traveler.style.strokeDashoffset = String(1 - bounded);
    });
    $$(`.rr-charge[data-rr-edge="${CSS.escape(edgeId)}"]`).forEach((charge) => {
      charge.style.setProperty("--rr-edge-restrained-opacity", (.18 + .72 * bounded).toFixed(3));
    });
  }

  function nodeProcessingWork() {
    return window.matchMedia("(max-width: 760px)").matches ? 216 : 288;
  }

  async function runNodeCompletion(node, token) {
    if (!node) return token === rrRunToken;
    node.classList.add("is-just-completed");
    if (!rrMotionEnabled) {
      const completed = await runPlaybackProgress(65, token);
      node.classList.remove("is-just-completed");
      return completed;
    }
    const completed = await runPlaybackProgress(65, token, (progress) => {
      const pulse = progress < .42 ? progress / .42 : (1 - progress) / .58;
      node.style.setProperty("--rr-completion-y", `${(-2 * pulse).toFixed(3)}px`);
      node.style.setProperty("--rr-completion-scale", (1 + .018 * pulse).toFixed(4));
      node.style.setProperty("--rr-completion-brightness", (1 + .24 * pulse).toFixed(3));
    });
    node.classList.remove("is-just-completed");
    node.style.removeProperty("--rr-completion-y");
    node.style.removeProperty("--rr-completion-scale");
    node.style.removeProperty("--rr-completion-brightness");
    return completed;
  }

  function scrollToPhase(phase) {
    if (!rrMotionEnabled) return;
    const firstNodeId = phase.gate ? data.gates[phase.gate].node : phase.items?.[0]?.[0];
    scrollToNode(firstNodeId);
  }

  async function traverseEdges(edgeIds, token, alert = false) {
    for (const edgeId of edgeIds || []) {
      if (token !== rrRunToken) return false;
      const work = edgeTravelWork(edgeId);
      setEdgeProgress(edgeId, 0);
      setEdges([edgeId], alert ? "gate-failed" : "charging");
      const completed = await runPlaybackProgress(work, token, (progress) => setEdgeProgress(edgeId, progress));
      if (!completed || token !== rrRunToken) return false;
      setEdges([edgeId], alert ? "failed" : "complete");
    }
    return true;
  }

  async function processNode(nodeId, finalState, token) {
    if (token !== rrRunToken) return false;
    const node = $(`.rr-node[data-rr-node="${CSS.escape(nodeId)}"]`);
    node?.style.setProperty("--rr-node-progress", "0");
    setNodeState(nodeId, "charging");
    const processed = await runPlaybackProgress(nodeProcessingWork(), token, (progress) => {
      node?.style.setProperty("--rr-node-progress", progress.toFixed(4));
    });
    if (!processed || token !== rrRunToken) return false;
    setNodeState(nodeId, finalState);
    if (finalState === "waiting") return true;
    return runNodeCompletion(node, token);
  }

  async function runItem(item, index, token) {
    const [nodeId, state, edges, detail] = item;
    await rrWait(index ? 40 : 0, token);
    if (token !== rrRunToken) return;
    scrollToNode(nodeId);
    if (!await traverseEdges(edges, token)) return;
    if (!await processNode(nodeId, state, token)) return;
    if (state === "failed") setEdges(edges, "failed");
    appendEvent(nodeId, state, detail);
  }

  function renderGate(gateKey) {
    const gate = data.gates[gateKey];
    const node = nodeMap.get(gate.node);
    const gateNumber = node?.title.match(/\d+/)?.[0] || "—";
    const gateTotal = gateNumber === "09" ? "09" : "08";
    const choices = gate.choices || [
      { label: gate.primary, action: gate.primaryAction },
      { label: gate.secondary, action: gate.secondaryAction },
    ];
    $("#rr-decision-panel").innerHTML = `
      <div class="rr-decision-card">
        <span>人工关口 ${escapeHtml(gateNumber)} / ${gateTotal} · 流程已暂停</span>
        <h3>${escapeHtml(gate.title)}</h3>
        <p class="rr-why">${escapeHtml(gate.whyNow)}</p>
        <p class="rr-operator-prompt">现在请你判断</p>
        <p class="rr-question">${escapeHtml(gate.question)}</p>
        <div class="rr-look-at">${gate.lookAt.map((item) => `<span><i>待核</i>${escapeHtml(item)}</span>`).join("")}</div>
        <div class="rr-decision-actions">
          ${choices.map((choice, index) => `<button type="button" data-rr-gate-choice="${index}" data-rr-gate-action="${escapeHtml(choice.action)}">${escapeHtml(choice.label)}</button>`).join("")}
        </div>
        <p class="rr-must-click">流程会停在这里，直到你点一个判断。</p>
        <p class="rr-accountability"><b>人把关的期待：</b>${escapeHtml(gate.expectation)}</p>
      </div>`;
    $$("[data-rr-gate-choice]", $("#rr-decision-panel")).forEach((button) => {
      button.addEventListener("click", () => {
        if (!rrGateResolver) return;
        const choice = choices[Number(button.dataset.rrGateChoice)];
        const action = choice.action;
        const label = choice.label;
        const resolver = rrGateResolver;
        rrGateResolver = null;
        $$('[data-rr-gate-choice]', $("#rr-decision-panel")).forEach((control) => { control.disabled = true; });
        document.body.classList.remove("rr-gate-paused", "rr-gate-held");
        if (!rrPaused) document.body.classList.remove("rr-paused");
        resolver({ action, label });
      }, { once: true });
    });
  }

  function renderGateTransition(gateKey, automatic = false) {
    const gate = data.gates[gateKey];
    const node = nodeMap.get(gate.node);
    const gateNumber = node?.title.match(/\d+/)?.[0] || "—";
    $("#rr-decision-panel").innerHTML = `
      <div class="rr-decision-card rr-transition-card${automatic ? " is-automatic" : ""}">
        <span>人工关口 ${escapeHtml(gateNumber)} / ${gateNumber === "09" ? "09" : "08"}</span>
        <h3>${automatic ? "本页会话已授权 · 本轮自动核对" : "人工复核通过 · 正在进入下一步"}</h3>
        <p class="rr-why">${automatic ? "这个关口已在本页会话的首轮完整流程中由人确认；本轮只重放同一演示检查，不新增授权。" : "判断和理由已经记下。接下来先沿交接路径走到下一节点，再继续处理。"}</p>
        <div class="rr-transition-line" aria-hidden="true"><i></i></div>
        <p class="rr-accountability"><b>本关判断：</b>${escapeHtml(gate.title)}</p>
      </div>`;
  }

  async function waitForHumanGate(phase, token) {
    const gate = data.gates[phase.gate];
    const nodeId = gate.node;
    const lockGate = ["source", "exception", "qc", "unresolved", "qa"].includes(phase.gate);
    const autoDailyGate = rrScenario === "daily"
      && dailyGateKeys.includes(phase.gate)
      && dailyGateKeys.every((gateKey) => rrDailyApprovedGates.has(gateKey));
    scrollToNode(nodeId);
    if (!await traverseEdges(phase.edges, token, lockGate)) return false;
    if (!await processNode(nodeId, autoDailyGate ? "authorized" : "waiting", token)) return false;
    if (autoDailyGate) {
      setEdges(phase.edges, "complete");
      renderGateTransition(phase.gate, true);
      setStatus("本页会话已授权 · 本轮自动核对", "running");
      $("#rr-phase").textContent = `已人工授权 · 自动核对 ${gate.title}`;
      appendEvent(nodeId, "authorized", `本页会话首轮已人工通过；本轮开始自动核对：${gate.title}。`);
      await rrWait(81, token);
      appendEvent(nodeId, "reviewed", `自动核对完成：${gate.title}；无需再次点击。`);
      setStatus("自动核对完成 · 下一节点正在处理", "running");
      return true;
    }
    // The run already awaits the decision promise. Freeze the ambient network
    // too, so every gate reads as a genuine stop rather than a moving backdrop.
    document.body.classList.add("rr-paused", "rr-gate-paused");
    renderGate(phase.gate);
    $("#rr-decision-panel").scrollIntoView({
      behavior: rrMotionEnabled ? "smooth" : "auto",
      block: "end",
    });
    setStatus("等你判断 · 流程已停住", lockGate ? "hold" : "waiting");
    $("#rr-phase").textContent = `等你判断 · ${gate.title}`;
    appendEvent(nodeId, lockGate ? "hold" : "attention", gate.whyNow, true);
    const decision = await new Promise((resolve) => { rrGateResolver = resolve; });
    if (token !== rrRunToken || decision.cancel) return false;
    if (decision.action === "hold") {
      setNodeState(nodeId, "hold");
      setEdges(phase.edges, "failed");
      appendEvent(nodeId, "hold", `${decision.label}；流程停在这里，旧版本继续保留。`, true);
      rrHumanHold = true;
      document.body.classList.add("rr-paused", "rr-gate-paused", "rr-gate-held");
      return false;
    }
    document.body.classList.remove("rr-gate-paused", "rr-gate-held");
    setNodeState(nodeId, "reviewed");
    setEdges(phase.edges, "complete");
    const suffix = decision.action === "continue-excluded" ? "；记录为本期不纳入，其余事实继续更新。" : "；流程继续。";
    appendEvent(nodeId, "reviewed", `${decision.label}${suffix}`, true);
    if (rrScenario === "daily" && dailyGateKeys.includes(phase.gate)) rrDailyApprovedGates.add(phase.gate);
    renderGateTransition(phase.gate);
    setStatus("人工复核通过 · 正在进入下一步", "running");
    $("#rr-phase").textContent = "人工复核通过 · 正在进入下一步";
    await rrWait(112.5, token);
    setStatus("复核完成 · 下一节点正在处理", "running");
    return true;
  }

  function totalScenarioUnits(scenario) {
    return scenario.phases.reduce((sum, phase) => sum + (phase.items?.length || 0) + (phase.gate ? 2 : 0), 0);
  }

  async function finishRun(completed, token) {
    if (rrHumanHold || !completed) {
      setStatus("HOLD · 保留旧版本", "hold");
      $("#rr-phase").textContent = "等待补证据或重新启动";
      return;
    }
    const scenario = data.scenarios[rrScenario];
    const hasReleaseOutput = scenario.phases.some((phase) =>
      phase.items?.some(([nodeId]) => nodeId === "quiet_release"));
    const isDailyLoop = rrScenario === "daily";
    setStatus(isDailyLoop ? "本日完成 · 下一工作日待启" : hasReleaseOutput ? "流程完成" : "断点已处理", "done");
    $("#rr-phase").textContent = isDailyLoop ? `第 ${rrCycleNumber} 圈完成 · 下一工作日自动再跑` : hasReleaseOutput ? "快照已受控更新" : "原检查已重跑，返回每日主循环";
    $("#rr-decision-panel").innerHTML = `
      <div class="rr-decision-idle">
        <span>${isDailyLoop ? "本日结果 · 下一圈已排队" : "本轮结果"}</span>
        <strong>${escapeHtml(scenario.outcome)}</strong>
        <div class="rr-expectation-grid">
          <p><b>回答客户</b> 项目阶段、关键日期和最新来源同屏可查</p>
          <p><b>服务执行</b> 周期、样本和 sponsor credit 统一重算</p>
          <p><b>覆盖信号</b> 地域、行业、市值与发行类型可切分观察</p>
        </div>
      </div>`;
    if (isDailyLoop) {
      await rrWait(144, token);
      if (token === rrRunToken && !rrHumanHold && rrScenario === "daily") {
        startScenario("daily", { continuation: true });
      }
    }
  }

  async function executeScenario(token) {
    const scenario = data.scenarios[rrScenario];
    for (const phase of scenario.phases) {
      if (token !== rrRunToken) return;
      setCadence(phase.branch || "daily");
      $("#rr-phase").textContent = phase.gate ? `下一步等人点击 · ${data.gates[phase.gate].title}` : phase.label;
      scrollToPhase(phase);
      if (phase.gate) {
        const proceed = await waitForHumanGate(phase, token);
        if (!proceed) {
          if (token !== rrRunToken) return;
          await finishRun(false, token);
          return;
        }
      } else {
        setStatus("流程运行中", "running");
        for (const [index, item] of phase.items.entries()) {
          await runItem(item, index, token);
          if (token !== rrRunToken) return;
        }
        await rrWait(180, token);
      }
    }
    if (token === rrRunToken) await finishRun(true, token);
  }

  function startScenario(scenarioId, options = {}) {
    if (!data.scenarios[scenarioId]) return;
    if (rrGateResolver) {
      const resolver = rrGateResolver;
      rrGateResolver = null;
      resolver({ cancel: true });
    }
    rrRunToken += 1;
    const token = rrRunToken;
    rrScenario = scenarioId;
    if (scenarioId === "daily") rrCycleNumber = options.continuation ? rrCycleNumber + 1 : 1;
    rrPaused = false;
    document.body.classList.remove("rr-paused", "rr-gate-paused", "rr-gate-held");
    $("#rr-pause").textContent = "暂停";
    $("#rr-pause").setAttribute("aria-pressed", "false");
    rrHumanHold = false;
    if (!options.continuation) rrEvents = [];
    rrProgress = 0;
    rrRunSerial += 1;
    rrTotal = totalScenarioUnits(data.scenarios[scenarioId]);
    clearRuntimeState();
    applyScenarioFocus(data.scenarios[scenarioId]);
    renderIdleDecision();
    if (!options.continuation) $("#rr-log").innerHTML = '<p>&gt; 流程准备启动；主线与旁支会按节奏依次点亮<span class="rr-cursor">_</span></p>';
    $("#rr-title").textContent = data.scenarios[scenarioId].title;
    $("#rr-phase").textContent = "准备启动";
    updateProgress();
    setCadence(scenarioId === "weekly_eval" ? "weekly" : "daily");
    $("#rr-run-id").textContent = `RUN RR-D${String(rrCycleNumber).padStart(2, "0")}-${String(rrRunSerial).padStart(3, "0")}`;
    $$(".rr-scenario").forEach((button) => button.classList.toggle("is-selected", button.dataset.rrScenario === scenarioId));
    setStatus("准备启动", "running");
    rrWait(81, token).then((ready) => {
      if (ready && token === rrRunToken) executeScenario(token);
    });
  }

  function togglePause() {
    rrPaused = !rrPaused;
    const gateFrozen = Boolean(rrGateResolver) || rrHumanHold;
    document.body.classList.toggle("rr-paused", rrPaused || gateFrozen);
    $("#rr-pause").textContent = rrPaused ? "继续" : "暂停";
    $("#rr-pause").setAttribute("aria-pressed", String(rrPaused));
    if (rrPaused) setStatus("手动暂停", "waiting");
    else if (gateFrozen) setStatus(rrHumanHold ? "HOLD · 保留旧版本" : "等待人工判断", rrHumanHold ? "hold" : "waiting");
    else setStatus("流程运行中", "running");
  }

  function formatPlaybackRate(value) {
    return `${value.toFixed(2)}×`;
  }

  function setMotionEnabled(enabled) {
    rrMotionEnabled = Boolean(enabled);
    document.body.classList.toggle("rr-motion-restrained", !rrMotionEnabled);
    $("#rr-motion-optin").checked = rrMotionEnabled;
    if (reducedMotion() && !rrMotionEnabled) {
      $("#rr-motion-note").textContent = "遵循系统“减少动态”；流程时长不变，以填充和明暗显示进度。";
    } else if (reducedMotion()) {
      $("#rr-motion-note").textContent = "本页已启用演示动效；拖动时当前步骤立即变速。";
    } else if (!rrMotionEnabled) {
      $("#rr-motion-note").textContent = "本页已收起空间动效；流程时长不变。";
    } else {
      $("#rr-motion-note").textContent = "拖动时，当前连线和节点会立即变速。";
    }
  }

  function setPlaybackRate(value, options = {}) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    if (options.motionIntent) setMotionEnabled(true);
    rrPlaybackRate = Math.max(RR_SPEED_MIN, Math.min(RR_SPEED_MAX, numeric));
    const label = formatPlaybackRate(rrPlaybackRate);
    $("#rr-speed-range").value = rrPlaybackRate.toFixed(2);
    $("#rr-speed-range").setAttribute("aria-valuetext", `${rrPlaybackRate.toFixed(2)} 倍速`);
    $("#rr-speed-summary").textContent = label;
    $("#rr-speed-output").textContent = label;
    document.documentElement.style.setProperty("--rr-playback-rate", rrPlaybackRate.toFixed(2));
    $$('[data-rr-speed-value]').forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.rrSpeedValue) === rrPlaybackRate));
    });
  }

  function toggleSpeedPanel(force) {
    const button = $("#rr-speed");
    const panel = $("#rr-speed-panel");
    const open = typeof force === "boolean" ? force : button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    if (open) $("#rr-speed-range").focus();
  }

  function showInspector(nodeId) {
    const node = nodeMap.get(nodeId);
    if (!node) return;
    $("#rr-inspector-title").textContent = node.title;
    $("#rr-inspector-actor").textContent = actorNames[node.actor];
    const gate = Object.values(data.gates).find((item) => item.node === nodeId);
    $("#rr-inspector").innerHTML = `
      <strong>${escapeHtml(node.meta)}</strong>
      <dl>
        ${gate ? `<dt>你要判断什么</dt><dd>${escapeHtml(gate.question)}</dd>` : ""}
        <dt>这一环做什么</dt><dd>${escapeHtml(node.detail)}</dd>
        <dt>不能越过的边界</dt><dd class="rr-boundary">${escapeHtml(node.boundary)}</dd>
        <dt>责任归属</dt><dd>${escapeHtml(data.actors[node.actor].note)}</dd>
      </dl>`;
  }

  function scenarioFromUrl() {
    const state = new URLSearchParams(window.location.search).get("state");
    const aliases = { success: "daily", "nlr-lag": "nlr_lag", "qc-hold": "qc_hold", failure: "qc_hold" };
    return data.scenarios[state] ? state : aliases[state] || "daily";
  }

  renderNetwork();
  setZoom(1);
  setMotionEnabled(rrMotionEnabled);
  setPlaybackRate(RR_SPEED_DEFAULT);
  $$(".rr-scenario").forEach((button) => button.addEventListener("click", () => startScenario(button.dataset.rrScenario)));
  $("#rr-pause").addEventListener("click", togglePause);
  $("#rr-restart").addEventListener("click", () => startScenario(rrScenario));
  $("#rr-speed").addEventListener("click", () => toggleSpeedPanel());
  $("#rr-speed-range").addEventListener("input", (event) => setPlaybackRate(event.currentTarget.value, { motionIntent: true }));
  $$('[data-rr-speed-value]').forEach((button) => button.addEventListener("click", () => setPlaybackRate(button.dataset.rrSpeedValue, { motionIntent: true })));
  $("#rr-speed-reset").addEventListener("click", () => setPlaybackRate(RR_SPEED_DEFAULT, { motionIntent: true }));
  $("#rr-motion-optin").addEventListener("change", (event) => setMotionEnabled(event.currentTarget.checked));
  $("#rr-zoom-out").addEventListener("click", () => setZoom(rrZoom - RR_ZOOM_STEP));
  $("#rr-zoom-in").addEventListener("click", () => setZoom(rrZoom + RR_ZOOM_STEP));
  $("#rr-zoom-reset").addEventListener("click", () => setZoom(1));
  $("#rr-map").addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom(rrZoom + (event.deltaY < 0 ? RR_ZOOM_STEP : -RR_ZOOM_STEP), {
      anchorX: event.clientX - rect.left,
      anchorY: event.clientY - rect.top,
    });
  }, { passive: false });
  $("#rr-map").addEventListener("keydown", (event) => {
    if (event.target !== event.currentTarget) return;
    if (["+", "="].includes(event.key)) {
      event.preventDefault();
      setZoom(rrZoom + RR_ZOOM_STEP);
    } else if (event.key === "-") {
      event.preventDefault();
      setZoom(rrZoom - RR_ZOOM_STEP);
    } else if (event.key === "0") {
      event.preventDefault();
      setZoom(1);
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#rr-speed").getAttribute("aria-expanded") === "true") {
      toggleSpeedPanel(false);
      $("#rr-speed").focus();
      return;
    }
    if (event.code === "Space" && !event.target.closest("button, a, input, select, textarea")) {
      event.preventDefault();
      togglePause();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".rr-speed-control")) toggleSpeedPanel(false);
  });

  const initialScenario = scenarioFromUrl();
  showInspector("policy_gate");
  startScenario(initialScenario);
})();
