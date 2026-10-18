/* SITE-WIDE BEHAVIOUR: menu, header, reveal animations, add-to-bag, newsletter */
(() => {
  const nav = $(".navigation"),
    ov = $(".nav-overlay"),
    hb = $(".hamburger");
  const setNav = (o) => {
    nav.classList.toggle("open", o);
    ov.classList.toggle("show", o);
    hb.setAttribute("aria-expanded", String(o));
    document.body.style.overflow = o ? "hidden" : "";
  };
  hb.addEventListener("click", () => setNav(true));
  $(".close-menu").addEventListener("click", () => setNav(false));
  ov.addEventListener("click", () => setNav(false));
  $$(".navigation a").forEach((a) => {
    if (a.dataset.nav === document.body.dataset.nav) a.classList.add("active");
    a.addEventListener("click", () => setNav(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });
  const hdr = $(".site-header"),
    onS = () => hdr.classList.toggle("scrolled", scrollY > 8);
  onS();
  addEventListener("scroll", onS, { passive: true });
  Cart.badge();
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    const p = PRODUCTS.find((x) => x.id === b.dataset.add);
    Cart.add(b.dataset.add, +(b.dataset.qty || 1));
    toast((p ? p.name : "Item") + " added to your bag");
  });
  $$(".social-form").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      $(".form-note", f.parentElement).textContent =
        "Welcome to the community. Use code GLOW10 for 10% off your first order.";
      f.reset();
    }),
  );
  window.observeReveals = () => {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
  };
})();
