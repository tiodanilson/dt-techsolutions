  // ===== Configuração =====
  const WHATSAPP_NUMBER = ""; // ex: "5511999999999" — deixe vazio enquanto não tiver
  const WHATSAPP_MSG = "Olá! Vim pelo site da dt.techsolutions e gostaria de um orçamento.";

  const wa = document.getElementById("wa");
  if (WHATSAPP_NUMBER) {
    wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
    document.getElementById("waTip").textContent = "Fale conosco no WhatsApp";
  } else {
    wa.href = "https://www.instagram.com/dt.techsolutions/";
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";

  // ===== Menu mobile =====
  const menuBtn = document.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  // ===== Cursor =====
  const cursor = document.querySelector(".cursor"), dot = document.querySelector(".cursor-dot");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; });
  (function loop() { cx += (mx - cx) * .15; cy += (my - cy) * .15; cursor.style.left = cx + "px"; cursor.style.top = cy + "px"; requestAnimationFrame(loop); })();
  document.querySelectorAll("a, button, .card").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  // ===== Magnético =====
  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    el.addEventListener("mouseleave", () => el.style.transform = "");
  });

  // ===== Esfera de partículas =====
  (function sphere() {
    const c = document.getElementById("sphere"), ctx = c.getContext("2d");
    let w, h, dpr, pts = [], rotY = 0, rotX = 0, tX = 0, tY = 0, scrollF = 0;
    const N = innerWidth < 800 ? 700 : 1400;
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - 2 * (i + .5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push([Math.cos(th) * Math.sin(phi), Math.sin(th) * Math.sin(phi), Math.cos(phi)]);
    }
    function size() { dpr = Math.min(devicePixelRatio, 2); w = c.offsetWidth; h = c.offsetHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener("resize", size);
    addEventListener("mousemove", e => { tY = (e.clientX / innerWidth - .5) * .8; tX = (e.clientY / innerHeight - .5) * .8; });
    addEventListener("scroll", () => { scrollF = Math.min(scrollY / innerHeight, 1); }, { passive: true });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      rotY += reduce ? 0 : .0025; rotX += (tX - rotX) * .05;
      const ry = rotY + tY, R = Math.min(w, h) * (w < 800 ? .42 : .36) * (1 + scrollF * .6);
      const ox = w < 800 ? w / 2 : w * .68, oy = h * .42 - scrollF * 120;
      const cyR = Math.cos(ry), syR = Math.sin(ry), cxR = Math.cos(rotX), sxR = Math.sin(rotX);
      for (const [x, y, z] of pts) {
        let x1 = x * cyR - z * syR, z1 = x * syR + z * cyR;
        let y1 = y * cxR - z1 * sxR, z2 = y * sxR + z1 * cxR;
        const s = 1 / (1.8 - z2 * .6), a = (z2 + 1) / 2;
        ctx.globalAlpha = (.08 + a * .7) * (1 - scrollF * .7);
        ctx.fillStyle = a > .85 ? "#39f53c" : "#fff";
        ctx.fillRect(ox + x1 * R * s, oy + y1 * R * s, 1.4 * s, 1.4 * s);
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ===== Manifesto: dividir em palavras =====
  const man = document.getElementById("manifesto");
  man.innerHTML = man.textContent.split(" ").map(w => `<span class="word">${w}</span>`).join(" ");

  // ===== Preloader + animações =====
  function runIntro() {
    document.body.classList.remove("loading");
    if (!hasGsap || reduce) { document.getElementById("loader").remove(); return; }
    gsap.timeline()
      .to("#loader", { yPercent: -100, duration: 1, ease: "expo.inOut" })
      .from(".hero h1 .line > span", { yPercent: 110, duration: 1.2, stagger: .1, ease: "expo.out" }, "-=.4")
      .from(".hero .fade, .hero .label", { opacity: 0, y: 20, duration: .8, stagger: .1 }, "-=.8")
      .from("nav", { opacity: 0, duration: .8 }, "<");
  }

  if (hasGsap && !reduce) {
    const counter = { v: 0 };
    gsap.to(counter, { v: 100, duration: 1.6, ease: "power2.inOut",
      onUpdate: () => { document.getElementById("count").textContent = Math.round(counter.v); document.getElementById("bar").style.transform = `scaleX(${counter.v / 100})`; },
      onComplete: runIntro });
  } else {
    runIntro();
  }

  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    gsap.to(".hero-content", { yPercent: -25, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Marquee: anda sozinho e acelera com o scroll
    const mq = document.getElementById("marquee");
    const loop = gsap.to(mq, { xPercent: -50, duration: 20, ease: "none", repeat: -1 });
    ScrollTrigger.create({ onUpdate: self => {
      const v = self.getVelocity() / 300;
      gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(v), 6), duration: .2, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1 }) });
    }});

    // Manifesto palavra por palavra
    gsap.to(".manifesto .word", { opacity: 1, stagger: .05, ease: "none",
      scrollTrigger: { trigger: ".manifesto", start: "top 70%", end: "bottom 60%", scrub: true } });

    // Serviços: scroll horizontal só no desktop
    ScrollTrigger.matchMedia({
      "(min-width: 801px)": () => {
        const track = document.getElementById("track");
        const dist = () => track.scrollWidth - innerWidth;
        gsap.to(track, { x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: ".services", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
      },
      "(max-width: 800px)": () => {
        gsap.utils.toArray(".card").forEach(card => gsap.from(card, { y: 60, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } }));
      }
    });

    // Reveals genéricos
    gsap.utils.toArray(".reveal").forEach(el => gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }));

    // Passos do processo
    gsap.utils.toArray(".step").forEach(step => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 80%" } });
      tl.from(step.children, { y: 30, opacity: 0, duration: .8, stagger: .08, ease: "power3.out" });
      ScrollTrigger.create({ trigger: step, start: "top 75%", end: "bottom 50%",
        onUpdate: s => step.style.setProperty("--p", s.progress) });
    });

    // CTA título
    gsap.from(".cta h2 .line > span", { yPercent: 110, duration: 1.2, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".cta", start: "top 70%" } });

    // Rodapé gigante desliza
    gsap.fromTo("#footerBig", { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: { trigger: "#footerBig", start: "top bottom", end: "bottom top", scrub: true } });
  }
