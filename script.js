/* ==========================================================================
   SALMASTRO – script del sito
   I contenuti (orari, prezzi, eventi…) arrivano da config.js
   ========================================================================== */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = motionQuery.matches;
  motionQuery.addEventListener?.("change", (e) => { reduceMotion = e.matches; });

  const euro = (n, dec) => (dec || !Number.isInteger(n) ? n.toFixed(2).replace(".", ",") : n) + " €";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmtTime = (hhmm) => hhmm.replace(/^0(\d)/, "$1");
  const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

  /* ---------------------------------------------------------------------
     1. Testi e link da config.js
     --------------------------------------------------------------------- */
  const laurea = C.eventi.find((e) => e.id === "laurea");
  const cfgText = {
    slogan: C.slogan,
    sala: C.sale.sala,
    terrazza: C.sale.terrazza,
    instagramNome: C.social.instagramNome,
    indirizzo: C.indirizzo,
    telefono: C.telefono,
    email: C.email,
    laureaOfferta: laurea && laurea.offerta,
    laureaPrezzo: laurea && laurea.daPrezzo
  };
  $$("[data-cfg]").forEach((el) => {
    const v = cfgText[el.dataset.cfg];
    if (v !== undefined && v !== null) el.textContent = v;
  });
  const waLink = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(C.whatsappMessaggio);
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + C.telefonoLink));
  $$("[data-wa]").forEach((a) => (a.href = waLink));
  $$("[data-mail]").forEach((a) => (a.href = "mailto:" + C.email));
  $$("[data-social]").forEach((a) => (a.href = C.social[a.dataset.social] || "#"));
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     2. Aperto / chiuso (ora di Pescara, anche se chi guarda è altrove)
     --------------------------------------------------------------------- */
  function nowInRome() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: C.fusoOrario, weekday: "short", hour: "2-digit", minute: "2-digit",
      year: "numeric", month: "2-digit", day: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { dow, min: (+p.hour % 24) * 60 + +p.minute, y: +p.year, m: +p.month, d: +p.day };
  }

  // Restituisce gli intervalli [apre, chiude] in minuti per un giorno (chiude può superare 1440)
  function slot(dow) {
    const o = C.orari[dow];
    if (!o) return null;
    const a = toMin(o.apre);
    let c = toMin(o.chiude);
    if (c <= a) c += 1440;
    return { a, c, apre: o.apre, chiude: o.chiude };
  }

  function getStatus() {
    const { dow, min } = nowInRome();
    const today = slot(dow);
    const yest = slot((dow + 6) % 7);
    if (yest && yest.c > 1440 && min < yest.c - 1440) return { open: true, text: "Aperto ora, fino alle " + fmtTime(yest.chiude) };
    if (today && min >= today.a && min < today.c) return { open: true, text: "Aperto ora, fino alle " + fmtTime(today.chiude) };
    if (today && min < today.a) return { open: false, text: "Chiuso, apriamo alle " + fmtTime(today.apre) };
    for (let i = 1; i <= 7; i++) {
      const s = slot((dow + i) % 7);
      if (s) {
        const quando = i === 1 ? "domani" : GIORNI[(dow + i) % 7];
        return { open: false, text: "Chiuso, apriamo " + quando + " alle " + fmtTime(s.apre) };
      }
    }
    return { open: false, text: "Chiuso" };
  }

  function renderStatus() {
    const s = getStatus();
    $$("[data-status-text]").forEach((el) => (el.textContent = s.text));
    $$(".status").forEach((el) => (el.dataset.state = s.open ? "open" : "closed"));
  }
  renderStatus();
  setInterval(renderStatus, 30000);

  // Tabella orari (da lunedì a domenica)
  const hoursBody = $("#orari tbody");
  if (hoursBody) {
    const todayDow = nowInRome().dow;
    hoursBody.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const o = C.orari[d];
      const label = GIORNI[d].charAt(0).toUpperCase() + GIORNI[d].slice(1);
      const val = o ? fmtTime(o.apre) + " – " + fmtTime(o.chiude) : "Chiuso";
      return `<tr class="${d === todayDow ? "is-today" : ""}"><th scope="row">${label}${d === todayDow ? " <span class=\"sr-only\">(oggi)</span>" : ""}</th><td>${val}</td></tr>`;
    }).join("");
  }

  // Orari delle fasce del "nostro giorno"
  C.giornata.forEach((g) => { const el = $(`[data-orario="${g.id}"]`); if (el) el.textContent = g.orario; });

  /* ---------------------------------------------------------------------
     3. Menù a schede
     --------------------------------------------------------------------- */
  const MENU_VISIBILI = 5;
  const menuItem = (v) => `<li class="mi"><span class="mi__name">${esc(v.nome)}${v.nota ? `<span class="mi__note">${esc(v.nota)}</span>` : ""}</span><span class="mi__dots" aria-hidden="true"></span><span class="mi__price">${euro(v.prezzo, true)}</span></li>`;
  const tabsEl = $("#menu-tabs");
  const panelsEl = $("#menu-panels");
  if (tabsEl && panelsEl) {
    tabsEl.innerHTML = C.menu.map((cat, i) =>
      `<button class="tab" role="tab" type="button" id="tab-${cat.id}" aria-controls="panel-${cat.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(cat.nome)}</button>`
    ).join("");
    panelsEl.innerHTML = C.menu.map((cat, i) =>
      `<div class="panel" role="tabpanel" id="panel-${cat.id}" aria-labelledby="tab-${cat.id}" tabindex="0" ${i ? "hidden" : ""}>
        <ul>${cat.voci.slice(0, MENU_VISIBILI).map(menuItem).join("")}</ul>
        ${cat.voci.length > MENU_VISIBILI ? `
        <div class="mi-more" id="more-${cat.id}"><div><ul>${cat.voci.slice(MENU_VISIBILI).map(menuItem).join("")}</ul></div></div>
        <button class="btn btn--outline btn--sm mi-toggle" type="button" aria-expanded="false" aria-controls="more-${cat.id}" data-more="${cat.voci.length - MENU_VISIBILI}">Vedi tutto (${cat.voci.length})</button>` : ""}
      </div>`
    ).join("");

    // Sul telefono: prime 5 voci, le altre con "Vedi tutto"
    const phone = window.matchMedia("(max-width: 759px)");
    const syncMore = () => $$(".mi-more", panelsEl).forEach((m) => {
      const btn = m.nextElementSibling;
      m.inert = phone.matches && btn.getAttribute("aria-expanded") !== "true";
    });
    $$(".mi-toggle", panelsEl).forEach((btn) => btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      const more = $("#" + btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", open);
      more.classList.toggle("is-open", open);
      btn.textContent = open ? "Mostra meno" : "Vedi tutto (" + (MENU_VISIBILI + +btn.dataset.more) + ")";
      syncMore();
      if (!open) btn.closest(".panel").scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    }));
    phone.addEventListener?.("change", syncMore);
    syncMore();
    const tabs = $$(".tab", tabsEl);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        $("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        let n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  const cotw = C.cocktailDellaSettimana;
  if (cotw) {
    $("#cotw-title").textContent = cotw.nome;
    $("#cotw-desc").textContent = cotw.descrizione;
    $("#cotw-price").textContent = euro(cotw.prezzo);
    $("#cotw-img").src = cotw.foto;
    $("#cotw-img").alt = "Il cocktail della settimana: " + cotw.nome;
  }

  /* ---------------------------------------------------------------------
     4. Eventi e pacchetti
     --------------------------------------------------------------------- */
  const checks = (arr) => arr.map((x) => `<li>${esc(x)}</li>`).join("");
  if (laurea) $("#laurea-incluso").innerHTML = checks(laurea.incluso);

  const evGrid = $("#eventi-grid");
  if (evGrid) {
    evGrid.innerHTML = C.eventi.filter((e) => e.id !== "laurea").map((e) => `
      <article class="ev">
        <figure class="photo"><img src="${e.foto}" alt="${esc(e.fotoAlt || e.nome)}" loading="lazy" decoding="async"></figure>
        <div class="ev__body">
          <h3 class="ev__title">${esc(e.nome)}</h3>
          <ul class="checks">${checks(e.incluso)}</ul>
          <div class="ev__foot">
            <p class="price">a partire da <strong>${euro(e.daPrezzo)}</strong> a persona</p>
            <a class="btn btn--outline btn--sm" href="#preventivo" data-prefill-evento="${e.id}">Chiedi un preventivo</a>
          </div>
        </div>
      </article>`).join("");
  }

  const pkGrid = $("#pacchetti");
  if (pkGrid) {
    pkGrid.innerHTML = C.pacchetti.map((p) => `
      <article class="pk${p.consigliato ? " pk--hot" : ""}">
        ${p.consigliato ? '<p class="pk__badge">Il più scelto</p>' : ""}
        <h4 class="pk__name">${esc(p.nome)}</h4>
        <p class="pk__price"><strong>${euro(p.prezzo)}</strong> a persona</p>
        <p class="pk__desc">${esc(p.descrizione)}</p>
        <ul class="checks">${checks(p.incluso)}</ul>
        <a class="btn btn--outline" href="#preventivo" data-prefill-pacchetto="${p.id}">Scegli ${esc(p.nome)}</a>
      </article>`).join("");
  }

  /* Carosello orizzontale con i puntini (attivo solo sul telefono, via CSS) */
  function carousel(track, nome) {
    if (!track) return;
    const cards = Array.from(track.children);
    const dots = document.createElement("div");
    dots.className = "dots";
    dots.setAttribute("aria-label", nome);
    dots.innerHTML = cards.map((c, i) => `<button type="button" class="dot" aria-label="Scheda ${i + 1} di ${cards.length}"${i ? "" : ' aria-current="true"'}></button>`).join("");
    track.after(dots);
    const btns = $$(".dot", dots);
    const setActive = (i) => btns.forEach((b, k) => (k === i ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
    btns.forEach((b, i) => b.addEventListener("click", () => {
      track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    }));
    let raf = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = track.scrollLeft + cards[0].offsetLeft;
        let best = 0;
        cards.forEach((c, i) => { if (Math.abs(c.offsetLeft - x) < Math.abs(cards[best].offsetLeft - x)) best = i; });
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = cards.length - 1;
        setActive(best);
      });
    }, { passive: true });
  }
  carousel(evGrid, "Scorri i tipi di evento");
  carousel(pkGrid, "Scorri i pacchetti");

  /* ---------------------------------------------------------------------
     5. Serate: mostra la prossima data per ogni appuntamento settimanale
     --------------------------------------------------------------------- */
  const serateEl = $("#serate-list");
  if (serateEl) {
    const now = nowInRome();
    const base = Date.UTC(now.y, now.m - 1, now.d);
    const fmt = (opt) => new Intl.DateTimeFormat("it-IT", Object.assign({ timeZone: "UTC" }, opt));
    const items = C.serate.map((s) => {
      let add = (s.giorno - now.dow + 7) % 7;
      if (add === 0 && now.min > toMin(s.ora) + 120) add = 7; // stasera è già finita
      const date = new Date(base + add * 86400000);
      return { s, date, add };
    }).sort((a, b) => a.date - b.date);
    serateEl.innerHTML = items.map(({ s, date, add }) => {
      const iso = date.toISOString().slice(0, 10);
      const when = add === 0 ? "Stasera" : add === 1 ? "Domani" : "Ogni " + GIORNI[s.giorno];
      return `
      <li class="night">
        <figure class="photo curtain" data-reveal>
          <img src="${s.foto}" alt="${esc(s.titolo)}" loading="lazy" decoding="async">
          <time class="night__date" datetime="${iso}T${s.ora}">
            <span class="night__dow">${fmt({ weekday: "short" }).format(date)}</span>
            <span class="night__day">${fmt({ day: "numeric" }).format(date)}</span>
            <span class="night__mon">${fmt({ month: "short" }).format(date)}</span>
          </time>
        </figure>
        <div class="night__body">
          <p class="night__time">${when}, dalle ${fmtTime(s.ora)}</p>
          <h3 class="night__title">${esc(s.titolo)}</h3>
          <p class="night__desc">${esc(s.descrizione)}</p>
          <p class="night__entry">${esc(s.ingresso)}</p>
        </div>
      </li>`;
    }).join("");
  }

  carousel(serateEl, "Scorri le serate");
  carousel($("#recensioni-list"), "Scorri le recensioni");

  /* ---------------------------------------------------------------------
     6. Domande frequenti (fisarmonica)
     --------------------------------------------------------------------- */
  const faqEl = $("#faq-list");
  if (faqEl) {
    faqEl.innerHTML = C.faq.map((f, i) => `
      <div class="acc">
        <h3><button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-b-${i}">
          <span>${esc(f.d)}</span><span class="acc__icon" aria-hidden="true"></span>
        </button></h3>
        <div class="acc__panel" id="faq-${i}" role="region" aria-labelledby="faq-b-${i}" inert><div><p>${esc(f.r)}</p></div></div>
      </div>`).join("");
    $$(".acc__btn", faqEl).forEach((b) => b.addEventListener("click", () => {
      const item = b.closest(".acc");
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      b.setAttribute("aria-expanded", open);
      $(".acc__panel", item).inert = !open;
    }));
  }

  /* ---------------------------------------------------------------------
     7. Modulo preventivo (Web3Forms)
     --------------------------------------------------------------------- */
  const form = $("#quote-form");
  if (form) {
    const tipo = $("#f-tipo");
    const pack = $("#f-pacchetto");
    const data = $("#f-data");
    tipo.insertAdjacentHTML("beforeend",
      C.eventi.map((e) => `<option value="${e.id}">${esc(e.nome)}</option>`).join("") + '<option value="altro">Altro</option>');
    pack.insertAdjacentHTML("beforeend",
      C.pacchetti.map((p) => `<option value="${p.id}">${esc(p.nome)} – ${euro(p.prezzo)} a persona</option>`).join("") + '<option value="non-so">Non lo so ancora, consigliatemi voi</option>');
    $("#f-persone").max = C.sale.sala + C.sale.terrazza;

    const localToday = () => {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    };
    data.min = localToday();

    // Prefill dai pulsanti "Chiedi un preventivo" / "Scegli pacchetto"
    document.addEventListener("click", (e) => {
      const ev = e.target.closest("[data-prefill-evento]");
      const pk = e.target.closest("[data-prefill-pacchetto]");
      if (ev) { tipo.value = ev.dataset.prefillEvento; clearErr(tipo); }
      if (pk) { pack.value = pk.dataset.prefillPacchetto; clearErr(pack); }
    });

    const rules = {
      nome: (v) => (v.trim().length < 2 ? "Scrivi il tuo nome e cognome." : ""),
      telefono: (v) => (!v.trim() ? "Scrivi un numero di telefono." : v.replace(/\D/g, "").length < 8 ? "Il numero sembra incompleto: controlla le cifre." : ""),
      email: (v) => (!v.trim() ? "Scrivi la tua email." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "L'email non è valida: controlla che ci siano @ e dominio." : ""),
      tipo_evento: (v) => (!v ? "Scegli il tipo di evento." : ""),
      data: (v) => (!v ? "Scegli la data dell'evento." : v < localToday() ? "La data è già passata: scegline una da oggi in poi." : ""),
      persone: (v) => {
        const n = Number(v), max = C.sale.sala + C.sale.terrazza;
        if (!v) return "Indica quante persone saranno.";
        if (!Number.isInteger(n) || n < 1) return "Scrivi un numero intero di persone.";
        if (n > max) return "Possiamo ospitare al massimo " + max + " persone tra sala e terrazza.";
        return "";
      },
      pacchetto: (v) => (!v ? "Scegli un pacchetto, o \"Non lo so ancora\"." : ""),
      privacy: (_, el) => (!el.checked ? "Serve il consenso per poterti rispondere." : "")
    };

    function showErr(el, msg) {
      const field = el.closest(".field");
      const box = $("#" + el.getAttribute("aria-describedby"));
      field.classList.toggle("is-invalid", !!msg);
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (box) box.textContent = msg;
    }
    function clearErr(el) { showErr(el, ""); }
    function check(el) {
      const rule = rules[el.name];
      if (!rule) return true;
      const msg = rule(el.value, el);
      showErr(el, msg);
      return !msg;
    }
    Object.keys(rules).forEach((name) => {
      const el = form.elements[name];
      el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur", () => check(el));
      el.addEventListener("input", () => { if (el.closest(".field").classList.contains("is-invalid")) check(el); });
    });

    const msg = $("#form-msg");
    const btn = $("#quote-submit");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form__msg";
      msg.textContent = "";
      const invalid = Object.keys(rules).map((n) => form.elements[n]).filter((el) => !check(el));
      if (invalid.length) {
        invalid[0].focus();
        msg.className = "form__msg is-err";
        msg.textContent = invalid.length === 1 ? "Manca ancora un campo: è evidenziato qui sopra." : "Mancano " + invalid.length + " campi: sono evidenziati qui sopra.";
        return;
      }
      if (form.elements.botcheck.checked) return;

      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      delete payload.botcheck;
      payload.tipo_evento = tipo.options[tipo.selectedIndex].text;
      payload.pacchetto = pack.options[pack.selectedIndex].text;
      payload.privacy = "Consenso dato";

      if (!C.web3formsKey || C.web3formsKey === "INSERISCI_CHIAVE_WEB3FORMS") {
        msg.className = "form__msg is-demo";
        msg.textContent = "Modulo compilato correttamente. Questa è una demo: per ricevere le richieste via email inserisci la chiave Web3Forms in config.js.";
        return;
      }

      btn.disabled = true;
      btn.firstElementChild.textContent = "Invio in corso…";
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.assign({
            access_key: C.web3formsKey,
            subject: "Richiesta preventivo: " + payload.tipo_evento + " (" + payload.persone + " persone)",
            from_name: C.nome + " – sito web",
            replyto: payload.email
          }, payload))
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        form.reset();
        msg.className = "form__msg is-ok";
        msg.textContent = "Richiesta inviata. Ti rispondiamo entro 24 ore con il preventivo.";
      } catch (err) {
        msg.className = "form__msg is-err";
        msg.textContent = "Invio non riuscito. Riprova tra poco oppure chiamaci al " + C.telefono + ".";
      } finally {
        btn.disabled = false;
        btn.firstElementChild.textContent = "Invia la richiesta";
      }
    });
  }

  /* ---------------------------------------------------------------------
     8. Mappa
     --------------------------------------------------------------------- */
  const map = $("#map");
  if (map) map.src = `https://maps.google.com/maps?q=${C.mappa.lat},${C.mappa.lng}&z=${C.mappa.zoom}&hl=it&output=embed`;

  /* ---------------------------------------------------------------------
     9. Barra in alto, menu mobile, torna su, link attivo
     --------------------------------------------------------------------- */
  const header = $("#header");
  const burger = $("#burger");
  const nav = $("#nav");
  const totop = $("#totop");

  function setMenu(open) {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    if (open) $("a", nav).focus({ preventScroll: true });
  }
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 900px)").addEventListener?.("change", (e) => { if (e.matches) setMenu(false); });

  totop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    $(".brand").focus({ preventScroll: true });
  });

  const navLinks = $$(".nav__list a");
  const navTargets = navLinks.map((a) => [a, $(a.getAttribute("href"))]).filter((x) => x[1]);
  function updateActiveLink() {
    const line = window.innerHeight * 0.4;
    let active = null;
    navTargets.forEach(([a, sec]) => { const r = sec.getBoundingClientRect(); if (r.top <= line && r.bottom > line) active = a; });
    navLinks.forEach((a) => (a === active ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }

  /* ---------------------------------------------------------------------
     10. Animazioni: parole che salgono, tendine, schede in sequenza, contatori
     --------------------------------------------------------------------- */
  // Spezza i titoli in parole
  $$("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(" ");
  });
  // Lettere del nome nell'hero
  const heroName = $(".hero__name");
  if (heroName) {
    const t = heroName.textContent;
    heroName.setAttribute("aria-label", t);
    heroName.innerHTML = [...t].map((ch, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${esc(ch)}</span>`).join("");
  }
  // Indice per lo sfalsamento delle schede
  $$("[data-stagger]").forEach((g) => Array.from(g.children).forEach((c, i) => c.style.setProperty("--i", i % 6)));

  function countUp(el) {
    const target = +el.dataset.count;
    // "1.200": separatore delle migliaia anche a 4 cifre
    const f = { format: (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") };
    if (reduceMotion) { el.textContent = f.format(target); return; }
    const dur = 1800, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = f.format(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const revealTargets = $$("[data-split], [data-reveal], [data-stagger], [data-count]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add("is-in");
        if (el.dataset.count) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => { el.classList.add("is-in"); if (el.dataset.count) el.textContent = el.dataset.count; });
  }

  /* ---------------------------------------------------------------------
     11. Scorrimento: parallasse, cielo del "nostro giorno", barra, torna su
     --------------------------------------------------------------------- */
  const pxEls = $$("[data-parallax]");
  const day = $("#giorno");
  const skies = day ? $$(".sky", day) : [];
  const sun = day ? $(".day__sun", day) : null;
  const phases = day ? $$(".phase", day) : [];
  const heroH = () => $(".hero").offsetHeight;

  // Visibilità per la parallasse: lavora solo sulle foto sullo schermo
  const visible = new Set();
  const pxIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
  }, { rootMargin: "120px 0px" });
  pxEls.forEach((el) => pxIO.observe(el));

  let ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function update() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    header.classList.toggle("is-solid", y > 40);
    totop.classList.toggle("is-visible", y > vh * 0.9);
    document.body.classList.toggle("show-totop", y > vh * 0.9);
    updateActiveLink();

    if (!reduceMotion) {
      visible.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        if (el.parentElement.classList.contains("hero")) {
          if (y < heroH()) el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
          return;
        }
        const r = el.parentElement.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) * -speed;
        const lim = r.height * 0.08;
        el.style.transform = `translate3d(0, ${Math.max(-lim, Math.min(lim, off)).toFixed(1)}px, 0)`;
      });
    }

    // Cielo: interpola tra le fasi in base a quale è al centro dello schermo
    if (day && skies.length) {
      const dr = day.getBoundingClientRect();
      if (dr.bottom > 0 && dr.top < vh) {
        const centers = phases.map((p) => { const r = p.getBoundingClientRect(); return r.top + r.height / 2 - vh / 2; });
        let pos = 0; // 0 … 3
        if (centers[0] > 0) pos = 0;
        else if (centers[centers.length - 1] < 0) pos = centers.length - 1;
        else {
          for (let i = 0; i < centers.length - 1; i++) {
            if (centers[i] <= 0 && centers[i + 1] > 0) { pos = i + (-centers[i]) / (centers[i + 1] - centers[i]); break; }
          }
        }
        if (reduceMotion) pos = Math.round(pos);
        skies.forEach((s, i) => {
          const o = i === 0 ? 1 : Math.max(0, Math.min(1, pos - (i - 1)));
          s.style.opacity = o.toFixed(3);
        });
        day.classList.toggle("is-night", pos > 2.5);
        if (sun) {
          // Il sole sorge dal mare (a destra), è alto a mezzogiorno e tramonta verso la Majella (a sinistra);
          // di notte lascia il posto alla luna, in alto a destra.
          const w = window.innerWidth;
          const u = Math.min(1, pos / 2);
          const night = Math.max(0, Math.min(1, (pos - 2.3) / 0.7));
          const sw = sun.offsetWidth;
          const tx = w * (0.8 - 0.66 * u) - sw / 2;
          const ty = vh * (0.8 - 0.64 * Math.sin(u * Math.PI)) - sw / 2;
          const mx = w * 0.82 - sw / 2, my = vh * 0.16;
          sun.style.setProperty("--sx", (tx + (mx - tx) * night).toFixed(1) + "px");
          sun.style.setProperty("--sy", (ty + (my - ty) * night).toFixed(1) + "px");
        }
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  /* ---------------------------------------------------------------------
     12. Galleria con ingrandimento
     --------------------------------------------------------------------- */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  const lbCap = $("#lb-cap");
  const lbCount = $("#lb-count");
  const galBtns = $$("#gal .gal__btn");
  let cur = 0;
  let opener = null;

  function show(i) {
    cur = (i + galBtns.length) % galBtns.length;
    const img = $("img", galBtns[cur]);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lbCount.textContent = (cur + 1) + " / " + galBtns.length;
  }
  function openLb(i) {
    opener = galBtns[i];
    show(i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.body.classList.add("no-scroll");
    $("#lb-close").focus();
  }
  function closeLb() {
    if (lb.open) lb.close();
    document.body.classList.remove("no-scroll");
    if (opener) opener.focus({ preventScroll: true });
  }
  galBtns.forEach((b, i) => {
    b.setAttribute("aria-label", "Ingrandisci: " + $("img", b).alt);
    b.addEventListener("click", () => openLb(i));
  });
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", () => show(cur - 1));
  $("#lb-next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("cancel", (e) => { e.preventDefault(); closeLb(); });
  lb.addEventListener("close", () => document.body.classList.remove("no-scroll"));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox__fig")) closeLb(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); }
    if (e.key === "Escape") { e.preventDefault(); closeLb(); }
  });
  // Scorrimento col dito
  let sx = null, sy = null;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
