(() => {
  "use strict";

  const data = window.SEED_LAB_DATA;
  const cellSeed = window.PFM_CELL_SEED_V2_AUDIENCE;
  const liveChallenge = window.LIVE_COMPANY_ROULETTE;
  const PROJECT_SEED = "project_progress";
  const seedOrder = ["project_progress", "backlog_conversion", "volume_asp_channel"];
  const stageOrder = ["company-roulette", "genesis", "seed-skeleton", "seed-binding", "seed-living", "seed-models"];
  const stageLabels = {
    "company-roulette": ["00", "现场选公司", "观众点名 / 轮盘备选"],
    genesis: ["01", "明确建模任务", "从业务问题出发"],
    "seed-skeleton": ["02", "模型骨架", "Sheet / Cell / Formula"],
    "seed-binding": ["03", "填入假设", "数值、边界与单元格"],
    "seed-living": ["04", "接通公式", "上下游关系与检查"],
    "seed-models": ["05", "业务模块", "共用完整三表底盘"],
  };
  const slotLabels = {
    identity: "项目标识 ID",
    transaction_price: "合同交易价格",
    cost_incurred_to_date: "截至当期累计发生成本",
    expected_total_cost: "最新审批预计总成本 ETC",
    expected_total_cost_version: "成本预估版本号",
    prior_expected_total_cost: "上一期预计总成本",
    prior_cumulative_revenue: "以前期间累计确认收入",
    prior_cumulative_cost: "以前期间累计确认成本",
    cumulative_billings: "累计开票金额",
    cumulative_cash_collected: "累计回款金额",
    revenue_policy_confirmed: "收入确认会计政策核验",
    milestone_status: "工程里程碑状态",
    cumulative_progress_reported: "业务申报累计进度",
  };
  const modelLabels = {
    project_progress: "项目完工进度模型 / Cost-to-complete",
    backlog_conversion: "在手订单转化模型 / Backlog Conversion",
    volume_asp_channel: "量价渠道模型 / Volume × ASP",
  };
  const seedQuestions = {
    project_progress: "经审批的项目进度依据将形成多少项目收入、成本、毛利及 working capital 敞口？",
    backlog_conversion: "已签约业务还剩多少、如何变动，确定性 backlog 以外还有哪些商业机会？",
    volume_asp_channel: "月度产品销量、ASP、渠道、区域、汇率及单位成本将形成多少收入与毛利？",
  };
  const noSeedFlow = ["原始财务输入", "标准化与映射", "权威底稿数据", "从零搭建模型结构", "新建 Excel 工作簿"];
  const withSeedFlow = ["业务依据", "已确认的假设值", "权威底稿数据", "完整模型骨架", "完整三表模型"];
  const typeLabels = { string: "文本", number: "数值", boolean: "是/否" };
  const unitLabels = {
    id: "项目 ID", CU_thousand_ex_tax: "千元演示货币（不含税）", CU_thousand: "千元演示货币",
    version: "版本号", boolean: "是/否", status: "状态", ratio: "比例",
  };
  const authorizationLabels = {
    source_bound: "来源直接绑定", banker_confirmed: "须经 Banker 确认", accountant_confirmed: "须经会计师确认",
  };
  const valueLabels = { installation_active: "安装施工中", commissioning: "调试验收中" };
  const dagNodeLabels = {
    cumulative_progress: "累计完工进度", cumulative_revenue: "累计收入", current_period_revenue: "当期收入",
    current_period_cost: "当期成本", project_gp: "项目毛利", project_gp_margin: "项目毛利率",
    unconditional_receivable_raw: "应收款原值", receivable: "应收账款", contract_asset_raw: "合同资产原值", contract_asset: "合同资产",
  };
  const controlLabels = {
    ETC_REVISION_CATCH_UP: "ETC 变更追赶调整", PROGRESS_RANGE: "完工进度范围", EXPECTED_LOSS: "合同预计损失",
  };
  const controlStatusLabels = {
    FLAG: "提示复核", PASS: "通过", FLAG_ACCOUNTANT_CONFIRMATION_REQUIRED: "提示复核 · 须经会计师确认",
  };
  const controlDetailLabels = {
    ETC_REVISION_CATCH_UP: "最新审批预计总成本与上一版估计不同；差异通过当期收入反映。",
    PROGRESS_RANGE: "计算所得完工进度位于 0%–100% 之间，未作强行截断。",
    EXPECTED_LOSS: "预计总成本高于合同交易价格；亏损合同或预计损失处理未被隐藏。",
  };

  let rouletteFallback = liveChallenge?.fallback_companies?.[0] || null;
  let rouletteSelection = rouletteFallback;
  let rouletteMode = "fallback";

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatNumber = (value, digits = 4) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value !== "number") return String(value);
    const rendered = new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(Math.abs(value));
    return value < 0 ? `−${rendered}` : rendered;
  };

  const formatPercent = (value, digits = 1) => `${value < 0 ? "−" : ""}${new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Math.abs(value) * 100)}%`;

  const formatValue = (value, unit) => {
    if (typeof value === "boolean") return value ? "已确认" : "未确认";
    if (typeof value === "number" && unit === "ratio") return formatPercent(value, 1);
    if (typeof value === "string" && valueLabels[value]) return valueLabels[value];
    return formatNumber(value);
  };

  const mappingReason = (mapping) => mapping.state === "BOUND_WITH_CONFLICT"
    ? "已采用权威度最高且获授权的数值，同时在界面保留来源冲突。"
    : mapping.state === "BOUND"
      ? "来源权威度、单位及授权状态均符合绑定要求。"
      : humanState(mapping.state);

  const ownerLabel = (value) => ({ banker: "Banker", accountant: "会计师" }[value] || value);

  const outputUnit = (seedId, nodeId) => {
    const node = data.seeds[seedId].formula_lineage.nodes.find((candidate) => candidate.node_id === nodeId);
    if (!node) throw new Error(`缺少输出单位：${seedId}.${nodeId}`);
    return node.output_unit;
  };

  const formatAudienceCurrency = (value, unit) => {
    const policies = {
      CU_thousand: { multiplier: 1000, label: "演示货币" },
      CU_thousand_ex_tax: { multiplier: 1000, label: "演示货币（不含税）" },
      RC: { multiplier: 1, label: "演示报告货币" },
    };
    const policy = policies[unit];
    if (!policy) throw new Error(`观众版不支持该货币单位：${unit}`);
    const baseValue = value * policy.multiplier;
    const magnitude = Math.abs(baseValue);
    const scale = magnitude >= 1000000
      ? { divisor: 1000000, suffix: "m", digits: 2 }
      : magnitude >= 1000
        ? { divisor: 1000, suffix: "k", digits: magnitude >= 100000 ? 0 : 1 }
        : { divisor: 1, suffix: "", digits: 0 };
    const numberText = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: scale.digits,
      maximumFractionDigits: scale.digits,
    }).format(magnitude / scale.divisor);
    return `${baseValue < 0 ? "−" : ""}${numberText}${scale.suffix} ${policy.label}`;
  };

  const technicalEvidence = (entries) => `<details class="model-technical-evidence"><summary>精准底稿依据</summary><div>${entries.map((entry) => `<code data-raw-output-key="${escapeHtml(entry.key)}" data-raw-output-value="${escapeHtml(String(entry.value))}" data-output-unit="${escapeHtml(entry.unit)}">${escapeHtml(`${entry.key} = ${String(entry.value)} ${entry.unit}`)}</code>`).join("")}</div></details>`;

  const sourceLabel = (value) => {
    const map = {
      operating_schedule: "运营排期表 / Operating Schedule",
      business_chapter: "业务与技术章节 / Business Chapter",
      management_discussion: "管理层讨论 / Management Discussion",
    };
    return map[value] || String(value || "未注明来源").replaceAll("_", " ");
  };
  const humanState = (value) => ({
    BOUND: "已成功绑定",
    BOUND_WITH_CONFLICT: "保留源端冲突",
    BLOCKED_CONFIRMATION: "阻断 — 缺少人工确认",
    BLOCKED_UNIT: "阻断 — 单位不匹配",
    BLOCKED_TYPE: "阻断 — 数据类型不匹配",
    MISSING: "缺失",
    OPTIONAL_MISSING: "选填项 — 未提供",
  }[value] || String(value || "未知").replaceAll("_", " "));

  const conceptForKey = (conceptKey) => data.concept_pack.concepts.find((row) => row.concept_key === conceptKey);

  function stageNav(active) {
    return `<nav class="genesis-stage-nav" aria-label="模型生成阶段">${stageOrder.map((state) => {
      const [number, label, note] = stageLabels[state];
      return `<button type="button" data-genesis-state="${state}" class="${state === active ? "is-active" : ""}" aria-current="${state === active ? "step" : "false"}"><b>${number}</b><span>${escapeHtml(label)}</span><small>${escapeHtml(note)}</small></button>`;
    }).join("")}</nav>`;
  }

  function stateHeader(kicker, title, note, badge) {
    return `<header class="genesis-state-header"><div><span>${escapeHtml(kicker)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(note)}</p></div>${badge ? `<strong>${escapeHtml(badge)}</strong>` : ""}</header>`;
  }

  function shell(active, body) {
    return `${stageNav(active)}<div class="genesis-state" data-genesis-state-panel="${active}">${body}</div>`;
  }

  function safeOutputSlug(company) {
    return String(company.ticker || company.name_cn || "AUDIENCE_PICK")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "AUDIENCE_PICK";
  }

  function buildLivePrompt(company, fallback, mode) {
    const audiencePick = mode === "audience";
    const sourceInstruction = audiencePick
      ? "这是观众现场点名对象，尚未预检。先完成下述 3 分钟可行性门槛；不得默认代码、市场或报告期。"
      : `该对象已纳入演示后备池。官方入口：${company.source_portal_url}`;
    const selectedIdentity = audiencePick
      ? `${company.name_cn}｜市场提示：${company.market}｜股票代码需由你从官方披露确认`
      : `${company.name_cn} / ${company.name_en}｜${company.ticker}｜${company.market}｜报告货币 ${company.reporting_currency}`;
    const outputSlug = safeOutputSlug(company);
    return `40 分钟现场任务：为一家真实上市公司搭建可直接打开的 Excel 财务预测模型。每项预测都要有依据，公式可逐格追踪，利润表、资产负债表和现金流量表互相联动；本轮不写长报告。

【现场对象】
首选公司：${selectedIdentity}
对象状态：${sourceInstruction}
后备公司：${fallback.name_cn} / ${fallback.name_en}｜${fallback.ticker}｜${fallback.market}
后备官方入口：${fallback.source_portal_url}

【资料和范围】
1. 只使用公开资料。优先级固定为：交易所 / 法定披露平台原始公告与完整报告 > 公司 IR 页面上的同一原始文件 > 其他来源。不得用财经网站摘要替代原始报表，不得编造缺失值。
2. 首选公司如属于银行、保险、券商、地产、矿业勘探、pre-revenue、生物科技无商业化收入，或年结日非 12 月 31 日，或 2023–2025 年报与 2026H1 完整报告任一无法在开始后 3 分钟内从官方来源定位，立即切换到上述后备公司，不要继续搜索。
3. 所有数值用计算工具或 Excel 公式计算。保留币种和原报告单位；除非披露要求，不做无依据汇率换算。
4. 本轮只交付模型文件和一页来源说明，不扩展为 PPT、网页或长报告。非关键问题按最稳妥的公开口径处理，并在限制项中写明。

【标准模型底盘】
沿用现场演示的标准三表模板。模板只提供工作表结构、公式联动、预测驱动和检查机制；其中所有演示数值、公司名和期间都必须替换，不得冒充真实资料。保留三表、营运资金、固定资产、债务、税项、权益及检查表的联动关系；只删去对该公司明显不适用的业务模块。

【40 分钟执行节奏】
0–3 分钟｜锁定主体与来源
- 从官方文件确认法定公司名、ticker、交易所、报告货币、12 月年结日。
- 定位并保存 2023、2024、2025 年报，以及 2026H1 完整中期报告。若 2026H1 只有业绩公告而无完整报告，按上述规则切换后备公司。

3–10 分钟｜录入历史数据与来源
- 录入 2023A、2024A、2025A 三年 P&L / BS / CFS；录入 2026H1A，并读取附注中的分部收入、成本、应收、存货、应付、PPE、债务、税项、股利及少数股东权益。
- 每个历史录入数都要保存来源文件、发布日期、页码 / 表名、原单位和 URL。若新报告重列比较数，以最新重列数优先，并保留差异说明。

10–17 分钟｜建立预测依据
- 收入：优先按公司披露的产品、业务或地区拆分；披露不足时才使用整体增长率。2026E–2028E 的每条增长率都要写明依据，包括历史趋势、2026H1 实际、管理层公开指引，以及订单、客户、产能或价格信息。
- 2026E 必须等于 2026H1A + H2E。H2E 参考历史下半年季节性、公开指引和已披露经营信号；不得无依据地直接用 2×H1。
- 销售成本 / 毛利率、销售费用、管理费用、研发费用和其他经营收支分开预测，不把所有费用合成一个比例。
- 营运资金：DSO = 平均应收 / 收入 × 天数；DIO = 平均存货 / 销售成本 × 天数；DPO = 平均应付 / 销售成本 × 天数。半年期统一使用 181 / 182 天口径，并写明分母。
- 资本开支与固定资产：期初固定资产 + 资本开支 − 折旧 − 处置 / 减值 / 汇兑影响 = 期末固定资产；资本开支依据历史强度、产能计划和公司指引。
- 债务与利息：期初债务 + 新增借款 − 实际偿还 + 其他变动 = 期末债务；偿债金额受现金底线和可用额度约束，利息按平均债务和披露利率测算。
- 税项与权益：税费、应交税项和现金税款互相联动；净利润、股利、其他综合收益及少数股东权益滚入期末权益。

17–32 分钟｜完成公式联动的 Excel
- 列至少覆盖 2023A、2024A、2025A、2026H1A、2026E、2027E、2028E。
- Workbook 至少保留：Cover、Source_Ledger、Assumptions、Revenue、Opex、Working_Capital、PPE、Debt_Interest、Tax_Equity、P&L、BS、CFS、Checks。
- 历史数据必须有出处；预测输入只放在 Assumptions 或明细表；三张主表的预测数全部引用明细表，不得手工写死。
- 现金流量表期末现金必须等于资产负债表现金；留存收益、固定资产、债务、应交税项和营运资金都要逐期滚动。不得用现金、其他资产、其他负债或权益作人为配平项。
- “其他”项目只有在不重大时才可按历史占比或固定余额预测，并写明依据；绝不能用来填平差额。

32–38 分钟｜完成交付前检查
- 逐年检查利润表加总、资产 − 负债 − 权益 = 0、现金流量表期末现金 = 资产负债表现金，以及留存收益、营运资金天数、固定资产、债务和税项滚动。
- 检查无 #REF! / #DIV/0! / #VALUE!、无外部工作簿链接、无预测结果手工写死、无隐藏配平项。
- 若 35 分钟仍未闭合，先把不重大明细合并到有来源的类别，再修正公式关系；不得用人为配平项。把尚未解决的问题写进 Checks，不得假装完成。

38–40 分钟｜交付
- 交付两份文件：${outputSlug}_THREE_STATEMENT_MODEL_2028E.xlsx，以及一页来源与假设说明。
- Excel 打开后应完成公式重算。一页说明只写公司、期间、币种、官方来源、核心预测依据、检查结果和明确限制。
- 交付时说明三表是否配平、用了哪些核心预测依据、还有哪些问题未解决。`;
  }

  function randomCompanyIndex(length) {
    if (!length) return 0;
    if (window.crypto?.getRandomValues) {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      return buffer[0] % length;
    }
    return Math.floor(Math.random() * length);
  }

  function applyChallengeSelection(company, mode) {
    rouletteSelection = company;
    rouletteMode = mode;
    const isAudience = mode === "audience";
    const title = document.getElementById("roulette-selected-name");
    const meta = document.getElementById("roulette-selected-meta");
    const note = document.getElementById("roulette-selected-note");
    const link = document.getElementById("roulette-source-link");
    const prompt = document.getElementById("roulette-prompt");
    const state = document.getElementById("roulette-readiness");
    if (!title || !prompt) return;
    title.textContent = isAudience ? company.name_cn : `${company.name_cn} · ${company.ticker}`;
    meta.textContent = isAudience ? `${company.market} · 股票代码在 3 分钟预检中确认` : `${company.market} · ${company.sector} · ${company.reporting_currency}`;
    note.textContent = isAudience ? "先看官方资料是否齐全；不适合普通三表，就换用轮盘备选。" : company.driver_hint;
    state.textContent = isAudience ? "等待 3 分钟预检" : "四期官方报告已预检";
    state.className = `roulette-readiness ${isAudience ? "is-live" : "is-ready"}`;
    link.hidden = isAudience;
    if (!isAudience) {
      link.href = company.source_portal_url;
      link.textContent = `${company.source_portal_label} ↗`;
    }
    document.querySelectorAll(".roulette-chamber").forEach((node) => node.classList.toggle("is-selected", node.dataset.companyId === company.id));
    prompt.value = buildLivePrompt(company, rouletteFallback, mode);
  }

  async function copyLivePrompt() {
    const prompt = document.getElementById("roulette-prompt");
    const button = document.getElementById("copy-live-prompt");
    const status = document.getElementById("roulette-action-status");
    if (!prompt || !button) return;
    try {
      await navigator.clipboard.writeText(prompt.value);
    } catch (_error) {
      prompt.focus();
      prompt.select();
      document.execCommand("copy");
    }
    button.textContent = "已复制｜可以开始建模";
    status.textContent = `已复制 ${prompt.value.length.toLocaleString("en-US")} 字符；40 分钟建模任务随时可启动。`;
    window.setTimeout(() => { button.textContent = "复制 40 分钟建模任务书"; }, 2600);
  }

  function renderCompanyRoulette(target) {
    const companies = liveChallenge.fallback_companies;
    const initial = rouletteSelection || companies[0];
    const body = `
      ${stateHeader("LIVE COMPANY CHALLENGE · 40 MINUTES", "你点一家公司，我们现场开建", "A 股或港股都可以。先用公开资料快速确认，再用 40 分钟生成一套真实三表 Excel。", "2023A–2026H1A → 2028E")}
      <div class="roulette-layout">
        <section class="audience-pick ruled-panel">
          <div class="genesis-panel-head"><span>01 / 你来点名</span><strong>选一家 A 股或港股上市公司</strong></div>
          <label for="audience-company">公司名称或股票代码</label>
          <div class="audience-input-row"><input id="audience-company" type="text" autocomplete="off" placeholder="例如：美的集团 / 000333.SZ"><select id="audience-market" aria-label="市场"><option value="A股或港股">自动识别</option><option value="A股">A股</option><option value="港股">港股</option></select></div>
          <button id="lock-audience-company" class="primary-action" type="button">就选这家公司</button>
          <p>我们先看公开资料是否齐全、是否适合普通三表；三分钟内不合适，就换一家备选。</p>
          <div class="roulette-divider"><span>没有提名？</span></div>
          <button id="spin-company-roulette" class="roulette-spin" type="button"><span>交给轮盘</span><strong>从六家备选中随机抽取</strong></button>
        </section>
        <section class="roulette-wheel-panel ruled-panel" aria-label="六家公司后备轮盘">
          <div class="genesis-panel-head"><span>02 / 六格轮盘</span><strong>六家公司，随机抽一家</strong></div>
          <div class="roulette-wheel" id="roulette-wheel">${companies.map((company, index) => `<button type="button" class="roulette-chamber" data-company-id="${escapeHtml(company.id)}" data-company-index="${index}" style="--slot:${index}"><b>0${index + 1}</b><span>${escapeHtml(company.name_cn)}</span><small>${escapeHtml(company.ticker)}</small></button>`).join("")}<div class="roulette-hub"><span>40</span><small>MIN</small></div></div>
          <div class="roulette-source-badges"><span>2023 AR</span><span>2024 AR</span><span>2025 AR</span><span>2026 H1</span></div>
        </section>
        <section class="roulette-delivery ruled-panel">
          <div class="genesis-panel-head"><span>03 / 开始建模</span><strong>复制任务书，立即开工</strong></div>
          <div class="roulette-selected-card"><div><span id="roulette-readiness" class="roulette-readiness"></span><h4 id="roulette-selected-name"></h4><p id="roulette-selected-meta"></p></div><p id="roulette-selected-note"></p><a id="roulette-source-link" target="_blank" rel="noopener"></a></div>
          <textarea id="roulette-prompt" readonly spellcheck="false" aria-label="40 分钟现场财务模型任务书"></textarea>
          <button id="copy-live-prompt" class="primary-action" type="button">复制 40 分钟建模任务书</button>
          <small id="roulette-action-status">交付：真实三表 Excel + 一页来源与假设说明；本轮不做独立复核。</small>
        </section>
      </div>`;
    target.innerHTML = shell("company-roulette", body);
    document.querySelectorAll(".roulette-chamber").forEach((button) => button.addEventListener("click", () => {
      rouletteFallback = companies[Number(button.dataset.companyIndex)];
      applyChallengeSelection(rouletteFallback, "fallback");
    }));
    document.getElementById("lock-audience-company").addEventListener("click", () => {
      const input = document.getElementById("audience-company");
      const market = document.getElementById("audience-market").value;
      const value = input.value.trim();
      if (!value) {
        document.getElementById("roulette-action-status").textContent = "请先输入公司名称或股票代码；也可以直接让轮盘选一家。";
        input.focus();
        return;
      }
      applyChallengeSelection({ id: "audience-pick", name_cn: value, ticker: "待确认", market, sector: "待确认", reporting_currency: "待确认" }, "audience");
    });
    document.getElementById("spin-company-roulette").addEventListener("click", () => {
      const button = document.getElementById("spin-company-roulette");
      const chambers = [...document.querySelectorAll(".roulette-chamber")];
      button.disabled = true;
      button.classList.add("is-spinning");
      let tick = 0;
      const stopAt = 18 + randomCompanyIndex(7);
      const targetIndex = randomCompanyIndex(companies.length);
      const timer = window.setInterval(() => {
        chambers.forEach((node) => node.classList.remove("is-spinning"));
        chambers[tick % chambers.length].classList.add("is-spinning");
        tick += 1;
        if (tick < stopAt) return;
        window.clearInterval(timer);
        chambers.forEach((node) => node.classList.remove("is-spinning"));
        rouletteFallback = companies[targetIndex];
        applyChallengeSelection(rouletteFallback, "fallback");
        button.disabled = false;
        button.classList.remove("is-spinning");
        document.getElementById("roulette-action-status").textContent = `已随机抽中 ${rouletteFallback.name_cn}；任务书已切换至 ${rouletteFallback.ticker}。`;
      }, 52);
    });
    document.getElementById("copy-live-prompt").addEventListener("click", copyLivePrompt);
    applyChallengeSelection(initial, rouletteMode);
  }

  function renderGenesis(target) {
    const statements = data.concept_pack.display_statements.slice(0, 5);
    const body = `
      ${stateHeader("模型搭建路径 · MODEL BUILD", "两条搭建路径，一个证据标准", "没有现成底盘，可以从零搭建；有标准底盘，就从一套已经配平的完整模型结构开始。", "底稿事实 ≠ 模型结构")}
      <div class="genesis-overview-grid">
        <section class="genesis-business ruled-panel">
          <div class="genesis-panel-head"><span>业务是怎么说的</span><strong>先看原始依据，再明确模型要回答什么</strong></div>
          <ol>${statements.map((row, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><p>${escapeHtml(row.text)}</p><em>${escapeHtml(sourceLabel(row.source_type))}</em></li>`).join("")}</ol>
        </section>
        <section class="genesis-paths ruled-panel" data-testid="genesis-paths">
          <div class="genesis-panel-head"><span>构建路径选择</span><strong>选择模型架构，但不改变业务事实</strong></div>
          <div class="path-ledger">
            <article data-build-path="no-seed"><span>路径 A · 从零搭建</span><h4>按目标公司重新搭表</h4><p>从标准化输入出发，搭出一套公式联动的新工作簿。</p><ol>${noSeedFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><strong>适合业务结构特殊、没有合适底盘的项目</strong></article>
            <article data-build-path="with-seed"><span>路径 B · 沿用标准底盘</span><h4>从完整三表模板起步 · 当前演示路径</h4><p>业务结构匹配时，沿用已经定义工作表、单元格、公式关系和检查规则的完整三表底盘。</p><ol>${withSeedFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><strong>结构可直接执行；填充值全部为合成演示数据</strong></article>
          </div>
        </section>
      </div>
      <div class="genesis-five-stage" data-testid="five-stage-story">
        <div><b>01</b><span>业务诉求</span><small>梳理核心概念与缺口</small></div>
        <div><b>02</b><span>模型骨架</span><small>Sheet / Cell / Formula 蓝图</small></div>
        <div><b>03</b><span>填入假设</span><small>替换已确认的输入值</small></div>
        <div><b>04</b><span>接通公式</span><small>保留上下游关系与检查</small></div>
        <div><b>05</b><span>模型运转</span><small>三表、排期与控制共同重算</small></div>
      </div>
      <p class="genesis-boundary">底稿事实是唯一输入依据。缺失、冲突或未确认的内容，在模型里原样保留，不会凭空补齐。</p>`;
    target.innerHTML = shell("genesis", body);
  }

  function renderLegacySkeleton(target) {
    const seed = data.seeds[PROJECT_SEED];
    const anatomy = [
      ["骨架标识", `${modelLabels[PROJECT_SEED]} · v${seed.version}`, seedQuestions[PROJECT_SEED]],
      ["待填业务项", `${seed.required_concept_slots.length} 个待填项目`, "仅定义数据类型、允许单位与授权角色"],
      ["细到什么程度", "项目 × 期间", `${seed.driver_registry_schema.driver_fields.length} 个可复用变量字段`],
      ["公式依赖图", `${seed.formula_lineage.nodes.length} 个计算节点`, "加 / 减 / 乘 / 除 / max(0, x)"],
      ["控制与防线", `${seed.bounds_control_policy.length} 条控制规则`, `${seed.failure_anti_pattern_checks.length} 项反模式拦截检查`],
      ["授权复核机制", "Banker 与 会计师协同", seed.authorization_confirmation_rules.relaxation_allowed ? "允许放宽" : "禁止静默放宽"],
    ];
    const body = `
      ${stateHeader("项目完工进度模型骨架", "一套不带公司数据的模型结构", "标准底盘给出可复用的业务项目、公式关系、检查规则与授权机制；本身不含任何企业数据。", `${seed.required_concept_slots.length} 个待填项目 · ${seed.formula_lineage.nodes.length} 个计算节点`)}
      <div class="seed-skeleton-grid">
        <section class="seed-anatomy ruled-panel" aria-label="Project Progress seed anatomy">
          <div class="genesis-panel-head"><span>语义结构解析</span><strong>清晰规范的结构定义，拒绝概念包装</strong></div>
          <div class="anatomy-ledger">${anatomy.map(([label, value, note]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><p>${escapeHtml(note)}</p></article>`).join("")}</div>
          <div class="dag-strip" aria-label="十节点公式依赖图">${seed.formula_lineage.nodes.map((node, index) => `<span data-dag-node="${escapeHtml(node.node_id)}"><b>${String(index + 1).padStart(2, "0")}</b><span data-dag-label="${escapeHtml(node.node_id)}">${escapeHtml(dagNodeLabels[node.node_id] || node.node_id)}</span></span>`).join("")}</div>
        </section>
        <section class="seed-slot-register ruled-panel">
          <div class="genesis-panel-head"><span>待填业务项</span><strong>全部 ${seed.required_concept_slots.length} 项必需业务概念</strong></div>
          <ol>${seed.required_concept_slots.map((slot, index) => `<li data-seed-slot="${escapeHtml(slot.slot_id)}"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(slotLabels[slot.slot_id] || slot.slot_id)}</span><small>${escapeHtml(`${typeLabels[slot.type] || slot.type} · ${slot.allowed_units.map((unit) => unitLabels[unit] || unit).join("/")} · ${authorizationLabels[slot.authorization] || slot.authorization}`)}</small></li>`).join("")}</ol>
          <div class="seed-integrity"><strong>不含企业私有数据</strong><p>该模型骨架仅包含可复用计算语法；不包含任何发行人、客户、项目、产品或基准数据。</p><button id="open-raw-seed" class="secondary-action" type="button">查看 7,068 字符模型骨架摘要</button></div>
        </section>
      </div>
      <div id="seed-drawer-scrim" class="seed-drawer-scrim" hidden></div>
      <aside id="seed-raw-drawer" class="seed-raw-drawer" aria-hidden="true" aria-label="项目完工进度模型骨架底稿"><header><div><span>演示结构文件</span><strong>project_progress.seed.json · 模型骨架</strong><p class="seed-drawer-sub" style="margin:2px 0 0;font-size:12px;color:#8a7a60">演示数据 · 非真实项目 · 不可用于决策 · 内部底稿保留原始文件摘要</p></div><button id="close-raw-seed" type="button">关闭</button></header><pre id="seed-raw-text"></pre></aside>`;
    target.innerHTML = shell("seed-skeleton", body);
    document.getElementById("seed-raw-text").textContent = data.seed_raw[PROJECT_SEED];
    wireRawDrawer();
  }

  function projectMappings() {
    const entities = data.models[PROJECT_SEED].fit.entities;
    const entity = entities.find((row) => row.entity_id === "PRJ-A1") || entities[0];
    const mappings = entity ? entity.mappings.slice() : [];
    const selectedIndex = Math.max(0, mappings.findIndex((row) => row.slot_id === "cumulative_progress_reported"));
    return { entity, mappings, selectedIndex };
  }

  function renderBindingDetail(mapping, index) {
    const target = document.getElementById("seed-binding-detail");
    if (!target || !mapping) return;
    document.querySelectorAll(".seed-slot-button").forEach((button) => {
      const selected = Number(button.dataset.slotIndex) === index;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const record = mapping.record;
    const concept = conceptForKey(mapping.concept_key);
    const candidates = concept?.candidates || [];
    const owner = ownerLabel(record?.confirmation_owner) || (record?.requires_confirmation ? "未分配" : "来源已绑定");
    const stateClass = mapping.state === "BOUND_WITH_CONFLICT" ? "is-conflict" : mapping.state.startsWith("BLOCKED") || mapping.state === "MISSING" ? "is-blocked" : "is-bound";
    const conflict = candidates.length > 1 ? `<section class="binding-conflict" data-testid="binding-conflict"><header><strong>保留源端冲突 · 须经 Banker 人工确认</strong><span>${candidates.length} 个来源数据候选</span></header>${candidates.map((candidate) => `<div data-conflict-source="${escapeHtml(candidate.source_type)}"><span>${escapeHtml(`${sourceLabel(candidate.source_type)} · ${candidate.reference} · 权威度 ${candidate.source_rank}`)}</span><b>${escapeHtml(formatValue(candidate.value, candidate.unit))}</b><small>${candidate.confirmed ? "已确认来源" : "待人工确认"}</small></div>`).join("")}</section>` : "";
    target.className = `seed-binding-detail ${stateClass}`;
    target.dataset.slotId = mapping.slot_id;
    target.innerHTML = `
      <header><div><span>选定槽位 ${String(index + 1).padStart(2, "0")}</span><h4>${escapeHtml(slotLabels[mapping.slot_id] || mapping.slot_id)}</h4></div><strong>${escapeHtml(humanState(mapping.state))}</strong></header>
      <div class="binding-story">
        <article><small>1 · 空白槽位</small><strong>${escapeHtml(slotLabels[mapping.slot_id] || mapping.slot_id)}</strong><p>模型骨架中不含任何公司具体数值。</p></article>
        <article><small>2 · 按权威度排序的概念</small><strong>${record ? escapeHtml(`${sourceLabel(record.source_type)} · ${record.reference}`) : "无来源匹配"}</strong><p>${escapeHtml(mappingReason(mapping))}</p></article>
        <article><small>3 · SSOT 数值 / 阻断标记</small><strong>${record ? escapeHtml(formatValue(record.value, record.unit)) : "槽位保持空白"}</strong><p>${record ? "授权取值；数据冲突在界面保持可见。" : escapeHtml(humanState(mapping.state))}</p></article>
      </div>
      <dl class="binding-audit" data-testid="binding-audit">
        <div><dt>来源类型</dt><dd>${record ? escapeHtml(sourceLabel(record.source_type)) : "—"}</dd></div>
        <div><dt>出处索引</dt><dd>${record ? escapeHtml(record.reference) : "—"}</dd></div>
        <div><dt>期间 / 单位</dt><dd>${record ? escapeHtml(`${record.period} / ${unitLabels[record.unit] || record.unit}`) : "—"}</dd></div>
        <div><dt>权威度排序</dt><dd>${record ? escapeHtml(record.source_rank) : "—"}</dd></div>
        <div><dt>确认责任人</dt><dd>${escapeHtml(owner)}</dd></div>
        <div class="binding-reason-cell"><dt>绑定判断理由</dt><dd><span data-binding-reason-summary>${escapeHtml(mappingReason(mapping))}</span><details class="binding-reason-disclosure"><summary>查看完整理由</summary><p data-binding-reason-full>${escapeHtml(mappingReason(mapping))}</p></details></dd></div>
      </dl>${conflict}`;
  }

  function renderLegacyBinding(target) {
    const seed = data.seeds[PROJECT_SEED];
    const { entity, mappings, selectedIndex } = projectMappings();
    const summary = data.models[PROJECT_SEED].fit.summary;
    const defaultMapping = mappings[selectedIndex];
    const defaultCandidates = conceptForKey(defaultMapping.concept_key)?.candidates || [];
    const defaultConflictLabel = defaultCandidates.map((candidate) => formatValue(candidate.value, candidate.unit)).join(" 对比 ");
    const body = `
      ${stateHeader("13 项概念槽位绑定微距", "血肉来自业务依据，具体数值来自 SSOT", `选择任意槽位，查看空白语法、排序概念、授权取值或阻断原因。默认视图展示 ${defaultConflictLabel} 进度确认冲突。`, `${mappings.length}/${seed.required_concept_slots.length} 已挂载`)}
      <div class="binding-summary"><div><span>核算主体</span><strong>${escapeHtml(entity.entity_id)}</strong></div><div><span>槽位覆盖率</span><strong data-testid="slot-coverage">${mappings.length}/${seed.required_concept_slots.length}</strong></div><div><span>可实例化</span><strong>${summary.instantiable}/${summary.entities}</strong></div><div><span>已保留冲突</span><strong>${summary.conflicted_bindings} 项已明确标注</strong></div></div>
      <div class="seed-binding-grid">
        <section class="seed-binding-index ruled-panel" aria-label="全部 13 项完工进度模型概念槽位"><div class="genesis-panel-head"><span>概念槽位完整索引</span><strong>空白语法 → 权威排序 → 成功绑定 / 规则阻断</strong></div><div>${mappings.map((mapping, index) => `<button type="button" class="seed-slot-button ${mapping.state === "BOUND_WITH_CONFLICT" ? "is-conflict" : mapping.state.startsWith("BLOCKED") || mapping.state === "MISSING" ? "is-blocked" : "is-bound"}" data-slot-index="${index}" data-slot-id="${escapeHtml(mapping.slot_id)}" aria-pressed="false"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(slotLabels[mapping.slot_id] || mapping.slot_id)}</span><small>${escapeHtml(humanState(mapping.state))}</small></button>`).join("")}</div></section>
        <section id="seed-binding-detail" class="seed-binding-detail" data-testid="binding-detail"></section>
      </div>`;
    target.innerHTML = shell("seed-binding", body);
    document.querySelectorAll(".seed-slot-button").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.slotIndex);
      renderBindingDetail(mappings[index], index);
    }));
    renderBindingDetail(mappings[selectedIndex], selectedIndex);
  }

  function projectProgressPresentation(projectModel) {
    const rows = projectModel.project_rows.map((row) => {
      const input = row.bound_inputs;
      const calc = row.calculated;
      return {
        entityId: row.entity_id,
        period: row.period,
        estimateVersion: input.expected_total_cost_version,
        expectedLoss: row.expected_loss_signal,
        calculated: calc,
        equations: {
          progress: `${formatNumber(input.cost_incurred_to_date)} ÷ ${formatNumber(input.expected_total_cost)} = ${formatPercent(calc.cumulative_progress, 1)}`,
          cumulativeRevenue: `${formatNumber(input.transaction_price)} × ${formatPercent(calc.cumulative_progress, 1)} = ${formatNumber(calc.cumulative_revenue)}`,
          currentRevenue: `${formatNumber(calc.cumulative_revenue)} − ${formatNumber(input.prior_cumulative_revenue)} = ${formatNumber(calc.current_period_revenue)}`,
          currentCost: `${formatNumber(input.cost_incurred_to_date)} − ${formatNumber(input.prior_cumulative_cost)} = ${formatNumber(calc.current_period_cost)}`,
          gp: `${formatNumber(calc.current_period_revenue)} − ${formatNumber(calc.current_period_cost)} = ${formatNumber(calc.project_gp)} · 毛利率 ${formatPercent(calc.project_gp_margin, calc.project_gp_margin === 0.5 ? 1 : 4)}`,
          receivable: `${formatNumber(input.cumulative_billings)} − ${formatNumber(input.cumulative_cash_collected)} = ${formatNumber(calc.receivable)}`,
          contractAsset: `${formatNumber(calc.cumulative_revenue)} − ${formatNumber(input.cumulative_billings)} = ${formatNumber(calc.contract_asset)}`,
        },
      };
    });
    const aggregate = projectModel.period_aggregate;
    const sum = (key) => rows.reduce((total, row) => total + row.calculated[key], 0);
    const computed = {
      current_period_revenue: sum("current_period_revenue"),
      current_period_cost: sum("current_period_cost"),
      project_gp: sum("project_gp"),
      contract_asset: sum("contract_asset"),
      receivable: sum("receivable"),
    };
    computed.project_gp_margin = computed.project_gp / computed.current_period_revenue;
    const reconciles = ["current_period_revenue", "current_period_cost", "project_gp", "contract_asset", "receivable"].every((key) => computed[key] === aggregate[key])
      && Math.abs(computed.project_gp_margin - aggregate.project_gp_margin) <= 0.000001;
    const left = rows[0].calculated;
    const right = rows[1].calculated;
    const bridge = (a, b, total) => `${formatNumber(a)} ${b < 0 ? "−" : "+"} ${formatNumber(Math.abs(b))} = ${formatNumber(total)}`;
    return {
      rows,
      aggregate,
      computed,
      reconciles,
      bridges: {
        revenue: bridge(left.current_period_revenue, right.current_period_revenue, aggregate.current_period_revenue),
        cost: bridge(left.current_period_cost, right.current_period_cost, aggregate.current_period_cost),
        gp: bridge(left.project_gp, right.project_gp, aggregate.project_gp),
        contractAsset: bridge(left.contract_asset, right.contract_asset, aggregate.contract_asset),
        receivable: bridge(left.receivable, right.receivable, aggregate.receivable),
        margin: `${formatNumber(aggregate.project_gp)} ÷ ${formatNumber(aggregate.current_period_revenue)} = ${formatPercent(aggregate.project_gp_margin, 4)}`,
      },
    };
  }

  function renderProjectFormulaDetail(presentation, projectId) {
    const target = document.getElementById("seed-project-formulas");
    const row = presentation.rows.find((candidate) => candidate.entityId === projectId) || presentation.rows[0];
    if (!target || !row) return;
    document.querySelectorAll(".seed-project-tab").forEach((button) => {
      const selected = button.dataset.projectId === row.entityId;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const equations = [
      ["发生成本 ÷ 预计总成本 → 完工进度", "progress", row.equations.progress],
      ["合同总价 × 进度 → 累计收入", "cumulative-revenue", row.equations.cumulativeRevenue],
      ["扣除以前累计 → 当期收入", "current-revenue", row.equations.currentRevenue],
      ["扣除以前累计 → 当期成本", "current-cost", row.equations.currentCost],
      ["当期收入 − 当期成本 → 当期毛利", "gp", row.equations.gp],
      ["开票金额 − 回款金额 → 应收账款", "receivable", row.equations.receivable],
      ["累计收入 − 开票金额 → 合同资产", "contract-asset", row.equations.contractAsset],
    ];
    target.dataset.projectId = row.entityId;
    target.innerHTML = `<header><strong>${escapeHtml(row.entityId)}</strong><span>${escapeHtml(`${row.period} · 最新 ETC ${row.estimateVersion}`)}</span>${row.expectedLoss ? "<em>合同预计损失 · 需会计师确认</em>" : ""}</header><div>${equations.map(([label, id, equation]) => `<article data-equation="${id}" data-project-id="${escapeHtml(row.entityId)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(equation)}</strong></article>`).join("")}</div>`;
  }

  function renderLegacyLiving(target) {
    const seed = data.seeds[PROJECT_SEED];
    const model = data.models[PROJECT_SEED];
    const presentation = projectProgressPresentation(model.model);
    const groupedControls = presentation.rows.map((row) => ({
      entityId: row.entityId,
      controls: model.controls.filter((control) => control.entity_id === row.entityId),
    }));
    const body = `
      ${stateHeader("项目公式联动与勾稽", "模型开始运转", "选择任意演示项目查看具体代入公式。两项目汇总勾稽与五项控制检查实时可见。", presentation.reconciles ? "勾稽完全平衡" : "勾稽检查异常")}
      <div class="seed-project-tabs" aria-label="选择演示项目">${presentation.rows.map((row) => `<button type="button" class="seed-project-tab" data-project-id="${escapeHtml(row.entityId)}" aria-pressed="false"><span>${escapeHtml(row.entityId)}</span><small>营业收入 ${formatNumber(row.calculated.current_period_revenue)} · 毛利 ${formatNumber(row.calculated.project_gp)} · 毛利率 ${formatPercent(row.calculated.project_gp_margin, row.calculated.project_gp_margin === 0.5 ? 1 : 4)}</small></button>`).join("")}</div>
      <div class="seed-living-grid">
        <section class="seed-formula-panel ruled-panel"><div id="seed-project-formulas" data-testid="project-formula-detail"></div><p class="seed-policy-boundary">本展示为会计师确认的投入法 (input method) 演示模型实现，不构成正式 IFRS 15 会计政策结论。</p></section>
        <section class="seed-aggregate-panel ruled-panel"><div class="genesis-panel-head"><span>两项目汇总桥接</span><strong>PRJ-A1 + PRJ-B2</strong></div><div data-testid="aggregate-reconciliation" class="aggregate-status ${presentation.reconciles ? "is-pass" : "is-fail"}">${presentation.reconciles ? "全部项目贡献勾稽平衡" : "项目贡献勾稽校验未通过"}</div><dl>
          <div data-aggregate-equation="revenue"><dt>营业收入 Revenue</dt><dd>${escapeHtml(presentation.bridges.revenue)}</dd></div>
          <div data-aggregate-equation="cost"><dt>成本 Cost</dt><dd>${escapeHtml(presentation.bridges.cost)}</dd></div>
          <div data-aggregate-equation="gp"><dt>毛利 GP</dt><dd>${escapeHtml(presentation.bridges.gp)}</dd></div>
          <div data-aggregate-equation="contract-asset"><dt>合同资产 Contract asset</dt><dd>${escapeHtml(presentation.bridges.contractAsset)}</dd></div>
          <div data-aggregate-equation="receivable"><dt>应收账款 Receivable</dt><dd>${escapeHtml(presentation.bridges.receivable)}</dd></div>
          <div data-aggregate-equation="margin"><dt>毛利率 Margin</dt><dd>${escapeHtml(presentation.bridges.margin)}</dd></div>
        </dl></section>
        <section class="seed-controls-panel ruled-panel" data-testid="project-controls"><div class="genesis-panel-head"><span>五项规则控制</span><strong>按项目归属展示</strong></div><div>${groupedControls.map((group) => `<article data-control-entity="${escapeHtml(group.entityId)}"><h4>${escapeHtml(group.entityId)}</h4><ul>${group.controls.map((control) => `<li class="${control.status.includes("FLAG") ? "is-flag" : "is-pass"}" data-control-id="${escapeHtml(control.control_id)}"><b>${escapeHtml(controlLabels[control.control_id] || control.control_id)}</b><span>${escapeHtml(controlStatusLabels[control.status] || control.status)}</span><small>${escapeHtml(controlDetailLabels[control.control_id] || control.detail)}</small></li>`).join("")}</ul></article>`).join("")}</div></section>
      </div>`;
    target.innerHTML = shell("seed-living", body);
    document.querySelectorAll(".seed-project-tab").forEach((button) => button.addEventListener("click", () => renderProjectFormulaDetail(presentation, button.dataset.projectId)));
    renderProjectFormulaDetail(presentation, presentation.rows[0].entityId);
  }

  const driverImpact = {
    revenue_growth: ["P&L Revenue", "Gross Profit", "Working Capital", "CFO", "Cash"],
    gross_margin: ["COGS", "Gross Profit", "Inventory / AP", "EBITDA", "Cash"],
    selling_expense_ratio: ["Selling Expense", "EBITDA", "Net Profit", "Cash"],
    admin_expense_ratio: ["Admin Expense", "EBITDA", "Net Profit", "Cash"],
    rd_expense_ratio: ["R&D Expense", "EBITDA", "Net Profit", "Cash"],
    other_opex_ratio: ["Other Opex", "EBITDA", "Net Profit", "Cash"],
    dso: ["Accounts Receivable", "ΔAR", "CFO", "Cash", "Debt Draw"],
    dio: ["Inventory", "ΔInventory", "CFO", "Cash", "Debt Draw"],
    dpo: ["Accounts Payable", "ΔAP", "CFO", "Cash", "Debt Draw"],
    annual_capex: ["Capex", "PPE Closing", "D&A", "CFI", "Cash"],
    annual_debt_repayment_requested: ["Effective Repayment", "Closing Debt", "Interest", "CFF", "Cash"],
    annual_dividends: ["Retained Earnings", "CFF", "Cash"],
    tax_rate: ["Tax Expense", "Tax Payable", "Tax Cash Paid", "Net Profit", "Cash"],
    interest_rate: ["Interest Expense", "PBT", "Net Profit", "Cash"],
    cash_floor: ["Facility Draw", "Closing Debt", "CFF", "Closing Cash"],
    facility_limit: ["Available Capacity", "Facility Draw", "Closing Debt", "Facility Check"],
    ppe_remaining_life_months: ["Depreciation", "PPE Closing", "EBIT", "Cash"],
    tax_payment_lag_months: ["Tax Payable", "Tax Cash Paid", "CFO", "Cash"],
  };

  const formatSeedValue = (value, unit = "") => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value !== "number") return String(value);
    if (unit.includes("%")) return formatPercent(value, 1);
    return formatNumber(value, 4);
  };

  function renderSkeleton(target) {
    const contract = cellSeed.workbook_contract;
    const stats = [
      ["工作表", contract.sheet_count, `${contract.engine_sheet_count} 张计算表 + ${contract.support_sheets.length} 张支持表`],
      ["已定义单元格", formatNumber(contract.nonempty_cell_count, 0), "每个非空单元格均登记位置与类型"],
      ["公式单元格", formatNumber(contract.formula_cell_count, 0), "保留完整 Excel 公式，不改写为伪代码"],
      ["公式关系", formatNumber(contract.dependency_edge_count, 0), "记录每条公式的上游和下游"],
      ["月度期间", contract.period_count, `${contract.period_start} → ${contract.period_end}`],
    ];
    const body = `
      ${stateHeader("完整三表模型底盘", "不是几条零散公式，而是一套已配平工作簿", "底盘定义每张工作表、每个单元格、公式关系、假设位置和检查项；替换演示值后，仍沿同一套关系重算。", `${contract.sheet_count} 张工作表 · ${formatNumber(contract.formula_cell_count, 0)} 条公式`)}
      <div class="cell-seed-stats" data-testid="cell-seed-stats">${stats.map(([label, value, note]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`).join("")}</div>
      <div class="cell-seed-skeleton-grid">
        <section class="cell-seed-module-panel ruled-panel">
          <div class="genesis-panel-head"><span>六个内生联动模块</span><strong>共用同一套月度三表计算底盘</strong></div>
          <div class="cell-seed-module-grid">${cellSeed.modules.map((module, index) => `<article data-seed-module="${escapeHtml(module.id)}"><b>${String(index + 1).padStart(2, "0")}</b><div><strong>${escapeHtml(module.label)}</strong><p>${escapeHtml(module.purpose)}</p><small>${escapeHtml(module.sheets.join(" → "))}</small></div></article>`).join("")}</div>
        </section>
        <section class="cell-seed-sheet-panel ruled-panel">
          <div class="genesis-panel-head"><span>工作表地图</span><strong>每个数都能回到具体工作表和单元格</strong></div>
          <div class="cell-seed-sheet-grid">${contract.workbook_sheets.map((sheet, index) => `<span class="${contract.support_sheets.includes(sheet) ? "is-support-sheet" : ""}"><b>${String(index + 1).padStart(2, "0")}</b>${escapeHtml(sheet)}</span>`).join("")}</div>
          <div class="cell-seed-integrity">
            <strong>完整三表底盘已生成 · ${escapeHtml(cellSeed.full_seed_sha256.slice(0, 16))}…</strong>
            <p>合成值已填充并在源工作簿内生配平；不含真实项目名称、客户资料或本机路径。结构文件记录全工作簿 ${formatNumber(contract.nonempty_cell_count, 0)} 个非空单元格及 ${formatNumber(contract.dependency_edge_count, 0)} 条公式关系。</p>
            <div><button id="open-raw-seed" class="secondary-action" type="button">查看模型骨架摘要</button><a class="secondary-action cell-seed-json-link" href="${escapeHtml(cellSeed.full_seed_relative_path)}" target="_blank" rel="noopener">打开完整结构文件</a></div>
          </div>
        </section>
      </div>
      <div id="seed-drawer-scrim" class="seed-drawer-scrim" hidden></div>
      <aside id="seed-raw-drawer" class="seed-raw-drawer" aria-hidden="true" aria-label="三表模型底盘摘要"><header><div><span>三表模型 · 结构文件</span><strong>完整三表模型 · 骨架摘要</strong><p class="seed-drawer-sub">演示数据 · 非真实项目 · 不可用于决策 · 完整底稿已锁定</p></div><button id="close-raw-seed" type="button">关闭</button></header><pre id="seed-raw-text"></pre></aside>`;
    target.innerHTML = shell("seed-skeleton", body);
    document.getElementById("seed-raw-text").textContent = JSON.stringify(cellSeed, null, 2);
    wireRawDrawer();
  }

  function renderDriverDetail(driver, index) {
    const target = document.getElementById("cell-seed-driver-detail");
    if (!target || !driver) return;
    document.querySelectorAll(".cell-seed-driver-button").forEach((button) => {
      const selected = Number(button.dataset.driverIndex) === index;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const impacts = driverImpact[driver.id] || ["Formula dependency graph"];
    target.dataset.driverId = driver.id;
    target.innerHTML = `
      <header><div><span>假设 ${String(index + 1).padStart(2, "0")} · ${escapeHtml(driver.id)}</span><h4>${escapeHtml(driver.label)}</h4></div><strong>${driver.editable ? "可编辑 · 需授权" : "公式锁定"}</strong></header>
      <div class="cell-seed-driver-periods">${Object.keys(driver.values).map((period) => `<article><span>${escapeHtml(period)}</span><strong>${escapeHtml(formatSeedValue(driver.values[period], driver.unit))}</strong><code>${escapeHtml(driver.cells[period])}</code><small>输入值</small></article>`).join("")}</div>
      <dl class="cell-seed-driver-policy">
        <div><dt>允许范围</dt><dd>${escapeHtml(`${formatSeedValue(driver.min, driver.unit)} — ${formatSeedValue(driver.max, driver.unit)}`)}</dd></div>
        <div><dt>输入单位</dt><dd>${escapeHtml(driver.unit)}</dd></div>
        <div><dt>授权要求</dt><dd>${escapeHtml(driver.authorization)}</dd></div>
        <div><dt>参数依据</dt><dd>${escapeHtml(driver.basis)}</dd></div>
      </dl>
      <section class="cell-seed-downstream"><span>会影响哪些结果</span><div>${impacts.map((impact) => `<b>${escapeHtml(impact)}</b>`).join("")}</div><p>完整结构文件保留全部公式关系；页面只展示这项假设的主要传导路径。</p></section>`;
  }

  function renderBinding(target) {
    const drivers = cellSeed.drivers;
    const editable = drivers.filter((driver) => driver.editable).length;
    const body = `
      ${stateHeader("预测假设台账", "位置、数值、边界和授权一并定义", "这里用合成数值填充模型；换成目标公司数据时，只替换获授权的输入值，公式及上下游关系保持锁定。", `${drivers.length} 项假设 · 2027E–2029E`)}
      <div class="binding-summary cell-seed-binding-summary"><div><span>已定义假设</span><strong>${drivers.length}</strong></div><div><span>可编辑输入</span><strong>${editable * 3}</strong></div><div><span>锁定公式</span><strong>${formatNumber(cellSeed.workbook_contract.formula_cell_count, 0)} 项</strong></div><div><span>授权机制</span><strong>Banker 确认后生效</strong></div></div>
      <div class="cell-seed-binding-grid">
        <section class="cell-seed-driver-index ruled-panel"><div class="genesis-panel-head"><span>完整假设索引</span><strong>收入 / 费用 / 营运资金 / 资本开支 / 债务 / 税项</strong></div><div>${drivers.map((driver, index) => `<button type="button" class="cell-seed-driver-button" data-driver-index="${index}" data-driver-id="${escapeHtml(driver.id)}" aria-pressed="false"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(driver.label)}</span><small>${escapeHtml(driver.unit)}</small></button>`).join("")}</div></section>
        <section id="cell-seed-driver-detail" class="cell-seed-driver-detail" data-testid="cell-seed-driver-detail"></section>
      </div>`;
    target.innerHTML = shell("seed-binding", body);
    document.querySelectorAll(".cell-seed-driver-button").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.driverIndex);
      renderDriverDetail(drivers[index], index);
    }));
    renderDriverDetail(drivers.find((driver) => driver.id === "dso") || drivers[0], Math.max(0, drivers.findIndex((driver) => driver.id === "dso")));
  }

  function renderLineageDetail(lineage, index) {
    const target = document.getElementById("cell-seed-lineage-detail");
    if (!target || !lineage) return;
    document.querySelectorAll(".cell-seed-lineage-tab").forEach((button) => {
      const selected = Number(button.dataset.lineageIndex) === index;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const stepRefs = new Set(lineage.steps.map((step) => step.ref));
    const rows = lineage.steps.map((step, stepIndex) => {
      const upstream = [...(step.precedents || []), ...(step.precedent_patterns || [])];
      const downstream = lineage.steps.filter((candidate) => (candidate.precedents || []).includes(step.ref)).map((candidate) => candidate.ref);
      const expression = step.kind === "formula" ? step.formula : `VALUE = ${formatSeedValue(step.value)}`;
      return `<article data-lineage-cell="${escapeHtml(step.ref)}"><b>${String(stepIndex + 1).padStart(2, "0")}</b><div class="cell-seed-lineage-cell"><span>${escapeHtml(step.ref)}</span><small>${escapeHtml(step.kind.toUpperCase())}</small></div><code>${escapeHtml(expression)}</code><div class="cell-seed-lineage-links"><span>上游：${escapeHtml(upstream.length ? upstream.join(" · ") : "输入")}</span><span>下游：${escapeHtml(downstream.length ? downstream.join(" · ") : stepIndex === lineage.steps.length - 1 ? "输出 / 检查" : "跨模块继续")}</span></div><strong>${escapeHtml(formatSeedValue(step.cached_value))}</strong></article>`;
    }).join("");
    const checkValue = lineage.check.cached_value;
    target.dataset.lineageId = lineage.id;
    target.innerHTML = `<header><div><span>${escapeHtml(lineage.label)}</span><p>${escapeHtml(lineage.summary)}</p></div><strong>${escapeHtml(lineage.status)}</strong></header><div class="cell-seed-lineage-rows">${rows}</div><footer><span>检查项</span><code>${escapeHtml(lineage.check.ref)} · ${escapeHtml(lineage.check.formula || "工作簿整体检查")}</code><strong>${escapeHtml(formatSeedValue(checkValue))}</strong></footer>`;
  }

  function renderLiving(target) {
    const lineages = cellSeed.formula_lineages;
    const checks = cellSeed.controls.checks;
    const defaultIndex = Math.max(0, lineages.findIndex((lineage) => lineage.id === "working_capital_bridge"));
    const body = `
      ${stateHeader("公式上下游关系", "每条公式都能回到工作表、单元格和传导方向", "收入、费用、营运资金、固定资产、债务与三表不是几张静态截图，而是同一套可追踪的计算关系。", `${lineages.length} 条主链路 · ${checks.length} 项检查`)}
      <div class="cell-seed-lineage-tabs" aria-label="选择公式链路">${lineages.map((lineage, index) => `<button type="button" class="cell-seed-lineage-tab" data-lineage-index="${index}" data-lineage-id="${escapeHtml(lineage.id)}" aria-pressed="false"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(lineage.label)}</span></button>`).join("")}</div>
      <div class="cell-seed-living-grid">
        <section id="cell-seed-lineage-detail" class="cell-seed-lineage-detail ruled-panel" data-testid="cell-seed-lineage-detail"></section>
        <section class="cell-seed-control-panel ruled-panel" data-testid="cell-seed-controls"><div class="genesis-panel-head"><span>源模型内部检查记录</span><strong>${escapeHtml(cellSeed.controls.status)} · ${checks.length}/${checks.length}</strong></div><div>${checks.map((check) => `<article><i class="lamp ${check.status === "PASS" ? "lamp-green" : "lamp-amber"}"></i><span>${escapeHtml(check.label)}</span><strong>${escapeHtml(formatSeedValue(check.max_abs_value))}</strong><small>容差 ${escapeHtml(formatSeedValue(check.tolerance))}</small></article>`).join("")}</div><p>这些检查只证明演示底盘内部自洽；换成目标公司的真实数据后，必须重新检查。</p></section>
      </div>`;
    target.innerHTML = shell("seed-living", body);
    document.querySelectorAll(".cell-seed-lineage-tab").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.lineageIndex);
      renderLineageDetail(lineages[index], index);
    }));
    renderLineageDetail(lineages[defaultIndex], defaultIndex);
  }

  function modelAnswers(seedId) {
    const model = data.models[seedId];
    if (seedId === "project_progress") {
      const aggregate = model.model.period_aggregate;
      const revenueUnit = outputUnit(seedId, "current_period_revenue");
      const gpUnit = outputUnit(seedId, "project_gp");
      return {
        answer: `项目细分口径下当期营业收入 ${formatAudienceCurrency(aggregate.current_period_revenue, revenueUnit)}，当期毛利 ${formatAudienceCurrency(aggregate.project_gp, gpUnit)}。`,
        technical: [
          { key: "period_aggregate.current_period_revenue", value: aggregate.current_period_revenue, unit: revenueUnit },
          { key: "period_aggregate.project_gp", value: aggregate.project_gp, unit: gpUnit },
        ],
        facts: "合同交易总价、最新审批预计总成本 ETC、实际发生成本、以前期间累计确认金额、工程里程碑、开票与回款事实。",
        formula: "发生成本 ÷ 预计总成本 ETC → 完工进度 → 累计收入 → 当期收入与当期毛利。",
        failure: "完工进度超过 100%、静默强行截断、预估版本过期失效、掩盖收入倒轧或掩盖合同预计损失。",
        confirmation: "Banker 负责核验合同真实性、成本版本、工程里程碑与回款凭据；会计师负责核验收入确认政策与成本合规性。",
      };
    }
    if (seedId === "backlog_conversion") {
      const roll = model.model.signed_roll_forward;
      const backlogUnit = outputUnit(seedId, "closing_backlog_value");
      return {
        answer: `期末已签约在手订单 ${formatAudienceCurrency(roll.closing_backlog_value, backlogUnit)}，涵盖 ${formatNumber(roll.closing_backlog_count)} 个项目；框架协议与潜在商机实行严格分账管理。`,
        technical: [
          { key: "signed_roll_forward.closing_backlog_value", value: roll.closing_backlog_value, unit: backlogUnit },
        ],
        facts: "期初已签约订单、当期新签约增量、经审批的合同变更、当期确认履约或终止合同、项目数量变动明细。",
        formula: "期初已签约 + 新签约增量 ± 经审批合同变更 − 已确认或终止金额 = 期末已签约在手订单。",
        failure: "将无约束力框架协议计入已签约、将谈判阶段意向混淆为确定性订单、或金额与项目数量对账不平。",
        confirmation: "Banker 负责核验已签约状态、合同变更签署、终止违约情况、工期顺延及概率加权测算情景。",
      };
    }
    const group = model.model.group_rollup[0];
    const revenueUnit = outputUnit(seedId, "total_revenue");
    const gpUnit = outputUnit(seedId, "gross_profit");
    return {
      answer: `集团口径总营收 ${formatAudienceCurrency(group.revenue, revenueUnit)}，总毛利 ${formatAudienceCurrency(group.gross_profit, gpUnit)}；${model.model.blocked_rows.length} 行未经确认的新品爬坡数据保持在基准模型之外。`,
      technical: [
        { key: "group_rollup.revenue", value: group.revenue, unit: revenueUnit },
        { key: "group_rollup.gross_profit", value: group.gross_profit, unit: gpUnit },
      ],
      facts: "产品销量、ASP/零售指导价倒扣桥接、销售区域、渠道归属、结算汇率、单位产品成本、搭售比例与映射关系。",
      formula: "产品销量 × 净售价 ASP × 结算汇率 + 明确搭售增量；单位成本 × 销量 × 汇率 → 预测毛利。",
      failure: "单位或汇率错配、产品映射未获确认、未经证实的销量激增假设、或汇总合并勾稽断裂。",
      confirmation: "Banker 负责核验销量预测、定价策略、产品归类映射、产能匹配与在手订单；会计师负责核验单位成本与存货计价。",
    };
  }

  function renderModels(target) {
    const body = `
      ${stateHeader("BANKER 业务模块台账", "三种收入构建方式，共用同一套完整三表底盘", "项目进度、在手订单转化与销量 × 单价只决定收入及毛利的构建方式；费用、营运资金、固定资产、债务、税项与三表仍沿用同一套公式关系。", "先选收入逻辑，再接入完整三表")}
      <div class="seed-model-ledger" data-testid="three-models">${seedOrder.map((seedId, index) => {
        const seed = data.seeds[seedId];
        const answer = modelAnswers(seedId);
        const identity = data.models[seedId].model_identity;
        return `<section data-model-id="${seedId}"><header><span>模型 ${String(index + 1).padStart(2, "0")}</span><h4>${escapeHtml(modelLabels[seedId])}</h4><small>${seed.formula_lineage.nodes.length} 个依赖图节点 · 模型标识 ${escapeHtml(identity.model_identity_sha256.slice(0, 12))}</small></header><dl>
          <div data-human-section="question"><dt>业务问题与测算结果</dt><dd>${escapeHtml(seedQuestions[seedId])} <strong data-audience-answer>${escapeHtml(answer.answer)}</strong>${technicalEvidence(answer.technical)}</dd></div>
          <div data-human-section="facts"><dt>所需事实依据</dt><dd>${escapeHtml(answer.facts)}</dd></div>
          <div data-human-section="formula"><dt>核心计算公式</dt><dd>${escapeHtml(answer.formula)}</dd></div>
          <div data-human-section="failure"><dt>潜在失效模式</dt><dd>${escapeHtml(answer.failure)}</dd></div>
          <div data-human-section="confirmation"><dt>人工确认关卡</dt><dd>${escapeHtml(answer.confirmation)}</dd></div>
        </dl></section>`;
      }).join("")}</div>
      <div class="seed-judgment-gate"><strong>Banker 专业判断关卡</strong><p>Banker 选择最符合业务事实的收入构建方式；其输出随后进入同一套已配平的利润表、资产负债表、现金流量表及配套排期。</p></div>`;
    target.innerHTML = shell("seed-models", body);
  }

  function wireRawDrawer() {
    const drawer = document.getElementById("seed-raw-drawer");
    const scrim = document.getElementById("seed-drawer-scrim");
    const opener = document.getElementById("open-raw-seed");
    const closer = document.getElementById("close-raw-seed");
    const open = () => {
      scrim.hidden = false;
      requestAnimationFrame(() => {
        scrim.classList.add("is-open");
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        closer.focus();
      });
    };
    const close = () => {
      scrim.classList.remove("is-open");
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      window.setTimeout(() => { scrim.hidden = true; }, 180);
      opener.focus();
    };
    opener.addEventListener("click", open);
    closer.addEventListener("click", close);
    scrim.addEventListener("click", close);
    drawer.dataset.closeReady = "true";
  }

  function render(state, target, navigate) {
    if (!data || !data.seeds || !data.models || !data.seed_raw || !cellSeed || !cellSeed.workbook_contract || !liveChallenge || liveChallenge.fallback_companies.length !== 6) {
      target.innerHTML = `<div class="genesis-error"><strong>模型底盘数据不可用</strong><p>集成后的演示数据未能加载。</p></div>`;
      return;
    }
    if (state === "company-roulette") renderCompanyRoulette(target);
    else if (state === "seed-skeleton") renderSkeleton(target);
    else if (state === "seed-binding") renderBinding(target);
    else if (state === "seed-living") renderLiving(target);
    else if (state === "seed-models") renderModels(target);
    else renderGenesis(target);
    target.querySelectorAll("[data-genesis-state]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.genesisState)));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const drawer = document.getElementById("seed-raw-drawer");
    if (!drawer || !drawer.classList.contains("is-open")) return;
    document.getElementById("close-raw-seed").click();
  });

  window.MODEL_GENESIS = Object.freeze({
    render,
    projectProgressPresentation,
    stageOrder: stageOrder.slice(),
  });
})();
