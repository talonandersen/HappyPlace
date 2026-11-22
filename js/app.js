/* HappyPlace — a research-based, personal well-being checklist for families.
   All data lives in this browser's localStorage. No accounts, no analytics. */
(() => {
  "use strict";

  const KEY = "happyplace.v1";
  const A = window.HP_ACTIVITIES;
  const S = window.HP_SOURCES;
  const $view = document.getElementById("view");
  const $sheet = document.getElementById("sheet");

  // ---------- storage ----------
  const blank = () => ({ profiles: [], activeId: null, data: {} });
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { return blank(); }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast("Couldn't save on this device (storage may be full or blocked)."); }
  }

  // ---------- helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const dk = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parse(k); d.setDate(d.getDate() + n); return dk(d); };
  const todayK = () => dk(new Date());
  const weekStartK = (k) => { const d = parse(k); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dk(d); };
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const fmtDate = (k) => parse(k).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const shortDate = (k) => parse(k).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const variance = (a) => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, a.length - 1); };
  const round = (n, d = 0) => { const f = 10 ** d; return Math.round(n * f) / f; };
  const actById = (id) => A.find((a) => a.id === id);
  const bandOf = (age) => (age < 10 ? "child" : age < 18 ? "teen" : "adult");

  const P = () => state.profiles.find((p) => p.id === state.activeId);
  function D(pid = state.activeId) {
    const d = state.data[pid] || (state.data[pid] = {});
    d.days ||= {}; d.who5 ||= []; d.fit ||= {}; d.workouts ||= []; d.lifts ||= [];
    return d;
  }
  const emptyDay = () => ({ done: {}, minutes: {}, plate: {}, kcal: {} });
  const dayR = (k) => D().days[k] || emptyDay();
  function dayW(k) {
    const d = D().days;
    d[k] ||= emptyDay();
    d[k].done ||= {}; d[k].minutes ||= {}; d[k].plate ||= {}; d[k].kcal ||= {};
    return d[k];
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.setAttribute("role", "status");
    t.style.cssText = "position:fixed;left:50%;bottom:92px;transform:translateX(-50%);background:var(--text);color:var(--bg);padding:10px 16px;border-radius:12px;z-index:30;font-size:14px;max-width:90vw;text-align:center";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ---------- activities for a person ----------
  const available = (p) => A.filter((a) => !a.ages || a.ages.includes(p.band));
  function activeItems(p) {
    const core = A.filter((a) => a.core && !(p.hidden || {})[a.id]);
    const menu = Object.keys(p.chosen || {}).map(actById).filter((a) => a && !a.core && (!a.ages || a.ages.includes(p.band)));
    return core.concat(menu);
  }
  const targetFor = (p, a) => ((p.targets || {})[a.id] ?? a.target.perWeek);
  const labelFor = (p, a) => (p.band === "child" && a.kid ? a.kid : a.label);
  const cueFor = (p, a) => (p.cues || {})[a.id] || "";

  function weekAmount(a, refK) {
    const ws = weekStartK(refK);
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = D().days[addDays(ws, i)];
      if (!d) continue;
      if (a.target.type === "minutes") n += (d.minutes || {})[a.id] || 0;
      else if ((d.done || {})[a.id]) n++;
    }
    return n;
  }

  function strengthTag(s) {
    const t = { strong: ["strong", "Strong evidence"], good: ["good", "Good evidence, small effect"], basic: ["", "Healthy habit"] }[s];
    return `<span class="tag ${t[0]}">${t[1]}</span>`;
  }
  function sourceLinks(ids) {
    return `<ul class="sources">${ids.map((id) => S[id] ? `<li><a href="${esc(S[id].url)}" target="_blank" rel="noopener">${esc(S[id].cite)}</a></li>` : "").join("")}</ul>`;
  }

  // ---------- movement ----------
  const WTYPES = {
    walk: { label: "Walk", emoji: "🚶", dist: true },
    run: { label: "Run / jog", emoji: "🏃", dist: true, bone: true },
    bike: { label: "Bike", emoji: "🚴", dist: true },
    hike: { label: "Hike", emoji: "🥾", dist: true, bone: true },
    swim: { label: "Swim", emoji: "🏊" },
    strength: { label: "Strength / weights", emoji: "🏋️", muscle: true },
    sports: { label: "Sports (basketball, soccer…)", emoji: "⚽", bone: true },
    play: { label: "Active play / playground / tag", emoji: "🛝", bone: true, muscle: true },
    climb: { label: "Climbing / monkey bars", emoji: "🧗", muscle: true },
    jump: { label: "Jump rope / trampoline", emoji: "🤸", bone: true },
    dance: { label: "Dance", emoji: "💃", bone: true },
    yoga: { label: "Yoga / stretching", emoji: "🧘" },
    other: { label: "Other", emoji: "✨" }
  };
  const EFFORT = {
    light: "Light — easy, could sing",
    moderate: "Moderate — can talk, not sing",
    vigorous: "Vigorous — only a few words at a time"
  };
  const MOVE_GOALS = {
    health: { label: "Feel better & stay healthy", modEq: 150, stretch: 300, strengthDays: 2,
      note: "The baseline guideline: 150–300 moderate minutes a week (vigorous minutes count double) plus muscle-strengthening 2+ days.", sources: ["paGuidelines"] },
    lose: { label: "Lose weight", modEq: 250, stretch: 300, strengthDays: 2,
      note: "For weight loss, ACSM found 150–250 min/week gives modest results and more than 250 min/week gives clinically meaningful loss, especially combined with a modest calorie deficit.", sources: ["acsmWeight", "paGuidelines"] },
    strength: { label: "Build strength", modEq: 150, stretch: 300, strengthDays: 3,
      note: "Keep the 150-minute aerobic base and train each major muscle group 2–3 days a week. Add weight gradually when you can beat your target reps.", sources: ["paGuidelines", "acsm"] },
    fitness: { label: "Get fitter (cardio / running)", modEq: 150, stretch: 300, strengthDays: 2, vigTarget: 75,
      note: "Aim for at least 75 vigorous minutes (runs, intervals) inside your weekly total. Vigorous minutes count double.", sources: ["paGuidelines", "exercise"] }
  };

  function speedOf(w) { return w.dist > 0 && w.min > 0 ? w.dist / (w.min / 60) : 0; }
  function autoEffort(type, mph) {
    if (!mph) return null;
    if (type === "walk" || type === "hike") return mph < 2.5 ? "light" : mph < 4 ? "moderate" : "vigorous";
    if (type === "run") return "vigorous";
    if (type === "bike") return mph < 5 ? "light" : mph < 10 ? "moderate" : "vigorous";
    return null;
  }
  function metOf(type, effort, mph) {
    if (mph && (type === "walk" || type === "hike")) {
      const base = mph < 2 ? 2.0 : mph < 2.5 ? 2.8 : mph < 3.5 ? 3.5 : mph < 4 ? 4.3 : mph < 4.5 ? 5.0 : 7.0;
      return type === "hike" ? Math.max(base, 5.3) : base;
    }
    if (mph && type === "run") return Math.max(6, 1.65 * mph);
    if (mph && type === "bike") return mph < 10 ? 4.0 : mph < 12 ? 6.8 : mph < 14 ? 8.0 : 10.0;
    if (type === "strength") return effort === "vigorous" ? 6.0 : 3.5;
    return { light: 2.5, moderate: 4.0, vigorous: 7.0 }[effort] || 3.5;
  }
  function paceStr(w) {
    if (!(w.dist > 0 && w.min > 0)) return "";
    const pace = w.min / w.dist;
    const m = Math.floor(pace), s = Math.round((pace - m) * 60);
    return `${m}:${pad(s === 60 ? 0 : s)} /mi · ${round(speedOf(w), 1)} mph`;
  }
  const weightKg = (p) => (p.weightLb ? p.weightLb * 0.4536 : 0);
  const kcalOf = (p, w) => (weightKg(p) ? Math.round(w.met * weightKg(p) * (w.min / 60)) : 0);

  function workoutsOn(k) { return D().workouts.filter((w) => w.date === k); }
  function moveWeek(p, refK) {
    const ws = weekStartK(refK);
    const res = { modEq: 0, vig: 0, total: 0, strengthDays: new Set(), muscleDays: new Set(), boneDays: new Set(), vigDays: new Set(), perDay: {} };
    for (let i = 0; i < 7; i++) {
      const k = addDays(ws, i);
      let mvpa = 0, all = 0;
      workoutsOn(k).forEach((w) => {
        const t = WTYPES[w.type] || {};
        all += w.min;
        if (w.effort === "moderate") { res.modEq += w.min; mvpa += w.min; }
        if (w.effort === "vigorous") { res.modEq += 2 * w.min; res.vig += w.min; mvpa += w.min; res.vigDays.add(k); }
        if (w.type === "strength") res.strengthDays.add(k);
        if (t.muscle) res.muscleDays.add(k);
        if (t.bone) res.boneDays.add(k);
      });
      D().lifts.filter((l) => l.date === k).forEach(() => { res.strengthDays.add(k); res.muscleDays.add(k); });
      res.perDay[k] = { mvpa, all };
      res.total += all;
    }
    return res;
  }

  // ---------- nutrition ----------
  const ACTIVITY_LEVELS = {
    1.2: "Mostly sitting (desk job, little exercise)",
    1.375: "Lightly active (light exercise 1–3 days/week)",
    1.55: "Moderately active (exercise 3–5 days/week)",
    1.725: "Very active (hard exercise 6–7 days/week)"
  };
  const CAL_GOALS = {
    maintain: { label: "Maintain my weight", delta: 0 },
    lose05: { label: "Lose about ½ lb a week", delta: -250 },
    lose1: { label: "Lose about 1 lb a week", delta: -500 },
    gain05: { label: "Gain about ½ lb a week", delta: 250 }
  };
  function calorieTarget(p) {
    const c = p.calories || {};
    if (!c.enabled || !p.weightLb || !c.heightIn || !p.age) return null;
    const kg = p.weightLb * 0.4536, cm = c.heightIn * 2.54;
    const bmr = 10 * kg + 6.25 * cm - 5 * p.age + (c.sex === "male" ? 5 : -161);
    const tdee = bmr * Number(c.activity || 1.375);
    const floor = c.sex === "male" ? 1500 : 1200;
    const raw = tdee + (CAL_GOALS[c.goal || "maintain"].delta);
    const target = Math.round(Math.max(raw, floor) / 10) * 10;
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), target, floored: raw < floor, kg };
  }
  const MEAL_SPLIT = { breakfast: 0.25, lunch: 0.3, dinner: 0.3, snack: 0.15 };

  // ---------- care / safety ----------
  function careCard(p) {
    const w = D().who5;
    const last = w[w.length - 1], prev = w[w.length - 2];
    const low2 = last && prev && last.raw < 13 && prev.raw < 13;
    const lowNow = last && last.raw < 13 && daysBetween(last.date, todayK()) <= 14;
    let lowDays = 0;
    for (let i = 0; i < 7; i++) {
      const m = dayR(addDays(todayK(), -i)).mood;
      if (m != null && m <= 2.5) lowDays++;
    }
    if (!(low2 || lowNow || lowDays >= 4)) return "";
    if (p.band === "child") {
      return `<div class="card care"><h3>💛 Lots of sad days lately</h3>
        <p>Feeling sad sometimes is normal. If it keeps happening, please tell a grown-up you trust, like a parent, teacher or school counselor. You don't have to figure it out alone.</p></div>`;
    }
    const who = p.band === "teen" ? "a parent, school counselor, doctor or another adult you trust" : "your doctor or someone you trust";
    return `<div class="card care"><h3>💛 Checking in on you</h3>
      <p>${low2 ? "Your last two well-being check-ins were low." : "Your mood has been low lately."} That deserves more than a checklist. Please talk with ${who}.</p>
      <p>If you ever feel hopeless or think about hurting yourself, call or text <b>988</b> (Suicide &amp; Crisis Lifeline, US) any time. If you're in immediate danger, call 911.</p>
      <p class="small">HappyPlace is a habit tool, not a diagnosis or treatment.</p></div>`;
  }

  // ---------- views ----------
  let viewDate = todayK();
  let pendingFit = null, fitDraft = {};
  let planFilter = null;
  let confirmKey = null;

  function header() {
    const p = P();
    const btn = document.getElementById("profileBtn");
    btn.innerHTML = p ? `<span class="avatar">${esc(p.emoji)}</span>${esc(p.name)}` : `<span class="avatar">＋</span>Add person`;
  }

  function moodCard(p, k) {
    const m = dayR(k).mood;
    if (p.band === "child") {
      const faces = [["😢", 0], ["😕", 2.5], ["😐", 5], ["🙂", 7.5], ["😄", 10]];
      return `<div class="card"><h3>How do you feel today?</h3>
        <div class="mood-row faces">${faces.map(([f, v]) => `<button data-action="mood" data-v="${v}" class="${m === v ? "sel" : ""}" aria-label="mood ${v}">${f}</button>`).join("")}</div></div>`;
    }
    return `<div class="card"><h3>Overall, how was today?</h3>
      <div class="mood-row">${Array.from({ length: 11 }, (_, v) => `<button data-action="mood" data-v="${v}" class="${m === v ? "sel" : ""}">${v}</button>`).join("")}</div>
      <div class="mood-scale"><span>Worst</span><span>Best</span></div></div>`;
  }

  function itemRow(p, a, k) {
    const d = dayR(k);
    const tgt = targetFor(p, a);
    const amt = weekAmount(a, k);
    const cue = cueFor(p, a);
    if (a.target.type === "minutes") {
      const mins = d.minutes[a.id] || 0;
      return `<div class="item ${mins ? "done" : ""}">
        <span class="emoji">${a.emoji}</span>
        <div class="body"><div class="label">${esc(labelFor(p, a))}${mins ? ` · ${mins} min` : ""}</div>
          <div class="meta">${amt} of ${tgt} min this week${cue ? ` · ${esc(cue)}` : ""}</div>
          <div class="bar" style="margin-top:6px"><i style="width:${Math.min(100, (amt / tgt) * 100)}%"></i></div></div>
        <div class="minutes">
          ${mins ? `<button data-action="addmin" data-id="${a.id}" data-n="-10" aria-label="remove 10 minutes">−</button>` : ""}
          <button data-action="addmin" data-id="${a.id}" data-n="10">+10</button>
          <button data-action="addmin" data-id="${a.id}" data-n="30">+30</button>
        </div></div>`;
    }
    const done = !!d.done[a.id];
    const dots = Array.from({ length: tgt }, (_, i) => `<i class="${i < amt ? "on" : ""}"></i>`).join("");
    return `<button class="item ${done ? "done" : ""}" data-action="toggle" data-id="${a.id}" aria-pressed="${done}">
      <span class="emoji">${a.emoji}</span>
      <span class="body"><span class="label">${esc(labelFor(p, a))}</span>
        <span class="meta" style="display:block">${Math.min(amt, 99)} of ${tgt} days this week <span class="dots">${dots}</span>${cue ? ` · ${esc(cue)}` : ""}</span></span>
      <span class="check"></span></button>`;
  }

  function who5Due(p) {
    if (p.band === "child") return false;
    const w = D().who5;
    return !w.length || daysBetween(w[w.length - 1].date, todayK()) >= 14;
  }

  function rotationCard(p) {
    const t = todayK();
    if (p.rotationDismissed && daysBetween(p.rotationDismissed, t) < 14) return "";
    const stale = Object.entries(p.chosen || {}).map(([id, v]) => ({ a: actById(id), since: v.since })).find((x) => x.a && x.since && daysBetween(x.since, t) >= 21);
    if (!stale) return "";
    return `<div class="card soft"><h3>🔄 Time for a fresh twist?</h3>
      <p>"${esc(labelFor(p, stale.a))}" has been in your plan for 3+ weeks. Doing the exact same thing over and over tends to wear off. Try a new version (a different kind act, a new trail, a different person to thank) or swap it for something new.</p>
      <div class="row"><button class="btn small" data-action="goto" data-to="plan">Swap or change</button>
      <button class="btn small ghost" data-action="rotation-keep">Keep it, I'll mix it up</button></div></div>`;
  }

  function fitCard(p) {
    if (!pendingFit) return "";
    const a = actById(pendingFit);
    const q = p.band === "child"
      ? [["enjoyed", "Was it fun?"], ["worth", "Did it make you feel good?"], ["hard", "Was it hard?"]]
      : [["enjoyed", "Did you enjoy it?"], ["worth", "Did it feel worth it?"], ["hard", "Was it hard to do?"]];
    return `<div class="card info"><h3>Quick check: ${esc(labelFor(p, a))}</h3>
      <p class="small">Three taps help HappyPlace learn what fits you. Asked at most every two weeks per activity.</p>
      ${q.map(([key, text]) => `<div class="row" style="justify-content:space-between;margin:8px 0"><span>${text}</span>
        <span class="chips"><button class="chip ${fitDraft[key] === 1 ? "sel" : ""}" data-action="fit" data-q="${key}" data-v="1">Yes</button>
        <button class="chip ${fitDraft[key] === 0 ? "sel" : ""}" data-action="fit" data-q="${key}" data-v="0">No</button></span></div>`).join("")}
      <button class="btn small ghost" data-action="fit-skip">Skip</button></div>`;
  }

  function renderToday() {
    const p = P();
    const k = viewDate, t = todayK();
    const items = activeItems(p);
    const isToday = k === t;
    const hour = new Date().getHours();
    const hi = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    let h = `<h1>${isToday ? `${hi}, ${esc(p.name)}` : "Catching up"}</h1>
      <div class="row" style="justify-content:space-between">
        <p class="sub" style="margin:0">${fmtDate(k)}</p>
        <span class="row">
          <button class="btn small ghost" data-action="day" data-n="-1" ${daysBetween(k, t) >= 6 ? "disabled" : ""} aria-label="previous day">◀</button>
          <button class="btn small ghost" data-action="day" data-n="1" ${isToday ? "disabled" : ""} aria-label="next day">▶</button>
        </span></div>`;
    h += careCard(p);
    if (isToday && who5Due(p)) {
      h += `<div class="card soft"><h3>📝 2-minute well-being check-in</h3>
        <p>Five quick questions (the WHO-5) every two weeks. It's how you'll see whether your habits are actually helping over time.</p>
        <button class="btn small" data-action="who5">Start</button></div>`;
    }
    if (isToday) h += rotationCard(p);
    h += moodCard(p, k);
    h += `<h2>${p.band === "child" ? "My happy list" : "Your baseline"}</h2>`;
    h += `<div class="list">${items.map((a) => itemRow(p, a, k)).join("")}</div>`;
    h += fitCard(p);
    h += `<p class="small" style="margin-top:14px">Aim for your weekly targets, not perfection. Missing a day doesn't undo anything; habits take about two months on average to stick, longer for some people.</p>`;
    return h;
  }

  // ---- Move ----
  function moveGuideline(p, wk, k) {
    const today = wk.perDay[k] || { mvpa: 0, all: 0 };
    if (p.age < 6) {
      return `<div class="card"><h3>Goal: active all day 🛝</h3>
        <p>Kids ages 3–5 should be active throughout the day, aiming for about <b>3 hours of active play</b>, at any intensity.</p>
        <div class="row" style="justify-content:space-between"><span>Today</span><b>${today.all} / 180 min</b></div>
        <div class="bar"><i style="width:${Math.min(100, (today.all / 180) * 100)}%"></i></div>
        <p class="small">Source: Physical Activity Guidelines for Americans.</p></div>`;
    }
    if (p.age < 18) {
      const daysMet = Object.values(wk.perDay).filter((d) => d.mvpa >= 60).length;
      const row = (label, n, of) => `<div class="row" style="justify-content:space-between;margin-top:8px"><span>${label}</span><b>${n} / ${of}</b></div><div class="bar"><i style="width:${Math.min(100, (n / of) * 100)}%"></i></div>`;
      return `<div class="card"><h3>Goal: 60 active minutes a day ⚡</h3>
        <p class="small">Ages 6–17: 60+ minutes of moderate-to-vigorous activity every day, including vigorous, muscle-strengthening and bone-strengthening activity on at least 3 days a week each.</p>
        ${row("Today's active minutes", today.mvpa, 60)}
        ${row("Days this week with 60+ min", daysMet, 7)}
        ${row("Vigorous days (huffing & puffing)", wk.vigDays.size, 3)}
        ${row("Muscle days (climbing, push-ups)", wk.muscleDays.size, 3)}
        ${row("Bone days (running, jumping, sports)", wk.boneDays.size, 3)}
        <p class="small">Source: Physical Activity Guidelines for Americans. No weight-based goals for kids and teens. Growing bodies just need to move.</p></div>`;
    }
    const g = MOVE_GOALS[p.moveGoal || "health"];
    const sd = wk.strengthDays.size;
    return `<div class="card"><h3>Your goal: ${esc(g.label)}</h3>
      <p class="small">${esc(g.note)}${p.age >= 65 ? " At 65+, also add balance activities (like standing on one foot or tai chi)." : ""}</p>
      <div class="row" style="justify-content:space-between;margin-top:8px"><span>Active minutes this week<br><span class="small">vigorous counts double</span></span><b>${wk.modEq} / ${g.modEq}</b></div>
      <div class="bar"><i style="width:${Math.min(100, (wk.modEq / g.modEq) * 100)}%"></i></div>
      ${g.vigTarget ? `<div class="row" style="justify-content:space-between;margin-top:8px"><span>Vigorous minutes</span><b>${wk.vig} / ${g.vigTarget}</b></div><div class="bar"><i style="width:${Math.min(100, (wk.vig / g.vigTarget) * 100)}%"></i></div>` : ""}
      <div class="row" style="justify-content:space-between;margin-top:8px"><span>Strength days</span><b>${sd} / ${g.strengthDays}</b></div>
      <div class="bar"><i style="width:${Math.min(100, (sd / g.strengthDays) * 100)}%"></i></div>
      <p class="small">${wk.modEq >= g.stretch ? "You're past 300 minutes. More benefits keep coming beyond the minimum." : `More is better up to about ${g.stretch}+ minutes.`}</p>
      <div class="row"><label class="field" style="flex:1;margin:0">Change goal
        <select data-prof="moveGoal">${Object.entries(MOVE_GOALS).map(([id, x]) => `<option value="${id}" ${id === (p.moveGoal || "health") ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select></label></div>
      <details><summary class="small">Research</summary>${sourceLinks(g.sources)}</details></div>`;
  }

  function renderMove() {
    const p = P(), k = todayK();
    const wk = moveWeek(p, k);
    const showKcal = p.band === "adult" && p.weightLb;
    const types = Object.entries(WTYPES).filter(([id]) => p.band !== "child" || id !== "strength");
    let h = `<h1>Move</h1><p class="sub">${p.band === "adult" ? "Goals based on your age and what you're working toward." : "Goals based on your age."}</p>`;
    h += moveGuideline(p, wk, k);

    h += `<h2>Log activity</h2><div class="card">
      <label class="field">What did you do?
        <select id="wType">${types.map(([id, t]) => `<option value="${id}">${t.emoji} ${esc(t.label)}</option>`).join("")}</select></label>
      <div class="row">
        <label class="field" style="flex:1">Minutes<input id="wMin" type="number" inputmode="numeric" min="1" max="600" placeholder="30"></label>
        <label class="field" style="flex:1" id="wDistWrap">Distance (miles, optional)<input id="wDist" type="number" inputmode="decimal" step="0.01" min="0" placeholder="2.0"></label>
      </div>
      <label class="field">How hard was it? <span class="small">(picked for you when you enter distance)</span>
        <select id="wEffort">${Object.entries(EFFORT).map(([id, t]) => `<option value="${id}" ${id === "moderate" ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <p class="small" id="wPreview"></p>
      <button class="btn" data-action="log-workout">Save</button></div>`;

    if (p.band !== "child") {
      const lifts = D().lifts;
      const names = [...new Set(lifts.map((l) => l.ex))];
      const common = ["Squat", "Deadlift", "Bench press", "Overhead press", "Row", "Pull-up", "Push-up", "Lunge", "Plank (sec)"];
      h += `<h2>Strength log</h2><div class="card">
        <label class="field">Exercise<input id="lEx" list="exList" placeholder="e.g. Squat"></label>
        <datalist id="exList">${[...new Set(names.concat(common))].map((n) => `<option value="${esc(n)}">`).join("")}</datalist>
        <div class="row">
          <label class="field" style="flex:1">Sets<input id="lSets" type="number" inputmode="numeric" min="1" value="3"></label>
          <label class="field" style="flex:1">Reps<input id="lReps" type="number" inputmode="numeric" min="1" value="10"></label>
          <label class="field" style="flex:1">Weight (lb)<input id="lLb" type="number" inputmode="decimal" min="0" placeholder="0 = bodyweight"></label>
        </div>
        <button class="btn" data-action="log-lift">Save set</button>
        ${p.band === "teen" ? `<p class="small">Teens: strength training is safe and helpful with good form and supervision. Learn technique with light weight first.</p>` : ""}
      </div>`;
      if (names.length) {
        h += `<div class="list">${names.slice(-8).reverse().map((n) => {
          const hist = lifts.filter((l) => l.ex === n);
          const last = hist[hist.length - 1];
          const best = Math.max(...hist.map((l) => l.lb || 0));
          const bump = last.lb ? Math.max(2.5, Math.round(last.lb * 0.05 / 2.5) * 2.5) : 0;
          return `<div class="item"><span class="emoji">🏋️</span><div class="body">
            <div class="label">${esc(n)}</div>
            <div class="meta">Last (${shortDate(last.date)}): ${last.sets}×${last.reps}${last.lb ? ` @ ${last.lb} lb` : " bodyweight"}${best ? ` · best ${best} lb` : ""}</div>
            <div class="meta">Next: ${last.lb ? `if every set felt doable with 1–2 reps to spare, try ${last.lb + bump} lb.` : "add a rep or a set when it feels easy."} Otherwise repeat.</div></div></div>`;
        }).join("")}</div>
        <p class="small">Progression follows the ACSM guideline of adding about 2–10% when you can beat your target reps.</p>`;
      }
    }

    const recent = D().workouts.slice(-10).reverse();
    if (recent.length) {
      h += `<h2>Recent</h2><div class="list">${recent.map((w) => {
        const t = WTYPES[w.type] || WTYPES.other;
        const kc = showKcal ? kcalOf(p, w) : 0;
        return `<div class="item"><span class="emoji">${t.emoji}</span><div class="body">
          <div class="label">${esc(t.label)} · ${w.min} min</div>
          <div class="meta">${shortDate(w.date)} · ${w.effort}${w.dist ? ` · ${w.dist} mi · ${paceStr(w)}` : ""}${kc ? ` · ~${kc} kcal` : ""}</div></div>
          <button class="btn small ghost" data-action="del-workout" data-id="${w.id}" aria-label="delete">✕</button></div>`;
      }).join("")}</div>`;
      if (showKcal) h += `<p class="small">Calories burned are estimates from standard MET values and your weight, and can be off by 20% or more.</p>`;
    }
    h += `<details><summary class="small">Research behind Move</summary>${sourceLinks(["paGuidelines", "intensity", "compendium", "acsm", "acsmWeight", "exercise"])}</details>`;
    return h;
  }

  // ---- Plate ----
  function plateSvg() {
    return `<svg width="130" height="100" viewBox="0 0 130 100" role="img" aria-label="Plate: half vegetables and fruit, a quarter protein, a quarter whole grains, plus water">
      <circle cx="50" cy="50" r="47" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
      <path d="M50,50 L50,6 A44,44 0 0 0 50,94 Z" fill="var(--veg)"/>
      <path d="M50,50 L50,6 A44,44 0 0 1 94,50 Z" fill="var(--protein)"/>
      <path d="M50,50 L94,50 A44,44 0 0 1 50,94 Z" fill="var(--grain)"/>
      <rect x="108" y="30" width="16" height="32" rx="4" fill="var(--water)"/></svg>`;
  }

  function renderPlate() {
    const p = P(), k = todayK();
    const d = dayR(k);
    const kid = p.band === "child";
    const parts = window.HP_PLATE.parts;
    let h = `<h1>${kid ? "My plate" : "Plate"}</h1><p class="sub">${kid ? "Try to fill your plate with lots of colors!" : "Build each meal with the Healthy Eating Plate."}</p>`;
    h += `<div class="card"><div class="plate">${plateSvg()}<div class="legend">
      ${parts.map((x) => `<div><b style="background:${x.color}"></b>${esc(kid ? x.kid : x.label)}${x.share ? ` · ${x.share === 0.5 ? "½" : "¼"}` : ""}</div>`).join("")}</div></div>
      ${kid ? "" : `<details><summary class="small">What goes in each part</summary>${parts.map((x) => `<p class="small"><b>${esc(x.label)}:</b> ${esc(x.tip)}</p>`).join("")}</details>`}</div>`;

    const target = p.band === "adult" ? calorieTarget(p) : null;
    window.HP_PLATE.meals.forEach((m) => {
      const got = (d.plate || {})[m.id] || {};
      const sugg = target ? Math.round((target.target * MEAL_SPLIT[m.id]) / 10) * 10 : 0;
      h += `<div class="card"><h3>${m.emoji} ${esc(m.label)}</h3>
        <div class="chips">${parts.map((x) => `<button class="chip ${got[x.id] ? "sel" : ""}" data-action="plate" data-meal="${m.id}" data-part="${x.id}">${got[x.id] ? "✓ " : ""}${esc(kid ? x.kid.split(" (")[0] : x.label)}</button>`).join("")}</div>
        <p class="small">${esc(kid ? m.kidIdeas : m.ideas)}</p>
        ${target ? `<div class="row"><label class="field" style="flex:1;margin:4px 0">Calories <span class="small">(guide ~${sugg})</span>
          <input type="number" inputmode="numeric" min="0" data-kcal="${m.id}" value="${(d.kcal || {})[m.id] ?? ""}" placeholder="${sugg}"></label></div>` : ""}</div>`;
    });

    if (p.band === "adult") h += calorieSection(p, target, d);
    else {
      h += `<div class="card info"><h3>Why no calorie counting here?</h3>
        <p>Growing bodies need plenty of fuel. Pediatricians recommend that kids and teens <b>not</b> diet or count calories, because dieting is one of the strongest predictors of eating disorders. What helps instead: balanced plates, regular family meals, and moving for fun.</p>
        ${sourceLinks(["aap", "plate"])}</div>`;
    }
    return h;
  }

  function calorieSection(p, target, d) {
    if (!target) {
      return `<div class="card info"><h3>Calorie target (optional)</h3>
        <p>Want a daily calorie estimate based on your age, height, weight, activity and goal? It's off by default. Calorie tracking helps some people and makes others more anxious about food, so it's your call.</p>
        <button class="btn small" data-action="cal-settings">Set up calorie target</button>
        <details><summary class="small">Research</summary>${sourceLinks(["mifflin", "amdr", "calorieApps"])}</details></div>`;
    }
    const total = Object.values(d.kcal || {}).reduce((s, x) => s + (Number(x) || 0), 0);
    const burned = workoutsOn(todayK()).reduce((s, w) => s + kcalOf(p, w), 0);
    const proteinMin = Math.round(target.kg * 0.8);
    const gr = (pct, per) => Math.round((target.target * pct) / per);
    return `<div class="card"><h3>Today's calories</h3>
      <div class="row" style="justify-content:space-between"><span>Eaten</span><b>${total} / ${target.target} kcal</b></div>
      <div class="bar"><i style="width:${Math.min(100, (total / target.target) * 100)}%"></i></div>
      <p class="small">Goal: ${esc(CAL_GOALS[p.calories.goal || "maintain"].label)}. Your estimated maintenance is ~${target.tdee} kcal/day (Mifflin-St Jeor × activity).${target.floored ? " Your target is held at a safe minimum rather than going lower." : ""}</p>
      ${burned ? `<p class="small">Logged workouts today: ~${burned} kcal (estimate). Your target already includes your activity level, so these aren't added back.</p>` : ""}
      <details><summary>Daily nutrient ranges</summary>
        <p class="small"><b>Protein:</b> at least ${proteinMin} g (0.8 g per kg body weight), up to ${gr(0.35, 4)} g.<br>
        <b>Carbs:</b> ${gr(0.45, 4)}–${gr(0.65, 4)} g, mostly vegetables, fruit, whole grains and beans.<br>
        <b>Fat:</b> ${gr(0.2, 9)}–${gr(0.35, 9)} g, mostly from olive oil, nuts, fish and avocado.</p>
        <p class="small">The meal split (25% breakfast, 30% lunch, 30% dinner, 15% snacks) is just a starting point. Shift it to fit your day.</p>
        ${sourceLinks(["mifflin", "amdr", "plate"])}</details>
      <p class="small">If counting starts making you anxious about food, turn it off. The plate guide alone is a great way to eat well.</p>
      <button class="btn small ghost" data-action="cal-settings">Calorie settings</button></div>`;
  }

  function calSheet() {
    const p = P(); const c = p.calories || {};
    const ft = c.heightIn ? Math.floor(c.heightIn / 12) : "", inch = c.heightIn ? c.heightIn % 12 : "";
    openSheet(`<h2 style="margin-top:0">Calorie target</h2>
      <p class="small">Used only on this device to estimate your needs with the Mifflin-St Jeor equation, the most accurate standard formula for healthy adults.</p>
      <label class="field">Sex (used by the equation)<select id="cSex"><option value="female" ${c.sex !== "male" ? "selected" : ""}>Female</option><option value="male" ${c.sex === "male" ? "selected" : ""}>Male</option></select></label>
      <div class="row"><label class="field" style="flex:1">Height (ft)<input id="cFt" type="number" min="3" max="8" value="${ft}"></label>
        <label class="field" style="flex:1">(in)<input id="cIn" type="number" min="0" max="11" value="${inch}"></label></div>
      <label class="field">Weight (lb)<input id="cLb" type="number" min="60" max="700" value="${p.weightLb || ""}"></label>
      <label class="field">Age<input id="cAge" type="number" min="18" max="110" value="${p.age || ""}"></label>
      <label class="field">Activity level<select id="cAct">${Object.entries(ACTIVITY_LEVELS).map(([v, t]) => `<option value="${v}" ${Number(c.activity || 1.375) === Number(v) ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label class="field">Goal<select id="cGoal">${Object.entries(CAL_GOALS).map(([v, g]) => `<option value="${v}" ${v === (c.goal || "maintain") ? "selected" : ""}>${g.label}</option>`).join("")}</select></label>
      <p class="small">Weight loss is capped at about 1 lb a week, and the target never drops below 1,200 (women) / 1,500 (men) kcal. If you're pregnant, nursing, have a medical condition, or have had an eating disorder, check with your doctor instead of using this.</p>
      <div class="row"><button class="btn" data-action="cal-save">Save</button>
      ${c.enabled ? `<button class="btn ghost" data-action="cal-off">Turn off calorie tracking</button>` : ""}
      <button class="btn ghost" data-action="close">Cancel</button></div>`);
  }

  // ---- Insights ----
  function welch(a, b) {
    const diff = mean(a) - mean(b);
    const se = Math.sqrt(variance(a) / a.length + variance(b) / b.length) || 1e-9;
    return { diff, t: diff / se };
  }
  function renderInsights() {
    const p = P();
    const days = D().days;
    const keys = Object.keys(days).filter((k) => days[k].mood != null && daysBetween(k, todayK()) <= 120).sort();
    const need = 28;
    let h = `<h1>Insights</h1><p class="sub">What seems to work for <b>you</b>, not the average person.</p>`;
    if (keys.length < need) {
      h += `<div class="card"><h3>Gathering your data</h3>
        <p>Rate your day on the Today tab. Personal patterns need about four weeks of ratings before they mean much.</p>
        <div class="row" style="justify-content:space-between"><span>Days rated</span><b>${keys.length} / ${need}</b></div>
        <div class="bar"><i style="width:${(keys.length / need) * 100}%"></i></div></div>`;
    } else {
      const rows = activeItems(p).map((a) => {
        const did = (k) => (a.target.type === "minutes" ? ((days[k].minutes || {})[a.id] || 0) > 0 : !!(days[k].done || {})[a.id]);
        const w = keys.filter(did).map((k) => days[k].mood), wo = keys.filter((k) => !did(k)).map((k) => days[k].mood);
        if (w.length < 5 || wo.length < 5) return { a, msg: w.length < 5 ? "Not done enough yet to compare" : "Done almost every day, so there's nothing to compare against", rank: -1 };
        const { diff, t } = welch(w, wo);
        const at = Math.abs(t);
        const lbl = at < 1.5 ? "No clear pattern" : at < 2.5 ? "Possible pattern" : "Consistent pattern";
        const dir = diff >= 0 ? "higher" : "lower";
        const scale = p.band === "child" ? "" : " points";
        return { a, rank: at, lbl, msg: `Mood ${round(Math.abs(diff), 1)}${scale} ${dir} on days you did this (${w.length} vs ${wo.length} days)` };
      }).sort((x, y) => y.rank - x.rank);
      h += `<div class="card info"><p><b>Patterns, not proof.</b> Weekends, sleep, illness and stress affect both what you do and how you feel, and good days can cause activities rather than the other way around. With this many comparisons, one or two "patterns" may be chance.</p></div>`;
      h += `<div class="card">${rows.map((r) => `<div class="insight"><div><b>${r.a.emoji} ${esc(labelFor(p, r.a))}</b><div class="small">${esc(r.msg)}</div></div>${r.lbl ? `<span class="tag ${r.lbl === "Consistent pattern" ? "strong" : r.lbl === "Possible pattern" ? "good" : ""}">${r.lbl}</span>` : ""}</div>`).join("")}</div>`;
      h += `<div class="card soft"><h3>🧪 Want a real answer? Run a 2-week experiment</h3>
        <p>Pick one activity. Do it every day one week, skip it the next, and keep rating your days. Swapping on and off like this tells you far more than patterns alone.</p></div>`;
    }

    const fit = D().fit;
    const fitRows = Object.entries(fit).map(([id, arr]) => ({ a: actById(id), arr })).filter((x) => x.a && x.arr.length);
    if (fitRows.length) {
      h += `<h2>How activities fit you</h2><div class="card">${fitRows.map(({ a, arr }) => {
        const pct = (key) => Math.round((arr.filter((r) => r[key] === 1).length / arr.length) * 100);
        return `<div class="insight"><div><b>${a.emoji} ${esc(labelFor(p, a))}</b><div class="small">Enjoyed ${pct("enjoyed")}% · Worth it ${pct("worth")}% · Hard ${pct("hard")}%</div></div></div>`;
      }).join("")}</div>`;
    }

    if (p.band !== "child") {
      const w = D().who5;
      h += `<h2>Well-being check-ins (WHO-5)</h2>`;
      if (!w.length) h += `<p class="small">No check-ins yet. You'll be prompted on the Today tab every two weeks.</p>`;
      else {
        h += `<div class="card">${w.slice(-8).reverse().map((x) => `<div class="insight"><span>${shortDate(x.date)}</span><b>${x.raw * 4}%</b></div>`).join("")}
          <p class="small">0–100%. Watch the trend. A score below 50% is a sign to check in with a doctor or someone you trust.</p></div>`;
      }
      h += `<button class="btn small ghost" data-action="who5">Take a check-in now</button>`;
    }

    const wkRows = [0, 1, 2, 3].map((i) => { const k = addDays(weekStartK(todayK()), -7 * i); return { k, wk: moveWeek(p, k) }; });
    if (wkRows.some((r) => r.wk.total)) {
      h += `<h2>Movement, last 4 weeks</h2><div class="card">${wkRows.map(({ k, wk }) => `<div class="insight"><span>Week of ${shortDate(k)}</span><b>${p.band === "adult" ? `${wk.modEq} active min` : `${wk.total} min`}</b></div>`).join("")}</div>`;
    }
    return h;
  }

  // ---- Plan ----
  function suggestions(p) {
    const fit = D().fit;
    const liked = Object.entries(fit).filter(([, arr]) => arr.length && arr.filter((r) => r.enjoyed === 1).length / arr.length >= 0.5).map(([id]) => actById(id)).filter(Boolean);
    if (!liked.length) return [];
    const tags = {}; liked.forEach((a) => a.tags.forEach((t) => { tags[t] = (tags[t] || 0) + 1; }));
    return available(p).filter((a) => !a.core && !(p.chosen || {})[a.id])
      .map((a) => ({ a, score: a.tags.reduce((s, t) => s + (tags[t] || 0), 0) }))
      .filter((x) => x.score > 0).sort((x, y) => y.score - x.score).slice(0, 3)
      .map((x) => ({ ...x, because: liked.find((l) => l.tags.some((t) => x.a.tags.includes(t))) }));
  }

  function planRow(p, a, isCore) {
    const on = isCore ? !(p.hidden || {})[a.id] : !!(p.chosen || {})[a.id];
    const tgt = targetFor(p, a);
    const opts = a.target.type === "minutes" ? [60, 90, 120, 150, 200, 300] : [1, 2, 3, 4, 5, 6, 7];
    return `<div class="card">
      <div class="row" style="justify-content:space-between;flex-wrap:nowrap">
        <div><b>${a.emoji} ${esc(labelFor(p, a))}</b><div>${strengthTag(a.strength)}</div></div>
        <button class="chip ${on ? "sel" : ""}" data-action="${isCore ? "core-toggle" : "menu-toggle"}" data-id="${a.id}">${on ? "✓ In my plan" : "Add"}</button>
      </div>
      <p class="small">${esc(a.why)}</p>
      ${on ? `<div class="row">
        <label class="field" style="flex:1;margin:4px 0">Weekly target
          <select data-target="${a.id}">${opts.map((n) => `<option value="${n}" ${n === tgt ? "selected" : ""}>${a.target.type === "minutes" ? `${n} min` : `${n} day${n > 1 ? "s" : ""}`}</option>`).join("")}</select></label>
        <label class="field" style="flex:2;margin:4px 0">When? <span class="small">(link it to a routine)</span>
          <input data-cue="${a.id}" value="${esc(cueFor(p, a))}" placeholder="${a.id === "goodthings" ? "After dinner" : a.id === "move" ? "Before work" : "After I…"}" maxlength="60"></label></div>` : ""}
      <details><summary class="small">Research</summary>${sourceLinks(a.sources)}</details></div>`;
  }

  function renderPlan() {
    const p = P();
    const chosenCount = Object.keys(p.chosen || {}).filter((id) => { const a = actById(id); return a && (!a.ages || a.ages.includes(p.band)); }).length;
    const menu = available(p).filter((a) => !a.core && (!planFilter || a.tags.includes(planFilter)));
    const tagsAvail = [...new Set(available(p).filter((a) => !a.core).flatMap((a) => a.tags))];
    const sug = suggestions(p);
    let h = `<h1>My plan</h1><p class="sub">What makes one person happy doesn't always work for another. Keep the core, then pick what fits you.</p>`;

    h += `<h2>About ${esc(p.name)}</h2><div class="card">
      <div class="row">
        <label class="field" style="flex:2;margin:0">Name<input data-prof="name" value="${esc(p.name)}" maxlength="24"></label>
        <label class="field" style="flex:1;margin:0">Age<input data-prof="age" type="number" min="3" max="110" value="${p.age}"></label>
      </div>
      ${p.band === "adult" ? `<label class="field">Weight (lb, optional: used for calorie estimates)<input data-prof="weightLb" type="number" min="60" max="700" value="${p.weightLb || ""}"></label>` : ""}
      <div class="chips" style="margin-top:8px">${["🙂", "😎", "🦊", "🐻", "🐼", "🦁", "🐸", "🌻", "⚽", "🎮", "🎨", "🚀"].map((e) => `<button class="chip ${p.emoji === e ? "sel" : ""}" data-action="emoji" data-e="${e}">${e}</button>`).join("")}</div></div>`;

    h += `<h2>Core habits</h2><p class="small">The best-supported basics. On for everyone by default; turn any off if it doesn't fit your life right now.</p>`;
    h += A.filter((a) => a.core).map((a) => planRow(p, a, true)).join("");

    h += `<h2>Your picks <span class="small">(${chosenCount} chosen · 2–5 works best)</span></h2>`;
    if (chosenCount > 5) h += `<p class="small">That's a lot! Too many options can feel like a chore. Consider keeping your favorites and rotating the rest in later.</p>`;
    if (sug.length) {
      h += `<div class="card soft"><h3>✨ You might like</h3>${sug.map((x) => `<p>${x.a.emoji} <b>${esc(labelFor(p, x.a))}</b> <span class="small">(because you enjoyed ${esc(labelFor(p, x.because))})</span>
        <button class="chip" data-action="menu-toggle" data-id="${x.a.id}">Add</button></p>`).join("")}</div>`;
    }
    h += `<div class="chips" style="margin:8px 0"><button class="chip ${!planFilter ? "sel" : ""}" data-action="filter" data-t="">All</button>
      ${tagsAvail.map((t) => `<button class="chip ${planFilter === t ? "sel" : ""}" data-action="filter" data-t="${t}">${esc(window.HP_TAG_NAMES[t] || t)}</button>`).join("")}</div>`;
    h += menu.map((a) => planRow(p, a, false)).join("");

    h += `<h2>Family &amp; data</h2><div class="card">
      <p class="small">Everything is stored only in this browser on this device. Nothing is uploaded. If family members share a device, they can see each other's entries, so teens may prefer their own phone.</p>
      <div class="row">
        <button class="btn small ghost" data-action="people">Switch / add person</button>
        <button class="btn small ghost" data-action="export">Export backup</button>
        <label class="btn small ghost">Import backup<input type="file" accept="application/json" id="importFile" hidden></label>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn small danger" data-action="delete-person">${confirmKey === "person" ? `Tap again to delete ${esc(p.name)}` : `Delete ${esc(p.name)}'s data`}</button>
        <button class="btn small danger" data-action="delete-all">${confirmKey === "all" ? "Tap again to erase everything" : "Erase everything"}</button>
      </div></div>`;
    h += `<p><a href="#about">📚 The research behind HappyPlace →</a></p>`;
    return h;
  }

  function renderAbout() {
    let h = `<h1>The research</h1><p class="sub">HappyPlace only includes habits with real evidence behind them, and it's honest about how strong that evidence is.</p>`;
    h += `<div class="card"><h3>What to expect</h3>
      <p>Positive habits help, but modestly. After correcting for small, biased studies, the average effect of well-being activities is small. The value comes from stacking a few good habits over months, not from any single trick.</p>
      ${sourceLinks(["bias"])}</div>`;
    h += `<div class="card"><h3>Why it's personal</h3>
      <p>Researchers call it <b>person-activity fit</b>: an activity works better when it suits your personality, culture, preferences and motivation. That's why HappyPlace keeps a small evidence-based core, lets each person choose extras, asks quick "did you enjoy it?" questions, nudges variety every few weeks (repeating the exact same thing wears off), and shows your own patterns instead of averages.</p>
      ${sourceLinks(["fit", "variety", "dosage"])}</div>`;
    h += `<div class="card"><h3>Why no streaks</h3>
      <p>Broken streaks make people more likely to quit, and missing a single day doesn't hurt habit formation. HappyPlace uses weekly targets instead. Habits take a median of about 66 days to become automatic, with a huge range (18–254 days).</p>
      ${sourceLinks(["streaks", "habits"])}</div>`;
    h += `<div class="card"><h3>Check-ins</h3>
      <p>The WHO-5 Well-Being Index is a validated five-question measure used worldwide for adults and teens. Kids use a simple faces scale instead.</p>
      ${sourceLinks(["who5", "who5review", "youth", "wandering"])}</div>`;
    h += `<div class="card"><h3>Food and movement</h3>
      <p>Plate guidance follows Harvard's Healthy Eating Plate. Movement goals follow the U.S. Physical Activity Guidelines for each age. Calorie targets (adults only, optional) use the Mifflin-St Jeor equation. Kids and teens never see calorie counts or weight goals, as pediatricians advise.</p>
      ${sourceLinks(["plate", "paGuidelines", "intensity", "acsm", "acsmWeight", "mifflin", "amdr", "aap", "calorieApps"])}</div>`;
    h += `<h2>Every habit and its sources</h2>`;
    h += A.map((a) => `<details class="card"><summary>${a.emoji} ${esc(a.label)} ${strengthTag(a.strength)}</summary><p class="small">${esc(a.why)}</p>${sourceLinks(a.sources)}</details>`).join("");
    h += `<div class="card care"><h3>Important</h3>
      <p>HappyPlace is a well-being habit tool. It doesn't diagnose or treat depression, anxiety or any medical condition. If you or someone in your family is struggling, talk to a doctor or counselor. In the US, call or text <b>988</b> any time for the Suicide &amp; Crisis Lifeline.</p></div>`;
    h += `<p class="small">WHO-5 © World Health Organization, CC BY-NC-SA 3.0 IGO, used for non-commercial purposes without modification. WHO does not endorse this app.</p>`;
    return h;
  }

  // ---- onboarding / people ----
  function renderWelcome() {
    return `<h1>Welcome to HappyPlace</h1>
      <p class="sub">A daily well-being checklist for you and your family, built on research and made personal.</p>
      <div class="card"><p>✅ A small core of habits with real evidence behind them</p>
        <p>🧩 Extras each person picks, because what makes one person happy isn't the same for everyone</p>
        <p>📈 Your own patterns, not averages</p>
        <p>🔒 Private: everything stays on this device</p></div>
      ${newPersonForm()}`;
  }
  function newPersonForm() {
    return `<div class="card"><h3>Add a person</h3>
      <label class="field">Name<input id="npName" maxlength="24" placeholder="Name"></label>
      <label class="field">Age<input id="npAge" type="number" min="3" max="110" placeholder="Age"></label>
      <p class="small">Age sets what they see: a picture version for kids under 10, a teen version for 10–17, and the full version for adults.</p>
      <button class="btn" data-action="add-person">Add</button></div>`;
  }
  function peopleSheet() {
    openSheet(`<h2 style="margin-top:0">Who's checking in?</h2>
      <div class="list">${state.profiles.map((p) => `<button class="item ${p.id === state.activeId ? "done" : ""}" data-action="switch" data-id="${p.id}">
        <span class="emoji">${esc(p.emoji)}</span><span class="body"><span class="label">${esc(p.name)}</span><span class="meta" style="display:block">Age ${p.age}</span></span>
        ${p.id === state.activeId ? `<span class="check"></span>` : ""}</button>`).join("")}</div>
      ${newPersonForm()}
      <button class="btn ghost" data-action="close">Close</button>`);
  }

  function who5Sheet() {
    const W = window.HP_WHO5;
    const ans = {};
    const draw = () => {
      openSheet(`<h2 style="margin-top:0">Well-being check-in</h2>
        <p class="small">${W.intro} Pick the answer closest to how you've felt.</p>
        ${W.items.map((q, i) => `<div class="q"><b>${i + 1}. ${q}</b><div class="opts">${W.options.map((o, v) => `<button class="${ans[i] === 5 - v ? "sel" : ""}" data-w5q="${i}" data-w5v="${5 - v}">${o}</button>`).join("")}</div></div>`).join("")}
        <div class="row"><button class="btn" data-w5submit ${Object.keys(ans).length < 5 ? "disabled" : ""}>Done</button><button class="btn ghost" data-action="close">Later</button></div>
        <p class="small">WHO-5 Well-Being Index © WHO, CC BY-NC-SA 3.0 IGO.</p>`);
      $sheet.querySelectorAll("[data-w5q]").forEach((b) => b.addEventListener("click", () => { ans[b.dataset.w5q] = Number(b.dataset.w5v); const y = $sheet.querySelector(".panel").scrollTop; draw(); $sheet.querySelector(".panel").scrollTop = y; }));
      const sub = $sheet.querySelector("[data-w5submit]");
      sub.addEventListener("click", () => {
        if (Object.keys(ans).length < 5) return;
        const items = [0, 1, 2, 3, 4].map((i) => ans[i]);
        const raw = items.reduce((s, x) => s + x, 0);
        D().who5.push({ date: todayK(), raw, items });
        save();
        const pct = raw * 4;
        openSheet(`<h2 style="margin-top:0">Your score: ${pct}%</h2>
          ${pct < 50
            ? `<p>This is on the low side. Scores under 50% are a sign it's worth checking in with a doctor, counselor or someone you trust, especially if it stays low next time.</p><p>If you ever feel hopeless or think about hurting yourself, call or text <b>988</b> any time.</p>`
            : `<p>Thanks! The number itself matters less than how it changes. We'll ask again in two weeks so you can see whether your habits are helping.</p>`}
          <button class="btn" data-action="close">Close</button>`);
      });
    };
    draw();
  }

  function openSheet(html) { $sheet.innerHTML = `<div class="panel" role="dialog" aria-modal="true">${html}</div>`; $sheet.hidden = false; }
  function closeSheet() { $sheet.hidden = true; $sheet.innerHTML = ""; }

  // ---------- router ----------
  const ROUTES = { today: renderToday, move: renderMove, plate: renderPlate, insights: renderInsights, plan: renderPlan, about: renderAbout };
  function render(keepScroll) {
    header();
    const route = (location.hash || "#today").slice(1);
    document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("active", a.dataset.tab === route || (route === "about" && a.dataset.tab === "plan")));
    const y = window.scrollY;
    $view.innerHTML = P() ? (ROUTES[route] || renderToday)() : renderWelcome();
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
    if (route === "move" && P()) wireMoveForm();
    const imp = document.getElementById("importFile");
    if (imp) imp.addEventListener("change", importData);
  }
  window.addEventListener("hashchange", () => { confirmKey = null; render(false); });

  function wireMoveForm() {
    const type = document.getElementById("wType"), min = document.getElementById("wMin"), dist = document.getElementById("wDist"), eff = document.getElementById("wEffort"), prev = document.getElementById("wPreview"), distWrap = document.getElementById("wDistWrap");
    const update = () => {
      const t = WTYPES[type.value];
      distWrap.style.display = t.dist ? "" : "none";
      const w = { type: type.value, min: Number(min.value) || 0, dist: t.dist ? Number(dist.value) || 0 : 0 };
      const mph = speedOf(w);
      const auto = autoEffort(w.type, mph);
      if (auto) eff.value = auto;
      const p = P();
      const met = metOf(w.type, eff.value, mph);
      const parts = [];
      if (mph) parts.push(`Pace ${paceStr(w)} → ${eff.value}`);
      if (w.min && p.band === "adult" && p.weightLb) parts.push(`~${Math.round(met * weightKg(p) * (w.min / 60))} kcal (estimate)`);
      prev.textContent = parts.join(" · ");
    };
    [type, min, dist, eff].forEach((el) => el.addEventListener("input", update));
    update();
  }

  // ---------- actions ----------
  function addPerson() {
    const name = (document.getElementById("npName") || {}).value?.trim();
    const age = Number((document.getElementById("npAge") || {}).value);
    if (!name) return toast("Please add a name.");
    if (!(age >= 3 && age <= 110)) return toast("Please enter an age (3 or older).");
    const band = bandOf(age);
    const defaults = { child: ["fun", "playfriend", "helphome"], teen: ["fun", "flow", "music"], adult: ["quiet", "fun", "familymeal"] }[band];
    const t = todayK();
    const p = { id: uid(), name, age, band, emoji: band === "child" ? "🦊" : "🙂", chosen: Object.fromEntries(defaults.map((id) => [id, { since: t }])), hidden: {}, targets: {}, cues: {}, created: t, moveGoal: "health" };
    state.profiles.push(p);
    state.activeId = p.id;
    save(); closeSheet();
    toast(`Added ${name}. Pick your extras in My plan anytime.`);
    location.hash = "#today"; render(false);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `happyplace-backup-${todayK()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function importData(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(r.result);
        if (!s || !Array.isArray(s.profiles) || typeof s.data !== "object") throw new Error("bad");
        state = s; save(); toast("Backup restored."); render(false);
      } catch (err) { toast("That file isn't a HappyPlace backup."); }
    };
    r.readAsText(f);
  }

  document.addEventListener("click", (e) => {
    if (e.target === $sheet) return closeSheet();
    const el = e.target.closest("[data-action]");
    if (el === document.getElementById("profileBtn") || e.target.closest("#profileBtn")) return state.profiles.length ? peopleSheet() : null;
    if (!el) return;
    const act = el.dataset.action, id = el.dataset.id;
    const p = P();
    switch (act) {
      case "close": closeSheet(); return render(true);
      case "goto": location.hash = "#" + el.dataset.to; return;
      case "add-person": return addPerson();
      case "people": return peopleSheet();
      case "switch": state.activeId = id; save(); closeSheet(); viewDate = todayK(); pendingFit = null; return render(false);
      case "day": viewDate = addDays(viewDate, Number(el.dataset.n)); return render(true);
      case "mood": dayW(viewDate).mood = Number(el.dataset.v); save(); return render(true);
      case "toggle": {
        const d = dayW(viewDate);
        d.done[id] = !d.done[id];
        if (!d.done[id]) delete d.done[id];
        else {
          const last = (D().fit[id] || []).slice(-1)[0];
          if (!last || daysBetween(last.date, todayK()) >= 14) { pendingFit = id; fitDraft = {}; }
        }
        save(); return render(true);
      }
      case "addmin": {
        const d = dayW(viewDate);
        d.minutes[id] = Math.max(0, (d.minutes[id] || 0) + Number(el.dataset.n));
        if (!d.minutes[id]) delete d.minutes[id];
        save(); return render(true);
      }
      case "fit": {
        fitDraft[el.dataset.q] = Number(el.dataset.v);
        if (["enjoyed", "worth", "hard"].every((k) => fitDraft[k] != null)) {
          (D().fit[pendingFit] ||= []).push({ date: todayK(), ...fitDraft });
          pendingFit = null; fitDraft = {}; save(); toast("Thanks! That helps tailor your suggestions.");
        }
        return render(true);
      }
      case "fit-skip": {
        (D().fit[pendingFit] ||= []).push({ date: todayK(), skipped: true });
        pendingFit = null; save(); return render(true);
      }
      case "rotation-keep": p.rotationDismissed = todayK(); save(); return render(true);
      case "who5": return who5Sheet();
      case "core-toggle": p.hidden ||= {}; p.hidden[id] = !p.hidden[id]; save(); return render(true);
      case "menu-toggle": {
        p.chosen ||= {};
        if (p.chosen[id]) delete p.chosen[id]; else p.chosen[id] = { since: todayK() };
        save(); return render(true);
      }
      case "filter": planFilter = el.dataset.t || null; return render(true);
      case "emoji": p.emoji = el.dataset.e; save(); return render(true);
      case "plate": {
        const d = dayW(todayK());
        const m = (d.plate[el.dataset.meal] ||= {});
        m[el.dataset.part] = !m[el.dataset.part];
        const balanced = Object.values(d.plate).filter((x) => x.veg && x.protein && x.grain).length;
        if (balanced >= 2 && (p.chosen || {}).plate) d.done.plate = true;
        save(); return render(true);
      }
      case "cal-settings": return calSheet();
      case "cal-save": {
        const ft = Number(document.getElementById("cFt").value), inch = Number(document.getElementById("cIn").value) || 0;
        const lb = Number(document.getElementById("cLb").value), age = Number(document.getElementById("cAge").value);
        if (!(ft >= 3 && lb >= 60 && age >= 18)) return toast("Please fill in height, weight and age (18+).");
        p.weightLb = lb; p.age = age; p.band = bandOf(age);
        p.calories = { enabled: true, sex: document.getElementById("cSex").value, heightIn: ft * 12 + inch, activity: Number(document.getElementById("cAct").value), goal: document.getElementById("cGoal").value };
        save(); closeSheet(); return render(true);
      }
      case "cal-off": p.calories = { ...(p.calories || {}), enabled: false }; save(); closeSheet(); return render(true);
      case "log-workout": {
        const type = document.getElementById("wType").value;
        const min = Number(document.getElementById("wMin").value);
        const dist = WTYPES[type].dist ? Number(document.getElementById("wDist").value) || 0 : 0;
        const effort = document.getElementById("wEffort").value;
        if (!(min > 0 && min <= 600)) return toast("Enter how many minutes.");
        const w = { id: uid(), date: todayK(), type, min, dist: dist || undefined, effort, met: metOf(type, effort, speedOf({ min, dist })) };
        D().workouts.push(w);
        const d = dayW(todayK());
        const todayMin = workoutsOn(todayK()).filter((x) => x.effort !== "light" || p.band === "child").reduce((s, x) => s + x.min, 0);
        if (todayMin >= 20) d.done.move = true;
        if (type === "strength" && (p.chosen || {}).strength) d.done.strength = true;
        save(); toast("Logged! Nice work."); return render(true);
      }
      case "del-workout": D().workouts = D().workouts.filter((w) => w.id !== id); save(); return render(true);
      case "log-lift": {
        const ex = document.getElementById("lEx").value.trim();
        const sets = Number(document.getElementById("lSets").value), reps = Number(document.getElementById("lReps").value), lb = Number(document.getElementById("lLb").value) || 0;
        if (!ex || !(sets > 0) || !(reps > 0)) return toast("Add the exercise, sets and reps.");
        D().lifts.push({ id: uid(), date: todayK(), ex, sets, reps, lb });
        if ((p.chosen || {}).strength) dayW(todayK()).done.strength = true;
        save(); toast("Saved."); return render(true);
      }
      case "export": return exportData();
      case "delete-person": {
        if (confirmKey !== "person") { confirmKey = "person"; return render(true); }
        confirmKey = null;
        delete state.data[p.id];
        state.profiles = state.profiles.filter((x) => x.id !== p.id);
        state.activeId = state.profiles[0]?.id || null;
        save(); toast("Deleted."); location.hash = "#today"; return render(false);
      }
      case "delete-all": {
        if (confirmKey !== "all") { confirmKey = "all"; return render(true); }
        confirmKey = null; state = blank(); save(); location.hash = "#today"; return render(false);
      }
    }
  });

  document.addEventListener("change", (e) => {
    const t = e.target, p = P();
    if (!p) return;
    if (t.dataset.target) { (p.targets ||= {})[t.dataset.target] = Number(t.value); save(); return render(true); }
    if (t.dataset.cue != null && t.dataset.cue !== undefined && t.hasAttribute("data-cue")) { (p.cues ||= {})[t.dataset.cue] = t.value.trim(); save(); return; }
    if (t.dataset.kcal) { const d = dayW(todayK()); const v = t.value === "" ? undefined : Math.max(0, Number(t.value)); if (v == null) delete d.kcal[t.dataset.kcal]; else d.kcal[t.dataset.kcal] = v; save(); return render(true); }
    if (t.dataset.prof) {
      const f = t.dataset.prof;
      if (f === "name") { if (t.value.trim()) p.name = t.value.trim(); }
      else if (f === "age") { const a = Number(t.value); if (a >= 3 && a <= 110) { p.age = a; p.band = bandOf(a); } }
      else if (f === "weightLb") { const w = Number(t.value); p.weightLb = w >= 60 ? w : undefined; }
      else p[f] = t.value;
      save(); return render(true);
    }
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$sheet.hidden) { closeSheet(); render(true); } });

  // Keep bands in sync if data was edited by hand or imported.
  state.profiles.forEach((p) => { p.band = bandOf(p.age || 30); });
  if (state.profiles.length && !P()) state.activeId = state.profiles[0].id;
  render(false);
})();
