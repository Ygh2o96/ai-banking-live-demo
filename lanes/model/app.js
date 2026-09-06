"use strict";

let demoData;
let activeScene = "hero1";
let currentModel;
let currentStatement = "pnl";
let currentH1View = "model";
let currentModelTitle = "基准模型";
let h1DefinitionsConfirmed = false;
let radarTimer = null;
let radarMode = null;
let radarIndex = 0;
let radarPaused = false;

const H1_GENESIS_STATES = ["company-roulette", "genesis", "seed-skeleton", "seed-binding", "seed-living", "seed-models"];
const LIQUIDITY_FIGURE_NOTE = "允许并明确标注文中所需融资金额，优先最小化融资需求；维持月度最低安全现金底线。";
const LATTICE_PRODUCT_EQUATION = "5 × 4 × 5 × 6 × 3 × 3 × 4";

const LATTICE_DIMENSION_LABELS = Object.freeze({
  organic_growth_profiles: "内生增长率组合",
  gross_margin: "毛利率",
  management_expense_ratio: "管理费用率",
  advertising_spend: "年度广告投放",
  dso: "应收账款周转天数 DSO",
  dio: "存货周转天数 DIO",
  dpo: "应付账款周转天数 DPO",
});
const LATTICE_FILTER_LABELS = Object.freeze({
  "profit-gate": "2028E 盈利关卡",
  "liquidity-gate": "月度最低现金关卡",
  "policy-control-gate": "已授权范围与三表勾稽关卡",
});
const LATTICE_PARTITION_LABELS = Object.freeze({
  rejected: "未通过刚性约束",
  "feasible-zero": "可行 · 无需外部融资",
  "feasible-funded": "可行 · 需要外部融资",
});
const LATTICE_FUNDING_BIN_LABELS = Object.freeze({
  zero: "零外部融资",
  "gt-0-le-100": "外部融资 > HK$0m–HK$100m",
  "gt-100-le-250": "外部融资 > HK$100m–HK$250m",
  "gt-250-le-1000": "外部融资 > HK$250m–HK$1,000m",
});
const LATTICE_OBJECTIVE_LABELS = Object.freeze({
  "minimize external funding": "最小化外部融资金额",
  "minimize normalized driver movement": "最小化假设改动幅度",
  "maximize minimum monthly cash": "最大化月度最低现金",
  "maximize 2028E net profit": "最大化 2028E 净利润",
  "stable enumeration order": "保持固定枚举顺序",
});
const SOLVED_CHECK_LABELS = Object.freeze({
  "profit-2028": "2028E 净利润 > HK$0m",
  "monthly-cash": "月度最低现金 > HK$20m",
  "model-identities": "P&L / BS / CFS 三表勾稽",
  management_expense_ratio: "管理费用率位于 [6%, 8%]",
  gross_margin: "毛利率位于 [32%, 35%]",
  advertising_roi: "广告投入 ROI 位于 [2.5, 3.5]",
  dpo: "DPO 位于 [45, 60] 天",
  dso: "DSO ≤ 55 天",
  "maintenance-capex": "资本开支锁定在维持性水平",
});
const SCENARIO_FIELD_LABELS = Object.freeze({
  tax_rate: "所得税率",
  maintenance_capex: "维持性资本开支",
  other_opex_ratio: "其他经营费用率",
  annual_depreciation: "年度折旧",
  interest_rate: "利率",
  organic_growth: "内生增长率",
  gross_margin: "毛利率",
  management_expense_ratio: "管理费用率",
  advertising_spend: "年度广告投放",
  dso: "应收账款周转天数 DSO",
  dio: "存货周转天数 DIO",
  dpo: "应付账款周转天数 DPO",
  advertising_roi_definition: "广告投入 ROI 定义",
  monthly_cash_comparison: "月度最低现金比较口径",
  monthly_cash: "月度最低现金",
});

const RADAR_STATE_LABELS = Object.freeze({
  verified: "已核验",
  failed: "未通过",
  pass: "通过",
  blocked: "已阻断",
  quarantined: "已隔离",
  candidate: "待判断",
  reviewed: "已复核",
  released: "已发布",
});
const RADAR_COPY_ZH = Object.freeze({
  success: {
    steps: {
      source: ["官方来源", "从白名单官方页面获取；保留时间戳与原始出处。"],
      script: ["程序摄取", "已完成签名核验、内容哈希、解析与去重；未发现重复记录。"],
      source_gate: ["来源与范围关卡", "官方来源完整；预期附件解析成功；覆盖监测范围。"],
      impact: ["影响候选", "申请文件清单及责任分工时间表可能需要调整。"],
      evidence_gate: ["证据链核验", "每项判断均可定位至原文第 4 段及附件第 2 页。"],
      human: ["Banker 专业判断", "对现有工作流具有重要性；已收窄表述，未把法律结论交由系统作出。"],
      release_gate: ["发布审批", "责任人、截止日、复核安排及人工授权均已具备。"],
      ledger: ["决策台账", "决策已记录，保留不可变证据索引及待办事项。"],
    },
    output: {
      what_changed: "新增支持性明细表需在首次申报时提交，不再仅限后续问询时补充。",
      why_it_may_matter: "起草与核验排期可能需要提前设置责任人确认节点。",
      evidence: "官方通知第 4 段；附件第 2 页；来源哈希 c5b8...71ad。",
      affected_workstream: "申报文件 / 核验计划",
      owner: "执行工作流负责人",
      due_date: "2026-09-04",
      recheck: "待法律顾问复核后确认适用性；2026-09-05 再次核对官方页面。",
    },
  },
  failure: {
    steps: {
      source: ["官方来源", "已获取来源页面并完成哈希记录。"],
      script: ["程序摄取", "附件签名有效，但解析后缺少两个预期段落。"],
      source_gate: ["来源与范围关卡", "覆盖不完整。候选事项转入证据隔离区，下游关卡保持关闭。"],
      quarantine: ["证据隔离", "不生成影响候选、通知或发布事项；须重新获取并由人工核查。"],
    },
    output: {
      what_changed: "未发布任何规则变动。",
      why_it_may_matter: "来源包可能不完整；依据残缺文本采取行动，可能形成虚假的新增要求。",
      evidence: "解析完整性检查未通过；缺少第 6 至第 7 段。",
      affected_workstream: "监管监测队列",
      owner: "监管雷达运营负责人",
      due_date: "2026-09-03",
      recheck: "重新获取附件、比对哈希并人工核查来源后，从来源与范围关卡重新开始。",
    },
  },
});

const PRECEDENT_COPY_ZH = Object.freeze({
  "PX-001": ["经销商库存监控与返利管控", "申请人每月监控经销商库存，审阅终端动销报告，并在符合条件的采购入账时计提销量返利。", "字面表述直接匹配，且业务模式可比。"],
  "PX-002": ["渠道库存集中", "经销商库存约相当于六周预期终端动销量。返利安排可能推高期末前采购量，申请人据此复核是否存在异常压货。", "直接匹配，可用于风险因素披露结构。"],
  "PX-004": ["下游库存覆盖监控", "独立经销商每月提交库存覆盖及二级销售速度表；管理层把下游库存与终端销售消化量进行对比，并调查滞销产品。", "虽未使用检索词原文，但语义高度相关。"],
  "PX-005": ["渠道激励管控", "批发渠道合作方根据年度协议获得销量支持返利；申请人跟踪下游库存，并将返利计提与二级市场销售信息勾稽。", "语义召回：渠道库存及激励计提控制。"],
  "PX-007": ["经销商采购返利", "经销商可取得追溯性采购返利；相关负债根据合同档位、符合条件的发票及预计结算率重新计量。", "可作为会计处理对照，但未披露库存监控。"],
  "PX-009": ["零售网点代销存货", "相关产品虽称为经销商库存，但在终端售出前法定所有权仍归申请人；零售运营商收取服务返利，但不承担存货风险。", "不予采纳：字面相似，但所有权及存货风险仍由申请人承担，属于代销模式而非买断制经销。"],
  "PX-014": ["可变对价准备", "预期商业激励计提按各报告期的合同档位、二级销售信息及已批准促销申请估算。", "可作为返利会计处理的语义先例。"],
  "PX-016": ["经销合同终止权", "如经销商库存过高、未经授权跨区销售或未提供终端动销报告，分销合同允许终止合作。", "可直接用于经销商治理条款对照。"],
  "PX-018": ["下游库存及终端消化", "区域批发商按产品系列报送库存数量、零售端消化及库龄；当库存周数超过政策阈值时，申请人会调低出货量。", "可用于库存及终端动销监控的语义对照。"],
  "PX-021": ["渠道支持款项", "向批发合作方支付的款项原则上冲减收入；仅在识别出可明确区分且能可靠计量的服务时例外。", "会计原则相关，但库存证据有限。"],
  "PX-024": ["激励驱动的订货行为", "按销量计算的返利可能影响批发订单时点；管理层在各报告期后复核后续零售消化及退货情况。", "可作为风险因素及期后事项的语义对照。"],
  "PX-026": ["禁止回购安排", "申请人没有义务回购经销商未售库存；有限的瑕疵品退货另行管控，且金额不重大。", "可直接用于风险转移边界对照。"],
  "PX-027": ["渠道销售截止性测试", "申请人结合交付凭证、期后终端动销、贷项通知单及主要经销商库存报告测试销售截止性。", "可直接用于审计证据对照。"],
  "PX-029": ["渠道滞销库存", "经销商库存账龄超过 90 天时，将触发发货复核、终端动销计划，并可能下调未来返利资格。", "可直接用于经营控制对照。"],
  "PX-030": ["依赖渠道合作方资料", "申请人依赖渠道合作方提供终端销售及下游库存报告；资料不完整可能导致纠正措施延迟。", "可用于数据局限性披露的语义对照。"],
});

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function money(value, digits = 1) {
  const sign = value < 0 ? "−" : "";
  return `${sign}HK$${Math.abs(value).toFixed(digits)}m`;
}

