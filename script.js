/* =========================================================
   Curso de Torá — Primer Nivel · Interacciones
   ========================================================= */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Pixel de Meta ----------
     Pega aquí el ID de tu Pixel (solo números) para activarlo.
     Registra "PageView" al cargar y "Lead" en cada clic a WhatsApp. */
  const META_PIXEL_ID = "2587852578380294";

  if (META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", META_PIXEL_ID);
    fbq("track", "PageView");

    document.querySelectorAll(".js-cta").forEach((btn) => {
      btn.addEventListener("click", () => fbq("track", "Lead", { content_name: "Grupo WhatsApp - Curso de Torá" }));
    });
  }

  /* ---------- Año del footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navegación: fondo al hacer scroll ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Smooth scroll para enlaces internos ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- Acordeón FAQ (uno abierto a la vez) ---------- */
  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    const triggers = accordion.querySelectorAll(".accordion__trigger");

    const setOpen = (trigger, open) => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      trigger.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      trigger.closest(".accordion__item").classList.toggle("is-open", open);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const willOpen = trigger.getAttribute("aria-expanded") !== "true";
        triggers.forEach((t) => setOpen(t, false));
        setOpen(trigger, willOpen);
      });
    });
  }

  /* ---------- Indicador dinámico de cupos ----------
     Ajusta estos valores según el estado real del grupo.
     El porcentaje sube lentamente mientras el visitante está en la página. */
  const SPOTS_CONFIG = {
    start: 82,     // % ocupado al cargar la página
    max: 94,       // tope máximo que mostrará
    stepMs: 9000,  // cada cuánto puede subir
  };

  const spots = document.querySelector("[data-spots]");
  if (spots) {
    const valueEl = spots.querySelector("[data-spots-value]");
    const fillEl = spots.querySelector("[data-spots-fill]");
    const barEl = spots.querySelector("[data-spots-bar]");
    let current = SPOTS_CONFIG.start;

    const render = (pct) => {
      const available = 100 - pct;
      valueEl.textContent = `Quedan ${available}%`;
      fillEl.style.transform = `scaleX(${pct / 100})`;
      barEl.setAttribute("aria-valuenow", String(pct));
      barEl.setAttribute("aria-valuetext", `${pct}% de cupos ocupados`);
    };

    // Espera un frame para que la barra se anime desde 0
    requestAnimationFrame(() => requestAnimationFrame(() => render(current)));

    const timer = setInterval(() => {
      if (current >= SPOTS_CONFIG.max) {
        clearInterval(timer);
        return;
      }
      if (Math.random() < 0.6) {
        current += 1;
        render(current);
      }
    }, SPOTS_CONFIG.stepMs);
  }

  /* ---------- Aparición de elementos al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Pequeño escalonado entre tarjetas hermanas
    revealEls.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      const index = siblings.indexOf(el);
      if (index > 0) el.style.transitionDelay = `${Math.min(index, 4) * 70}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- CTA fija en móvil: aparece al pasar el hero ---------- */
  const stickyCta = document.querySelector("[data-sticky-cta]");
  const hero = document.getElementById("inicio");
  const finalCta = document.querySelector(".final-cta");
  if (stickyCta && hero && "IntersectionObserver" in window) {
    let heroVisible = true;
    let finalVisible = false;
    const update = () => stickyCta.classList.toggle("is-visible", !heroVisible && !finalVisible);

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      update();
    }).observe(hero);

    if (finalCta) {
      new IntersectionObserver(([entry]) => {
        finalVisible = entry.isIntersecting;
        update();
      }).observe(finalCta);
    }
  }
})();
