(() => {
  "use strict";

  const data = window.SEED_LAB_DATA;
  const PROJECT_SEED = "project_progress";
  const seedOrder = ["project_progress", "backlog_conversion", "volume_asp_channel"];
  const stageOrder = ["genesis", "seed-skeleton", "seed-binding", "seed-living", "seed-models"];
  const stageLabels = {
    genesis: ["01", "业务诉求", "两种搭建路径"],
    "seed-skeleton": ["02", "模型骨架", "语法与 Slot 槽位"],
    "seed-binding": ["03", "挂上数据", "排序与概念绑定"],
    "seed-living": ["04", "接通神经", "公式上下游与检查"],
    "seed-models": ["05", "动态模型", "Banker 判断与选择"],
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
  const noSeedFlow = ["原始财务输入", "标准化与映射", "SSOT 底稿", "从零推导模型脚手架", "新建 XLSX 工作簿"];
  const withSeedFlow = ["业务依据", "按权威度排序的概念", "SSOT 数值", "Seed 模型骨架", "driver model"];
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

  function renderGenesis(target) {
    const statements = data.concept_pack.display_statements.slice(0, 5);
    const body = `
      ${stateHeader("模型生成路径 · MODEL GENESIS", "两条同样有效的搭建路径，同一个证据底线", "无 seed 从零搭建是一级标准能力；仅当业务问题契合时，JSON seed 骨架方可加速模型语法搭建。", "SSOT 底稿事实 ≠ Seed 模型语法")}
      <div class="genesis-overview-grid">
        <section class="genesis-business ruled-panel">
          <div class="genesis-panel-head"><span>业务是怎么说的</span><strong>按权威度排序的源端信号定义业务问题</strong></div>
          <ol>${statements.map((row, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><p>${escapeHtml(row.text)}</p><em>${escapeHtml(sourceLabel(row.source_type))}</em></li>`).join("")}</ol>
        </section>
        <section class="genesis-paths ruled-panel" data-testid="genesis-paths">
          <div class="genesis-panel-head"><span>构建路径选择</span><strong>选择模型架构，但不改变业务事实</strong></div>
          <div class="path-ledger">
            <article data-build-path="no-seed"><span>路径 A · 无 SEED：从零搭建</span><h4>无 seed 从零搭建 · 已保留验证界面</h4><p>从标准化输入推导全新模型脚手架，直接生成公式联动的全新工作簿。</p><ol>${noSeedFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><strong>经独立复核的一级有效能力</strong></article>
            <article data-build-path="with-seed"><span>路径 B · 有 SEED：调用模型骨架</span><h4>调用 Seed · 当前演示路径</h4><p>业务问题契合后，调用包含预置 slot 槽位、公式依赖图、检查规则与授权机制的可复用骨架。</p><ol>${withSeedFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><strong>Seed 骨架不含任何企业真实数据</strong></article>
          </div>
        </section>
      </div>
      <div class="genesis-five-stage" data-testid="five-stage-story">
        <div><b>01</b><span>业务诉求</span><small>梳理核心概念与缺口</small></div>
        <div><b>02</b><span>模型骨架</span><small>调用 Seed 语法与槽位</small></div>
        <div><b>03</b><span>挂上数据</span><small>绑定概念与 SSOT 数值</small></div>
        <div><b>04</b><span>接通神经</span><small>接通公式与检查规则</small></div>
        <div><b>05</b><span>模型运转</span><small>生成可供复核的报表</small></div>
      </div>
      <p class="genesis-boundary">SSOT 底稿事实是唯一输入依据。缺失、冲突或未确认的数据事实，在模型中保持缺失、冲突或未确认，系统绝不凭空捏造补齐。</p>`;
    target.innerHTML = shell("genesis", body);
  }

  function renderSkeleton(target) {
    const seed = data.seeds[PROJECT_SEED];
    const anatomy = [
      ["骨架标识", `${modelLabels[PROJECT_SEED]} · v${seed.version}`, seedQuestions[PROJECT_SEED]],
      ["概念槽位 (Slots)", `${seed.required_concept_slots.length} 个待绑定槽位`, "仅定义数据类型、允许单位与授权角色"],
      ["细到什么程度", "项目 × 期间", `${seed.driver_registry_schema.driver_fields.length} 个可复用变量字段`],
      ["公式依赖图", `${seed.formula_lineage.nodes.length} 个受控计算节点`, "加 / 减 / 乘 / 除 / max(0, x)"],
      ["控制与防线", `${seed.bounds_control_policy.length} 条控制规则`, `${seed.failure_anti_pattern_checks.length} 项反模式拦截检查`],
      ["授权复核机制", "Banker 与 会计师协同", seed.authorization_confirmation_rules.relaxation_allowed ? "允许放宽" : "禁止静默放宽"],
    ];
    const body = `
      ${stateHeader("项目完工进度模型骨架", "纯净的模型骨架", "Seed 提供可复用的模型语法、Slot 槽位、公式依赖图、检查规则与授权机制；骨架本身不含任何企业数据。", `${seed.required_concept_slots.length} 个槽位 · ${seed.formula_lineage.nodes.length} 个依赖图节点`)}
      <div class="seed-skeleton-grid">
        <section class="seed-anatomy ruled-panel" aria-label="Project Progress seed anatomy">
          <div class="genesis-panel-head"><span>语义结构解析</span><strong>清晰规范的结构定义，拒绝概念包装</strong></div>
          <div class="anatomy-ledger">${anatomy.map(([label, value, note]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><p>${escapeHtml(note)}</p></article>`).join("")}</div>
          <div class="dag-strip" aria-label="十节点公式依赖图">${seed.formula_lineage.nodes.map((node, index) => `<span data-dag-node="${escapeHtml(node.node_id)}"><b>${String(index + 1).padStart(2, "0")}</b><span data-dag-label="${escapeHtml(node.node_id)}">${escapeHtml(dagNodeLabels[node.node_id] || node.node_id)}</span></span>`).join("")}</div>
        </section>
        <section class="seed-slot-register ruled-panel">
          <div class="genesis-panel-head"><span>待填充槽位清单 (SLOTS)</span><strong>全部 ${seed.required_concept_slots.length} 项必需业务概念</strong></div>
          <ol>${seed.required_concept_slots.map((slot, index) => `<li data-seed-slot="${escapeHtml(slot.slot_id)}"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(slotLabels[slot.slot_id] || slot.slot_id)}</span><small>${escapeHtml(`${typeLabels[slot.type] || slot.type} · ${slot.allowed_units.map((unit) => unitLabels[unit] || unit).join("/")} · ${authorizationLabels[slot.authorization] || slot.authorization}`)}</small></li>`).join("")}</ol>
          <div class="seed-integrity"><strong>不含企业私有数据</strong><p>该模型骨架仅包含可复用计算语法；不包含任何发行人、客户、项目、产品或基准数据。</p><button id="open-raw-seed" class="secondary-action" type="button">查看 7,068 字符模型骨架（观众版 JSON seed）</button></div>
        </section>
      </div>
      <div id="seed-drawer-scrim" class="seed-drawer-scrim" hidden></div>
      <aside id="seed-raw-drawer" class="seed-raw-drawer" aria-hidden="true" aria-label="项目完工进度模型骨架底稿"><header><div><span>观众版 JSON seed</span><strong>project_progress.seed.json · 模型骨架</strong><p class="seed-drawer-sub" style="margin:2px 0 0;font-size:12px;color:#8a7a60">演示数据 · 非真实项目 · 不可用于决策 · 内部底稿保留原始规范哈希值</p></div><button id="close-raw-seed" type="button">关闭</button></header><pre id="seed-raw-text"></pre></aside>`;
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

  function renderBinding(target) {
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

  function renderLiving(target) {
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
      ${stateHeader("BANKER 模型对比台账", "三种模型架构，系统绝不自动拼成一个答案", "每个模型回答不同的业务问题，保持各自的数据事实、计算公式、失效模式与人工确认关卡。", "仅允许人工决策组合")}
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
      <div class="seed-judgment-gate"><strong>Banker 专业判断关卡</strong><p>只有 Banker 明确选择后，才会对比或组合不同模型；系统不会自动拼成一个答案。</p></div>`;
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
    if (!data || !data.seeds || !data.models || !data.seed_raw) {
      target.innerHTML = `<div class="genesis-error"><strong>Seed 数据包不可用</strong><p>集成后的演示数据未能加载。</p></div>`;
      return;
    }
    if (state === "seed-skeleton") renderSkeleton(target);
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