function number(value, digits = 1) {
  return Number(value).toFixed(digits);
}

function percent(value, digits = 1) {
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

function integer(value) {
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function sourceNumber(value, digits = 6) {
  const numeric = Number(value);
  const sign = numeric < 0 ? "−" : numeric > 0 ? "+" : "";
  return `${sign}${Math.abs(numeric).toFixed(digits)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scenarioFieldLabel(value) {
  return SCENARIO_FIELD_LABELS[value] || String(value).replaceAll("_", " ");
}

function conflictLabel(value) {
  const labels = {
    "gross margin below 30%": "毛利率低于 30%",
    "management expense and advertising spend locked": "管理费用率与广告支出完全锁定",
    "positive 2027E net profit": "要求 2027E 净利润扭亏为盈",
    "DSO above 75 days and DPO below 30 days": "应收天数高于 75 天且应付天数低于 30 天",
    "zero external funding and minimum monthly cash above HK$30m": "要求零外部融资且月度最低现金高于 HK$30m",
  };
  return labels[value] || value;
}

function audiencePrecedent(row) {
  const copy = PRECEDENT_COPY_ZH[row.doc_id];
  return copy ? { ...row, title: copy[0], snippet: copy[1], banker_view: copy[2] } : row;
}

function toast(message, tone = "cyan") {
  const node = $("#toast");
  node.textContent = message;
  node.style.borderColor = `var(--${tone})`;
  node.classList.add("is-visible");
  clearTimeout(node._timer);
  node._timer = setTimeout(() => node.classList.remove("is-visible"), 2600);
}

async function api(path, options = {}) {
  if (location.protocol === "file:" || window.__DEMO_BOOTSTRAP__) return offlineApi(path, options);
  try {
    const response = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok && response.status === 404 && window.__DEMO_BOOTSTRAP__) return offlineApi(path, options);
    if (!contentType.includes("application/json") && window.__DEMO_BOOTSTRAP__) return offlineApi(path, options);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return payload;
  } catch (error) {
    if (window.__DEMO_BOOTSTRAP__) return offlineApi(path, options);
    throw error;
  }
}

function offlineApi(path, options = {}) {
  const body = options.body ? JSON.parse(options.body) : {};
  const local = window.__DEMO_BOOTSTRAP__;
  if (path === "/api/bootstrap") return Promise.resolve(local);
  if (path === "/api/hero1/simple") {
    return Promise.resolve({ ...local.hero1.simple, baseline_result: local.hero1.baseline, adjusted_result: local.hero1.simple_adjusted });
  }
  if (path === "/api/hero1/parse") {
    const definitions = body.definitions || {};
    const scenario = structuredClone(local.hero1.feasible.scenario);
    const pending = [];
    if (definitions.advertising_roi_definition !== "attributable_revenue_divided_by_advertising_spend") pending.push("advertising_roi_definition");
    if (definitions.monthly_cash_comparison !== "strictly_greater_than") pending.push("monthly_cash_comparison");
    scenario.definitions_pending = pending;
    scenario.confirmed_definitions = definitions;
    scenario.solve_blocked = pending.length > 0;
    return Promise.resolve(scenario);
  }
  if (path === "/api/hero1/solve") {
    const definitions = body.definitions || {};
    if (definitions.advertising_roi_definition !== "attributable_revenue_divided_by_advertising_spend" || definitions.monthly_cash_comparison !== "strictly_greater_than") {
      return Promise.reject(new Error("求解已阻断：待确认口径必须清零"));
    }
    return Promise.resolve(local.hero1.feasible);
  }
  if (path === "/api/hero1/infeasible") return Promise.resolve(local.hero1.infeasible);
  if (path === "/api/hero3/retrieval") return Promise.resolve(local.hero3);
  return Promise.reject(new Error(`离线路由不可用：${path}`));
}

function selectScene(scene) {
  activeScene = scene;
  $$(".scene").forEach((node) => node.classList.toggle("is-active", node.id === scene));
  $$(".hero-tab").forEach((node) => node.classList.toggle("is-active", node.dataset.sceneTarget === scene));
}

function setH1Stage(stage) {
  const order = ["baseline", "simple", "parse", "solve"];
  const index = order.indexOf(stage);
  $$('[data-h1-stage]').forEach((row) => {
    const rowIndex = order.indexOf(row.dataset.h1Stage);
    row.classList.toggle("is-current", rowIndex === index);
    row.classList.toggle("is-done", rowIndex < index);
  });
}

function deltaText(value, baseline, format = money) {
  const delta = value - baseline;
  if (Math.abs(delta) < 0.0001) return "无变动";
  return `${delta > 0 ? "+" : ""}${format(delta)}`;
}

function renderH1Model(model, title, baseline = demoData.hero1.baseline) {
  currentModel = model;
  currentModelTitle = title;
  if (currentH1View === "model") $("#h1-view-title").textContent = title;
  const annual = model.annual;
  const baseAnnual = baseline.annual;
  $("#kpi-revenue").textContent = money(annual["2028E"].revenue);
  $("#kpi-revenue-delta").textContent = deltaText(annual["2028E"].revenue, baseAnnual["2028E"].revenue);
  $("#kpi-profit").textContent = money(annual["2028E"].net_profit);
  $("#kpi-profit").className = annual["2028E"].net_profit > 0 ? "positive" : "negative";
  $("#kpi-profit-delta").textContent = deltaText(annual["2028E"].net_profit, baseAnnual["2028E"].net_profit);
  $("#kpi-cash").textContent = money(model.summary.minimum_monthly_cash);
  $("#kpi-cash-month").textContent = `${model.summary.minimum_monthly_cash_month} 最低点`;
  $("#kpi-funding").textContent = money(model.summary.external_funding);
  $("#kpi-funding").className = model.summary.external_funding <= 0.0001 ? "positive" : "changed";
  $("#kpi-funding-delta").textContent = deltaText(model.summary.external_funding, baseline.summary.external_funding);
  $("#h1-replay").textContent = "可回溯验证 · 版本已留痕";
  renderDriverList(model, baseline);
  renderForecastChart(model);
  renderStatementTable();
}

function activateH1View(view, updateUrl = false) {
  currentH1View = view;
  const panelView = H1_GENESIS_STATES.includes(view) ? "genesis" : view;
  const genesisMode = panelView === "genesis";
  $$('[data-h1-view-panel]').forEach((panel) => panel.classList.toggle("is-active", panel.dataset.h1ViewPanel === panelView));
  $$('[data-h1-view]').forEach((button) => {
    const selected = button.dataset.h1View === panelView || (genesisMode && H1_GENESIS_STATES.includes(button.dataset.h1View));
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  $(".forecast-workspace").classList.toggle("is-genesis-mode", genesisMode);
  const titles = {
    model: currentModelTitle,
    wiggle: `Wiggle test 影响传导 · ${demoData.hero1.wiggle.event_id}`,
    lattice: "Solver lattice 解空间 · 全量组合回溯",
    "company-roulette": "40 分钟现场建模挑战 · 观众选股 / 六格轮盘",
    genesis: "模型搭建路径 · 两条构建路径",
    "seed-skeleton": "完整三表模型结构 · 工作表、单元格与公式蓝图",
    "seed-binding": "预测假设台账 · 输入位置、边界与授权",
    "seed-living": "公式上下游关系 · 三表联动与勾稽",
    "seed-models": "业务模型模块 · 共用完整三表模型结构",
  };
  $("#h1-view-title").textContent = titles[view];
  if (genesisMode) {
    if (!window.MODEL_GENESIS) throw new Error("模型结构模块不可用");
    window.MODEL_GENESIS.render(view, $("#h1-genesis-view"), (nextState) => activateH1View(nextState, true));
  }
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set("scene", "hero1");
    if (view === "model") url.searchParams.delete("state");
    else url.searchParams.set("state", view);
    history.replaceState(null, "", url);
  }
}

function wiggleNodeValue(node, precision) {
  if (node.baseline !== undefined) {
    return {
      primary: `${number(node.baseline, 0)} → ${number(node.value, 0)} 天`,
      source: `已确认变动 ${sourceNumber(node.value - node.baseline, precision.source_decimals)} 天`,
    };
  }
  if (typeof node.value === "string") return { primary: node.value, source: "确定性公式上下游联动" };
  return {
    primary: `${node.kind === "control_check" ? "勾稽检查 " : "变动 "}${money(node.value, precision.display_decimals)}`,
    source: `底稿数值 ${sourceNumber(node.value, precision.source_decimals)}`,
  };
}

function renderWiggleTrace() {
  const trace = demoData.hero1.wiggle;
  const positions = {
    "dio-driver": { x: 30, y: 72, w: 205, h: 118 },
    "inventory-formula": { x: 285, y: 72, w: 250, h: 118 },
    "inventory-delta": { x: 590, y: 72, w: 220, h: 118 },
    "external-funding-delta": { x: 900, y: 72, w: 230, h: 118 },
    "revenue-delta": { x: 30, y: 326, w: 205, h: 118 },
    "wc-formula-check": { x: 285, y: 326, w: 250, h: 118 },
    "bs-check": { x: 590, y: 326, w: 220, h: 118 },
    "cash-rollforward-check": { x: 900, y: 326, w: 230, h: 118 },
  };
  const edgePath = (edge) => {
    const from = positions[edge.from];
    const to = positions[edge.to];
    const vertical = Math.abs(from.x - to.x) < 10;
    if (vertical) {
      const x = from.x + from.w / 2;
      return { d: `M ${x} ${from.y + from.h} L ${x} ${to.y}`, x: x + 9, y: (from.y + from.h + to.y) / 2 };
    }
    const startX = from.x + from.w;
    const startY = from.y + from.h / 2;
    const endX = to.x;
    const endY = to.y + to.h / 2;
    const midX = (startX + endX) / 2;
    return { d: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`, x: midX, y: Math.min(startY, endY) - 10 };
  };
  const edgeLabels = {
    drives: "驱动计算",
    formula: "代入公式",
    lineage: "公式联动",
    cff: "计入 CFF",
    excluded: "不在此下游范围内",
    reconciles: "勾稽平衡",
  };
  const edges = trace.edges.map((edge) => {
    const path = edgePath(edge);
    const labelText = edgeLabels[edge.label] || edge.label;
    return `<g class="wiggle-edge edge-${escapeHtml(edge.kind)}" data-edge-id="${escapeHtml(edge.id)}" data-from="${escapeHtml(edge.from)}" data-to="${escapeHtml(edge.to)}" data-kind="${escapeHtml(edge.kind)}"><path d="${path.d}" marker-end="url(#arrow-${escapeHtml(edge.kind)})"/><text x="${path.x}" y="${path.y}" text-anchor="middle">${escapeHtml(labelText)}</text></g>`;
  }).join("");
  const kindLabels = { must_move: "必须联动", must_not_move: "保持不变", control_check: "勾稽检查", lineage: "公式上下游关系" };
  const nodeLabels = {
    "dio-driver": "存货周转天数 DIO 假设",
    "inventory-formula": "存货核算公式",
    "inventory-delta": "首月存货变动",
    "external-funding-delta": "外部融资金额变动",
    "revenue-delta": "2027E 营业收入（保持不变）",
    "wc-formula-check": "营运资金公式勾稽",
    "bs-check": "资产负债平衡检查",
    "cash-rollforward-check": "现金滚存检查",
  };
  const nodes = trace.nodes.map((node) => {
    const pos = positions[node.id];
    const value = wiggleNodeValue(node, trace.precision);
    const formulaLines = node.id === "inventory-formula" ? ["存货 = COGS / 30", "× DIO"] : [value.primary];
    const valueY = node.id === "inventory-formula" ? 72 : 77;
    const sourceY = node.id === "inventory-formula" ? 109 : 104;
    const nodeLabel = nodeLabels[node.id] || node.label;
    return `<g class="wiggle-node node-${escapeHtml(node.kind)}" data-node-id="${escapeHtml(node.id)}" data-kind="${escapeHtml(node.kind)}" data-source="${escapeHtml(node.source)}" transform="translate(${pos.x} ${pos.y})"><rect width="${pos.w}" height="${pos.h}"/><text class="wiggle-kind" x="15" y="23">${kindLabels[node.kind]}</text><text class="wiggle-label" x="15" y="49">${escapeHtml(nodeLabel)}</text><text class="wiggle-value" x="15" y="${valueY}">${formulaLines.map((line, index) => `<tspan x="15" dy="${index ? 21 : 0}">${escapeHtml(line)}</tspan>`).join("")}</text><text class="wiggle-source" x="15" y="${sourceY}">${escapeHtml(value.source)}</text></g>`;
  }).join("");
  const exactRows = trace.nodes.filter((node) => typeof node.value === "number").map((node) => {
    const value = wiggleNodeValue(node, trace.precision);
    const nodeLabel = nodeLabels[node.id] || node.label;
    return `<div class="trace-register-row" data-register-node="${escapeHtml(node.id)}"><span>${escapeHtml(nodeLabel)}</span><strong>${escapeHtml(value.source)}</strong></div>`;
  }).join("");
  $("#h1-wiggle-view").innerHTML = `<div class="wiggle-layout"><section class="wiggle-graph ruled-panel"><div class="evidence-heading wiggle-heading"><div><span>影响传导追踪</span><strong>单项假设变动；非受影响下游项目保持不变</strong><small>联动有效性测试，非最终可行方案；后续进入求解空间。</small></div><div class="trace-legend"><span class="legend-move">必须联动</span><span class="legend-still">保持不变</span><span class="legend-control">勾稽检查</span></div></div><svg id="wiggle-graph" viewBox="0 0 1160 500" role="img" aria-label="DIO wiggle 影响传导图"><defs><marker id="arrow-must_move" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker><marker id="arrow-must_not_move" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker><marker id="arrow-control_check" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker></defs>${edges}${nodes}</svg></section><aside class="trace-register ruled-panel"><div class="evidence-heading"><div><span>数据底稿数值</span><strong>精准生成数值</strong></div></div><div class="trace-register-body">${exactRows}</div><div class="trace-reconcile"><span>传导与检查</span><strong>${integer(trace.nodes.length)} 个检查节点 · ${integer(trace.edges.length)} 条传导关系</strong><small>完整版本已经留痕，可逐项回查</small></div><button id="wiggle-change-log" class="secondary-action">查看完整变动日志</button></aside></div>`;
  $("#wiggle-change-log").addEventListener("click", () => showWiggleChangeLog(demoData.hero1.simple));
}

