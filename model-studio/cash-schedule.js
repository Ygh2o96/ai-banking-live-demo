/** Local monthly cash editor. The host owns project revisions and persistence.
 * const editor = createCashScheduleEditor({api, onApply: row => updateDraft(row), onDirty});
 * await editor.open({projectId, row}); // close()/destroy() preserve dirty edits unless discarded.
 * Load cash-schedule.css once in the host document. No imports or provider calls.
 */
const CASH_DRIVERS = new Set(['capex', 'dividends', 'debt_draw', 'debt_repayment', 'contract_additions']);
const CASH_LABELS = {capex:'资本开支', dividends:'股息支付', debt_draw:'新增借款', debt_repayment:'偿还借款', contract_additions:'新增合同金额'};
let editorSequence = 0;
const copy = value => JSON.parse(JSON.stringify(value));
const monthIndex = value => {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(String(value || ''));
  return match && Number(match[1]) >= 1 ? Number(match[1]) * 12 + Number(match[2]) - 1 : null;
};
function monthsBetween(start, end) {
  const first = monthIndex(start), last = monthIndex(end);
  if (first === null || last === null) throw new Error('请填写完整的起止月份。');
  if (last < first) throw new Error('结束月份不能早于开始月份。');
  if (last - first + 1 > 60) throw new Error('每次最多安排 60 个月，请调整起止月份。');
  return Array.from({length:last - first + 1}, (_, i) => {
    const index = first + i;
    return `${String(Math.floor(index / 12)).padStart(4, '0')}-${String(index % 12 + 1).padStart(2, '0')}`;
  });
}
function decimal(raw) {
  const text = String(raw).trim();
  const match = /^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d+))?$/.exec(text);
  if (!match || !Number.isFinite(Number(text))) return null;
  const exponent = Number(match[3] || 0);
  if (!Number.isFinite(exponent) || Math.abs(exponent) > 400) return null;
  const [whole, fraction = ''] = match[2].split('.');
  let coefficient = BigInt((whole || '0') + fraction) * (match[1] === '-' ? -1n : 1n);
  let scale = fraction.length - exponent;
  if (scale > 400) return null;
  if (scale < 0) { coefficient *= 10n ** BigInt(-scale); scale = 0; }
  while (scale > 0 && coefficient % 10n === 0n) { coefficient /= 10n; scale -= 1; }
  return {coefficient, scale};
}
function combine(left, right, subtract = false) {
  const scale = Math.max(left.scale, right.scale);
  return {coefficient:left.coefficient * 10n ** BigInt(scale - left.scale) + (subtract ? -1n : 1n) * right.coefficient * 10n ** BigInt(scale - right.scale), scale};
}
function decimalText(value) {
  const negative = value.coefficient < 0n;
  let digits = (negative ? -value.coefficient : value.coefficient).toString().padStart(value.scale + 1, '0');
  if (value.scale) digits = `${digits.slice(0, -value.scale)}.${digits.slice(-value.scale)}`.replace(/\.?0+$/, '');
  const [whole, fraction] = digits.split('.');
  return `${negative ? '−' : ''}${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${fraction ? `.${fraction}` : ''}`;
}
function amount(raw) {
  const text = raw === null || raw === undefined ? '' : String(raw).trim();
  if (!text) return {missing:true};
  // Bound hostile/accidental pasted input before constructing a BigInt.
  if (text.length > 400) return {error:'金额过长，请核对数值。'};
  const value = Number(text), precise = decimal(text);
  if (!precise || value < 0) return {error:'请填写非负的有限金额；没有发生的月份请明确填 0。'};
  const saved = decimal(String(value));
  if (combine(precise, saved, true).coefficient !== 0n) return {error:'小数精度超出可保存范围，请核对并缩短数值。'};
  return {value, precise:saved};
}
const scalarAmount = value => typeof value === 'number' ? amount(value) : {error:'采用总额尚未填写为有效数值。'};
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

