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
        id: "precedent-search-run",
        title: "先例检索案例",
        status: "六个议题",
        summary: "从第三方付款到 Entity List 客户销售，查看案例比较、原文页码和适用边界。",
        fileLabel: "打开先例检索案例",
        href: "../../fallback/precedents/index.html",
        metadata: Object.freeze([
          Object.freeze({ label: "交付内容", value: "检索题目、候选清单、原文定位、Banker 取舍" }),
          Object.freeze({ label: "证据口径", value: "保留来源、页码与适用性判断" }),
          Object.freeze({ label: "案例范围", value: "30 份案例记录，边界案例单独标明" }),
        ]),
      }),
      Object.freeze({
        id: "financial-model-run",
        title: "财务模型案例",
        status: "六家公司",
        summary: "查看公开年报、业务假设与三表联动；下载后可以直接调整驱动因素。",
        fileLabel: "打开财务模型案例",
        href: "../../fallback/models/index.html",
        metadata: Object.freeze([
          Object.freeze({ label: "交付内容", value: "输入口径、模型输出、关键检查、限制说明" }),
          Object.freeze({ label: "假设说明", value: "披露不足处列明 LEAP、理由和影响" }),
          Object.freeze({ label: "使用范围", value: "教学模型，预测为演示假设" }),
        ]),
      }),
    ]),
  });
})();
