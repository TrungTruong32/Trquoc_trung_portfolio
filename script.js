/* ---------------- TYPING EFFECT ---------------- */
const roles = ["an AI Engineer.", "a Data Engineer.", "a Fullstack Developer."];
let roleIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.getElementById("typing");

function tick() {
  if (!typingEl) return;
  const full = roles[roleIdx];
  if (!deleting) {
    charIdx++;
    typingEl.textContent = full.slice(0, charIdx);
    if (charIdx === full.length) {
      deleting = true;
      setTimeout(tick, 1200);
      return;
    }
  } else {
    charIdx--;
    typingEl.textContent = full.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(tick, deleting ? 50 : 90);
}
document.addEventListener("DOMContentLoaded", tick);

/* ---------------- PARTICLES ---------------- */
(function particles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dots;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.max(50, Math.floor(w * h / 20000));
    dots = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.5
    }));
  }
  window.addEventListener("resize", resize);
  resize();

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;

      // bounce edges
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;

      // draw glow particle
      const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
      grad.addColorStop(0, `rgba(212,175,55,${d.alpha})`);
      grad.addColorStop(0.4, `rgba(241,215,122,${d.alpha * 0.3})`);
      grad.addColorStop(1, "rgba(212,175,55,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

const hero = document.querySelector(".hero");
let particlesStarted = false;

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !particlesStarted) {
    particlesStarted = true;
    particles(); // gọi hàm particles()
  }
}, { threshold: 0.2 });

if (hero) heroObserver.observe(hero);



// ==== Back-to-top ====  
const backBtn = document.getElementById("back-to-top");
const deckBtn = document.getElementById("to-deck");
if (backBtn) {
  window.addEventListener("scroll", () => {
    const show = window.scrollY > 300;
    backBtn.classList.toggle("show", show);
    deckBtn?.classList.toggle("show", show);
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==== Scroll animations ====  
const scrollEls = document.querySelectorAll('.fade-up, .slide-left, .slide-right');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

scrollEls.forEach(el => scrollObserver.observe(el));

/* ---------------- CAROUSELS (Work + Projects) ---------------- */
document.addEventListener("DOMContentLoaded", function(){
  // Shared config: 1 card on mobile, 2 on tablet, 3 on desktop.
  // With >3 slides the extra cards become horizontally swipeable.
  const baseConfig = {
    slidesPerView: 3,
    spaceBetween: 22,
    // Cho phép chọn chữ + cuộn dọc trong vùng .no-swipe (không hijack thành vuốt ngang)
    noSwiping: true,
    noSwipingClass: 'no-swipe',
    touchStartPreventDefault: false,
    breakpoints: {
      0:    { slidesPerView: 1 },
      640:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  };

  // Nav buttons are scoped to each swiper's own element (not global selectors),
  // otherwise two carousels sharing .swiper-button-next/prev would fight over the
  // first match in the DOM (work precedes projects) and break projects navigation.
  document.querySelectorAll(".work-swiper, .projects-swiper").forEach(function(el){
    new Swiper(el, Object.assign({}, baseConfig, {
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev")
      },
      // Clickable dots — the primary navigation affordance on mobile, where the
      // .no-swipe detail region blocks horizontal swipe on most of the card.
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true
      }
    }));
  });
});

/* ---------------- WORK DURATION (auto month count) ---------------- */
// Appends "(N months)" to each .work-period from its data-start / data-end.
// Months are counted inclusively (e.g. 2026-06 → 2026-07 = 2 months), matching
// how a CV reads a range. data-end="present" tracks the current date, so an
// ongoing role never shows a stale number.
document.addEventListener("DOMContentLoaded", function(){
  const toMonths = s => {                    // "YYYY-MM" -> absolute month index
    const [y, m] = s.split("-").map(Number);
    return y * 12 + (m - 1);
  };

  document.querySelectorAll(".work-period[data-start]").forEach(function(el){
    const start = toMonths(el.dataset.start);
    let end;
    if (el.dataset.end === "present") {
      const now = new Date();
      end = now.getFullYear() * 12 + now.getMonth();
    } else {
      end = toMonths(el.dataset.end);
    }

    const n = Math.max(1, end - start + 1);   // inclusive; guard against bad data
    const span = document.createElement("span");
    span.className = "work-duration";
    span.textContent = ` (${n} ${n === 1 ? "month" : "months"})`;
    el.appendChild(span);
  });
});

// Smooth scroll khi click vào navbar — chỉ áp dụng cho link anchor cùng trang (#...).
// Link tới trang khác (vd ./blog/index.html) để trình duyệt điều hướng bình thường.
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href') || '';
    if (!href.startsWith('#')) return;   // để link ngoài/trang khác hoạt động
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});



// Scroll spy highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

window.addEventListener("load", () => {
  initCanvasEffect(); 
});

const menuBtn = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});



/* ---------------- WORK PROJECTS — accordion + detail modal ---------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Accordion: one project open at a time within each company card
  document.querySelectorAll(".work-projects").forEach(group => {
    const items = Array.from(group.querySelectorAll(".wp-item"));
    // Open the first project by default so the card isn't bare
    if (items[0]) {
      items[0].classList.add("open");
      const h0 = items[0].querySelector(".wp-head");
      if (h0) h0.setAttribute("aria-expanded", "true");
    }
    group.querySelectorAll(".wp-head").forEach(head => {
      const toggle = () => {
        const item = head.closest(".wp-item");
        const willOpen = !item.classList.contains("open");
        items.forEach(it => {
          it.classList.remove("open");
          const h = it.querySelector(".wp-head");
          if (h) h.setAttribute("aria-expanded", "false");
        });
        if (willOpen) {
          item.classList.add("open");
          head.setAttribute("aria-expanded", "true");
        }
      };
      // Click anywhere on the row toggles — except on the eye (detail) button
      head.addEventListener("click", e => {
        if (e.target.closest(".wp-eye")) return;
        toggle();
      });
      // Keyboard support for the div-based toggle (Enter / Space)
      head.addEventListener("keydown", e => {
        if (e.target.closest(".wp-eye")) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  });

  // Detail modal (reuses each project's hidden .wp-full content)
  const modal = document.getElementById("work-modal");
  if (!modal) return;
  const body = document.getElementById("work-modal-body");
  const title = document.getElementById("work-modal-title");
  let lastFocus = null;

  const openModal = (name, html) => {
    title.textContent = name;
    body.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".work-modal-close");
    if (closeBtn) closeBtn.focus();
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll(".wp-eye").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const item = btn.closest(".wp-item");
      const nameEl = item.querySelector(".wp-name");
      const name = nameEl ? nameEl.textContent.trim() : "Project detail";
      const full = item.querySelector(".wp-full");
      lastFocus = btn;
      openModal(name, full ? full.innerHTML : "");
    });
  });

  modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
});



