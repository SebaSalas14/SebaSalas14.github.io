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
            co.roles.forEach(function (r) { list.push({ company: co.company, role: r }); });
        });
        return list;
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
            return '<div class="g-row">' +
                '<div class="g-label"><strong>' + esc(t(r.role.title)) + "</strong><span>" + esc(r.company) + "</span></div>" +
                '<div class="g-track">' + ticks.replace(/<em>.*?<\/em>/g, "") +
                '<span class="g-bar ' + r.role.domain + live + '" style="left:' + s + "%;--w:" + w + "%;--d:" + (i * 70) + 'ms" title="' +
                esc(range(r.role.start, r.role.end)) + '"></span></div></div>';
        }).join("");

        $("gantt").innerHTML = rows + '<div class="g-row g-axis"><div class="g-label"></div><div class="g-track">' + ticks + "</div></div>";
    }

    function renderTimeline() {
        $("timeline").innerHTML = S.experience.map(function (co) {
            var current = co.roles.some(function (r) { return !r.end; });
            var roles = co.roles.map(function (r) {
                var badges = (!r.end ? '<span class="badge-d live">● ' + esc(ui("exp.current")) + "</span>" : "") +
                    (r.promoted ? '<span class="badge-d up"><i class="fas fa-arrow-up"></i> ' + esc(ui("exp.promoted")) + "</span>" : "");
                return '<div class="tl-role' + (r.end ? "" : " is-live") + '">' +
                    '<div class="tl-head"><h4>' + esc(t(r.title)) + "</h4>" + badges + "</div>" +
                    '<p class="tl-meta mono">' + esc(range(r.start, r.end)) + " · " + esc(duration(r.start, r.end)) +
                    (r.team ? " · " + esc(r.team) : "") + "</p>" +
                    (r.summary ? '<p class="tl-summary">' + esc(t(r.summary)) + "</p>" : "") +
                    '<ul class="ticks">' + t(r.bullets).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
                    '<div class="chips">' + r.skills.map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div>" +
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
                '<div class="chips">' + g.items.map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div></article>";
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

    function typeQuery() {
        var q = "SELECT role, company, since FROM career WHERE current = TRUE;";
        var out = $("term-query");
        var done = function () {
            $("term-caret").style.display = "none";
            $("term-result").hidden = false;
        };
        if (reduceMotion) { out.textContent = q; done(); return; }
        var i = 0;
        setTimeout(function tick() {
            out.textContent = q.slice(0, ++i);
            if (i < q.length) setTimeout(tick, 22 + Math.random() * 40);
            else setTimeout(done, 350);
        }, 700);
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
        observeReveals(true);
        if (window.jQuery) jQuery("body").scrollspy("refresh");
    }

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
    typeQuery();
    scrollProgress();
    network();
})();