export function createCashScheduleEditor({api, onApply, onDirty = () => {}} = {}) {
  if (typeof onApply !== 'function') throw new TypeError('Cash schedule editor requires onApply(row).');
  const prefix = `cash-schedule-${++editorSequence}`;
  const dialog = node('dialog', 'cash-schedule');
  dialog.setAttribute('aria-labelledby', `${prefix}-title`);
  dialog.setAttribute('aria-describedby', `${prefix}-intro`);
  dialog.innerHTML = `
    <div class="cash-schedule__head"><div><p class="cash-schedule__eyebrow">分月安排</p><h2 id="${prefix}-title"></h2></div><button type="button" class="cash-schedule__close" aria-label="关闭分月安排">关闭</button></div>
    <div class="cash-schedule__body">
      <p id="${prefix}-intro" class="cash-schedule__intro">把已采用的总额安排到具体月份。空白表示尚未确定；没有发生的月份也请明确填入 0。</p>
      <section class="cash-schedule__source"><div><span>本次采用总额</span><strong data-total></strong><small data-unit></small></div><details><summary>查看保留的原始依据</summary><blockquote data-quote></blockquote><p data-source-note></p></details></section>
      <p class="cash-schedule__calendar" data-calendar role="status">正在读取已确认的预测月份…</p>
      <div class="cash-schedule__span"><label>开始月份<input type="month" data-start min="0001-01" max="9999-12"></label><label>结束月份<input type="month" data-end min="0001-01" max="9999-12"></label><button type="button" data-span>列出每月金额</button></div>
      <button type="button" class="cash-schedule__link" data-forecast hidden>使用当前预测月份范围</button>
      <p class="cash-schedule__hint">可包含历史月份以核对完整预算。历史月份的分配不会改写实际试算表；预测范围以外的金额也不会自动转入预测期。</p>
      <section class="cash-schedule__decision" data-outside hidden aria-live="polite"><h3>缩短月份会移除已填写的金额</h3><p>这些金额仍保留在当前编辑中，请先核对。</p><ul data-outside-list></ul><div class="cash-schedule__actions"><button type="button" data-keep>保留原月份</button><button type="button" class="cash-schedule__danger" data-discard-outside>明确移除所列金额并调整月份</button></div></section>
      <p class="cash-schedule__error" data-error role="alert" hidden></p>
      <div class="cash-schedule__stats" aria-live="polite" aria-atomic="true"><div><span>已安排金额</span><strong data-sum>0</strong></div><div><span data-difference-label>尚未安排</span><strong data-difference>—</strong></div><div><span>尚未填写</span><strong data-missing>—</strong></div></div>
      <p class="cash-schedule__hint" data-validation>选择起止月份后，逐月填写金额。</p>
      <div class="cash-schedule__table-wrap" tabindex="0" aria-label="逐月安排金额"><table><thead><tr><th scope="col">月份</th><th scope="col">用途</th><th scope="col">安排金额</th></tr></thead><tbody data-months></tbody></table><p class="cash-schedule__empty" data-empty>尚未选择月份。每月金额由你填写。</p></div>
      <div class="cash-schedule__confirm"><label><input type="checkbox" data-timing>我已核对各月发生时间，包括明确填写为 0 的月份。</label><label><input type="checkbox" data-total-confirm>我已核对分月合计与本次采用总额一致。</label></div>
      <section class="cash-schedule__decision" data-close-prompt hidden aria-live="polite"><h3>本次编辑尚未应用</h3><p>可以继续编辑或先保留草稿。关闭并放弃只会移除本次窗口中的修改。</p><div class="cash-schedule__actions"><button type="button" data-resume>继续编辑</button><button type="button" class="cash-schedule__danger" data-abandon>放弃本次修改并关闭</button></div></section>
    </div>
    <div class="cash-schedule__foot"><p>应用后返回假设表；保存整张表后才会写入项目。</p><div class="cash-schedule__actions"><button type="button" data-draft>保留未完成草稿</button><button type="button" class="cash-schedule__primary" data-apply>应用已确认的分月安排</button></div></div>`;
  document.body.append(dialog);
  const get = selector => dialog.querySelector(selector);
  const startInput = get('[data-start]'), endInput = get('[data-end]');
  let session = null, generation = 0, applying = false, destroyRequested = false, disposed = false;
  function error(message = '') { get('[data-error]').textContent = message; get('[data-error]').hidden = !message; }
  function dirty() {
    if (!session) return;
    session.dirty = true;
    get('[data-timing]').checked = false;
    get('[data-total-confirm]').checked = false;
    onDirty();
  }
  function refreshStats() {
    if (!session) return;
    let sum = {coefficient:0n, scale:0}, missing = 0, invalid = 0;
    for (const month of session.months) {
      const entry = amount(session.values[month]);
      if (entry.missing) missing += 1;
      else if (entry.error) invalid += 1;
      else sum = combine(sum, entry.precise);
    }
    const total = scalarAmount(session.row.value);
    const difference = !total.error && !total.missing ? combine(total.precise, sum, true) : null;
    get('[data-sum]').textContent = decimalText(sum);
    get('[data-difference]').textContent = difference ? decimalText({...difference, coefficient:difference.coefficient < 0n ? -difference.coefficient : difference.coefficient}) : '—';
    get('[data-difference-label]').textContent = !difference ? '总额待核对' : difference.coefficient < 0n ? '超出总额' : difference.coefficient === 0n ? '与总额差额' : '尚未安排';
    get('[data-missing]').textContent = session.months.length ? String(missing) : '—';
    get('[data-validation]').textContent = !session.months.length ? '选择起止月份后，逐月填写金额。' : invalid ? `有 ${invalid} 个月金额无效；合计暂未计入这些金额，请逐项修改。` : missing ? `还有 ${missing} 个月未填写。差额仅供核对，不会自动分配。` : difference?.coefficient === 0n ? '金额已逐月填写且合计一致；请核对发生时间并勾选下方确认。' : '分月金额与采用总额尚未一致。请核对每月安排或返回假设表修改总额。';
    return {sum, missing, invalid, total, difference};
  }
  function monthPurpose(month) {
    if (!session.calendar.length) return ['待核对', ''];
    if (session.calendar.includes(month)) return ['预测月份', 'cash-schedule__forecast'];
    if (month < session.calendar[0]) return ['历史月份 · 不改写实际数', 'cash-schedule__historic'];
    return ['当前预测范围以外', 'cash-schedule__historic'];
  }
  function renderMonths() {
    const body = get('[data-months]'); body.replaceChildren();
    for (const month of session.months) {
      const row = node('tr'); row.append(node('th', '', month)); row.firstChild.scope = 'row';
      const [purpose, className] = monthPurpose(month), purposeCell = node('td', className, purpose);
      purposeCell.dataset.purpose = month; row.append(purposeCell);
      const cell = node('td'), input = node('input');
      input.type = 'text'; input.inputMode = 'decimal'; input.autocomplete = 'off'; input.maxLength = 400;
      input.value = session.values[month] ?? ''; input.placeholder = '待确定';
      input.setAttribute('aria-label', `${month} 安排金额`); input.dataset.month = month;
      const hint = node('span', 'cash-schedule__input-error'); hint.id = `${prefix}-${month}-error`;
      input.setAttribute('aria-describedby', hint.id);
      const validate = () => { const result = amount(input.value); hint.textContent = result.error || ''; input.setAttribute('aria-invalid', String(Boolean(result.error))); };
      input.addEventListener('input', () => { session.values[month] = input.value; dirty(); error(); validate(); refreshStats(); });
      validate(); cell.append(input, hint); row.append(cell); body.append(row);
    }
    get('[data-empty]').hidden = Boolean(session.months.length);
    refreshStats();
  }
  function commitSpan(months, discard = []) {
    for (const month of discard) delete session.values[month];
    session.months = months; session.start = months[0]; session.end = months.at(-1); session.pending = null;
    startInput.value = session.start; endInput.value = session.end;
    get('[data-outside]').hidden = true; error(); dirty(); renderMonths();
  }
  function chooseSpan() {
    if (!session || applying) return;
    let months;
    try { months = monthsBetween(startInput.value, endInput.value); } catch (exception) { error(exception.message); return; }
    const outside = Object.keys(session.values).filter(month => String(session.values[month] ?? '').trim() !== '' && !months.includes(month));
    if (outside.length) {
      session.pending = {months, outside};
      const list = get('[data-outside-list]'); list.replaceChildren();
      outside.sort().forEach(month => list.append(node('li', '', `${month}：${session.values[month]}`)));
      get('[data-outside]').hidden = false; error('请先确认是否移除列出的金额，当前分月表仍按原月份保留。');
      return;
    }
    commitSpan(months);
  }
  function hide() { generation += 1; dialog.close(); session = null; applying = false; }
  function requestClose() {
    if (applying) return false;
    if (session?.dirty) { get('[data-close-prompt]').hidden = false; get('[data-resume]').focus(); return false; }
    if (dialog.open) hide();
    return true;
  }
  async function apply(complete) {
    if (!session || applying) return;
    error();
    if (!session.months.length || session.pending || startInput.value !== session.start || endInput.value !== session.end) { error('请先点击“列出每月金额”，并处理月份范围内外的安排。'); return; }
    const results = refreshStats();
    if (results.invalid) { error('请先改正无效金额；未确定的月份可以留空后保留草稿。'); return; }
    const outside = Object.keys(session.values).filter(month => !session.months.includes(month) && String(session.values[month] ?? '').trim() !== '');
    if (outside.length) { chooseSpan(); return; }
    if (results.total.error || results.total.missing) { error('请先返回假设表填写有效的非负总额，再保留草稿或确认分月安排。'); return; }
    if (complete && results.missing) { error('每个月都须明确填写金额，没有发生的月份请填 0。'); return; }
    if (complete && results.difference.coefficient !== 0n) { error('分月合计尚未等于本次采用总额，不能确认完成。'); return; }
    if (complete && (!get('[data-timing]').checked || !get('[data-total-confirm]').checked)) { error('请分别勾选发生时间与分月合计的确认。'); return; }
    const updated = copy(session.row);
    updated.values = Object.fromEntries(session.months.map(month => { const parsed = amount(session.values[month]); return [month, parsed.missing ? null : parsed.value]; }));
    updated.cash_allocation = {start_month:session.start, end_month:session.end, total:session.row.value, confirmed:complete};
    if (!complete) updated.status = 'proposed';
    applying = true; dialog.setAttribute('aria-busy', 'true');
    const controls = [...dialog.querySelectorAll('button,input')], disabled = controls.map(control => control.disabled);
    controls.forEach(control => { control.disabled = true; });
    try { await onApply(updated); session.dirty = false; hide(); if (destroyRequested) { dialog.remove(); disposed = true; } }
    catch (exception) { error(exception?.message || '分月安排未能返回假设表，本次输入仍保留，请重试。'); }
    finally { applying = false; dialog.removeAttribute('aria-busy'); controls.forEach((control, index) => { control.disabled = disabled[index]; }); }
  }
  get('[data-span]').addEventListener('click', chooseSpan);
  for (const input of [startInput, endInput]) input.addEventListener('input', () => { session.pending = null; get('[data-outside]').hidden = true; dirty(); error(); });
  get('[data-forecast]').addEventListener('click', () => { startInput.value = session.calendar[0]; endInput.value = session.calendar.at(-1); dirty(); chooseSpan(); });
  get('[data-keep]').addEventListener('click', () => { startInput.value = session.start; endInput.value = session.end; session.pending = null; get('[data-outside]').hidden = true; error(); });
  get('[data-discard-outside]').addEventListener('click', () => { if (session.pending) commitSpan(session.pending.months, session.pending.outside); });
  get('[data-draft]').addEventListener('click', () => apply(false));
  get('[data-apply]').addEventListener('click', () => apply(true));
  get('.cash-schedule__close').addEventListener('click', requestClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
  get('[data-resume]').addEventListener('click', () => { destroyRequested = false; get('[data-close-prompt]').hidden = true; });
  get('[data-abandon]').addEventListener('click', () => { hide(); if (destroyRequested) { dialog.remove(); disposed = true; } });
  for (const checkbox of [get('[data-timing]'), get('[data-total-confirm]')]) checkbox.addEventListener('change', () => { session.dirty = true; onDirty(); });
  return {
    async open({projectId, row} = {}) {
      if (disposed) throw new Error('此编辑窗口已移除，请重新创建后打开。');
      if (!row || !CASH_DRIVERS.has(row.id)) throw new Error('此分月安排只适用于已支持的现金收支或新增合同金额。');
      if (session?.dirty || applying) { requestClose(); throw new Error('请先保留或放弃当前窗口的修改，再打开另一项安排。'); }
      if (dialog.open) hide();
      destroyRequested = false;
      const token = ++generation, allocation = row.cash_allocation || {};
      session = {row:copy(row), values:{}, months:[], start:'', end:'', calendar:[], pending:null, dirty:false};
      if (row.values && typeof row.values === 'object' && !Array.isArray(row.values)) for (const [month, value] of Object.entries(row.values)) session.values[month] = value === null || value === undefined ? '' : String(value);
      if (monthIndex(allocation.start_month) !== null && monthIndex(allocation.end_month) !== null) {
        try { session.months = monthsBetween(allocation.start_month, allocation.end_month); session.start = allocation.start_month; session.end = allocation.end_month; } catch { /* Retain all values for explicit span repair. */ }
      }
      startInput.value = session.start; endInput.value = session.end;
      get(`#${prefix}-title`).textContent = `${row.label || CASH_LABELS[row.id]} · 分月安排`;
      const total = scalarAmount(row.value);
      get('[data-total]').textContent = total.error || total.missing ? '待核对' : decimalText(total.precise);
      get('[data-unit]').textContent = row.unit ? `单位：${row.unit}` : '金额单位待确认，请与假设表保持一致。';
      get('[data-quote]').textContent = row.source_quote || '尚未关联原文，请在假设表补充采用依据。';
      get('[data-source-note]').textContent = row.source_date ? `原文日期：${row.source_date}` : '原文及本次采用总额在此处仅供核对；修改请返回假设表。';
      for (const selector of ['[data-outside]', '[data-close-prompt]', '[data-forecast]']) get(selector).hidden = true;
      get('[data-timing]').checked = false; get('[data-total-confirm]').checked = false;
      get('[data-calendar]').textContent = '正在读取已确认的预测月份…'; error(); renderMonths();
      dialog.showModal(); startInput.focus();
      try {
        if (typeof api !== 'function' || !projectId) throw new Error('Calendar unavailable');
        const data = await api(`/api/projects/${encodeURIComponent(projectId)}/schedule-calendar`, {method:'GET'});
        if (token !== generation || !session) return;
        const periods = data?.forecast_periods;
        if (!Array.isArray(periods) || !periods.length || periods.length > 60 || periods.some(month => monthIndex(month) === null)) throw new Error('Calendar unavailable');
        session.calendar = [...new Set(periods)].sort();
        get('[data-calendar]').textContent = `当前预测月份：${session.calendar[0]} 至 ${session.calendar.at(-1)}。请按原始预算覆盖的时间选择安排范围。`;
        get('[data-forecast]').hidden = false;
        for (const cell of dialog.querySelectorAll('[data-purpose]')) {
          const [purpose, className] = monthPurpose(cell.dataset.purpose);
          cell.textContent = purpose; cell.className = className;
        }
      } catch {
        if (token !== generation || !session) return;
        get('[data-calendar]').textContent = '暂未取得预测月份，请先确认历史试算表及其口径。仍可按资料填写起止月份；历史与预测归属须待口径确认后核对。';
      }
    },
    close:requestClose,
    destroy() { if (!requestClose()) { destroyRequested = true; return false; } generation += 1; dialog.remove(); disposed = true; return true; }
  };
}