function dimensionValues(row) {
  const percentKeys = new Set(["gross_margin", "management_expense_ratio"]);
  if (row.id === "organic_growth_profiles") return `${row.values.map((profile) => profile.map((value) => number(value * 100, 0)).join("/")).join(" · ")}%`;
  if (percentKeys.has(row.id)) return row.values.map((value) => percent(value, 1)).join(" · ");
  if (row.id === "advertising_spend") return row.values.map((value) => money(value, 0)).join(" · ");
  return row.values.map((value) => `${number(value, 0)}d`).join(" · ");
}

function renderLatticeVisualization() {
  const lattice = demoData.hero1.lattice;
  const dimensions = lattice.dimensions.map((row) => `<div class="dimension-row" data-dimension-id="${escapeHtml(row.id)}" data-cardinality="${row.cardinality}"><span>${escapeHtml(LATTICE_DIMENSION_LABELS[row.id] || row.label)}</span><div class="dimension-scale" aria-label="${row.cardinality} 个取值">${Array.from({ length: row.cardinality }, () => "<i></i>").join("")}</div><strong>×${integer(row.cardinality)}</strong><small>${escapeHtml(dimensionValues(row))}</small></div>`).join("");
  const filters = lattice.sequential_filter.map((row, index) => {
    const survivorWidth = row.entered ? (row.surviving / row.entered) * 100 : 0;
    const rejectedWidth = row.entered ? (row.rejected_here / row.entered) * 100 : 0;
    return `<div class="filter-stage" data-filter-id="${escapeHtml(row.id)}" data-entered="${row.entered}" data-rejected="${row.rejected_here}" data-surviving="${row.surviving}"><div><span>0${index + 1} / ${escapeHtml(LATTICE_FILTER_LABELS[row.id] || row.label)}</span><strong>${integer(row.entered)} 个方案进入</strong></div><div class="filter-bar" aria-label="${integer(row.surviving)} 个通过，${integer(row.rejected_here)} 个剔除"><i class="filter-survive" style="width:${survivorWidth.toFixed(6)}%"></i><i class="filter-reject" style="width:${rejectedWidth.toFixed(6)}%"></i></div><small><b>${integer(row.rejected_here)} 个在本关卡剔除</b><em>${integer(row.surviving)} 个继续</em></small></div>`;
  }).join("");
  const liquidity = lattice.liquidity_funding;
  const partition = liquidity.evaluated_partition.map((row) => {
    const width = liquidity.evaluated_candidates ? (row.candidates / liquidity.evaluated_candidates) * 100 : 0;
    return `<i class="partition-${escapeHtml(row.id)}" data-partition-id="${escapeHtml(row.id)}" data-candidates="${row.candidates}" style="width:${width.toFixed(6)}%" title="${escapeHtml(LATTICE_PARTITION_LABELS[row.id] || row.label)}：${integer(row.candidates)}"></i>`;
  }).join("");
  const partitionLabels = liquidity.evaluated_partition.map((row) => `<span data-partition-label="${escapeHtml(row.id)}"><i class="partition-key key-${escapeHtml(row.id)}"></i>${escapeHtml(LATTICE_PARTITION_LABELS[row.id] || row.label)} <strong>${integer(row.candidates)}</strong></span>`).join("");
  const fundingBins = liquidity.feasible_funding_bins.map((row) => {
    const width = liquidity.feasible_candidates ? (row.candidates / liquidity.feasible_candidates) * 100 : 0;
    return `<div class="funding-bin" data-funding-bin="${escapeHtml(row.id)}" data-candidates="${row.candidates}"><span>${escapeHtml(LATTICE_FUNDING_BIN_LABELS[row.id] || row.label)}</span><div><i style="width:${width.toFixed(6)}%"></i></div><strong>${integer(row.candidates)}</strong></div>`;
  }).join("");
  const objectives = lattice.objective_hierarchy.map((label, index) => `<li><b>${index + 1}</b><span>${escapeHtml(LATTICE_OBJECTIVE_LABELS[label] || label)}</span></li>`).join("");
  const plans = lattice.top_ranked_plans.map((plan) => `<div class="ranked-plan" data-plan-rank="${plan.rank}"><b>#${plan.rank}</b><span><em>外部融资 Funding</em><strong>${money(plan.external_funding, 2)}</strong></span><span><em>假设改动 Movement</em><strong>${number(plan.normalized_driver_movement, 6)}</strong></span><span><em>最低现金 Min cash</em><strong>${money(plan.minimum_monthly_cash, 2)}</strong></span><span><em>2028E 净利 2028E NP</em><strong>${money(plan.net_profit_2028, 2)}</strong></span></div>`).join("");
  const proof = lattice.infeasible_domain;
  const conflicts = proof.conflicting_set.map((item) => `<span>• ${escapeHtml(conflictLabel(item))}</span>`).join("");
  $("#h1-lattice-view").innerHTML = `<div class="lattice-layout"><header class="lattice-summary ruled-panel"><div><span>有限候选组合空间</span><strong id="lattice-product">${integer(lattice.dimension_product)}</strong><small id="lattice-equation">${lattice.dimensions.map((row) => row.cardinality).join(" × ")} = ${integer(lattice.dimension_product)}</small></div><div><span>实际完整计算</span><strong id="lattice-evaluated">${integer(lattice.evaluated_candidates)}</strong><small>全量无抽样</small></div><div><span>满足所有约束</span><strong id="lattice-feasible">${integer(lattice.feasible_candidates)}</strong><small>通过全部刚性检查</small></div><div><span>剔除不合规方案</span><strong id="lattice-rejected">${integer(lattice.rejected_candidates)}</strong><small id="lattice-reconciliation">${integer(lattice.feasible_candidates)} + ${integer(lattice.rejected_candidates)} = ${integer(lattice.evaluated_candidates)}</small></div><p>仅对界面展示的有限候选空间进行全量枚举；不对冻结范围以外的连续空间或全局最优作任何主张。</p></header><section class="lattice-dimensions ruled-panel"><div class="evidence-heading"><div><span>01 / 搜索维度</span><strong>实际候选取值范围与组合基数</strong></div></div><div class="dimension-list">${dimensions}</div></section><section class="lattice-filter ruled-panel"><div class="evidence-heading"><div><span>02 / 刚性约束与资金需求</span><strong>逐级淘汰瀑布图与资金负担</strong></div></div><div class="filter-list">${filters}</div><figure class="liquidity-figure" data-liquidity-evaluated="${liquidity.evaluated_candidates}" data-liquidity-feasible="${liquidity.feasible_candidates}" data-liquidity-rejected="${liquidity.rejected_candidates}" data-zero-funding="${liquidity.feasible_zero_external_funding}" data-positive-funding="${liquidity.feasible_positive_external_funding}"><figcaption><span>全部候选方案分布</span><strong>允许融资并明确标识，优先最小化融资需求</strong></figcaption><div class="liquidity-partition" aria-label="${integer(liquidity.rejected_candidates)} 个剔除，${integer(liquidity.feasible_zero_external_funding)} 个可行且无需融资，${integer(liquidity.feasible_positive_external_funding)} 个可行但需要融资">${partition}</div><div class="partition-labels">${partitionLabels}</div><div class="funding-bin-list">${fundingBins}</div><p>${escapeHtml(LIQUIDITY_FIGURE_NOTE)}</p></figure><div class="filter-foot"><span>以已授权范围构建有限候选空间，并对全部检查重新验证</span><strong>${integer(lattice.domain_construction.post_filter_rejection_count)} 方案在初筛后剔除</strong></div></section><section class="lattice-ranking ruled-panel"><div class="evidence-heading"><div><span>03 / 排序准则与优选方案</span><strong>多目标优化层级与优选方案</strong></div></div><ol class="objective-list">${objectives}</ol><div class="ranked-plans">${plans}</div></section><section class="infeasible-strip" data-infeasible-evaluated="${proof.evaluated_candidates}" data-infeasible-passing="${proof.passing_candidates}"><div><span>04 / 确定性无解证明</span><strong>${integer(proof.dimension_product)} 个组合 · ${integer(proof.evaluated_candidates)} 个已计算 · ${integer(proof.passing_candidates)} 个通过</strong><small>未作任何放宽，须由 Banker 选择 · 复验证据已留存</small></div><div><span>极值 / 2027E 利润</span><strong>${money(proof.witness_bounds.maximum_2027E_net_profit, 6)}</strong><small>最大观测值</small></div><div><span>极值 / 外部融资</span><strong>${money(proof.witness_bounds.minimum_external_funding, 6)}</strong><small>最低融资需求</small></div><div><span>冲突约束集</span><small class="conflict-list">${conflicts}</small></div></section></div>`;
}

