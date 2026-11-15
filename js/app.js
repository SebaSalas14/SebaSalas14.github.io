/*
 * Render del contenido de js/data.js, cambio de idioma (es/en/ca)
 * y efectos visuales. Sin dependencias: corre antes de js/scripts.js
 * para que el scroll suave y el scrollspy del template vean el DOM final.
 */
(function () {
    "use strict";

    var S = window.SITE;
    var LANGS = ["es", "en", "ca"];
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lang = detectLang();
    var certFilter = "all";
    var skillFilter = null;

    function detectLang() {
        var q = new URLSearchParams(location.search).get("lang");
        if (LANGS.indexOf(q) > -1) return q;
        try {
            var saved = localStorage.getItem("lang");
            if (LANGS.indexOf(saved) > -1) return saved;
        } catch (e) { /* almacenamiento bloqueado */ }
        var nav = (navigator.language || "es").slice(0, 2).toLowerCase();
        return LANGS.indexOf(nav) > -1 ? nav : "en";
    }

    // Texto traducible ({es,en,ca}) o literal.
    function t(v) {
        if (v == null) return "";
        if (typeof v === "string" || Array.isArray(v)) return v;
        return v[lang] || v.es || "";
    }

    function ui(key) { return t(S.ui[key]); }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // Nombre de empresa/centro, enlazado a su web si la tiene
    function orgLink(name, url) {
        if (!url) return esc(name);
        return '<a class="org-link" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(name) +
            '&nbsp;<i class="fas fa-external-link-alt" aria-hidden="true"></i></a>';
    }

    function $(id) { return document.getElementById(id); }

    /* ---------- Fechas ---------- */

    function ym(s) {
        var p = s.split("-");
        return { y: +p[0], m: +(p[1] || 1) };
    }

    function nowYm() {
        var d = new Date();
        return { y: d.getFullYear(), m: d.getMonth() + 1 };
    }

    function monthIndex(d) { return d.y * 12 + (d.m - 1); }

    function fmtMonth(s) {
        var d = ym(s);
        return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" })
            .format(new Date(d.y, d.m - 1, 1));
    }

    // Duración inclusiva, como la cuenta LinkedIn.
    function duration(start, end) {
        var total = monthIndex(end ? ym(end) : nowYm()) - monthIndex(ym(start)) + 1;
        var y = Math.floor(total / 12), m = total % 12;
        var U = {
            y: { es: ["año", "años"], en: ["yr", "yrs"], ca: ["any", "anys"] },
            m: { es: ["mes", "meses"], en: ["mo", "mos"], ca: ["mes", "mesos"] }
        };
        var out = [];
        if (y) out.push(y + " " + U.y[lang][y > 1 ? 1 : 0]);
        if (m) out.push(m + " " + U.m[lang][m > 1 ? 1 : 0]);
        return out.join(" ");
    }

    function range(start, end) {
        return fmtMonth(start) + " – " + (end ? fmtMonth(end) : ui("exp.present"));
    }

    function allRoles() {
        var list = [];
        S.experience.forEach(function (co) {
            co.roles.forEach(function (r) { list.push({ company: co.company, role: r, i: list.length }); });
        });
        return list;
    }

    /* ---------- Habilidades ↔ roles ---------- */

    // Todo el texto de un valor traducible, en los tres idiomas.
    function allText(v) {
        if (v == null) return "";
        if (typeof v === "string") return v;
        if (Array.isArray(v)) return v.map(allText).join(" ");
        return Object.keys(v).map(function (k) { return allText(v[k]); }).join(" ");
    }

    var roleTexts = new WeakMap();
    function roleText(r) {
        if (!roleTexts.has(r)) {
            roleTexts.set(r, [r.title, r.team, r.summary, r.bullets, r.skills].map(allText).join(" ").toLowerCase());
        }
        return roleTexts.get(r);
    }

    // Un rol usa una habilidad si la menciona como palabra completa;
    // "ETL / ELT" vale por cualquiera de las dos.
    function usesSkill(r, skill) {
        return skill.split(" / ").some(function (term) {
            var safe = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            return new RegExp("(^|[^a-z0-9])" + safe + "($|[^a-z0-9])").test(roleText(r));
        });
    }

    function rolesWith(skill) {
        return allRoles().filter(function (x) { return usesSkill(x.role, skill); });
    }

    // Chip clicable si la habilidad aparece en algún rol; withCount añade cuántos.
    function skillChip(skill, withCount) {
        var n = rolesWith(skill).length;
        if (!n) return '<span class="chip">' + esc(skill) + "</span>";
        return '<button type="button" class="chip chip-btn" data-skill="' + esc(skill) + '" aria-pressed="false">' +
            esc(skill) + (withCount ? "<sup>" + n + "</sup>" : "") + "</button>";
    }

    /* ---------- Render ---------- */

    function renderStatic() {
        document.documentElement.lang = lang;
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            el.textContent = ui(el.getAttribute("data-i18n"));
        });
        document.querySelectorAll(".lang-btn").forEach(function (b) {
            b.classList.toggle("is-on", b.getAttribute("data-lang") === lang);
            b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang);
        });
        $("hero-intro").textContent = t(S.profile.intro);
        $("hero-loc").textContent = t(S.profile.location);
        $("year").textContent = new Date().getFullYear();
        $("updated").textContent = fmtMonth(S.updated);
    }

    function renderKpis() {
        var since = ym(S.profile.dataSince);
        var years = Math.floor((monthIndex(nowYm()) - monthIndex(since)) / 12);
        var items = [
            { n: years, suffix: "+", label: ui("kpi.years") },
            { n: allRoles().length, suffix: "", label: ui("kpi.roles") },
            { n: S.education.filter(function (e) { return e.kind === "master"; }).length, suffix: "", label: ui("kpi.masters") },
            { n: S.certs.length, suffix: "", label: ui("kpi.certs") }
        ];
        $("kpis").innerHTML = items.map(function (k) {
            return '<div class="kpi reveal"><span class="kpi-n" data-count="' + k.n + '" data-suffix="' + k.suffix + '">0</span>' +
                '<span class="kpi-l">' + esc(k.label) + "</span></div>";
        }).join("");
    }

    function renderStory() {
        $("story").innerHTML = t(S.about).map(function (p, i) {
            return '<p class="reveal' + (i === 0 ? " story-lead" : "") + '">' + esc(p) + "</p>";
        }).join("");
    }

    function renderPipeline() {
        $("pipeline").innerHTML = S.pipeline.map(function (st, i) {
            var link = i < S.pipeline.length - 1 ? '<div class="pipe-link" aria-hidden="true"><i></i></div>' : "";
            return '<div class="pipe-stage">' +
                '<span class="pipe-n mono">0' + (i + 1) + '</span>' +
                '<i class="fas ' + st.icon + ' pipe-icon"></i>' +
                '<strong>' + esc(t(st.name)) + "</strong>" +
                '<div class="pipe-tools">' + st.tools.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + "</div>" +
                "</div>" + link;
        }).join("");
    }

    function renderGantt() {
        var roles = allRoles().slice().reverse();
        var first = Math.min.apply(null, roles.map(function (r) { return ym(r.role.start).y; }));
        var lo = monthIndex({ y: first, m: 1 });
        var hi = monthIndex({ y: nowYm().y + 1, m: 1 });
        var span = hi - lo;
        function pct(d) { return ((monthIndex(d) - lo) / span) * 100; }

        var ticks = "";
        for (var y = first; y <= nowYm().y + 1; y++) {
            var x = pct({ y: y, m: 1 });
            ticks += '<span class="g-tick" style="left:' + x + '%"><em>' + (y <= nowYm().y ? y : "") + "</em></span>";
        }

        var rows = roles.map(function (r, i) {
            var s = pct(ym(r.role.start));
            var e = pct(r.role.end ? ym(r.role.end) : nowYm());
            var w = Math.max(e - s, 1.2);
            var live = r.role.end ? "" : " live";
            return '<div class="g-row" data-role="' + r.i + '">' +
                '<div class="g-label"><strong>' + esc(t(r.role.title)) + "</strong><span>" + esc(r.company) + "</span></div>" +
                '<div class="g-track">' + ticks.replace(/<em>.*?<\/em>/g, "") +
                '<span class="g-bar ' + r.role.domain + live + '" style="left:' + s + "%;--w:" + w + "%;--d:" + (i * 70) + 'ms" title="' +
                esc(range(r.role.start, r.role.end)) + '"></span></div></div>';
        }).join("");

        $("gantt").innerHTML = rows + '<div class="g-row g-axis"><div class="g-label"></div><div class="g-track">' + ticks + "</div></div>";
    }

    function renderTimeline() {
        var k = 0;
        $("timeline").innerHTML = S.experience.map(function (co) {
            var current = co.roles.some(function (r) { return !r.end; });
            var roles = co.roles.map(function (r) {
                var badges = (!r.end ? '<span class="badge-d live">● ' + esc(ui("exp.current")) + "</span>" : "") +
                    (r.promoted ? '<span class="badge-d up"><i class="fas fa-arrow-up"></i> ' + esc(ui("exp.promoted")) + "</span>" : "");
                return '<div class="tl-role' + (r.end ? "" : " is-live") + '" data-role="' + (k++) + '">' +
                    '<div class="tl-head"><h4>' + esc(t(r.title)) + "</h4>" + badges + "</div>" +
                    '<p class="tl-meta mono">' + esc(range(r.start, r.end)) + " · " + esc(duration(r.start, r.end)) +
                    (r.team ? " · " + esc(r.team) : "") + "</p>" +
                    (r.summary ? '<p class="tl-summary">' + esc(t(r.summary)) + "</p>" : "") +
                    '<ul class="ticks">' + t(r.bullets).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
                    '<div class="chips">' + r.skills.map(function (s) { return skillChip(s, false); }).join("") + "</div>" +
                    "</div>";
            }).join("");
            var domain = co.roles[0].domain;
            return '<article class="tl-item card-d reveal ' + domain + (current ? " is-live" : "") + '">' +
                '<header class="tl-company"><h3>' + orgLink(co.company, co.url) + '</h3><span class="mono">' + esc(t(co.place)) + "</span></header>" +
                roles + "</article>";
        }).join("");
    }

    function renderEducation() {
        var icons = { master: "fa-user-graduate", degree: "fa-microscope", school: "fa-flask" };
        $("edu-list").innerHTML = S.education.map(function (e) {
            return '<article class="card-d edu reveal">' +
                '<i class="fas ' + icons[e.kind] + ' edu-icon"></i>' +
                '<div><span class="mono dim">' + esc(e.start) + " → " + esc(e.end) + "</span>" +
                "<h3>" + esc(t(e.degree)) + "</h3><p>" + orgLink(e.school, e.url) + "</p></div></article>";
        }).join("");
    }

    function renderSkills() {
        $("skill-list").innerHTML = S.skills.map(function (g) {
            return '<article class="card-d skill reveal">' +
                '<h3><i class="fas ' + g.icon + '"></i>' + esc(t(g.name)) + "</h3>" +
                '<div class="chips">' + g.items.map(function (s) { return skillChip(s, true); }).join("") + "</div></article>";
        }).join("");
        $("lang-list").innerHTML = S.languages.map(function (l) {
            var bars = "";
            for (var i = 1; i <= 5; i++) bars += '<i class="' + (i <= l.level ? "on" : "") + '"></i>';
            return '<div class="lang card-d reveal"><strong>' + esc(t(l.name)) + '</strong><span class="meter" aria-hidden="true">' + bars +
                '</span><span class="mono dim">' + esc(t(l.label)) + "</span></div>";
        }).join("");
    }

    function renderCerts() {
        document.querySelectorAll("#cert-filters .filter").forEach(function (b) {
            b.classList.toggle("is-on", b.getAttribute("data-cat") === certFilter);
        });
        $("cert-list").innerHTML = S.certs.filter(function (c) {
            return certFilter === "all" || c.cat === certFilter;
        }).map(function (c) {
            return '<li class="cert ' + c.cat + '"><span class="mono dim">' + esc(fmtMonth(c.date)) + "</span>" +
                "<strong>" + esc(c.name) + "</strong><span>" + esc(c.issuer) + "</span></li>";
        }).join("");
    }

    function renderInterests() {
        $("interest-list").innerHTML = t(S.interests).map(function (s) {
            return '<span class="chip big">' + esc(s) + "</span>";
        }).join("");
    }

    function applySkillFilter() {
        var hits = skillFilter ? rolesWith(skillFilter) : [];
        var ids = hits.map(function (x) { return String(x.i); });
        document.body.classList.toggle("is-filtering", !!skillFilter);
        document.querySelectorAll("[data-role]").forEach(function (el) {
            el.classList.toggle("is-hit", ids.indexOf(el.getAttribute("data-role")) > -1);
        });
        document.querySelectorAll(".tl-item").forEach(function (el) {
            el.classList.toggle("is-hit", !!el.querySelector(".tl-role.is-hit"));
        });
        document.querySelectorAll(".chip-btn").forEach(function (b) {
            var on = b.getAttribute("data-skill") === skillFilter;
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", on);
        });

        var bar = $("exp-filter"), box = $("skill-result");
        bar.hidden = box.hidden = !skillFilter;
        if (!skillFilter) return;
        var count = hits.length + " " + ui(hits.length === 1 ? "filter.role" : "filter.roles");
        var clear = '<button type="button" class="btn-data js-clear-skill"><i class="fas fa-times"></i> ' + esc(ui("filter.clear")) + "</button>";
        bar.innerHTML = "<span>" + esc(ui("filter.by")) + ' <strong class="mono">' + esc(skillFilter) + "</strong> · " + esc(count) + "</span>" + clear;
        box.innerHTML = '<p class="mono skill-result-head"><strong>' + esc(skillFilter) + "</strong> → " + esc(count) + "</p>" +
            '<ul class="hits">' + hits.map(function (x) {
                return "<li><strong>" + esc(t(x.role.title)) + "</strong> · " + esc(x.company) +
                    ' <span class="mono dim">' + esc(range(x.role.start, x.role.end)) + "</span></li>";
            }).join("") + "</ul>" +
            '<div class="hero-cta"><a class="btn-data primary js-goto-exp" href="#experience"><i class="fas fa-arrow-down"></i> ' +
            esc(ui("filter.goto")) + "</a>" + clear + "</div>";
    }

    function renderAll() {
        renderStatic();
        renderKpis();
        renderStory();
        renderPipeline();
        renderGantt();
        renderTimeline();
        renderEducation();
        renderSkills();
        renderCerts();
        renderInterests();
        renderTermButtons();
        applySkillFilter();
    }

    /* ---------- Efectos ---------- */

    var revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            en.target.classList.add("in");
            var n = en.target.querySelector("[data-count]");
            if (n) countUp(n);
            revealObserver.unobserve(en.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }) : null;

    function observeReveals(instant) {
        document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
            if (instant || !revealObserver || reduceMotion) {
                el.classList.add("in");
                var n = el.querySelector("[data-count]");
                if (n) n.textContent = n.getAttribute("data-count") + n.getAttribute("data-suffix");
            } else {
                revealObserver.observe(el);
            }
        });
    }

    function countUp(el) {
        var target = +el.getAttribute("data-count");
        var suffix = el.getAttribute("data-suffix");
        var t0 = null, dur = 1200;
        function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : "");
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var rotatorTimer = null;
    function startRotator() {
        var el = $("role-rotator");
        var i = 0;
        clearInterval(rotatorTimer);
        el.textContent = t(S.profile.roles[0]);
        if (reduceMotion) return;
        rotatorTimer = setInterval(function () {
            i = (i + 1) % S.profile.roles.length;
            el.classList.add("swap");
            setTimeout(function () {
                el.textContent = t(S.profile.roles[i]);
                el.classList.remove("swap");
            }, 250);
        }, 2600);
    }

    /* ---------- Terminal ---------- */

    // Cada consulta se calcula desde data.js: el resultado siempre es real.
    var QUERIES = [
        {
            key: "now",
            sql: "SELECT role, company, since FROM career WHERE current = TRUE;",
            run: function () {
                var rows = allRoles().filter(function (x) { return !x.role.end; }).map(function (x) {
                    return [S.profile.now || t(x.role.title), x.company, x.role.start];
                });
                return { cols: ["role", "company", "since"], rows: rows };
            }
        },
        {
            key: "stack",
            sql: "SELECT tool, MIN(start) AS first_used, COUNT(role) AS roles FROM stack WHERE in_use GROUP BY tool ORDER BY first_used;",
            run: function () {
                var current = allRoles().filter(function (x) { return !x.role.end; })[0];
                var rows = current.role.skills.map(function (s) {
                    var used = rolesWith(s);
                    var first = used.map(function (x) { return x.role.start; }).sort()[0];
                    return [s, first, used.length];
                }).sort(function (a, b) { return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0; });
                return { cols: ["tool", "first_used", "roles"], rows: rows };
            }
        },
        {
            key: "domain",
            sql: "SELECT domain, COUNT(DISTINCT role) AS roles, ROUND(COUNT(DISTINCT month) / 12.0, 1) AS years FROM career_months GROUP BY domain;",
            run: function () {
                // Meses distintos: los roles que se solapan no cuentan doble.
                var acc = {};
                allRoles().forEach(function (x) {
                    var d = acc[x.role.domain] || (acc[x.role.domain] = { roles: 0, months: {} });
                    var from = monthIndex(ym(x.role.start));
                    var to = monthIndex(x.role.end ? ym(x.role.end) : nowYm());
                    d.roles++;
                    for (var m = from; m <= to; m++) d.months[m] = true;
                });
                var rows = Object.keys(acc).map(function (k) {
                    return [k, acc[k].roles, (Object.keys(acc[k].months).length / 12).toFixed(1)];
                });
                return { cols: ["domain", "roles", "years"], rows: rows };
            }
        },
        {
            key: "edu",
            sql: "SELECT degree, school, year FROM education WHERE level <> 'school' ORDER BY year DESC;",
            run: function () {
                var rows = S.education.filter(function (e) { return e.kind !== "school"; }).map(function (e) {
                    return [t(e.degree), e.school, e.end];
                });
                return { cols: ["degree", "school", "year"], rows: rows };
            }
        },
        {
            key: "langs",
            sql: "SELECT language, level FROM languages ORDER BY level DESC;",
            run: function () {
                var rows = S.languages.map(function (l) {
                    var bar = "";
                    for (var i = 1; i <= 5; i++) bar += i <= l.level ? "●" : "○";
                    return [t(l.name), bar + "  " + t(l.label)];
                });
                return { cols: ["language", "level"], rows: rows };
            }
        }
    ];

    var termRun = 0;
    var termKey = "now";

    function renderTermButtons() {
        $("term-qs").innerHTML = QUERIES.map(function (q) {
            var on = q.key === termKey;
            return '<button type="button" class="term-q' + (on ? " is-on" : "") + '" data-q="' + q.key + '" aria-pressed="' + on + '">' +
                esc(ui("term.q." + q.key)) + "</button>";
        }).join("");
    }

    function termTable(res) {
        var ms = 2 + Math.floor(Math.random() * 8);
        return "<table><thead><tr>" + res.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead>" +
            "<tbody>" + res.rows.map(function (r) {
                return "<tr>" + r.map(function (c) {
                    // Fechas y números no se parten en dos líneas.
                    return (/^[\d.-]+$/.test(c) ? '<td class="num">' : "<td>") + esc(c) + "</td>";
                }).join("") + "</tr>";
            }).join("") + "</tbody></table>" +
            '<div class="term-ok">✔ ' + res.rows.length + " " + esc(ui(res.rows.length === 1 ? "term.row" : "term.rows")) + " · " + ms + " ms</div>";
    }

    // Escribe la consulta y muestra su resultado; una consulta nueva cancela la anterior.
    function runQuery(key, instant, delay) {
        var q = QUERIES.filter(function (x) { return x.key === key; })[0];
        var run = ++termRun;
        var out = $("term-query"), res = $("term-result"), caret = $("term-caret");
        termKey = key;
        renderTermButtons();
        function show() {
            if (run !== termRun) return;
            caret.style.display = "none";
            res.innerHTML = termTable(q.run());
            res.hidden = false;
        }
        if (instant || reduceMotion) { out.textContent = q.sql; show(); return; }
        res.hidden = true;
        caret.style.display = "";
        out.textContent = "";
        var i = 0;
        setTimeout(function tick() {
            if (run !== termRun) return;
            out.textContent = q.sql.slice(0, ++i);
            if (i < q.sql.length) setTimeout(tick, 10 + Math.random() * 22);
            else setTimeout(show, 250);
        }, delay || 0);
    }

    /* ---------- CV en PDF ---------- */

    // jsPDF solo se descarga cuando alguien pide el CV.
    var JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    var jspdfReady = null;

    function loadJsPdf() {
        if (!jspdfReady) {
            jspdfReady = new Promise(function (resolve, reject) {
                var s = document.createElement("script");
                s.src = JSPDF_URL;
                s.onload = function () { resolve(window.jspdf.jsPDF); };
                s.onerror = function () { jspdfReady = null; reject(new Error("No se pudo cargar jsPDF")); };
                document.head.appendChild(s);
            });
        }
        return jspdfReady;
    }

    // Las fuentes estándar del PDF no tienen flechas.
    function pdfText(s) { return String(s).replace(/→/g, "–"); }

    // CV en A4 con texto real (seleccionable y legible por los ATS), en el idioma activo.
    function buildCv(JsPDF) {
        var doc = new JsPDF({ unit: "mm", format: "a4" });
        var P = S.profile;
        var M = 15, W = 210 - M * 2, BOTTOM = 297 - 17, PT = 0.3528, LH = 1.32;
        var INK = [22, 27, 38], MUTED = [105, 115, 130], ACCENT = [196, 112, 10];
        var y = M;

        function style(size, weight, rgb) {
            rgb = rgb || INK;
            doc.setFont("helvetica", weight || "normal");
            doc.setFontSize(size);
            doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        }
        function room(h) { if (y + h > BOTTOM) { doc.addPage(); y = M; } }
        // Texto con salto de línea; x es la sangría desde el margen.
        function para(text, size, weight, rgb, x, width) {
            x = x || 0;
            style(size, weight, rgb);
            var lh = size * PT * LH;
            doc.splitTextToSize(pdfText(text), width || W - x).forEach(function (line) {
                room(lh);
                doc.text(line, M + x, y + size * PT);
                y += lh;
            });
        }
        // Texto a la izquierda (con salto de línea) y dato a la derecha.
        function row(left, right, size, weight) {
            style(size - 1.5, "normal", MUTED);
            var rw = right ? doc.getTextWidth(pdfText(right)) + 6 : 0;
            style(size, weight);
            var lines = doc.splitTextToSize(pdfText(left), W - rw);
            var lh = size * PT * LH;
            room(lh * lines.length + 6);
            lines.forEach(function (line, i) { doc.text(line, M, y + size * PT + i * lh); });
            if (right) {
                style(size - 1.5, "normal", MUTED);
                doc.text(pdfText(right), M + W, y + size * PT, { align: "right" });
            }
            y += lh * lines.length;
        }
        // Etiqueta en negrita y texto en una segunda columna.
        function pair(label, text, labelW) {
            room(5);
            var top = y;
            style(9, "bold");
            doc.text(pdfText(label), M, y + 9 * PT);
            para(text, 9, "normal", INK, labelW, W - labelW);
            y = Math.max(y, top + 9 * PT * LH) + 0.6;
        }
        function heading(text) {
            room(14);
            y += 4;
            style(10.5, "bold", ACCENT);
            doc.text(pdfText(text).toUpperCase(), M, y + 10.5 * PT);
            y += 10.5 * PT + 1.6;
            doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
            doc.setLineWidth(0.35);
            doc.line(M, y, M + W, y);
            y += 3;
        }

        var current = allRoles().filter(function (x) { return !x.role.end; })[0];

        // Cabecera
        style(24, "bold");
        doc.text(P.name + " " + P.surname, M, y + 24 * PT);
        y += 24 * PT + 2.5;
        style(12, "bold", ACCENT);
        doc.text(pdfText(t(current.role.title) + " · " + current.company), M, y + 12 * PT);
        y += 12 * PT + 3;
        var links = [
            [t(P.location)],
            [P.email, "mailto:" + P.email],
            [P.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), P.linkedin],
            [P.web.replace(/^https:\/\//, ""), P.web]
        ];
        style(9, "normal", MUTED);
        var x = M;
        links.forEach(function (l, i) {
            if (i) { doc.text("  ·  ", x, y + 9 * PT); x += doc.getTextWidth("  ·  "); }
            if (l[1]) doc.textWithLink(l[0], x, y + 9 * PT, { url: l[1] });
            else doc.text(pdfText(l[0]), x, y + 9 * PT);
            x += doc.getTextWidth(pdfText(l[0]));
        });
        y += 9 * PT + 1;

        heading(ui("profile.title"));
        para(t(S.cvSummary), 9);

        heading(ui("exp.title"));
        S.experience.forEach(function (co, ci) {
            if (ci) y += 2;
            room(22);
            row(co.company, t(co.place), 11, "bold");
            co.roles.forEach(function (r) {
                // Los roles de salud van resumidos para que el CV entre en dos páginas.
                var brief = r.domain === "health";
                y += 1;
                room(16);
                para(t(r.title), 10, "bold");
                para(range(r.start, r.end) + " · " + duration(r.start, r.end) + (r.team ? " · " + r.team : ""), 8.5, "normal", ACCENT);
                y += 0.6;
                if (r.summary) { para(t(r.summary), 9); y += 0.6; }
                t(r.bullets).slice(0, brief ? 2 : undefined).forEach(function (b) {
                    room(5);
                    style(9, "normal", ACCENT);
                    doc.text("•", M + 1, y + 9 * PT);
                    para(b, 9, "normal", INK, 4.5);
                });
                if (!brief) para("Stack: " + r.skills.join(", "), 8.5, "italic", MUTED, 4.5);
            });
        });

        heading(ui("edu.title"));
        S.education.forEach(function (e) {
            row(t(e.degree), e.start + " – " + e.end, 10, "bold");
            para(e.school, 9, "normal", MUTED);
            y += 1;
        });

        heading(ui("skills.title"));
        S.skills.forEach(function (g) { pair(t(g.name), g.items.join(", "), 40); });

        pair(ui("skills.languages"), S.languages.map(function (l) { return t(l.name) + " (" + t(l.label) + ")"; }).join(" · "), 40);

        heading(ui("certs.title"));
        S.certs.forEach(function (c) { pair(fmtMonth(c.date), c.name + " — " + c.issuer, 24); });

        // Pie con enlace a la web y número de página
        var pages = doc.getNumberOfPages();
        for (var p = 1; p <= pages; p++) {
            doc.setPage(p);
            style(7.5, "normal", MUTED);
            doc.text(pdfText(P.name + " " + P.surname + " · " + ui("cv.footer") + " "), M, 297 - 9);
            var fx = M + doc.getTextWidth(pdfText(P.name + " " + P.surname + " · " + ui("cv.footer"))) + 1.2;
            doc.textWithLink(P.web.replace(/^https:\/\//, ""), fx, 297 - 9, { url: P.web });
            doc.text(p + " / " + pages, M + W, 297 - 9, { align: "right" });
        }

        doc.setProperties({
            title: P.name + " " + P.surname + " · CV",
            author: P.name + " " + P.surname,
            subject: t(current.role.title),
            keywords: S.skills.map(function (g) { return g.items.join(", "); }).join(", "),
            creator: P.web
        });
        return doc;
    }

    function downloadCv(btn) {
        var label = btn.querySelector("span");
        btn.disabled = true;
        label.textContent = ui("cv.loading");
        loadJsPdf().then(function (JsPDF) {
            buildCv(JsPDF).save("Sebastian-Salas-CV-" + lang.toUpperCase() + ".pdf");
        }).catch(function (err) {
            console.error(err);
        }).then(function () {
            btn.disabled = false;
            label.textContent = ui("hero.cta.cv");
        });
    }

    function scrollProgress() {
        var bar = document.querySelector(".scroll-progress");
        function update() {
            var h = document.documentElement.scrollHeight - innerHeight;
            bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
        }
        addEventListener("scroll", update, { passive: true });
        update();
    }

    // Red neuronal de fondo: nodos que derivan y se conectan por cercanía.
    function network() {
        var c = $("bg-net");
        var ctx = c.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, nodes = [], mouse = { x: -9999, y: -9999 }, raf = null;
        var LINK = 140;

        function resize() {
            w = c.clientWidth; h = c.clientHeight;
            c.width = w * dpr; c.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var n = Math.min(110, Math.round((w * h) / 15000));
            nodes = [];
            for (var i = 0; i < n; i++) {
                nodes.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                    r: 1 + Math.random() * 1.6, hot: Math.random() < 0.2
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            var i, j, a, b, dx, dy, d;
            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                a.x += a.vx; a.y += a.vy;
                if (a.x < 0 || a.x > w) a.vx *= -1;
                if (a.y < 0 || a.y > h) a.vy *= -1;
            }
            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                for (j = i + 1; j < nodes.length; j++) {
                    b = nodes[j];
                    dx = a.x - b.x; dy = a.y - b.y;
                    d = dx * dx + dy * dy;
                    if (d < LINK * LINK) {
                        d = Math.sqrt(d);
                        ctx.strokeStyle = (a.hot || b.hot ? "rgba(255,181,71," : "rgba(62,230,255,") + (1 - d / LINK) * 0.28 + ")";
                        ctx.lineWidth = 0.7;
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                }
                dx = a.x - mouse.x; dy = a.y - mouse.y;
                d = Math.sqrt(dx * dx + dy * dy);
                if (d < 180) {
                    ctx.strokeStyle = "rgba(255,181,71," + (1 - d / 180) * 0.6 + ")";
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
                ctx.fillStyle = a.hot ? "rgba(255,181,71,.9)" : "rgba(62,230,255,.7)";
                ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
            }
        }

        function loop() { draw(); raf = requestAnimationFrame(loop); }

        resize();
        addEventListener("resize", function () { resize(); if (reduceMotion) draw(); });
        addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
        document.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; });
        if (reduceMotion) { draw(); return; }
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) { cancelAnimationFrame(raf); raf = null; } else if (!raf) loop();
        });
        loop();
    }

    /* ---------- Eventos ---------- */

    function setLang(next) {
        if (next === lang) return;
        lang = next;
        try { localStorage.setItem("lang", lang); } catch (e) { /* almacenamiento bloqueado */ }
        renderAll();
        startRotator();
        runQuery(termKey, true);
        observeReveals(true);
        if (window.jQuery) jQuery("body").scrollspy("refresh");
    }

    // Mismo scroll suave que los enlaces del template (js/scripts.js).
    function scrollToId(id) {
        var el = $(id);
        if (window.jQuery && jQuery.easing.easeInOutExpo && !reduceMotion) {
            jQuery("html, body").animate({ scrollTop: jQuery(el).offset().top }, 1000, "easeInOutExpo");
        } else {
            el.scrollIntoView();
        }
    }

    document.addEventListener("click", function (e) {
        var el;
        if ((el = e.target.closest(".chip-btn"))) {
            var skill = el.getAttribute("data-skill");
            skillFilter = skillFilter === skill ? null : skill;
            applySkillFilter();
        } else if (e.target.closest(".js-clear-skill")) {
            skillFilter = null;
            applySkillFilter();
        } else if (e.target.closest(".js-goto-exp")) {
            e.preventDefault();
            scrollToId("experience");
        } else if ((el = e.target.closest(".term-q"))) {
            runQuery(el.getAttribute("data-q"));
        } else if ((el = e.target.closest(".js-cv"))) {
            downloadCv(el);
        }
    });

    document.querySelectorAll(".lang-btn").forEach(function (b) {
        b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });

    $("cert-filters").addEventListener("click", function (e) {
        var b = e.target.closest(".filter");
        if (!b) return;
        certFilter = b.getAttribute("data-cat");
        renderCerts();
    });

    renderAll();
    observeReveals(false);
    startRotator();
    runQuery("now", false, 700);
    scrollProgress();
    network();
})();
