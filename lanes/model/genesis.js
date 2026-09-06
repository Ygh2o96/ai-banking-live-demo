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
    "seed-models": ["05", "业务模块", "共用完整三表模型结构"],
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
      : `该对象已纳入演示后备池；既有文件是冻结材料，并非本次刚核对。官方入口：${company.source_portal_url}`;
    const selectedIdentity = audiencePick
      ? `${company.name_cn}｜市场提示：${company.market}｜股票代码需由你从官方披露确认`
      : `${company.name_cn} / ${company.name_en}｜${company.ticker}｜${company.market}｜报告货币 ${company.reporting_currency}`;
    const outputSlug = safeOutputSlug(company);
    return `40 分钟财务建模任务：为现场选定的真实上市公司制作公式驱动的三表 Excel。先锁定来源，再做经营驱动与支持表，最后接通三表、重算、改假设测试并恢复基准。每个有效预测期间都须满足资产 = 负债 + 权益及现金勾稽，不能只让基准情景看起来平衡。
现场讲解约 30 分钟；业务任务按 40 分钟安排，可在讲解结束后继续。时间是工作预算，不是完成或审阅承诺。本轮不写长报告。

【现场对象】
首选公司：${selectedIdentity}
对象状态：${sourceInstruction}
后备公司：${fallback.name_cn} / ${fallback.name_en}｜${fallback.ticker}｜${fallback.market}
后备官方入口：${fallback.source_portal_url}

【资料和范围】
1. 只使用公开资料。优先级固定为：交易所 / 法定披露平台原始公告与完整报告 > 公司 IR 页面上的同一原始文件 > 其他来源。不得用财经网站摘要替代原始报表，不得编造缺失值。
2. 开始业务后最多用 3 分钟确认公司身份、最新可用报告、年结日与单位。银行、保险等专用模型、报告期不匹配或关键官方资料拿不到时，说明具体缺口。若我已明确指定或授权后备公司，可在预检未满足时切换，并清楚回报切换原因、公司与所用版本；未指定或授权后备时，请我选择，不自行替换。页面默认列出的候选不等于我已授权。三分钟只是资料预检。
3. 所有数值用计算工具或 Excel 公式计算。保留币种和原报告单位；除非披露要求，不做无依据汇率换算。
4. 先读取已准备工作区的说明、来源目录、模型目录及适用建模 / 表格技能，运行现有 preflight。只在新 run 中制作输出；不改冻结原件、不安装工具、不重建资料库、不查私人或客户项目、不上传或发送。新取得公开输入另存，既有来源与旧复核记录保持原样。
5. 提取后备模型时，显示目录中的文件版本、来源时间、哈希和既有复核范围，明说“已准备的公开教学模型”。复制、打开、解释或改假设都不是今天从零建成；旧结果不验证新修订，也不证明最新披露已核对。

【标准模型结构】
先确定公司业务与报告口径，再复用适用的工作表和公式。网页合成模型的总体收入增长率，不代表真实公司的分产品 / 地区量价模型已经接入；说明层也不是可编辑的经营数据。新公司须建立自己的驱动表，替换合成名称、数值和期间，不能只改公司名。保留约定的三表、经营、营运资本、固定资产、融资、税项与权益范围；不因检查失败而删掉本应交付的能力。

【40 分钟执行节奏】
0–3 分钟｜锁定主体与来源
- 从官方文件确认法定公司名、ticker、交易所、报告货币、单位、年结日和合并口径，先讲清拿到了什么、还缺什么。
- 目标为 2023–2025A、2026–2028E，另列 2026H1 已披露实际。实际可得期间与目标不符就说明差异并确认范围；中期收入 / 利润锚点不冒充完整 H1 三表。冻结后备的报告范围以来源目录为准。

3–10 分钟｜录入历史数据与来源
- 按获确认范围逐行录入历史 P&L / BS / CFS，并读附注中的分部收入、成本、应收、存货、应付、PPE、债务、租赁、税项、股利及少数股东权益。保护实际期、来源表和公式。
- 每个历史数与已披露经营量保存来源 ID、文件、发布日期、取得时间、SHA-256、页码 / 表格 / 行列、币种、单位、期间和 URL。重列数须有可比桥接；保留冲突，不暗中混用。
- 打开PDF核对每页列头、单位、负号和括号。董事会决议、业绩摘要不能当成完整报告；单列比较数不得错放到本期。
- 历史报表逐年核对：税前利润减所得税等于净利润，归母加少数股东损益等于净利润。检查直接对照原报告利润行和现金流附注；空白或漏行不得默认为零。
- EBITDA 先核对发行人定义和披露值；模型口径不同就明确标成计算代理值，并列出与披露值的差异桥接。

10–17 分钟｜建立预测依据
- 收入先做“公司 → 业务 → 产品 → 地区 / 渠道”明细，深度以公开披露为限。只选一套互斥叶子节点相加；产品、地区和渠道若只是同一收入的平行口径，仅做交叉核对，不重复相加，不擅自交叉分配。单列分部间交易及抵销。
- 有销量与价格：每条产品 / 地区收入 = 销量 × 净 ASP × 必要的汇率换算；销量按需求、产能利用率、订单交付等披露驱动。明确销售量与产量不同；净 ASP 是否已经包含折扣、返利、产品组合及不含税口径，避免重复扣减。
- Mix：可选总销量 × 各产品销量占比 × 各自 ASP；同一层权重合计 = 100%。如果 ASP 已反映组合变化，不再叠加“mix 增长”。地区 / 渠道作为平行披露时，用各自小计核对同一个收入总额。
- 按业务选择替代路径：订阅 / 经常性收入可用期初客户 + 新增 − 流失的客户滚动、时间加权付费客户 × ARPU；门店可用有效营业店月 × 月店效，并区分同店、新店爬坡与关店；客户交易型业务可用平均活跃客户 × 购买频次 × 净客单价。每条收入只选一条主要生成路径，其余作核对，不重复计入。
- 没有销量 / ASP / 门店 / 客户披露时，不造经营量。保留已披露分部收入 × 逐期增长假设，清楚标注增长或结构 LEAP；只有收入总额可得时才使用总体增长率。GMV、订单额、开票额、ARR 与收入不能混同；总额法 / 净额法及收入确认时点以披露政策为准。
- 2026E 收入等于已取得的同口径 2026H1A + H2E；H2 依据季节性、已披露经营信号和公开指引，不直接以 2×H1 替代预测。没有完整中期三表时，只使用已披露锚点，不拼造期初 BS 或中期 CFS。
- 假设台账逐项记“driver ID | 业务 / 产品 / 地区 | 期间 | 单位 | 来源页码或 LEAP ID | 历史实际 | 预测输入 | 依据 | 允许范围 | 影响表 / 单元格 | 负责人”。已披露事实、工具计算推导、公开指引、建模假设分别标示。
- LEAP 登记逐项记“缺少什么来源 | 假设与理由 | 影响单元格及期间 | 敏感性 | 负责人 | 补证条件 / 到期日 | 状态”。例如：只披露分部收入、没有销量时，暂用分部增长路径；增长率是教学假设，不标成销量增长或公司指引。没有公司选择前不填公司预测数。
- 销售成本 / 毛利率、销售费用、管理费用、研发费用和其他经营收支分开预测，不把所有费用合成一个比例。
- 营运资本要分清平均周转与期末余额驱动。历史平均 DSO = 平均应收 / 同期收入 × 实际期间天数；期末余额法预测则为期末应收 = 同期收入 × 期末 DSO / 天数，不能把该输入说成披露的平均 DSO。DIO / DPO 同理，分别注明成本或采购额分母及是否含税；若使用平均余额反推期末，须带入期初余额并检查可行范围。天数由日期工具计算，不固定套半年天数。
- 资本开支与固定资产：期初固定资产 + 资本开支 − 折旧 − 处置 − 减值 ± 汇兑及其他已识别变动 = 期末固定资产；资本开支依据历史强度、产能计划和公司指引。
- 债务与利息：期初债务 + 实际提款 − 实际还款 + 已识别其他变动 = 期末债务；申请额、有效额、上限、未满足额、无效额分开。提款受已披露额度、可用期限、币种和契约约束；还款受存量债务及资金约束。流动性缺口必须显示，不假设无限授信或拿现金底线倒填债务。利息与提款 / 还款时点一致；平均债务形成循环时，使用有依据的时序或受控迭代并检验收敛，不硬填利息。
- 税项与权益：税费、应交税项和现金税款互相联动；净利润、股利、其他综合收益及少数股东权益滚入期末权益。

17–32 分钟｜完成公式联动的 Excel
- 各表日期、实际 / 预测标识、币种、单位及合并口径一致；中期比较单列，不与年度列相加。
- 工作簿保留来源、假设 / LEAP、Revenue / Operating、Opex、Working Capital、Fixed Assets、Funding / Tax / Equity、三表及 Checks。可复用既有同义工作表，不为改名字破坏公式。
- 历史数据必须有出处；预测输入只放在 Assumptions 或明细表；三张主表的预测数全部引用明细表，不得手工写死。
- 每个预测期：资产 − 负债 − 权益 = 0；期初现金 + CFO + CFI + CFF + 汇兑 = 期末现金，并与 BS 同口径现金勾稽。受限资金、定期存款等有独立来源与固定分类桥接，不强行等于全部货币资金。
- 每个支持表均显示期初 + 新增 + 非现金变动 − 释放 / 结算 = 期末；现金、留存收益、债务、租赁、税项、投资、固定资产及营运资本跨期滚动。非现金 D&A、减值、股份支付、FV、汇兑等在 P&L 与 CFS 对应；现金税款、税费与递延税分开。
- 禁止硬填现金、债务、其他资产、其他负债、权益或隐藏桥接来配平；Checks 只报告，不得直接或间接回流进业务余额。情景开关不得屏蔽结构错误，缺失来源只能产生 LEAP / UNKNOWN，不能让会计等式例外。
- 税务表分别列税费、递延税项、应交税项和实际缴税现金。发行费用同时核对现金流、股本溢价和损益分类，防止净差额掩盖两个相反的错误。
- “其他”项目只有在不重大时才可按历史占比或固定余额预测，并写明依据；绝不能用来填平差额。

32–38 分钟｜完成交付前检查
- 使用已安装且适用的电子表格计算引擎全量重算，记录引擎 / 版本 / 时间；重新打开准确交付文件，同时核对公式与保存后的缓存值。只有设置“打开时重算”不算已完成重算；引擎不可用就明确保留未重算状态。
- 按每个实际 / 预测期间核对历史来源、利润表加总、收入叶子节点到总额、mix 权重、资产负债表、现金桥接及每项跨期滚动；如有月表，月度加总与年度、现金低点与月度 CFS 一并核对。写明按原单位计算的容差，不用四舍五入遮住差异。
- 检查无 #REF! / #DIV/0! / #VALUE!、无外部工作簿链接、无预测结果手工写死、无隐藏配平项。
- 对实际接入的收入驱动、毛利率、DIO / DSO / DPO、capex、提款 / 还款、税率、股利设计单项正负、零、边界及组合扰动。先记录获授权输入单元格、旧值 / 新值、预期方向或数值，再只改底层假设并重算；明细表 → P&L → CFO / CFI / CFF → Cash / Equity / BS 都检查，覆盖输入期及下一期。
- 测试日志逐项保存 case ID、输入、单位、基准、预期、实际 delta、容差、支持表影响、保护范围、警告、引擎与恢复结果。保护实际期、来源、公式、无关输入与前期；每个测试后恢复基准并重算，对照原始基准输出及保护单元格，不只把界面数值改回去。
- 来源忠实度、结构完整性、情景警告、预测经济性与独立审阅分别记录。约 35 分钟仍有差异，查原始映射、符号、期间与支持表关系；不删在范围内的驱动、不塞配平项。保留问题、修复位置和原测试重跑记录，诚实交付进度。

38–40 分钟｜交付
- 交付 ${outputSlug}_THREE_STATEMENT_MODEL_2028E.xlsx 与一页来源 / 核心假设 / LEAP / 限制说明；来源台账、逐期检查和扰动 / 恢复日志放在同一 run，不扩展为长报告。
- 第一份可读且通过基本自检的草稿即冻结版本与 SHA-256 给我；独立审阅按适用规则在同一版本上并行进行。审阅中不原地改稿，新修改另立修订并保留原意见；作者自检不替代独立审阅或对外使用授权。
- 说明这是新建、冻结后备提取还是后备修改；逐期三表是否平衡、是否真正重算、恢复是否完成、哪些来源 / LEAP / 问题仍开放。未完成的测试或审阅如实列出，不把时间到点当作完成。`;
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
    state.textContent = isAudience ? "等待 3 分钟预检" : "已有冻结资料 · 开工时核对更新";
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
      ${stateHeader("LIVE COMPANY CHALLENGE · 40 MINUTES", "你点一家公司，我们现场开建", "先确认公开资料，再搭公式驱动三表。过程中的来源、假设、检查结果与未完项都可查看。", "2023–2025A + H1 锚点 → 2028E")}
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
          <small id="roulette-action-status">交付：公式联动的三表 Excel、来源与假设说明。</small>
          <a class="secondary-action" href="../../fallback/models/index.html" target="_blank" rel="noopener noreferrer">查看六家公司的模型与假设 ↗</a>
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
      ${stateHeader("模型搭建路径 · MODEL BUILD", "从零搭表，或沿用三表模板", "有合适模板，就沿用工作表和公式；没有，就按目标公司的业务重新搭建。", "底稿事实 ≠ 模型结构")}
      <div class="genesis-overview-grid">
        <section class="genesis-business ruled-panel">
          <div class="genesis-panel-head"><span>业务是怎么说的</span><strong>先看原始依据，再明确模型要回答什么</strong></div>
          <ol>${statements.map((row, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><p>${escapeHtml(row.text)}</p><em>${escapeHtml(sourceLabel(row.source_type))}</em></li>`).join("")}</ol>
        </section>
        <section class="genesis-paths ruled-panel" data-testid="genesis-paths">
          <div class="genesis-panel-head"><span>构建路径选择</span><strong>选择模型架构，但不改变业务事实</strong></div>
          <div class="path-ledger">
            <article data-build-path="no-seed"><span>路径 A · 从零搭建</span><h4>按目标公司重新搭表</h4><p>从标准化输入出发，搭出一套公式联动的新工作簿。</p><ol>${noSeedFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><strong>适合业务结构特殊、没有合适模型结构的项目</strong></article>
            <article data-build-path="with-seed"><span>路径 B · 沿用标准模型结构</span><h4>从完整三表模板起步 · 当前演示路径</h4><p>业务结构匹配时，沿用已经定义工作表、单元格、公式关系和检查规则的完整三表模型结构。</p><ol>${withSeedFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><strong>结构可直接执行；填充值全部为合成演示数据</strong></article>
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
      ${stateHeader("项目完工进度模型骨架", "一套不带公司数据的模型结构", "标准模型结构给出可复用的业务项目、公式关系、检查规则与授权机制；本身不含任何企业数据。", `${seed.required_concept_slots.length} 个待填项目 · ${seed.formula_lineage.nodes.length} 个计算节点`)}
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

  const driverBasis = (driver) => ({
    revenue_growth: "对合成上年收入应用逐年增长假设；月度分配沿用合成历史季节性。",
    gross_margin: "参考 24 个月合成历史设定的毛利率假设。",
    selling_expense_ratio: "参考合成历史销售费用率设定。",
    admin_expense_ratio: "参考合成历史管理费用率设定。",
    rd_expense_ratio: "参考合成历史研发费用率设定。",
    other_opex_ratio: "参考合成历史其他经营费用率设定。",
    dso: "参考最近 12 个月合成 DSO 设定，非真实公司披露值。",
    dio: "参考最近 12 个月合成 DIO 设定，非真实公司披露值。",
    dpo: "参考最近 12 个月合成 DPO 设定，非真实公司披露值。",
    annual_capex: "明确列示的维护与增长资本开支假设。",
    annual_debt_repayment_requested: "这是申请还款额；支持表另列实际执行额和超额申请。",
    annual_dividends: "单独设定的合成分派假设。",
    tax_rate: "仅用于教学的税率假设，不代表公司实际税务处理。",
    interest_rate: "按月初债务计息；不因现金归集形成循环引用。",
    cash_floor: "明确的流动性底线，仅用于测算已列示授信的提款需求。",
    facility_limit: "提款受期末债务不超过该额度的上限约束。",
    ppe_remaining_life_months: "以期初净固定资产加半期资本开支作月度直线折旧简化估算。",
    tax_payment_lag_months: "当月支付现金税款等于上月应交税项。",
  }[driver.id] || "参数依据保留在完整结构文件；未补充的来源不视作已确认。");

  const driverAuthorization = (driver) => ({
    "Banker-confirmed scenario only": "须经负责建模的 Banker 确认，仅用于获授权情景",
    "Locked synthetic policy assumption": "锁定的合成政策假设",
    "Locked synthetic facility assumption": "锁定的合成授信假设",
    "Locked training control": "锁定的教学控制参数",
    "Locked synthetic facility limit": "锁定的合成授信额度",
    "Locked simplified accounting assumption": "锁定的简化会计假设",
  }[driver.authorization] || "保留原授权范围，未确认前不修改");

  // Disclosure-led design examples, deliberately separate from the scalar seed engine.
  const revenueBuildMethods = [
    {
      id: "dimensions", label: "业务 / 产品 / 地区", title: "先确定收入分在哪些互斥明细里",
      formula: "公司收入 = Σ 互斥叶子节点收入 − 分部间抵销",
      rows: [
        ["业务 → 产品", "用已披露业务、产品作主树；叶子节点只能属于一个收入分支。", "财务附注的分部收入、产品收入与会计口径"],
        ["地区 / 渠道", "有交叉披露才细分到产品 × 地区；平行口径只做核对，不相加。", "分地区 / 渠道表；未披露交叉结构不擅自分配"],
        ["销量 / ASP / Mix", "在有披露的叶子节点选择量价；同一层 mix 合计为 100%。", "同期间、同单位的销量和净售价；说明折扣与汇率"],
      ],
      check: "产品小计、地区小计、渠道小计各自回到同一个总收入。它们不是三份可以相加的收入；未分配及抵销单列。",
      leap: "未披露产品 × 地区交叉数据：保留产品主树，地区作为平行核对。若确需分配，必须登记分配假设与敏感性。",
    },
    {
      id: "volume", label: "销量 × 净 ASP", title: "把增长拆成卖多少、卖多贵、卖什么",
      formula: "收入 = Σ（各产品销量 × 各自净 ASP × 适用汇率）",
      rows: [
        ["销量", "上期销量 × (1 + 销量增长)；用需求、订单交付、产能利用率作依据。", "销售量 / 交付量；不能直接把产量当销量"],
        ["净 ASP", "同口径收入 ÷ 销量，或已披露净售价；预测列价格变化。", "不含税、折扣、返利和总额 / 净额口径一致"],
        ["产品组合 Mix", "可用总销量 × 产品销量权重 × 各自 ASP；权重合计 100%。", "销量权重与收入权重分开；ASP 已含 mix 就不重复加成"],
      ],
      check: "先验每个产品的量 × 价，再验产品收入合计。保持币种 / 单位一致；缺少销量时不拿“活动指数”冒充实际件数。",
      leap: "某产品未披露销量：该产品暂用收入增长假设，其余产品保留已披露量价。假设依据、范围、影响期与补证条件逐项登记。",
    },
    {
      id: "recurring", label: "订阅 / 经常性", title: "先滚动客户，再按服务期间确认收入",
      formula: "收入 = 时间加权付费客户 × 同期 ARPU + 单独确认的一次性收入",
      rows: [
        ["客户滚动", "期初客户 + 新增 − 流失 = 期末客户；分别定义续约与流失。", "付费客户定义、新增、流失及生效时间"],
        ["ARPU / 套餐", "按付费客户、套餐结构与价格计算；客户数和 ARPU 期间一致。", "披露 ARPU、套餐价格及是否包含一次性收入"],
        ["收入确认", "预收款和递延收入另作滚动；按服务已提供的期间确认。", "合同期限、收入政策；ARR、开票与现金回款不等于收入"],
      ],
      check: "客户期初到期末滚动闭合，时间加权客户不等于期末客户。经常性与一次性收入互斥，递延收入与收款另行勾稽。",
      leap: "只有收入、没有付费客户 / ARPU：不能造客户台账，改用已披露服务分部增长并标注 LEAP。",
    },
    {
      id: "stores", label: "门店 × 店效", title: "新店开多久，比年末有几家更重要",
      formula: "收入 = Σ（各类有效营业店月 × 对应月店效）",
      rows: [
        ["门店滚动", "期初门店 + 新开 − 关闭 = 期末门店；逐店或分批计算营业店月。", "直营 / 加盟定义，开业及关闭时间"],
        ["同店 / 新店", "成熟店按同店增长；新店按开业月份与爬坡曲线计算。", "同店口径、历史店效及公开开店计划"],
        ["净收入", "直营销售与加盟费 / 供货收入按各自确认政策分开。", "GMV 不当收入；总额法 / 净额法先核对"],
      ],
      check: "不能用年末店数乘全年店效；同店与新店不能重复包含，关店后的月份不继续产生店效。",
      leap: "只披露期末店数：开店时间与新店爬坡是独立假设，登记后做敏感性；不声称店月来自披露。",
    },
    {
      id: "customers", label: "客户 × 频次 × 客单", title: "客户增长与单客消费分开讲",
      formula: "收入 = 同期平均活跃客户 × 购买频次 × 净客单价",
      rows: [
        ["活跃客户", "明确去重口径与统计期间；新增、留存和流失有一致定义。", "活跃 / 付费客户定义与公开经营指标"],
        ["频次 / 客单", "订单数 ÷ 客户数为频次；净交易额 ÷ 订单数为净客单价。", "订单取消、退款、税费和期间保持一致"],
        ["平台业务", "若以净额法确认佣金，先算适用交易额，再按合同抽佣率与政策确认。", "GMV → 可计佣交易额 → 净收入桥接；非再乘一次客单价"],
      ],
      check: "客户、订单和客单价需来自相同人群与期间；一个收入分支只用一条生成路径，渠道汇总不重复计入。",
      leap: "活跃客户或购买频次未披露时，用分部增长假设保留可解释性；不得倒算出看似实际的客户经营台账。",
    },
    {
      id: "growth", label: "披露不足时的增长", title: "资料有限时，写清分部增长假设及依据",
      formula: "分部收入_t = 同口径分部收入_(t−1) × (1 + g_t)",
      rows: [
        ["已披露基数", "用真实分部收入，先桥接重列、并购或业务口径变更。", "来源文件 / 页码 / 表格 / 期间 / 单位"],
        ["逐期假设 g_t", "分别写历史趋势、中期信号、公开指引与建模判断。", "每期假设有自己的依据；不冒充销量增长或管理层指引"],
        ["补证与升级", "拿到同口径销量或客户数据后再换明细路径，并重新勾稽。", "LEAP ID、影响单元格、负责人、补证条件 / 到期日"],
      ],
      check: "分部增长先汇总出公司收入和加权增长；不得再给总收入叠加一次总体增长。H1 已披露收入 + H2 假设 = 全年收入。",
      leap: "示例 LEAP-REV-01：缺少分部销量与净 ASP，因此以已披露分部收入为基数；g_t 待选定公司并给出依据后填写，不预填公司预测数。",
    },
  ];
  let revenueMethodId = "dimensions";

  function renderRevenueDetail(target, driver) {
    const method = revenueBuildMethods.find((item) => item.id === revenueMethodId) || revenueBuildMethods[0];
    target.classList.add("is-revenue-design");
    target.dataset.revenueMethod = method.id;
    target.innerHTML = `
      <header><div><span>收入明细设计 · ${escapeHtml(method.label)}</span><h4>${escapeHtml(method.title)}</h4></div><strong>讲解层 · 不改数</strong></header>
      <div class="revenue-design-body">
        <p class="revenue-scope-note">这里讲真实公司应如何拆收入；选择左侧路径只切换说明，不会修改模型、工作簿或情景组合。当前合成模型仍只接入总体收入增长率。</p>
        <div class="revenue-hierarchy" aria-label="收入拆解层级"><span>公司</span><b>→</b><span>业务</span><b>→</b><span>产品</span><b>→</b><span>地区 / 渠道</span><small>仅在披露支持时继续拆分；平行口径不重复相加</small></div>
        <section class="revenue-formula"><span>拟建支持表的核心公式</span><code>${escapeHtml(method.formula)}</code></section>
        <div class="revenue-driver-rows">${method.rows.map(([name, logic, source]) => `<article><strong>${escapeHtml(name)}</strong><div><p>${escapeHtml(logic)}</p><small>来源门槛：${escapeHtml(source)}</small></div></article>`).join("")}</div>
        <div class="revenue-control-pair"><section><span>汇总检查</span><p>${escapeHtml(method.check)}</p></section><section><span>透明 LEAP 示例 · 非公司事实</span><p>${escapeHtml(method.leap)}</p></section></div>
        <p class="revenue-register-note">每项假设登记：业务 / 产品 / 地区 · 期间 · 单位 · 来源或 LEAP · 数值及依据 · 范围 · 影响单元格 · 负责人。收入明细 → 主表收入 → 成本 / 营运资本 → 现金与权益，重算后逐期验三表。</p>
        <details class="revenue-scalar-detail"><summary>查看当前合成模型：总体增长率 ${escapeHtml(driver.id)}（非以上明细）</summary>
          <div class="cell-seed-driver-periods">${Object.keys(driver.values).map((period) => `<article><span>${escapeHtml(period)}</span><strong>${escapeHtml(formatSeedValue(driver.values[period], driver.unit))}</strong><code>${escapeHtml(driver.cells[period])}</code><small>合成输入 · 网页只读展示</small></article>`).join("")}</div>
          <p>允许范围：${escapeHtml(`${formatSeedValue(driver.min, driver.unit)} — ${formatSeedValue(driver.max, driver.unit)}`)}。依据：${escapeHtml(driverBasis(driver))}授权要求：${escapeHtml(driverAuthorization(driver))}。新公司的细项输入须先建支持表并验证，不能把这里的总体增长率改名当作已接入的销量或 ASP。</p>
        </details>
      </div>`;
  }

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
      ${stateHeader("完整三表模型", "从假设，一直追到三张报表", "工作表、单元格、公式关系和检查项都可以展开。替换演示值后，沿同一套关系重新计算。", `${contract.sheet_count} 张工作表 · ${formatNumber(contract.formula_cell_count, 0)} 条公式`)}
      <div class="cell-seed-stats" data-testid="cell-seed-stats">${stats.map(([label, value, note]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`).join("")}</div>
      <div class="cell-seed-skeleton-grid">
        <section class="cell-seed-module-panel ruled-panel">
          <div class="genesis-panel-head"><span>六个内生联动模块</span><strong>共用同一套月度三表计算模型结构</strong></div>
          <div class="cell-seed-module-grid">${cellSeed.modules.map((module, index) => `<article data-seed-module="${escapeHtml(module.id)}"><b>${String(index + 1).padStart(2, "0")}</b><div><strong>${escapeHtml(module.label)}</strong><p>${escapeHtml(module.purpose)}</p><small>${escapeHtml(module.sheets.join(" → "))}</small></div></article>`).join("")}</div>
        </section>
        <section class="cell-seed-sheet-panel ruled-panel">
          <div class="genesis-panel-head"><span>工作表地图</span><strong>每个数都能回到具体工作表和单元格</strong></div>
          <div class="cell-seed-sheet-grid">${contract.workbook_sheets.map((sheet, index) => `<span class="${contract.support_sheets.includes(sheet) ? "is-support-sheet" : ""}"><b>${String(index + 1).padStart(2, "0")}</b>${escapeHtml(sheet)}</span>`).join("")}</div>
          <div class="cell-seed-integrity">
            <strong>完整三表模型结构已生成 · ${escapeHtml(cellSeed.full_seed_sha256.slice(0, 16))}…</strong>
            <p>合成值已填充并在源工作簿内生配平；不含真实项目名称、客户资料或本机路径。结构文件记录全工作簿 ${formatNumber(contract.nonempty_cell_count, 0)} 个非空单元格及 ${formatNumber(contract.dependency_edge_count, 0)} 条公式关系。</p>
            <div><button id="open-raw-seed" class="secondary-action" type="button">查看模型骨架摘要</button><a class="secondary-action cell-seed-json-link" href="${escapeHtml(cellSeed.full_seed_relative_path)}" target="_blank" rel="noopener">打开完整结构文件</a></div>
          </div>
        </section>
      </div>
      <div id="seed-drawer-scrim" class="seed-drawer-scrim" hidden></div>
      <aside id="seed-raw-drawer" class="seed-raw-drawer" aria-hidden="true" aria-label="三表模型结构摘要"><header><div><span>三表模型 · 结构文件</span><strong>完整三表模型 · 骨架摘要</strong><p class="seed-drawer-sub">演示数据 · 非真实项目 · 不可用于决策 · 完整底稿已锁定</p></div><button id="close-raw-seed" type="button">关闭</button></header><pre id="seed-raw-text"></pre></aside>`;
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
    document.querySelectorAll("[data-revenue-method]").forEach((button) => {
      if (button.tagName !== "BUTTON") return;
      const selected = driver.id === "revenue_growth" && button.dataset.revenueMethod === revenueMethodId;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const impacts = driverImpact[driver.id] || ["Formula dependency graph"];
    target.dataset.driverId = driver.id;
    target.classList.remove("is-revenue-design");
    delete target.dataset.revenueMethod;
    if (driver.id === "revenue_growth") {
      renderRevenueDetail(target, driver);
      return;
    }
    target.innerHTML = `
      <header><div><span>假设 ${String(index + 1).padStart(2, "0")} · ${escapeHtml(driver.id)}</span><h4>${escapeHtml(driver.label)}</h4></div><strong>${driver.editable ? "模型输入 · 页面只读" : "公式锁定"}</strong></header>
      <div class="cell-seed-driver-periods">${Object.keys(driver.values).map((period) => `<article><span>${escapeHtml(period)}</span><strong>${escapeHtml(formatSeedValue(driver.values[period], driver.unit))}</strong><code>${escapeHtml(driver.cells[period])}</code><small>输入值</small></article>`).join("")}</div>
      <dl class="cell-seed-driver-policy">
        <div><dt>允许范围</dt><dd>${escapeHtml(`${formatSeedValue(driver.min, driver.unit)} — ${formatSeedValue(driver.max, driver.unit)}`)}</dd></div>
        <div><dt>输入单位</dt><dd>${escapeHtml(driver.unit)}</dd></div>
        <div><dt>授权要求</dt><dd>${escapeHtml(driverAuthorization(driver))}</dd></div>
        <div><dt>参数依据</dt><dd>${escapeHtml(driverBasis(driver))}</dd></div>
      </dl>
      <section class="cell-seed-downstream"><span>会影响哪些结果</span><div>${impacts.map((impact) => `<b>${escapeHtml(impact)}</b>`).join("")}</div><p>完整结构文件保留全部公式关系；页面只展示这项假设的主要传导路径。</p></section>`;
  }

  function renderBinding(target) {
    const drivers = cellSeed.drivers;
    const body = `
      ${stateHeader("预测假设台账", "收入先拆业务，再选有依据的驱动", "先看收入明细如何搭，再看合成模型已经接入的输入。讲解路径不改模型；真实公司须另建有来源的支持表并检验三表联动。", `${drivers.length} 项合成假设 · 2027E–2029E`)}
      <div class="binding-summary cell-seed-binding-summary"><div><span>合成模型假设</span><strong>${drivers.length}</strong></div><div><span>模型可授权输入</span><strong>${drivers.filter((driver) => driver.editable).reduce((sum, driver) => sum + Object.keys(driver.values).length, 0)}</strong></div><div><span>锁定公式</span><strong>${formatNumber(cellSeed.workbook_contract.formula_cell_count, 0)} 项</strong></div><div><span>本页交互</span><strong>只读讲解 · 不改工作簿</strong></div></div>
      <div class="cell-seed-binding-grid">
        <section class="cell-seed-driver-index ruled-panel"><div class="genesis-panel-head"><span>收入明细设计</span><strong>选择讲解路径 · 披露支持才采用</strong></div><div class="revenue-method-index">${revenueBuildMethods.map((method) => `<button type="button" data-revenue-method="${method.id}" aria-pressed="false">${escapeHtml(method.label)}</button>`).join("")}</div><div class="genesis-panel-head"><span>已接入的合成模型输入</span><strong>收入 / 费用 / 营运资本 / 融资 / 税项</strong></div><div>${drivers.map((driver, index) => `<button type="button" class="cell-seed-driver-button" data-driver-index="${index}" data-driver-id="${escapeHtml(driver.id)}" aria-pressed="false"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(driver.id === "revenue_growth" ? "总体收入增长（合成）" : driver.label)}</span><small>${escapeHtml(driver.unit)}</small></button>`).join("")}</div></section>
        <section id="cell-seed-driver-detail" class="cell-seed-driver-detail" data-testid="cell-seed-driver-detail"></section>
      </div>`;
    target.innerHTML = shell("seed-binding", body);
    document.querySelectorAll(".cell-seed-driver-button").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.driverIndex);
      renderDriverDetail(drivers[index], index);
    }));
    const revenueIndex = Math.max(0, drivers.findIndex((driver) => driver.id === "revenue_growth"));
    document.querySelectorAll("button[data-revenue-method]").forEach((button) => button.addEventListener("click", () => {
      revenueMethodId = button.dataset.revenueMethod;
      renderDriverDetail(drivers[revenueIndex], revenueIndex);
    }));
    renderDriverDetail(drivers[revenueIndex], revenueIndex);
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
      ${stateHeader("公式上下游关系", "每条公式都能回到工作表、单元格和传导方向", "收入、费用、营运资金、固定资产、债务与三表按公式连接，每一步都能追到源单元格。", `${lineages.length} 条主链路 · ${checks.length} 项检查`)}
      <div class="cell-seed-lineage-tabs" aria-label="选择公式链路">${lineages.map((lineage, index) => `<button type="button" class="cell-seed-lineage-tab" data-lineage-index="${index}" data-lineage-id="${escapeHtml(lineage.id)}" aria-pressed="false"><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(lineage.label)}</span></button>`).join("")}</div>
      <div class="cell-seed-living-grid">
        <section id="cell-seed-lineage-detail" class="cell-seed-lineage-detail ruled-panel" data-testid="cell-seed-lineage-detail"></section>
        <section class="cell-seed-control-panel ruled-panel" data-testid="cell-seed-controls"><div class="genesis-panel-head"><span>源模型内部检查记录</span><strong>${escapeHtml(cellSeed.controls.status)} · ${checks.length}/${checks.length}</strong></div><div>${checks.map((check) => `<article><i class="lamp ${check.status === "PASS" ? "lamp-green" : "lamp-amber"}"></i><span>${escapeHtml(check.label)}</span><strong>${escapeHtml(formatSeedValue(check.max_abs_value))}</strong><small>容差 ${escapeHtml(formatSeedValue(check.tolerance))}</small></article>`).join("")}</div><p>这些检查只证明演示模型结构内部自洽；换成目标公司的真实数据后，必须重新检查。</p></section>
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
      ${stateHeader("BANKER 业务模块台账", "三种收入构建方式，共用同一套完整三表模型结构", "项目进度、在手订单转化与销量 × 单价只决定收入及毛利的构建方式；费用、营运资金、固定资产、债务、税项与三表仍沿用同一套公式关系。", "先选收入逻辑，再接入完整三表")}
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
      target.innerHTML = `<div class="genesis-error"><strong>模型结构数据不可用</strong><p>集成后的演示数据未能加载。</p></div>`;
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