function renderDriverList(model, baseline) {
  const names = [
    ["segment:core_devices", "核心硬件收入增长 Core devices", "percent"],
    ["segment:growth_products", "成长产品收入增长 Growth products", "percent"],
    ["segment:software_services", "软件服务收入增长 Software & services", "percent"],
    ["gross_margin", "毛利率 Gross margin", "percent"],
    ["management_expense_ratio", "管理费用率 Mgmt exp ratio", "percent"],
    ["advertising_spend", "年度广告投放 Advertising spend", "money"],
    ["dso", "应收账款周转天数 DSO", "days"],
    ["dio", "存货周转天数 DIO", "days"],
    ["dpo", "应付账款周转天数 DPO", "days"],
  ];
  const html = names.map(([key, label, kind]) => {
    const segmentKey = key.startsWith("segment:") ? key.split(":", 2)[1] : null;
    const value = segmentKey ? model.annual["2028E"].segment_growths[segmentKey] : model.drivers[key]["2028E"];
    const old = segmentKey ? baseline.annual["2028E"].segment_growths[segmentKey] : baseline.drivers[key]["2028E"];
    const formatter = kind === "percent" ? percent : kind === "money" ? money : (v) => `${number(v, 0)} 天`;
    const changed = Math.abs(value - old) > 0.0001;
    return `<div class="driver-row"><span class="driver-name">${label}</span><span class="driver-value">${changed ? `<del>${formatter(old)}</del>` : ""}<em>${formatter(value)}</em></span></div>`;
  }).join("");
  $("#driver-list").innerHTML = html;
}

