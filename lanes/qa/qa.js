(() => {
  "use strict";

  const config = window.QA_EVIDENCE_CONFIG;
  const caseList = document.getElementById("qa-case-list");
  const siteStatus = document.getElementById("qa-site-status");
  const siteUrl = document.getElementById("qa-url-value");
  const siteLink = document.getElementById("qa-site-link");
  const qrVisual = document.getElementById("qa-qr-visual");
  const boundaryCopy = document.getElementById("qa-boundary-copy");

  function isInjected(value) {
    return typeof value === "string"
      && value.trim() !== ""
      && !/^__[A-Z0-9_]+__$/.test(value.trim());
  }

  function safeHref(value) {
    if (!isInjected(value)) return null;
    try {
      const resolved = new URL(value, window.location.href);
      return ["http:", "https:", "file:"].includes(resolved.protocol) ? resolved.href : null;
    } catch (_error) {
      return null;
    }
  }

  function isLocalQrAsset(value) {
    if (!isInjected(value)) return false;
    const trimmed = value.trim();
    return !/^(?:[a-z]+:)?\/\//i.test(trimmed) && !/^data:/i.test(trimmed);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderSiteTarget() {
    const href = safeHref(config.finalSiteUrl);
    if (!href) return;

    siteStatus.textContent = "页面已上线";
    siteStatus.classList.add("is-ready");
    siteUrl.textContent = href;
    if (boundaryCopy) boundaryCopy.textContent = "可以从屏幕上的任何一步开始，也可以直接问适用边界、人工判断和落地方式。";
    siteLink.replaceChildren();
    const link = element("a", "", "打开完整演示");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";
    siteLink.appendChild(link);

    if (!isLocalQrAsset(config.qrAsset)) {
      qrVisual.setAttribute("aria-label", "二维码暂不可用，请使用下方网址");
      qrVisual.querySelector(".qa-qr-wait").textContent = "请使用下方网址";
      return;
    }

    const image = new Image();
    image.alt = "扫描二维码打开完整演示页面";
    image.addEventListener("load", () => {
      qrVisual.replaceChildren(image);
      qrVisual.setAttribute("aria-label", image.alt);
    });
    image.addEventListener("error", () => {
      qrVisual.querySelector(".qa-qr-wait").textContent = "图片载入失败";
      qrVisual.setAttribute("aria-label", "二维码图片载入失败");
    });
    image.src = config.qrAsset;
  }

  function renderCase(item, index) {
    const article = element("article", "qa-case");
    article.dataset.caseId = item.id || `case-${index + 1}`;

    article.appendChild(element("div", "case-number", String(index + 1).padStart(2, "0")));

    const main = element("div", "case-main");
    const heading = element("div", "case-heading");
    heading.appendChild(element("h3", "", item.title || "未命名案例"));
    heading.appendChild(element("span", "status-chip", item.status || "待更新"));
    main.appendChild(heading);
    main.appendChild(element("p", "", item.summary || "案例资料待更新。"));

    const href = safeHref(item.href);
    if (href) {
      const link = element("a", "case-link", item.fileLabel || "打开案例资料");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener";
      main.appendChild(link);
    } else {
      main.appendChild(element("span", "case-link-pending", "案例资料待补充"));
    }
    if (Array.isArray(item.links)) {
      item.links.forEach((entry) => {
        const extraHref = safeHref(entry.href);
        if (!extraHref) return;
        const extra = element("a", "case-link", entry.label || "打开资料");
        extra.href = extraHref;
        extra.target = "_blank";
        extra.rel = "noopener";
        if (entry.download) extra.download = "";
        extra.style.marginRight = "18px";
        main.appendChild(extra);
      });
    }
    article.appendChild(main);

    const metadata = element("dl", "case-meta");
    const rows = Array.isArray(item.metadata) ? item.metadata : [];
    rows.forEach((row) => {
      const line = document.createElement("div");
      line.appendChild(element("dt", "", row.label || "说明"));
      line.appendChild(element("dd", "", row.value || "待补充"));
      metadata.appendChild(line);
    });
    article.appendChild(metadata);
    return article;
  }

  function renderCases() {
    caseList.replaceChildren();
    const cases = Array.isArray(config.cases) ? config.cases : [];
    if (!cases.length) {
      caseList.appendChild(element("div", "qa-empty", "尚未配置案例资料。"));
      return;
    }
    cases.forEach((item, index) => caseList.appendChild(renderCase(item, index)));
  }

  if (!config || typeof config !== "object") {
    caseList.replaceChildren(element("div", "qa-error", "页面配置未载入，请检查 data/qa-config.js。"));
    siteStatus.textContent = "配置载入失败";
    return;
  }

  renderSiteTarget();
  renderCases();
})();
