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
  const stateLabels = {
    pass: "完成",
    reviewed: "已复核",
    released: "已更新",
    attention: "需注意",
    candidate: "候选",
    failed: "发现问题",
    hold: "HOLD",
  };

  let rrScenario = "daily";
  let rrRunToken = 0;
  let rrPaused = false;
  let rrSpeedFactor = 7.2;
  let rrCinematicTempo = false;
  let rrGateResolver = null;
  let rrEvents = [];
  let rrProgress = 0;
  let rrTotal = 0;
  let rrHumanHold = false;
  let rrCycleNumber = 1;
  let rrRunSerial = 0;
  let rrCurrentBranch = "daily";

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
    for (const [id, fromId, toId, kind] of data.edges) {
      const from = nodeMap.get(fromId);
      const to = nodeMap.get(toId);
      if (!from || !to) continue;
      const d = edgePath(from, to);
      wires.push(`<path class="rr-wire" d="${d}" data-rr-wire="${escapeHtml(id)}"></path>`);
      charges.push(`<path class="rr-charge rr-edge-${escapeHtml(kind)}" d="${d}" data-rr-edge="${escapeHtml(id)}"></path>`);
      charges.push(`<path class="rr-charge rr-charge-echo rr-edge-${escapeHtml(kind)}" d="${d}" data-rr-edge="${escapeHtml(id)}"></path>`);
    }
    svg.innerHTML = wires.join("") + charges.join("");
    layer.innerHTML = data.nodes.map((node) => `
      <button class="rr-node rr-node-${escapeHtml(node.actor)}" data-rr-node="${escapeHtml(node.id)}"
        style="--rr-x:${node.x}px;--rr-y:${node.y}px;--rr-w:${node.w || 142}px"
        aria-label="${escapeHtml(node.title)}：${escapeHtml(node.meta)}">
        <small>${escapeHtml(actorNames[node.actor])}</small>
        <strong>${escapeHtml(node.title)}</strong>
        <span>${escapeHtml(node.meta)}</span>
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
      node.classList.remove("is-charging", "is-pass", "is-reviewed", "is-released", "is-attention", "is-candidate", "is-failed", "is-hold", "is-waiting", "is-muted");
    });
    $$(".rr-charge").forEach((edge) => edge.classList.remove("is-charging", "is-complete", "is-failed", "is-muted"));
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
        <span>需要 BANKER 判断</span>
        <strong>系统只把真正需要经验的少数问题交给人。</strong>
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
      daily: "主循环运行中",
      spot: "每日 Spot Check 旁支",
      weekly: "每周 Eval 旁支",
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
      const edges = $$(`.rr-charge[data-rr-edge="${CSS.escape(edgeId)}"]`);
      for (const edge of edges) {
        if (state === "charging") edge.classList.add("is-charging");
        if (state === "complete") edge.classList.add("is-complete");
        if (state === "failed") edge.classList.add("is-failed");
        if (state !== "charging") edge.classList.remove("is-charging");
      }
    }
  }

  function setNodeState(nodeId, state) {
    const node = $(`.rr-node[data-rr-node="${CSS.escape(nodeId)}"]`);
    if (!node) return;
    node.classList.remove("is-charging", "is-pass", "is-reviewed", "is-released", "is-attention", "is-candidate", "is-failed", "is-hold", "is-waiting");
    if (state) node.classList.add(`is-${state}`);
  }

  function sleepRaw(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function rrWait(milliseconds, token) {
    let remaining = milliseconds * rrSpeedFactor;
    while (remaining > 0 && token === rrRunToken) {
      const slice = Math.min(70, remaining);
      await sleepRaw(slice);
      if (!rrPaused) remaining -= slice;
    }
  }

  function scrollToPhase(phase) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const firstNodeId = phase.gate ? data.gates[phase.gate].node : phase.items?.[0]?.[0];
    const node = nodeMap.get(firstNodeId);
    if (!node) return;
    const map = $("#rr-map");
    const target = Math.max(0, Math.min(data.canvas.width - map.clientWidth, node.x - map.clientWidth * .42));
    map.scrollTo({ left: target, behavior: "smooth" });
  }

  async function runItem(item, index, token) {
    const [nodeId, state, edges, detail] = item;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await rrWait(reduced ? 0 : index * 650, token);
    if (token !== rrRunToken) return;
    setEdges(edges, state === "failed" ? "failed" : "charging");
    setNodeState(nodeId, "charging");
    await rrWait(reduced ? 30 : 1750 + (index % 3) * 220, token);
    if (token !== rrRunToken) return;
    setNodeState(nodeId, state);
    setEdges(edges, state === "failed" ? "failed" : "complete");
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
        if (!rrPaused) document.body.classList.remove("rr-paused");
        resolver({ action, label });
      }, { once: true });
    });
  }

  async function waitForHumanGate(phase, token) {
    const gate = data.gates[phase.gate];
    const nodeId = gate.node;
    const lockGate = ["source", "exception", "qc", "unresolved", "qa"].includes(phase.gate);
    setEdges(phase.edges, lockGate ? "failed" : "charging");
    setNodeState(nodeId, "waiting");
    // The run already awaits the decision promise. Freeze the ambient network
    // too, so every gate reads as a genuine stop rather than a moving backdrop.
    document.body.classList.add("rr-paused");
    renderGate(phase.gate);
    $("#rr-decision-panel").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "end",
    });
    setStatus("需要人工判断 · 流程已暂停", lockGate ? "hold" : "waiting");
    $("#rr-phase").textContent = `人工判断 · ${gate.title}`;
    appendEvent(nodeId, lockGate ? "hold" : "attention", gate.whyNow, true);
    const decision = await new Promise((resolve) => { rrGateResolver = resolve; });
    if (token !== rrRunToken || decision.cancel) return false;
    if (decision.action === "hold") {
      setNodeState(nodeId, "hold");
      setEdges(phase.edges, "failed");
      appendEvent(nodeId, "hold", `${decision.label}；流程停在这里，旧版本继续保留。`, true);
      rrHumanHold = true;
      document.body.classList.add("rr-paused");
      return false;
    }
    setNodeState(nodeId, "reviewed");
    setEdges(phase.edges, "complete");
    const suffix = decision.action === "continue-excluded" ? "；记录为本期不纳入，其余事实继续更新。" : "；流程继续。";
    appendEvent(nodeId, "reviewed", `${decision.label}${suffix}`, true);
    renderIdleDecision();
    setStatus("继续运行", "running");
    await rrWait(850, token);
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
      await rrWait(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 200 : 2600, token);
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
      $("#rr-phase").textContent = phase.gate ? `准备人工判断 · ${data.gates[phase.gate].title}` : phase.label;
      scrollToPhase(phase);
      if (phase.gate) {
        const proceed = await waitForHumanGate(phase, token);
        if (!proceed) {
          await finishRun(false, token);
          return;
        }
      } else {
        setStatus("流程运行中", "running");
        await Promise.all(phase.items.map((item, index) => runItem(item, index, token)));
        await rrWait(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 10 : 1100, token);
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
    document.body.classList.remove("rr-paused");
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
    window.setTimeout(() => {
      if (token === rrRunToken) executeScenario(token);
    }, 900);
  }

  function togglePause() {
    rrPaused = !rrPaused;
    document.body.classList.toggle("rr-paused", rrPaused);
    $("#rr-pause").textContent = rrPaused ? "继续" : "暂停";
    $("#rr-pause").setAttribute("aria-pressed", String(rrPaused));
    if (rrPaused) setStatus("手动暂停", "waiting");
    else if (rrGateResolver) setStatus("等待人工判断", "waiting");
    else setStatus("流程运行中", "running");
  }

  function toggleSpeed() {
    rrCinematicTempo = !rrCinematicTempo;
    rrSpeedFactor = rrCinematicTempo ? 10.5 : 7.2;
    document.documentElement.classList.toggle("rr-tempo-cinematic", rrCinematicTempo);
    $("#rr-speed").setAttribute("aria-pressed", String(rrCinematicTempo));
    $("#rr-speed b").textContent = rrCinematicTempo ? "极慢巡航 · 0.09×" : "超慢演示 · 0.14×";
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
  $$(".rr-scenario").forEach((button) => button.addEventListener("click", () => startScenario(button.dataset.rrScenario)));
  $("#rr-pause").addEventListener("click", togglePause);
  $("#rr-restart").addEventListener("click", () => startScenario(rrScenario));
  $("#rr-speed").addEventListener("click", toggleSpeed);
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !event.target.closest("button, a")) {
      event.preventDefault();
      togglePause();
    }
  });

  const initialScenario = scenarioFromUrl();
  showInspector("policy_gate");
  startScenario(initialScenario);
})();