function renderStatementTable() {
  if (!currentModel) return;
  const years = ["2027E", "2028E", "2029E"];
  let rows;
  if (currentStatement === "pnl") {
    rows = [
      ["营业收入 Revenue", "revenue", true, 1],
      ["销售成本 Cost of sales", "cogs", false, -1],
      ["毛利 Gross profit", "gross_profit", true, 1],
      ["其他经营收入 Other operating income", "other_operating_income", false, 1],
      ["销售及分销开支 Selling & distribution", "selling_and_distribution", false, -1],
      ["研发开支 R&D", "research_and_development", false, -1],
      ["管理费用 G&A", "management_expense", false, -1],
      ["品牌投放 Advertising", "advertising_expense", false, -1],
      ["其他经营开支 Other opex", "other_opex", false, -1],
      ["EBITDA", "ebitda", true, 1],
      ["折旧及摊销 D&A", "depreciation", false, -1],
      ["经营利润 EBIT", "ebit", true, 1],
      ["财务费用 Finance costs", "interest", false, -1],
      ["税前利润 PBT", "profit_before_tax", true, 1],
      ["所得税 Tax", "tax", false, -1],
      ["净利润 Net profit", "net_profit", true, 1],
    ];
  } else if (currentStatement === "cfs") {
    rows = [
      ["净利润 Net profit", "net_profit", false, 1],
      ["折旧及摊销 D&A", "depreciation", false, 1],
      ["应收账款增加 Increase in AR", "delta_ar", false, -1],
      ["存货增加 Increase in inventory", "delta_inventory", false, -1],
      ["应付账款增加 Increase in AP", "delta_ap", false, 1],
      ["经营活动现金流 CFO", "cfo", true, 1],
      ["资本开支 Capex", "capex", false, -1],
      ["投资活动现金流 CFI", "cfi", true, 1],
      ["融资提取 Funding draw", "external_funding", false, 1],
      ["有效还债 Debt repayment", "debt_repayment_effective", false, -1],
      ["股利 Dividends", "dividends", false, -1],
      ["筹资活动现金流 CFF", "cff", true, 1],
      ["期末现金余额 Closing cash", "closing_cash", true, 1],
    ];
  } else {
    rows = [
      ["货币资金 Cash", "cash", false, 1],
      ["应收账款 Accounts receivable", "accounts_receivable", false, 1],
      ["存货 Inventory", "inventory", false, 1],
      ["固定资产 PPE", "ppe", false, 1],
      ["其他资产 Other assets", "other_assets", false, 1],
      ["资产合计 Total assets", "total_assets", true, 1],
      ["应付账款 Accounts payable", "accounts_payable", false, 1],
      ["有息负债 Debt", "debt", false, 1],
      ["其他负债 Other liabilities", "other_liabilities", false, 1],
      ["股东权益 Equity", "equity", false, 1],
      ["负债与权益 Total L&E", "total_liabilities_equity", true, 1],
      ["资产负债平衡检查 BS check", "check", true, 1],
    ];
  }
  const values = (year, key, sign = 1) => {
    if (currentStatement === "pnl") return currentModel.annual[year][key] * sign;
    if (currentStatement === "cfs") {
      if (key === "closing_cash") return [...currentModel.months].reverse().find((row) => row.year === year).bs.cash;
      return currentModel.annual[year][key] * sign;
    }
    const bs = [...currentModel.months].reverse().find((row) => row.year === year).bs;
    if (key === "total_assets") return bs.cash + bs.accounts_receivable + bs.inventory + bs.ppe + bs.other_assets;
    if (key === "total_liabilities_equity") return bs.accounts_payable + bs.debt + bs.other_liabilities + bs.equity;
    return bs[key] * sign;
  };
  $("#statement-table").innerHTML = `<table class="financial-table"><thead><tr><th>百万元港币 HK$m</th>${years.map((year) => `<th>${year}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, key, total, sign]) => `<tr class="${total ? "total" : ""}"><td>${label}</td>${years.map((year) => `<td>${number(values(year, key, sign), 2)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function renderForecastChart(model) {
  const svg = $("#forecast-chart");
  const years = ["2027E", "2028E", "2029E"];
  const revenue = years.map((year) => model.annual[year].revenue);
  const cash = model.months.map((row) => row.bs.cash);
  const x0 = 58;
  const width = 720;
  const top = 25;
  const bottom = 222;
  const revenueMin = Math.min(...revenue) * 0.92;
  const revenueMax = Math.max(...revenue) * 1.05;
  const cashMin = Math.min(18, ...cash) - 1;
  const cashMax = Math.max(...cash) + 2;
  const yRevenue = (value) => bottom - ((value - revenueMin) / (revenueMax - revenueMin)) * (bottom - top);
  const yCash = (value) => bottom - ((value - cashMin) / (cashMax - cashMin)) * (bottom - top);
  const revenuePoints = revenue.map((value, index) => `${x0 + index * width / 2},${yRevenue(value)}`).join(" ");
  const cashPoints = cash.map((value, index) => `${x0 + index * width / (cash.length - 1)},${yCash(value)}`).join(" ");
  const grids = [0, 1, 2, 3].map((index) => {
    const y = top + index * (bottom - top) / 3;
    return `<line class="chart-grid" x1="${x0}" x2="${x0 + width}" y1="${y}" y2="${y}"/>`;
  }).join("");
  const yearLabels = years.map((year, index) => `<text class="chart-label" x="${x0 + index * width / 2}" y="246" text-anchor="middle">${year}</text>`).join("");
  const floorY = yCash(20);
  svg.innerHTML = `${grids}<line class="chart-floor" x1="${x0}" x2="${x0 + width}" y1="${floorY}" y2="${floorY}"/><text class="chart-label" x="${x0 + width - 2}" y="${floorY - 6}" text-anchor="end">HK$20m 最低现金红线</text><polyline class="chart-revenue" points="${revenuePoints}"/><polyline class="chart-cash" points="${cashPoints}"/>${revenue.map((value, index) => `<circle class="chart-dot" cx="${x0 + index * width / 2}" cy="${yRevenue(value)}" r="5"/><text class="chart-label" x="${x0 + index * width / 2}" y="${yRevenue(value) - 12}" text-anchor="middle">${number(value, 0)}</text>`).join("")}${yearLabels}`;
}

function formatObjective(objective) {
  if (!objective || typeof objective !== "object" || !objective.metric || !objective.direction) {
    throw new Error("解析已阻断：优化目标缺失或不完整");
  }
  const directionMap = { minimize: "最小化", maximize: "最大化" };
  const metricMap = { external_funding: "外部融资金额", net_profit: "净利润" };
  const dir = directionMap[objective.direction] || objective.direction.replaceAll("_", " ");
  const met = metricMap[objective.metric] || objective.metric.replaceAll("_", " ");
  return `${dir}${met}`;
}

function renderParsedScenario(scenario) {
  const objective = formatObjective(scenario.objective);
  const pending = scenario.definitions_pending || [];
  $("#definition-status").textContent = pending.length ? `${pending.length} 项口径待确认` : "口径确认完毕（待确认 = 0）";
  $("#definition-status").className = `status-chip ${pending.length ? "status-amber" : "status-green"}`;
  const rows = [
    ["优化目标", objective, false],
    ...scenario.hard_constraints.map((item) => [scenarioFieldLabel(item.metric), constraintText(item), false]),
    ["锁定假设", scenario.locked_assumptions.map(scenarioFieldLabel).join("、"), false],
    ["允许调整变量", scenario.allowed_drivers.map(scenarioFieldLabel).join("、"), false],
    ...pending.map((item) => ["待确认口径", scenarioFieldLabel(item), true]),
  ];
  const constraintList = $("#constraint-list");
  constraintList.innerHTML = rows.map(([label, value, isPending]) => `<div class="constraint-item ${isPending ? "is-pending" : ""}" data-parsed-field="${escapeHtml(label.toLowerCase().replaceAll(" ", "-"))}"><i></i><span><b>${escapeHtml(label)}</b> · ${escapeHtml(value)}</span><em>${isPending ? "阻断求解" : "已解析"}</em></div>`).join("");
  constraintList.dataset.parseState = "parsed";
}

function constraintText(item) {
  const metricMap = {
    gross_margin: "毛利率 Gross margin",
    management_expense_ratio: "管理费用率 Mgmt ratio",
    advertising_roi: "广告投资回报率 Ad ROI",
    dso: "应收账款周转天数 DSO",
    dpo: "应付账款周转天数 DPO",
    minimum_monthly_cash: "月度最低现金储备 Min cash",
    net_profit: "净利润 Net profit",
  };
  const metricName = metricMap[item.metric] || item.metric.replaceAll("_", " ");
  const period = item.period === "all_forecast_months" ? "全部预测月份" : item.period;
  if (item.operator === "inclusive_range") return `${item.min} ≤ ${metricName} ≤ ${item.max} · ${period}`;
  return `${metricName} ${item.operator} ${item.value} · ${period}`;
}

function renderSolvedConstraints(plan, solverResult) {
  const candidateReconciliation = `<div class="constraint-item is-pass"><i></i><span>${integer(solverResult.evaluated_candidates)} 个候选组合已全部测算，其中 ${integer(solverResult.feasible_candidates)} 个满足约束。</span><em>全量测算</em></div>`;
  $("#constraint-list").dataset.parseState = "solved";
  $("#constraint-list").innerHTML = candidateReconciliation + plan.checks.map((check) => {
    const actual = Array.isArray(check.actual) ? check.actual.map((value) => number(value, 2)).join(" / ") : number(check.actual, 3);
    return `<div class="constraint-item ${check.pass ? "is-pass" : "is-pending"}"><i></i><span>${escapeHtml(SOLVED_CHECK_LABELS[check.id] || check.label)}</span><em>${check.pass ? "通过" : "未通过"} · ${actual}</em></div>`;
  }).join("");
  $("#definition-status").textContent = `${plan.checks.filter((row) => row.pass).length}/${plan.checks.length} 项约束复核通过`;
  $("#definition-status").className = "status-chip status-green";
}

function openDialog(kicker, title, html) {
  $("#dialog-kicker").textContent = kicker;
  $("#dialog-title").textContent = title;
  $("#dialog-body").innerHTML = html;
  $("#detail-dialog").showModal();
}

function resetHero1() {
  h1DefinitionsConfirmed = false;
  activateH1View("model");
  setH1Stage("baseline");
  renderH1Model(demoData.hero1.baseline, "基准模型");
  $("#h1-confirm").disabled = true;
  $("#h1-solve").disabled = true;
  $("#definition-status").textContent = "2 项口径待确认";
  $("#definition-status").className = "status-chip status-amber";
  $("#constraint-list").dataset.parseState = "idle";
  $("#constraint-list").innerHTML = '<div class="empty-state">请点击“解析诉求”，提取优化目标、刚性约束、锁定假设与可调变量。</div>';
  $("#h1-gate-lamp").className = "lamp lamp-amber";
  $("#h1-gate-label").textContent = "待确认";
}

function showWiggleChangeLog(payload) {
  const deltas = payload.deltas;
  openDialog("变动日志 / H1-DIO-001", "调整单一假设，四个下游科目联动变化", `<div class="detail-block"><h3>已授权变动 Authorized change</h3><p>存货周转天数 (DIO) 从 ${number(payload.baseline, 0)} 天变动至 ${number(payload.new_value, 0)} 天。营业收入保持不变 (Revenue remains unchanged)。</p></div><div class="detail-block"><h3>公式上下游关系 Formula lineage</h3><div class="detail-code">${escapeHtml(payload.formula)}</div></div><div class="detail-block"><h3>重新联动计算差异 Recalculated deltas</h3><div class="detail-code">首月存货 (First-month inventory): ${money(deltas.first_month_inventory, 2)}\n最低月度现金 (Minimum cash): ${money(deltas.minimum_monthly_cash, 2)}\n外部融资金额 (External funding): ${money(deltas.external_funding, 2)}\n营业收入 (Revenue): ${money(deltas.revenue, 2)}</div></div><div class="detail-block"><h3>勾稽检查结果 Control result</h3><p>资产负债表 (BS)、现金滚存及营运资金 (working-capital) 公式勾稽差异均保持在 1e−6 以内。</p></div>`);
}

function openH1TeachDrawer(mode, trigger) {
  window.ModelCinema.open(mode, trigger, demoData.hero1);
}

function closeH1TeachDrawer() {
  window.ModelCinema.close();
}

function replayH1TeachMotion() {
  window.ModelCinema.replay();
}

function toggleH1TeachPause() {
  window.ModelCinema.toggle();
}

async function runSimpleAdjustment() {
  try {
    $("#h1-simple").disabled = true;
    $("#h1-view-title").textContent = "正在重新计算联动报表…";
    const payload = await api("/api/hero1/simple", { method: "POST", body: "{}" });
    renderH1Model(payload.adjusted_result, "DIO 调减 7 天 · 联动计算结果");
    setH1Stage("simple");
    activateH1View("wiggle", true);
    showWiggleChangeLog(payload);
  } catch (error) {
    toast(error.message, "rose");
  } finally {
    $("#h1-simple").disabled = false;
  }
}

async function parseScenario(definitions = {}) {
  const constraintList = $("#constraint-list");
  constraintList.dataset.parseState = "loading";
  $("#definition-status").textContent = "正在解析诉求…";
  $("#definition-status").className = "status-chip status-amber";
  $("#h1-confirm").disabled = true;
  $("#h1-solve").disabled = true;
  h1DefinitionsConfirmed = false;
  try {
    const scenario = await api("/api/hero1/parse", { method: "POST", body: JSON.stringify({ definitions }) });
    renderParsedScenario(scenario);
    setH1Stage("parse");
    $("#h1-confirm").disabled = scenario.definitions_pending.length === 0;
    $("#h1-solve").disabled = scenario.definitions_pending.length > 0;
    h1DefinitionsConfirmed = scenario.definitions_pending.length === 0;
    return scenario;
  } catch (error) {
    constraintList.dataset.parseState = "error";
    constraintList.innerHTML = `<div class="empty-state parse-error"><strong>诉求解析受阻</strong><br>${escapeHtml(error.message)}</div>`;
    $("#definition-status").textContent = "解析未完成";
    $("#definition-status").className = "status-chip status-rose";
    throw error;
  }
}

async function solveScenario() {
  if (!h1DefinitionsConfirmed) {
    toast("待确认口径清空前，求解通道保持阻断。", "amber");
    return;
  }
  $("#h1-solve").disabled = true;
  $("#h1-solve").textContent = `正在全量测算 ${integer(demoData.hero1.lattice.evaluated_candidates)} 个方案…`;
  $("#h1-view-title").textContent = "确定性求解中…";
  try {
    const result = await api("/api/hero1/solve", {
      method: "POST",
      body: JSON.stringify({ definitions: { advertising_roi_definition: "attributable_revenue_divided_by_advertising_spend", monthly_cash_comparison: "strictly_greater_than" } }),
    });
    if (result.status !== "FEASIBLE") throw new Error("主情景未找到任何可行方案");
    const plan = result.plans[0];
    renderH1Model(plan.result, "可行方案 · 全部约束复核通过");
    renderSolvedConstraints(plan, result);
    setH1Stage("solve");
    $("#h1-gate-lamp").className = "lamp lamp-green";
    $("#h1-gate-label").textContent = "复核通过";
    toast(`共求解出 ${result.feasible_candidates.toLocaleString()} 个可行方案；第 1 号方案外部融资需求最小。`, "emerald");
  } catch (error) {
    toast(error.message, "rose");
  } finally {
    $("#h1-solve").disabled = false;
  $("#h1-solve").textContent = "按约束求解";
  }
}

function showFormulas() {
  openDialog("来源依据与公式抽屉", "每个数字均有清晰的来源链与公式依赖", `<div class="detail-block"><h3>营业收入</h3><div class="detail-code">上年营业收入 × (1 + 内生增长率) + 广告增量收入</div></div><div class="detail-block"><h3>广告响应曲线（固定测算曲线）</h3><div class="detail-code">ROI = max(1.5, 3.6 − 0.12 × 年度广告支出)\n广告增量收入 = 广告支出 × ROI\n定义：广告增量收入 ÷ 广告支出</div><p>仅用于演示情景测算。曲线在求解前冻结，并非任意调整的配平项。</p></div><div class="detail-block"><h3>营运资金 WORKING CAPITAL</h3><div class="detail-code">AR = 月度营业收入 / 30 × DSO\nInventory = 月度 COGS / 30 × DIO\nAP = 月度 COGS / 30 × DPO\nΔAR、ΔInventory 与 ΔAP 计入 CFO</div></div><div class="detail-block"><h3>明确的外部融资机制</h3><div class="detail-code">外部融资提取额 = max(0, HK$20.01m − 融资前现金余额)\n融资提取额通过 CFF 增加现金与有息负债，不通过 BS 残差配平。</div></div>`);
}

function showInfeasible() {
  const proof = demoData.hero1.infeasible;
  openDialog("确定性无解证明", "数学上不可行 · 未人为放宽任何刚性条件", `<div class="detail-block"><h3>证明结论</h3><div class="detail-code">方法：全量枚举冻结的有限候选空间\n已计算候选：144\n通过候选：0\n证明 Hash：${proof.proof_hash.slice(0, 20)}…</div></div><div class="detail-block"><h3>极值边界测试</h3><div class="detail-code">2027E 净利润最大观测值：${money(proof.witness_bounds.maximum_2027E_net_profit, 2)}\n外部融资最低观测值：${money(proof.witness_bounds.minimum_external_funding, 2)}\n融资后月度最低现金最高观测值：${money(proof.witness_bounds.maximum_post_funding_minimum_cash, 2)}</div></div><div class="detail-block"><h3>冲突项</h3><p>${proof.conflicting_set.map((item) => escapeHtml(conflictLabel(item))).join(" · ")}</p></div><div class="detail-block"><h3>诊断性边界放宽测试</h3><p>在当前 0.1 步长网格上，毛利率需放宽至 ${percent(proof.determinable_relaxations[0].minimum_grid_value_for_positive_2027E_profit)} 始能实现 2027E 盈利；流动性约束依然独立违约。系统未放宽任何约束。</p></div>`);
}

function resetRadar() {
  clearTimeout(radarTimer);
  radarTimer = null;
  radarMode = null;
  radarIndex = 0;
  radarPaused = false;
  $("#radar-pause").textContent = "暂停";
  $("#radar-title").textContent = "就绪，等待执行受控推演";
  $("#radar-state").textContent = "待机";
  $("#radar-state-lamp").className = "lamp";
  $("#radar-token").style.left = "5%";
  $("#radar-token").style.top = "calc(51% - 7px)";
  $("#radar-token").className = "radar-token";
  $$(".flow-node, .quarantine-node").forEach((node) => node.classList.remove("is-active", "is-ok", "is-candidate", "is-bad"));
  $("#radar-events").innerHTML = '<div class="empty-state">暂无事件。请点击“运行合规通路”或“触发隔离拦截通路”。</div>';
  $("#event-count").textContent = "0 / 8";
  $("#output-state").textContent = "未生成";
  $("#output-state").className = "status-chip";
  $("#banker-output-body").innerHTML = '<div class="empty-state">完整行动卡片仅在受控通路走通后生成。</div>';
}

function runRadar(mode, instant = false) {
  resetRadar();
  radarMode = mode;
  $("#radar-title").textContent = mode === "success" ? "合规通路 · 各道关卡按序通过" : "拦截隔离通路 · 阻断流转是正常控制结果";
  $("#radar-state").textContent = "运行中";
  $("#radar-state-lamp").className = "lamp lamp-cyan";
  if (instant) {
    const steps = demoData.hero2[mode].steps;
    steps.forEach((_, index) => renderRadarStep(index, true));
    finishRadar();
  } else {
    stepRadar();
  }
}

function stepRadar() {
  if (!radarMode || radarPaused) return;
  const steps = demoData.hero2[radarMode].steps;
  if (radarIndex >= steps.length) {
    finishRadar();
    return;
  }
  renderRadarStep(radarIndex, false);
  radarIndex += 1;
  radarTimer = setTimeout(stepRadar, 720);
}

function renderRadarStep(index, instant) {
  const path = demoData.hero2[radarMode];
  const step = path.steps[index];
  const node = $(`[data-node="${step.id}"]`);
  $$(".flow-node").forEach((item) => item.classList.remove("is-active"));
  if (node) {
    node.classList.add("is-active");
    const isBad = ["failed", "blocked", "quarantined"].includes(step.state);
    const isCandidate = step.state === "candidate";
    const isOk = ["verified", "pass", "reviewed", "released"].includes(step.state);
    node.classList.toggle("is-bad", isBad);
    node.classList.toggle("is-candidate", isCandidate);
    node.classList.toggle("is-ok", isOk);
  }
  const token = $("#radar-token");
  if (step.id === "quarantine") {
    token.style.left = "31%";
    token.style.top = "80%";
  } else {
    const positions = { source: 7, script: 19, source_gate: 31, impact: 43, evidence_gate: 56, human: 68, release_gate: 81, ledger: 93 };
    token.style.left = `${positions[step.id]}%`;
    token.style.top = "calc(51% - 7px)";
  }
  token.className = `radar-token ${["failed", "blocked", "quarantined"].includes(step.state) ? "is-rose" : step.state === "candidate" ? "is-amber" : index >= 2 ? "is-green" : ""}`;
  const events = path.steps.slice(0, index + 1);
  $("#radar-events").innerHTML = events.map((item, eventIndex) => {
    const itemDisplay = RADAR_COPY_ZH[radarMode].steps[item.id] || [item.label, item.detail];
    return `<div class="event-row"><time>T+${String(eventIndex * 2).padStart(2, "0")}s</time><div><strong>${escapeHtml(itemDisplay[0])} · ${escapeHtml(RADAR_STATE_LABELS[item.state] || item.state)}</strong><span>${escapeHtml(itemDisplay[1])}</span></div></div>`;
  }).join("");
  $("#event-count").textContent = `${index + 1} / ${path.steps.length}`;
  if (!instant) $("#radar-events").scrollTop = $("#radar-events").scrollHeight;
}

function finishRadar() {
  clearTimeout(radarTimer);
  const isSuccess = radarMode === "success";
  $("#radar-state").textContent = isSuccess ? "已发布" : "已隔离";
  $("#radar-state-lamp").className = `lamp ${isSuccess ? "lamp-green" : "lamp-rose"}`;
  $("#radar-title").textContent = isSuccess ? "行动卡片已授权发布，责任与依据齐备" : "在来源与管辖范围关卡被拦截";
  $("#output-state").textContent = isSuccess ? "已授权行动" : "未予发布";
  $("#output-state").className = `status-chip ${isSuccess ? "status-green" : "status-rose"}`;
  const output = RADAR_COPY_ZH[radarMode].output;
  const fields = [
    ["变动内容", output.what_changed, true],
    ["潜在业务影响", output.why_it_may_matter, true],
    ["依据条款", output.evidence, false],
    ["关联业务工作流", output.affected_workstream, false],
    ["责任人", output.owner, false],
    ["截止日期", output.due_date, false],
    ["复核安排", output.recheck, true],
  ];
  $("#banker-output-body").innerHTML = fields.map(([label, value, wide]) => `<div class="output-field ${wide ? "wide" : ""}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  if (!isSuccess) {
    $("#output-state").textContent = "已隔离 · 阻断外部通知";
  }
}

function toggleRadarPause() {
  if (!radarMode) return;
  radarPaused = !radarPaused;
  $("#radar-pause").textContent = radarPaused ? "继续" : "暂停";
  if (!radarPaused) stepRadar();
}

function resetPrecedent() {
  const data = demoData.hero3;
  $("#filtered-count").textContent = data.filtered_count;
  $("#keyword-recall").textContent = "—";
  $("#hybrid-recall").textContent = "—";
  $("#recall-gain").textContent = "—";
  $("#precedent-title").textContent = "优先保证关键词精确性";
  $("#keyword-results").innerHTML = '<div class="empty-state">点击运行关键词检索，生成第一组候选证据。</div>';
  $("#embedding-results").innerHTML = '<div class="empty-state">等待执行第二步混合检索。</div>';
  $("#precedent-matrix").innerHTML = '<div class="empty-state">缺少具体文件、页码和可打开本地底稿来源的案例，不得进入对比矩阵。</div>';
  $("#matrix-state").textContent = "等待检索";
  $("#matrix-state").className = "status-chip status-amber";
  $("#embedding-run").disabled = true;
}

function resultCard(row, rank, recovered = false) {
  row = audiencePrecedent(row);
  const href = row.local_page_path;
  return `<a class="result-card ${recovered ? "is-recovered" : ""}" href="${escapeHtml(href)}" target="_blank" rel="noopener"><div class="result-rank">#${String(rank).padStart(2, "0")}</div><div class="result-copy"><strong>${escapeHtml(row.title)}</strong><span>${escapeHtml(row.snippet)}</span></div><div class="result-meta"><b>${number(row.hybrid_score ?? row.score, 3)}</b><em>${escapeHtml(row.doc_id)} · 第 ${row.page} 页</em></div></a>`;
}

function runKeyword() {
  const data = demoData.hero3;
  $("#keyword-results").innerHTML = data.keyword.slice(0, 6).map((row, index) => resultCard(row, index + 1)).join("");
  $("#keyword-recall").textContent = percent(data.evaluation.keyword_recall, 0);
  $("#hybrid-recall").textContent = "等待第二步";
  $("#recall-gain").textContent = `${data.evaluation.semantic_only_targets_recovered.length} 条待挽回`;
  $("#precedent-title").textContent = "关键词检索定位字面吻合项——同时检出易混淆误导项";
  $("#embedding-run").disabled = false;
  $("#matrix-state").textContent = "第一组证据";
  toast("关键词召回了实质为‘代销模式’的假同类案例。必须由 Banker 人工剔除。", "amber");
}

function runEmbedding() {
  const data = demoData.hero3;
  const recovered = data.hybrid.filter((row) => row.recovered_by_embedding);
  $("#embedding-results").innerHTML = recovered.slice(0, 6).map((row, index) => resultCard(row, index + 1, true)).join("");
  $("#hybrid-recall").textContent = percent(data.evaluation.hybrid_recall, 0);
  $("#recall-gain").textContent = `+${percent(data.evaluation.recall_gain, 0)}`;
  $("#precedent-title").textContent = "向量语义检索召回不同表述先例；底稿证据决定适用性";
  renderMatrix();
}

function renderMatrix() {
  const data = demoData.hero3;
  const selected = data.hybrid.filter((row) => row.applicable).slice(0, 4);
  const rejected = data.rejected_candidate;
  const rows = [...selected, rejected];
  $("#precedent-matrix").innerHTML = rows.map((row) => {
    row = audiencePrecedent(row);
    const reject = row.doc_id === rejected.doc_id;
    const href = row.local_page_path;
    const similarityType = reject
      ? "字面高度吻合（但模式不符）"
      : row.recovered_by_embedding
        ? "语义匹配召回先例"
        : "精确字面 + 语义吻合";
    const differenceText = reject
      ? "商品法定所有权与存货跌价风险均由申请人承担，属于代销模式"
      : "可比买断制经销渠道；具体法律条款仍须查验招股书原文";
    return `<div class="matrix-row"><div><strong>${escapeHtml(row.title)}</strong><p><a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(row.doc_id)} · 第 ${row.page} 页 ↗</a></p></div><div><strong>${similarityType}</strong><p>${reject ? "经销商库存 · 终端动销 · 返利安排" : escapeHtml(row.snippet.slice(0, 104))}…</p></div><div><strong>${differenceText}</strong><p>${escapeHtml(row.banker_view)}</p></div><div><span class="decision ${reject ? "reject" : ""}">${reject ? "不予采纳 REJECT" : "入选矩阵 MATRIX"}</span></div></div>`;
  }).join("");
  $("#matrix-state").textContent = "底稿引用核验通过";
  $("#matrix-state").className = "status-chip status-green";
}

function applyDeepLinkState() {
  const params = new URLSearchParams(location.search);
  const scene = params.get("scene") || "hero1";
  const state = params.get("state");
  selectScene(scene);
  if (scene === "hero1" && state === "solved") {
    h1DefinitionsConfirmed = true;
    const plan = demoData.hero1.feasible.plans[0];
    renderH1Model(plan.result, "可行方案 · 全部约束复核通过");
    renderSolvedConstraints(plan, demoData.hero1.feasible);
    setH1Stage("solve");
    $("#h1-gate-lamp").className = "lamp lamp-green";
    $("#h1-gate-label").textContent = "复核通过";
    activateH1View("model");
  } else if (scene === "hero1" && state === "wiggle") {
    renderH1Model(demoData.hero1.simple_adjusted, "DIO 调减 7 天 · 联动计算结果");
    setH1Stage("simple");
    activateH1View("wiggle");
  } else if (scene === "hero1" && state === "lattice") {
    h1DefinitionsConfirmed = true;
    const plan = demoData.hero1.feasible.plans[0];
    renderH1Model(plan.result, "可行方案 · 全部约束复核通过");
    renderSolvedConstraints(plan, demoData.hero1.feasible);
    setH1Stage("solve");
    $("#h1-gate-lamp").className = "lamp lamp-green";
    $("#h1-gate-label").textContent = "复核通过";
    activateH1View("lattice");
  } else if (scene === "hero1" && H1_GENESIS_STATES.includes(state)) {
    activateH1View(state);
  } else if (scene === "hero2" && state === "success") {
    runRadar("success", true);
  } else if (scene === "hero2" && state === "failure") {
    runRadar("failure", true);
  } else if (scene === "hero3" && state === "hybrid") {
    runKeyword();
    runEmbedding();
  }
}

function bindEvents() {
  $$(".hero-tab").forEach((button) => button.addEventListener("click", () => selectScene(button.dataset.sceneTarget)));
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-h1-teach]");
    if (trigger) openH1TeachDrawer(trigger.dataset.h1Teach, trigger);
  });
  $("#h1-teach-close").addEventListener("click", closeH1TeachDrawer);
  $("#h1-teach-scrim").addEventListener("click", closeH1TeachDrawer);
  $("#h1-teach-replay").addEventListener("click", replayH1TeachMotion);
  $("#h1-teach-pause").addEventListener("click", toggleH1TeachPause);
  $$(".statement-tab").forEach((button) => button.addEventListener("click", () => {
    currentStatement = button.dataset.statement;
    $$(".statement-tab").forEach((node) => node.classList.toggle("is-active", node === button));
    renderStatementTable();
  }));
  $("#h1-simple").addEventListener("click", runSimpleAdjustment);
  $("#h1-formulas").addEventListener("click", showFormulas);
  $("#h1-infeasible").addEventListener("click", showInfeasible);
  $("#h1-parse").addEventListener("click", () => parseScenario().catch((error) => toast(error.message, "rose")));
  $("#h1-confirm").addEventListener("click", () => parseScenario({ advertising_roi_definition: "attributable_revenue_divided_by_advertising_spend", monthly_cash_comparison: "strictly_greater_than" }).then(() => toast("口径定义已确认，求解通道开启。", "emerald")).catch((error) => toast(error.message, "rose")));
  $("#h1-solve").addEventListener("click", solveScenario);
  $$(".h1-view-tab").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.h1View === "wiggle") {
      renderH1Model(demoData.hero1.simple_adjusted, "DIO 调减 7 天 · 联动计算结果");
      setH1Stage("simple");
    }
    activateH1View(button.dataset.h1View, true);
  }));
  $("#radar-success").addEventListener("click", () => runRadar("success"));
  $("#radar-failure").addEventListener("click", () => runRadar("failure"));
  $("#radar-pause").addEventListener("click", toggleRadarPause);
  $("#radar-reset").addEventListener("click", resetRadar);
  $("#keyword-run").addEventListener("click", runKeyword);
  $("#embedding-run").addEventListener("click", runEmbedding);
  $("#dialog-close").addEventListener("click", () => $("#detail-dialog").close());
  $("#global-reset").addEventListener("click", () => ({ hero1: resetHero1, hero2: resetRadar, hero3: resetPrecedent })[activeScene]());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#h1-teach-drawer")?.classList.contains("is-open")) {
      closeH1TeachDrawer();
      return;
    }
    if (activeScene !== "hero2" || $("#detail-dialog").open) return;
    if (event.code === "Space") { event.preventDefault(); toggleRadarPause(); }
    if (event.key.toLowerCase() === "f") runRadar("failure");
    if (event.key.toLowerCase() === "r") resetRadar();
  });
}

window.HUATAI_DEMO_TEST_API = Object.freeze({
  formatObjective,
  renderParsedScenario,
  genesisStates: H1_GENESIS_STATES.slice(),
});

async function init() {
  try {
    demoData = await api("/api/bootstrap");
    renderWiggleTrace();
    renderLatticeVisualization();
    bindEvents();
    resetHero1();
    resetRadar();
    resetPrecedent();
    applyDeepLinkState();
    window.demoReady = true;
  } catch (error) {
    document.body.innerHTML = `<main style="padding:48px;color:#fff"><h1>演示页面加载失败</h1><p>${escapeHtml(error.message)}</p></main>`;
  }
}

init();
