(() => {
  "use strict";

  const ISSUES = Object.freeze([
    {
      id: "third-party-payment",
      title: "第三方付款",
      label: "THIRD-PARTY PAYMENT",
      question: "香港 IPO 招股书如何披露客户委托第三方付款的事实、商业原因、尽调程序、整改、内控及收入真实性结论？",
      must: "存在实际第三方付款安排；披露金额或收入占比；说明核查、整改或持续内控",
      expand: "third-party payor；payment on behalf；collection arrangement；AML / KYC；fund flow",
      exclude: "纯一般性反洗钱风险；普通支付平台；没有实际交易事实的模板段落",
      roulette: true,
    },
    {
      id: "customer-supplier-overlap",
      title: "客户与供应商重叠",
      label: "CUSTOMER / SUPPLIER OVERLAP",
      question: "同一交易对手同时是客户和供应商时，香港 IPO 招股书如何证明交易独立、商业合理、定价公允，并排除循环交易或收入虚增？",
      must: "同一主体具有双重身份；存在采购和销售事实；披露金额、产品、定价或核查程序",
      expand: "overlapping customers and suppliers；separate and independent；circular trading；gross versus net",
      exclude: "仅分别出现 customer 和 supplier；一般关联交易；没有双向交易的供应链描述",
      roulette: true,
    },
    {
      id: "distributor-inventory",
      title: "经销商库存与压货",
      label: "DISTRIBUTOR INVENTORY",
      question: "香港 IPO 招股书如何用经销商库存、sell-through、退货、返利和期后销售证据回应压货及收入截止性风险？",
      must: "买断式经销；披露库存或终端销售监控；说明返利、退货或异常压货控制",
      expand: "distributor inventory；sell-through；channel stuffing；sales return；rebate；subsequent sales",
      exclude: "代销或未转移存货风险；只写经销网络规模；没有库存监控证据",
      roulette: true,
    },
    {
      id: "gross-net",
      title: "Gross vs Net",
      label: "PRINCIPAL / AGENT",
      question: "香港 IPO 招股书在贸易、平台或服务安排中，如何分析 principal-versus-agent 并支持收入按 gross basis 或 net basis 呈列？",
      must: "明确 gross / net 结论；说明控制权转移或履约责任；披露判断因素或会计师工作",
      expand: "principal versus agent；gross basis；net basis；control before transfer；inventory risk",
      exclude: "仅出现 gross margin；与收入呈列无关的代理协议；没有会计判断的业务描述",
      roulette: true,
    },
    {
      id: "cross-border-data",
      title: "跨境数据与个人信息",
      label: "CROSS-BORDER DATA",
      question: "香港 IPO 招股书如何披露个人信息、数据跨境、境外云部署、CAC 评估及上市后数据合规安排？",
      must: "存在实际数据处理或跨境场景；说明适用法规；披露合规判断、整改或控制措施",
      expand: "cross-border transfer；personal information；data localization；CAC；security assessment",
      exclude: "通用网络安全风险；只写 IT 系统；没有业务数据流或法律分析",
      roulette: true,
    },
    {
      id: "entity-list-sales",
      title: "Entity List 客户销售",
      label: "ENTITY LIST / EAR",
      question: "香港 IPO 申请人向被列入美国 Entity List 的客户销售产品时，如何披露实际交易、Footnote、EAR 适用、licence 结论、重大性及持续内控？",
      must: "客户被列入 Entity List；存在实际销售；披露产品或服务；给出 EAR / licence 分析",
      expand: "Footnote 1 / 3 / 4；FDPR；de minimis；U.S.-origin；subject to the EAR；BIS licence",
      exclude: "仅一般制裁风险；只有供应商列名；SDN 付款问题；没有实际交易；角色或 Footnote 错配",
      roulette: false,
    },
  ]);

  const VIEW_STATE = Object.freeze({
    live: "rag-live",
    engine: "rag-engine",
    results: "results",
  });
  let rouletteTimer = null;
  let rouletteFrame = null;
  let rouletteState = null;
  let selectionTimer = null;
  let rouletteAngle = 0;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildPrompt(issue) {
    return [
      "请在 40 分钟内完成一轮可以直接在香港 IPO 项目会上讲解的先例检索。",
      "",
      "【研究问题】",
      issue.question,
      "",
      "【严格纳入条件】",
      issue.must,
      "",
      "【检索扩展词】",
      issue.expand,
      "",
      "【明确排除】",
      issue.exclude,
      "",
      "【执行路径】",
      "1. 检查本地已收录的近期成功上市招股书和可用 PDF；优先最终招股书和已上市案例。",
      "2. 从关键词、中英同义表达、公司及角色别名、相关章节四个方向并行查找，先形成较宽候选池。",
      "3. 合并重复结果，补齐相邻段落，再按文件归组；避免五个候选都来自同一公司或同一套措辞。",
      "4. 回读命中段所在章节及前后文，再回到原 PDF 命中页、前后页、表格与脚注核验。",
      "5. 按事实匹配、分析完整度、披露质量和适用性筛出最多 5 个候选，交由 Banker 决定是否纳入；不足 5 个就返回实际数量。可保留 1 个重要边界案例，但不得凑数。",
      "",
      "【每个案例必须给出】",
      "- 申请人中英文名、股份代号、上市日期或状态",
      "- 与本 issue 直接相关的交易事实、对象角色与产品或服务",
      "- 招股书披露方式及关键措辞摘要",
      "- 适用法规、法律或会计判断及中介结论",
      "- 整改、停止交易、许可或持续内控（如有）",
      "- 为什么可比，以及与当前问题的关键差异",
      "- 本地文件路径、准确 PDF 页码；库内有官方 HKEX URL 时一并给出",
      "",
      "【最终输出】",
      "A. BLUF：3–5 条横向结论",
      "B. 候选证据矩阵：标注事实最接近 / 分析最完整 / 披露最可借鉴 / 关键边界对照；最终是否纳入由 Banker 决定",
      "C. 检索记录：起始问题、扩展表达、关键排除动作、证据缺口与继续追问原因",
      "D. 给项目组的 5 条可执行启示",
      "",
      "中文为主，必要的专业术语可保留英文。不要搭建新工具，不生成 Word/PDF，不启动独立复核流程。任何结论必须能回到具体招股书和页码。",
    ].join("\n");
  }

  function liveMarkup() {
    return [
      '<section class="pr-live-view" data-pr-panel="live">',
      '<header class="pr-view-head"><div><span>LIVE PRECEDENT CHALLENGE</span><h3>选一个你真正关心的问题</h3><p>问题由你定；检索从招股书原文出发，最终回到案例、页码与适用边界。</p></div><strong>1 ISSUE · 5 CASES · 40 MIN</strong></header>',
      '<div class="pr-live-grid">',
      '<section class="pr-issue-panel"><header><span>AUDIENCE PICK</span><strong>今天想检索哪一类先例？</strong></header><div id="pr-issue-grid" class="pr-issue-grid"></div></section>',
      '<section class="pr-roulette-card"><header><span>ISSUE ROULETTE</span><strong>不知道选哪个？让轮盘决定</strong></header>',
      '<div id="pr-roulette-window" class="pr-roulette-window" aria-live="polite" aria-busy="false" style="--pr-angle:0deg;--pr-duration:520ms"><div class="pr-roulette-dial" aria-hidden="true"><i style="--pr-chamber:0"></i><i style="--pr-chamber:1"></i><i style="--pr-chamber:2"></i><i style="--pr-chamber:3"></i><i style="--pr-chamber:4"></i><span></span></div><div class="pr-roulette-copy"><small data-pr-roulette-kicker>READY</small><b data-pr-roulette-title>等待启动</b><span data-pr-roulette-label>五个常见招股书议题</span></div></div>',
      '<div class="pr-roulette-controls"><button id="pr-roulette-run" class="primary-action" type="button">随机抽取一个议题</button><button id="pr-roulette-pause" class="secondary-action" type="button" aria-pressed="false" disabled>暂停轮盘</button></div></section>',
      '</div>',
      '<section class="pr-prompt-studio"><header><div><span>LIVE RESEARCH BRIEF</span><strong id="pr-selected-issue">尚未选题</strong></div><em id="pr-prompt-status" aria-live="polite">等待选择</em></header><textarea id="pr-live-prompt" readonly aria-label="现场先例检索任务书" placeholder="选择议题后，生成一份可直接执行的完整检索任务书。"></textarea><div class="pr-prompt-actions"><button id="pr-copy-prompt" class="primary-action" type="button" disabled>复制检索任务书</button><button class="secondary-action" type="button" data-pr-open-view="engine">看 RAG 引擎如何工作</button></div></section>',
      '</section>',
    ].join("");
  }

  function engineMarkup() {
    return [
      '<section class="pr-engine-view" data-pr-panel="engine" hidden>',
      '<header class="pr-view-head"><div><span>招股书 RAG · 完整流程</span><h3>先尽量找全，再逐项读准</h3><p>发现证据缺口，就继续检索；输出前再回到原始招股书页面。</p></div><div class="pr-engine-head-actions"><strong>查找 → 深读 → 原文核验</strong><button id="pr-engine-motion-toggle" class="pr-motion-toggle" type="button" aria-pressed="false">暂停动效</button></div></header>',
      '<section class="pr-query-plan"><div><span>先把问题说清楚</span><strong>定义必须出现、可以扩展和明确排除的内容</strong></div><p><b>必须出现</b> 真实交易 + 对象角色 + 议题事实</p><p><b>可以扩展</b> 中英同义词 + 法规术语 + 相邻章节</p><p class="pr-exclusion"><b>明确排除</b> 一般风险 + 角色错配 + 无交易事实</p></section>',
      '<div class="pr-engine-flow" aria-label="原文整理、广泛查找、结果合并、深读核验和最佳先例选择的五阶段证据信号流">',
      '<section class="pr-engine-zone pr-chunk-zone"><header><span>01 · 整理原文</span><strong>按章节与自然段切分</strong></header><div class="pr-document-glyph" aria-hidden="true"><i></i><i></i><i></i></div><p>标题、段落、表格、脚注和页码一起保存；每段都能回到所在章节和前后文。</p><code>每段约 350–550 词 · 保留前后文与页码</code></section>',
      '<section class="pr-engine-zone pr-fast-zone"><header><span>02 · 广泛查找</span><strong>四个方向并行找候选</strong></header><div class="pr-four-lanes"><article><b>A</b><span>精确措辞</span><small>关键词与固定短语</small></article><article><b>B</b><span>相近表达</span><small>说法不同、意思相同</small></article><article><b>C</b><span>主体别名</span><small>公司、客户代号、清单名</small></article><article><b>D</b><span>章节筛选</span><small>年份、章节、角色过滤</small></article></div><em>先尽量找全，再逐项收窄</em></section>',
      '<section class="pr-engine-zone pr-fusion-zone"><header><span>03 · 合并结果</span><strong>让四路候选可比</strong></header><div class="pr-rrf-mark"><b>Σ</b><code>按各路排名加权</code></div><ol><li>同段去重</li><li>相邻段合并</li><li>按文件归组</li><li>保留不同类型案例</li></ol><p>不同检索方式的分数口径不同，先看各路排名，再综合比较。</p></section>',
      '<section class="pr-engine-zone pr-slow-zone"><header><span>04 · 深读核验</span><strong>逐项判断是否真的可比</strong></header><ol><li><b>回读完整章节</b><span>查看前后段、表格与脚注</span></li><li><b>逐项比较相关性</b><span>把问题与完整候选放在一起判断</span></li><li><b>检查是否完整</b><span>主体、交易、分析、结论、页码</span></li><li><b>判断是否适用</b><span>角色、法规依据与事实边界</span></li></ol><code>候选 30 篇 → 深读 8 篇</code></section>',
      '<section class="pr-engine-zone pr-evidence-zone"><header><span>05 · BEST MATCH</span><strong>分类型选最佳先例</strong></header><div><article><small>CLOSEST FACTUAL</small><b>事实最接近</b></article><article><small>LEGAL ANALYSIS</small><b>分析最完整</b></article><article><small>DISCLOSURE</small><b>披露最可借鉴</b></article><article class="pr-near-miss"><small>NEAR MISS</small><b>关键边界对照</b></article></div></section>',
      '</div>',
      '<div class="pr-proof-loop"><section><header><span>证据缺口循环</span><strong>发现证据缺口，就继续检索</strong></header><ol><li><b>01</b>规划检索词</li><li><b>02</b>并行找候选</li><li><b>03</b>合并与去重</li><li><b>04</b>深读并排序</li><li><b>05</b>在文档内追问</li><li><b>06</b>回到原 PDF 页</li></ol></section><section><header><span>每周复盘</span><strong>看清案例在哪一步被漏掉</strong></header><div><p><b>第一轮没找到</b><span>检查切分、词典和候选范围</span></p><p><b>合并时掉队</b><span>检查多路结果是否合理合并</span></p><p><b>深读后排低</b><span>检查排序依据和门槛</span></p><p><b>继续追问仍没找到</b><span>检查追问路径，以及什么时候已经查够</span></p></div><footer>是否找全 · 前十是否有用 · 页码是否准确 · 是否误报 · 响应是否及时</footer></section></div>',
      '</section>',
    ].join("");
  }

  function mount() {
    const hero = document.getElementById("hero3");
    if (!hero || hero.classList.contains("pr-rag-mounted")) return;
    const rail = hero.querySelector(".precedent-rail");
    const workspace = hero.querySelector(".precedent-workspace");
    const workspaceHeader = workspace && workspace.querySelector(".workspace-header");
    if (!rail || !workspace || !workspaceHeader) return;

    hero.classList.add("pr-rag-mounted");
    rail.insertAdjacentHTML("beforeend", [
      '<div class="pr-rail-panel" data-pr-rail="live"><div class="scene-index">HERO 03 / LIVE PRECEDENT SEARCH</div><h1>你来定问题，我们用招股书原文回答。</h1><p class="scene-purpose">选择一个议题，现场生成检索任务；最终答案必须回到具体案例、披露页和适用边界。</p><div class="rail-rule"></div><div class="pr-rail-steps"><p><b>01</b><span>选择议题</span><small>观众点题或轮盘随机</small></p><p><b>02</b><span>复制任务书</span><small>5 个扎实案例 · 40 分钟</small></p><p><b>03</b><span>回到证据</span><small>招股书 · 页码 · 上下文</small></p></div></div>',
      '<div class="pr-rail-panel" data-pr-rail="engine" hidden><div class="scene-index">HERO 03 / 招股书 RAG</div><h1>先尽量找全，再逐项读准，最后回到原始证据页。</h1><p class="scene-purpose">四个方向并行查找；合并重复结果；深读候选并补齐证据，最后交由 Banker 判断。</p><div class="rail-rule"></div><div class="pr-rail-steps"><p><b>01</b><span>广泛查找</span><small>措辞 · 语义 · 别名 · 章节</small></p><p><b>02</b><span>合并去重</span><small>按排名综合比较</small></p><p><b>03</b><span>深读核验</span><small>相关性 · 完整度 · 适用性</small></p><p><b>04</b><span>回到证据</span><small>招股书原文页</small></p><p><b>05</b><span>每周复盘</span><small>追查案例在哪一步被漏掉</small></p></div></div>',
    ].join(""));

    workspaceHeader.insertAdjacentHTML("afterend", [
      '<nav class="pr-view-nav" aria-label="先例检索页面视图"><button type="button" data-pr-view="live"><b>01</b><span>现场检索</span></button><button type="button" data-pr-view="engine"><b>02</b><span>RAG 引擎</span></button><button type="button" data-pr-view="results"><b>03</b><span>案例结果</span></button></nav>',
      '<div class="pr-surface">', liveMarkup(), engineMarkup(), '</div>',
    ].join(""));

    const issueGrid = document.getElementById("pr-issue-grid");
    issueGrid.innerHTML = ISSUES.map((issue, index) => '<button type="button" data-pr-issue="' + escapeHtml(issue.id) + '" aria-pressed="false" style="--pr-issue-delay:' + (index * 75) + 'ms"><b>' + String(index + 1).padStart(2, "0") + '</b><span>' + escapeHtml(issue.title) + '</span><small>' + escapeHtml(issue.label) + '</small></button>').join("");
    bind(hero);
    const params = new URLSearchParams(location.search);
    const initialView = params.get("scene") === "hero3" && params.get("state") === "rag-engine"
      ? "engine"
      : params.get("scene") === "hero3" && ["hybrid", "results"].includes(params.get("state"))
        ? "results"
        : "live";
    setView(hero, initialView, false);
  }

  function stopRoulette() {
    if (rouletteTimer !== null) window.clearTimeout(rouletteTimer);
    if (rouletteFrame !== null) window.cancelAnimationFrame(rouletteFrame);
    rouletteTimer = null;
    rouletteFrame = null;
    rouletteState = null;
    const dial = document.querySelector("#pr-roulette-window .pr-roulette-dial");
    if (dial) {
      dial.style.removeProperty("transition");
      dial.style.removeProperty("transform");
    }
  }

  function clearPreview(hero) {
    hero.querySelectorAll("[data-pr-issue]").forEach((button) => button.classList.remove("is-roulette-preview"));
  }

  function animateIssueSelection(hero, issueId) {
    if (selectionTimer !== null) window.clearTimeout(selectionTimer);
    selectionTimer = null;
    const buttons = [...hero.querySelectorAll("[data-pr-issue]")];
    buttons.forEach((button) => button.classList.remove("is-settling"));
    if (reducedMotionQuery.matches) return;
    const selectedIndex = buttons.findIndex((button) => button.dataset.prIssue === issueId);
    if (selectedIndex < 0) return;
    buttons.forEach((button, index) => {
      button.style.setProperty("--pr-wave-delay", Math.abs(index - selectedIndex) * 55 + "ms");
    });
    void hero.offsetWidth;
    buttons.forEach((button) => button.classList.add("is-settling"));
    selectionTimer = window.setTimeout(() => {
      buttons.forEach((button) => button.classList.remove("is-settling"));
      selectionTimer = null;
    }, 900);
  }

  function setIssue(hero, issueId, source) {
    const issue = ISSUES.find((candidate) => candidate.id === issueId);
    if (!issue) return;
    hero.querySelectorAll("[data-pr-issue]").forEach((button) => {
      const selected = button.dataset.prIssue === issueId;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    animateIssueSelection(hero, issueId);
    document.getElementById("pr-selected-issue").textContent = issue.title + " · " + issue.label;
    document.getElementById("pr-prompt-status").textContent = source + " · 任务书已就绪";
    document.getElementById("pr-live-prompt").value = buildPrompt(issue);
    document.getElementById("pr-copy-prompt").disabled = false;
  }

  function paintRoulette(hero, root, issue, step, totalSteps, durationMs, locking) {
    rouletteAngle += locking ? 72 : 432;
    root.style.setProperty("--pr-angle", rouletteAngle + "deg");
    root.style.setProperty("--pr-duration", durationMs + "ms");
    root.classList.remove("is-ticking", "is-locked");
    root.classList.add("is-spinning");
    void root.offsetWidth;
    root.classList.add("is-ticking");
    root.querySelector("[data-pr-roulette-kicker]").textContent = locking ? "LOCKING" : "SPIN " + String(step + 1).padStart(2, "0") + " / " + String(totalSteps).padStart(2, "0");
    root.querySelector("[data-pr-roulette-title]").textContent = issue.title;
    root.querySelector("[data-pr-roulette-label]").textContent = issue.label;
    hero.querySelectorAll("[data-pr-issue]").forEach((button) => button.classList.toggle("is-roulette-preview", button.dataset.prIssue === issue.id));
  }

  function lockRoulette(hero, root, issue) {
    clearPreview(hero);
    root.classList.remove("is-spinning", "is-ticking", "is-paused");
    root.classList.add("is-locked");
    root.setAttribute("aria-busy", "false");
    root.setAttribute("aria-live", "polite");
    root.querySelector("[data-pr-roulette-kicker]").textContent = "SELECTED / 已锁定";
    root.querySelector("[data-pr-roulette-title]").textContent = issue.title;
    root.querySelector("[data-pr-roulette-label]").textContent = issue.label;
  }

  function resetRoulette(hero, runLabel = "随机抽取一个议题") {
    stopRoulette();
    clearPreview(hero);
    const root = document.getElementById("pr-roulette-window");
    const runButton = document.getElementById("pr-roulette-run");
    const pauseButton = document.getElementById("pr-roulette-pause");
    if (!root || !runButton || !pauseButton) return;
    root.classList.remove("is-spinning", "is-ticking", "is-locked", "is-paused");
    root.setAttribute("aria-busy", "false");
    root.setAttribute("aria-live", "polite");
    runButton.disabled = false;
    runButton.textContent = runLabel;
    pauseButton.disabled = true;
    pauseButton.textContent = "暂停轮盘";
    pauseButton.setAttribute("aria-pressed", "false");
  }

  function scheduleRoulette(state, callback, delayMs) {
    if (rouletteState !== state) return;
    if (rouletteTimer !== null) window.clearTimeout(rouletteTimer);
    state.pending = callback;
    state.remainingMs = delayMs;
    state.dueAt = performance.now() + delayMs;
    rouletteTimer = window.setTimeout(() => {
      rouletteTimer = null;
      if (rouletteState !== state || state.paused) return;
      state.pending = null;
      callback();
    }, delayMs);
  }

  function pauseRoulette() {
    const state = rouletteState;
    if (!state) return;
    const { root, pauseButton } = state;
    const dial = root.querySelector(".pr-roulette-dial");
    if (!state.paused) {
      state.paused = true;
      if (rouletteTimer !== null) window.clearTimeout(rouletteTimer);
      if (rouletteFrame !== null) window.cancelAnimationFrame(rouletteFrame);
      rouletteTimer = null;
      rouletteFrame = null;
      state.remainingMs = Math.max(0, state.dueAt - performance.now());
      const frozenTransform = window.getComputedStyle(dial).transform;
      dial.style.transition = "none";
      dial.style.transform = frozenTransform;
      root.classList.add("is-paused");
      root.setAttribute("aria-busy", "false");
      root.setAttribute("aria-live", "polite");
      root.querySelector("[data-pr-roulette-kicker]").textContent = "PAUSED / 已暂停";
      pauseButton.textContent = "继续轮盘";
      pauseButton.setAttribute("aria-pressed", "true");
      document.getElementById("pr-prompt-status").textContent = "随机轮盘已暂停";
      return;
    }

    state.paused = false;
    const resumeDelayMs = Math.max(120, state.remainingMs);
    root.style.setProperty("--pr-duration", resumeDelayMs + "ms");
    root.classList.remove("is-paused");
    root.setAttribute("aria-busy", "true");
    root.setAttribute("aria-live", "off");
    root.querySelector("[data-pr-roulette-kicker]").textContent = "RESUMING / 继续";
    pauseButton.textContent = "暂停轮盘";
    pauseButton.setAttribute("aria-pressed", "false");
    document.getElementById("pr-prompt-status").textContent = "随机轮盘继续转动 · 等待落点";
    void dial.offsetWidth;
    dial.style.removeProperty("transition");
    rouletteFrame = window.requestAnimationFrame(() => {
      rouletteFrame = null;
      if (rouletteState === state && !state.paused) dial.style.removeProperty("transform");
    });
    if (state.pending) scheduleRoulette(state, state.pending, resumeDelayMs);
  }

  function finishRoulette(state) {
    if (rouletteState !== state) return;
    const { hero, root, winner, runButton, pauseButton } = state;
    stopRoulette();
    lockRoulette(hero, root, winner);
    runButton.disabled = false;
    runButton.textContent = "再随机抽取一次";
    pauseButton.disabled = true;
    pauseButton.textContent = "暂停轮盘";
    pauseButton.setAttribute("aria-pressed", "false");
    setIssue(hero, winner.id, "随机抽取");
  }

  function runRoulette(hero) {
    resetRoulette(hero);
    const candidates = ISSUES.filter((issue) => issue.roulette);
    const values = new Uint32Array(2);
    window.crypto.getRandomValues(values);
    const winnerIndex = values[0] % candidates.length;
    const startIndex = values[1] % candidates.length;
    const winner = candidates[winnerIndex];
    const root = document.getElementById("pr-roulette-window");
    const runButton = document.getElementById("pr-roulette-run");
    const pauseButton = document.getElementById("pr-roulette-pause");
    runButton.disabled = true;
    runButton.textContent = reducedMotionQuery.matches ? "正在锁定结果" : "轮盘转动中 · 正在锁定";
    root.setAttribute("aria-busy", "true");
    root.setAttribute("aria-live", reducedMotionQuery.matches ? "polite" : "off");
    document.getElementById("pr-prompt-status").textContent = "随机轮盘转动中 · 等待落点";

    if (reducedMotionQuery.matches) {
      lockRoulette(hero, root, winner);
      runButton.disabled = false;
      runButton.textContent = "再随机抽取一次";
      pauseButton.disabled = true;
      setIssue(hero, winner.id, "随机抽取");
      return;
    }

    const offsetToWinner = (winnerIndex - startIndex + candidates.length) % candidates.length;
    const totalSteps = candidates.length * 2 + offsetToWinner + 1;
    const minimumDelayMs = 520;
    const maximumDelayMs = 1120;
    const state = {
      hero,
      root,
      winner,
      runButton,
      pauseButton,
      candidates,
      startIndex,
      totalSteps,
      minimumDelayMs,
      maximumDelayMs,
      step: 0,
      paused: false,
      pending: null,
      remainingMs: 0,
      dueAt: 0,
    };
    rouletteState = state;
    pauseButton.disabled = false;
    pauseButton.textContent = "暂停轮盘";
    pauseButton.setAttribute("aria-pressed", "false");
    const advance = () => {
      if (rouletteState !== state) return;
      const issue = state.candidates[(state.startIndex + state.step) % state.candidates.length];
      const progress = state.totalSteps <= 1 ? 1 : state.step / (state.totalSteps - 1);
      const durationMs = Math.round(state.minimumDelayMs + (state.maximumDelayMs - state.minimumDelayMs) * progress * progress);
      const locking = state.step === state.totalSteps - 1;
      paintRoulette(state.hero, state.root, issue, state.step, state.totalSteps, durationMs, locking);
      if (locking) {
        scheduleRoulette(state, () => finishRoulette(state), durationMs);
        return;
      }
      state.step += 1;
      scheduleRoulette(state, advance, durationMs);
    };
    advance();
  }

  function restartViewMotion(hero, view) {
    hero.classList.remove("pr-live-sequence", "pr-engine-sequence", "pr-results-sequence");
    if (reducedMotionQuery.matches) return;
    void hero.offsetWidth;
    if (view === "live") hero.classList.add("pr-live-sequence");
    if (view === "engine") hero.classList.add("pr-engine-sequence");
    if (view === "results") hero.classList.add("pr-results-sequence");
  }

  function syncEngineMotionControl(hero) {
    const button = document.getElementById("pr-engine-motion-toggle");
    if (!button) return;
    if (reducedMotionQuery.matches) {
      hero.classList.remove("pr-motion-paused");
      button.disabled = true;
      button.textContent = "系统已减少动效";
      button.setAttribute("aria-pressed", "true");
      return;
    }
    const paused = hero.classList.contains("pr-motion-paused");
    button.disabled = false;
    button.textContent = paused ? "继续动效" : "暂停动效";
    button.setAttribute("aria-pressed", String(paused));
  }

  function toggleEngineMotion(hero) {
    if (reducedMotionQuery.matches) return;
    hero.classList.toggle("pr-motion-paused");
    syncEngineMotionControl(hero);
  }

  function handleReducedMotionChange(hero) {
    if (reducedMotionQuery.matches && rouletteState) finishRoulette(rouletteState);
    syncEngineMotionControl(hero);
    restartViewMotion(hero, hero.dataset.prView || "live");
  }

  function updateUrl(view) {
    const url = new URL(location.href);
    url.searchParams.set("scene", "hero3");
    url.searchParams.set("state", VIEW_STATE[view]);
    history.replaceState(null, "", url);
  }

  function setView(hero, view, updateHistory = true) {
    const safeView = Object.hasOwn(VIEW_STATE, view) ? view : "live";
    if (safeView !== "live") {
      resetRoulette(hero);
    }
    hero.dataset.prView = safeView;
    hero.classList.toggle("pr-mode-live", safeView === "live");
    hero.classList.toggle("pr-mode-engine", safeView === "engine");
    hero.classList.toggle("pr-mode-results", safeView === "results");
    hero.querySelectorAll("[data-pr-view]").forEach((button) => {
      const selected = button.dataset.prView === safeView;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    hero.querySelectorAll("[data-pr-panel]").forEach((panel) => { panel.hidden = panel.dataset.prPanel !== safeView; });
    hero.querySelectorAll("[data-pr-rail]").forEach((panel) => { panel.hidden = panel.dataset.prRail !== safeView; });
    const title = document.getElementById("precedent-title");
    const eyebrow = hero.querySelector(".workspace-header .eyebrow");
    const proof = hero.querySelector(".retrieval-proof span");
    if (safeView === "live") {
      eyebrow.textContent = "现场先例检索 · LIVE PRECEDENT CHALLENGE";
      title.textContent = "问题由观众选择，答案回到招股书证据";
      proof.textContent = "1 个议题 · 5 个先例 · 40 分钟";
    } else if (safeView === "engine") {
      eyebrow.textContent = "招股书 RAG 引擎 · PROSPECTUS RETRIEVAL";
      title.textContent = "从章节切分，回到原始证据页";
      proof.textContent = "先找全 → 再读准";
    } else {
      eyebrow.textContent = "混合先例检索 · HYBRID PRECEDENT RETRIEVAL";
      title.textContent = "先把关键词查准";
      proof.textContent = "本地语义检索 · 结果回到原文页";
    }
    syncEngineMotionControl(hero);
    restartViewMotion(hero, safeView);
    if (updateHistory) updateUrl(safeView);
  }

  async function copyPrompt() {
    const prompt = document.getElementById("pr-live-prompt");
    if (!prompt || !prompt.value) return;
    try {
      await navigator.clipboard.writeText(prompt.value);
    } catch (_) {
      prompt.focus();
      prompt.select();
      document.execCommand("copy");
    }
    document.getElementById("pr-prompt-status").textContent = "已复制 · 可以开始检索";
  }

  function bind(hero) {
    hero.querySelectorAll("[data-pr-view], [data-pr-open-view]").forEach((button) => {
      button.addEventListener("click", () => setView(hero, button.dataset.prView || button.dataset.prOpenView));
    });
    hero.querySelectorAll("[data-pr-issue]").forEach((button) => {
      button.addEventListener("click", () => {
        resetRoulette(hero);
        setIssue(hero, button.dataset.prIssue, "观众选择");
      });
    });
    document.getElementById("pr-roulette-run").addEventListener("click", () => runRoulette(hero));
    document.getElementById("pr-roulette-pause").addEventListener("click", pauseRoulette);
    document.getElementById("pr-engine-motion-toggle").addEventListener("click", () => toggleEngineMotion(hero));
    document.getElementById("pr-copy-prompt").addEventListener("click", copyPrompt);
    document.querySelector('[data-scene-target="hero3"]').addEventListener("click", () => setView(hero, "live", false));
    document.getElementById("global-reset").addEventListener("click", () => {
      if (!hero.classList.contains("is-active")) return;
      hero.classList.remove("pr-motion-paused");
      resetRoulette(hero);
      setView(hero, "live");
    });
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", () => handleReducedMotionChange(hero));
    } else {
      reducedMotionQuery.addListener(() => handleReducedMotionChange(hero));
    }
  }

  function boot(attempt = 0) {
    if (window.demoReady || attempt >= 50) {
      mount();
      return;
    }
    window.setTimeout(() => boot(attempt + 1), 50);
  }

  window.addEventListener("load", () => boot(), { once: true });
  window.PROSPECTUS_RAG = Object.freeze({ issues: ISSUES, buildPrompt });
})();
