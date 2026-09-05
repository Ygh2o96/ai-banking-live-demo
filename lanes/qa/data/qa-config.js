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
        title: "先例检索实跑案例",
        status: "待上传",
        summary: "培训结束后，我们会整理本次真实检索的题目、候选结果、原文定位和人工取舍，放到这里供复看。",
        fileLabel: "打开先例检索实跑材料",
        href: "__PRECEDENT_CASE_URL_OR_FILE__",
        metadata: Object.freeze([
          Object.freeze({ label: "交付内容", value: "检索题目、候选清单、原文定位、Banker 取舍" }),
          Object.freeze({ label: "证据口径", value: "保留来源、页码与适用性判断" }),
          Object.freeze({ label: "预计更新", value: "培训结束后整理上传" }),
        ]),
      }),
      Object.freeze({
        id: "financial-model-run",
        title: "财务模型实跑案例",
        status: "待上传",
        summary: "培训结束后，我们会把本次真实建模的输入口径、关键输出、检查结果和限制说明补充到这里。",
        fileLabel: "打开财务模型实跑材料",
        href: "__FINANCIAL_MODEL_CASE_URL_OR_FILE__",
        metadata: Object.freeze([
          Object.freeze({ label: "交付内容", value: "输入口径、模型输出、关键检查、限制说明" }),
          Object.freeze({ label: "证据口径", value: "区分系统生成、人工判断与待确认事项" }),
          Object.freeze({ label: "预计更新", value: "培训结束后整理上传" }),
        ]),
      }),
    ]),
  });
})();
