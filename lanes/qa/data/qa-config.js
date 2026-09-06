(() => {
  "use strict";

  /*
   * BUILD-TIME INJECTION SEAM
   * 1. Replace finalSiteUrl with the final deployed page URL.
   * 2. Generate a QR from that exact URL, save it inside this lane, then replace qrAsset
   *    with the local relative asset path. The page never fabricates a QR.
   * 3. Replace each case href when its real output is ready.
   */
  window.QA_EVIDENCE_CONFIG = Object.freeze({
    finalSiteUrl: "https://ygh2o96.github.io/ai-banking-live-demo/",
    qrAsset: "assets/final-site-qr.png",
    cases: Object.freeze([
      Object.freeze({
        id: "entity-list-live-report",
        title: "Entity List 客户销售  香港 IPO 先例研究",
        status: "演示期间实时生成",
        summary: "五家发行人的产品、收入、交易时间及 EAR 许可分析；另列爱芯元智的 Footnote 生效时间对照。附正式招股书链接与准确页码。",
        fileLabel: "阅读及下载研究报告",
        href: "../../live/precedent-search/index.html",
        metadata: Object.freeze([
          Object.freeze({ label: "生成日期", value: "2026年9月6日 · 演示期间编制，随后修订" }),
          Object.freeze({ label: "报告内容", value: "案例比较、律师意见、披露及尽调事项" }),
          Object.freeze({ label: "文件格式", value: "PDF · Word 可编辑版 · 仿宋" }),
        ]),
      }),
      Object.freeze({
        id: "financial-model-run",
        title: "公牛集团 · 演示模型修订",
        status: "演示后修订 · r4b",
        summary: "演示模型的后续修订：2026H1实际三表汇总、30个月预测、投资赎回与有限RCF。基准现金高于底线；未落实融资条款明确列示。",
        fileLabel: "查看现场版本与来源说明",
        href: "../../live/financial-model/index.html",
        links: Object.freeze([
          Object.freeze({ label: "下载 Excel", href: "../../live/financial-model/603195_SH_THREE_STATEMENT_MODEL_2028E.xlsx", download: true }),
          Object.freeze({ label: "打开一页说明 PDF", href: "../../live/financial-model/GONGNIU_PFM_ONE_PAGE_r4b.pdf" }),
        ]),
        metadata: Object.freeze([
          Object.freeze({ label: "生成版本", value: "2026-09-07 演示后修订 r4b" }),
          Object.freeze({ label: "模型范围", value: "产品量价、生产库存、人工费用、资产融资与月度三表" }),
          Object.freeze({ label: "使用边界", value: "公开教学；异构QA未完成；非申报级PFM" }),
        ]),
      }),
    ]),
  });
})();
