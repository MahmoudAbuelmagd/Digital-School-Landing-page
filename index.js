//  auto year
document.getElementById('year').textContent = new Date().getFullYear();

function animateStats({ duration = 1500, once = false } = {}) {
  const statEls = Array.from(document.querySelectorAll(".stat__value"));
  if (!statEls.length) return;

  function parseStatText(text) {
    const raw = String(text).trim();
    const suffixMatch = raw.match(/[^\d,.\s]+$/);
    const suffix = suffixMatch ? suffixMatch[0] : "";

    const numeric = raw.replace(suffix, "").replace(/,/g, "").trim();
    const target = parseInt(numeric, 10);
    const useCommas = /,/.test(raw) || (Number.isFinite(target) && target >= 1000);

    return {
      target: Number.isFinite(target) ? target : 0,
      suffix,
      useCommas
    };
  }

  function formatInt(n, useCommas) {
    return useCommas ? n.toLocaleString() : String(n);
  }

  function animateOne(el) {
    if (once && el.dataset.animated === "true") return;

    // Store original target in data-target on first run to avoid re-parsing partial numbers
    if (!el.dataset.target) {
      const { target, suffix, useCommas } = parseStatText(el.textContent);
      el.dataset.target = target;
      el.dataset.suffix = suffix;
      el.dataset.useCommas = useCommas;
    }

    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix;
    const useCommas = el.dataset.useCommas === "true";

    el.dataset.animated = "true";

    const start = performance.now();
    const startValue = 0;

    // Always show 0 at start
    el.textContent = formatInt(startValue, useCommas) + suffix;

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      // cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);

      // integer-safe current value
      const current = Math.floor(startValue + (target - startValue) * eased);

      el.textContent = formatInt(current, useCommas) + suffix;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // FORCE exact final value
        el.textContent = formatInt(target, useCommas) + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector(".stats");

  // Fallback: if section not found, animate immediately
  if (!statsSection) {
    statEls.forEach(animateOne);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          statEls.forEach(animateOne);
          if (once) io.disconnect();
          break;
        }
      }
    },
    { threshold: 0.25 }
  );

  io.observe(statsSection);
}

document.addEventListener("DOMContentLoaded", () => {
  animateStats({ duration: 1500, once: false });
});

// testimonials carousel 

const track = document.querySelector(".testimonial-track");
const slides = Array.from(track.children);
const dots = document.querySelectorAll(".dots span");

let currentIndex = 0;

function getSlideWidth() {
  return slides[0].getBoundingClientRect().width + 18;
}

function moveToSlide(index) {
  const offset = -index * getSlideWidth();
  track.style.transform = `translateX(${offset}px)`;

  dots.forEach(dot => dot.classList.remove("is-active"));
  dots[index].classList.add("is-active");

  currentIndex = index;
}

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.slide);
    moveToSlide(index);
  });
});

window.addEventListener("resize", () => {
  moveToSlide(currentIndex);
});

// Dynamic Hero Background Position
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth > 768) {
        const scrollPosition = window.scrollY || window.pageYOffset;
        // The background starts at 150px to stay below the sticky header.
        // As you scroll down, we dynamically move the background up to eliminate the white gap.
        const newY = Math.max(0, 150 - scrollPosition);
        hero.style.backgroundPosition = `center ${newY}px`;
      } else {
        hero.style.backgroundPosition = 'center';
      }
    });
  }
});

// Form validation logic
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// Auto-select topic based on URL Parameter
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const topicParam = urlParams.get('topic');
  if (topicParam) {
    const selectEl = document.getElementById('topic');
    if (selectEl) {
      // Find matching option
      for (let i = 0; i < selectEl.options.length; i++) {
        if (selectEl.options[i].text.toLowerCase().includes(topicParam.toLowerCase())) {
          selectEl.selectedIndex = i;
          break;
        }
      }
      
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }
});