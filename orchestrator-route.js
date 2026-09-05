(function exposeOrchestratorRoute(root, factory) {
  "use strict";

  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  root.OrchestratorRoute = contract;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  "use strict";

  const RAG_STATES = Object.freeze(["rag-live", "rag-engine", "results"]);

  function normalizeScene(value, state) {
    if (value === "hero1" && state === "seed-skeleton") return "hero3";
    if (value === "hero3" && state === "company-roulette") return "hero1";
    return ["hero1", "hero2", "hero3", "hero4", "hero5"].includes(value) ? value : "hero1";
  }

  function normalizeState(scene, state) {
    if (scene === "hero1") return "company-roulette";
    if (scene === "hero3") return RAG_STATES.includes(state) ? state : "rag-live";
    return "";
  }

  function resolve(value, state) {
    const scene = normalizeScene(value, state);
    return Object.freeze({ scene, state: normalizeState(scene, state) });
  }

  function applyToUrl(input, scene, state) {
    const resolved = resolve(scene, state);
    const route = new URL(input);
    route.searchParams.set("scene", resolved.scene);
    route.searchParams.delete("state");
    if (resolved.state) route.searchParams.set("state", resolved.state);
    return route;
  }

  return Object.freeze({ RAG_STATES, normalizeScene, normalizeState, resolve, applyToUrl });
});
