/* ============================================================
   WHATSAPP CONFIG
   Troque o número abaixo pelo número real no formato: 55DDD9XXXXXXXX
   ============================================================ */
const whatsappNumber  = "55SEUNUMEROAQUI";
const whatsappMessage = "Olá, Danilo! Gostaria de saber mais sobre a cerimônia de casamento e verificar a disponibilidade para a minha data.";
const whatsappUrl     = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappMessage);

/* ============================================================
   WHATSAPP LINKS
   ============================================================ */
document.querySelectorAll(".js-whatsapp").forEach(function(el) {
  el.href   = whatsappUrl;
  el.target = "_blank";
  el.rel    = "noopener noreferrer";
});

/* ============================================================
   FOOTER YEAR
   ============================================================ */
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   CAROUSEL FACTORY
   Builds a reusable carousel from the given config object.
   ============================================================ */
function buildCarousel(config) {
  var track       = config.track;
  var slides      = track.querySelectorAll(config.slideSelector);
  var dotsEl      = config.dotsContainer;
  var prevBtn     = config.prevBtn;
  var nextBtn     = config.nextBtn;
  var pauseTarget = config.pauseTarget || null;
  var interval    = config.interval   || 4500;

  var total   = slides.length;
  var current = 0;
  var timer   = null;
  var startX  = 0;

  if (total === 0) return;

  /* ----- Dots ----- */
  slides.forEach(function(_, i) {
    var dot = document.createElement("button");
    dot.className  = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Ir para o item " + (i + 1));
    dot.addEventListener("click", function() {
      goTo(i);
      resetAutoplay();
    });
    dotsEl.appendChild(dot);
  });

  function updateDots() {
    dotsEl.querySelectorAll(".dot").forEach(function(d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  /* ----- Navigation ----- */
  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    updateDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function() { goTo(current - 1); resetAutoplay(); });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function() { goTo(current + 1); resetAutoplay(); });
  }

  /* ----- Autoplay ----- */
  function startAutoplay() {
    timer = setInterval(function() { goTo(current + 1); }, interval);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  startAutoplay();

  /* ----- Pause on hover ----- */
  if (pauseTarget) {
    pauseTarget.addEventListener("mouseenter", stopAutoplay);
    pauseTarget.addEventListener("mouseleave", startAutoplay);
  }

  /* ----- Touch swipe ----- */
  track.addEventListener("touchstart", function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoplay();
    }
  }, { passive: true });
}

/* ============================================================
   CEREMONY CAROUSEL
   ============================================================ */
(function() {
  var track = document.getElementById("ceremonyTrack");
  if (!track) return;

  buildCarousel({
    track:         track,
    slideSelector: ".ceremony-carousel__slide",
    dotsContainer: document.getElementById("ceremonyDots"),
    prevBtn:       document.getElementById("ceremonyPrev"),
    nextBtn:       document.getElementById("ceremonyNext"),
    pauseTarget:   null,
    interval:      4500
  });
})();

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
(function() {
  var track = document.getElementById("depTrack");
  if (!track) return;

  var pauseTarget = document.getElementById("depCarousel");

  buildCarousel({
    track:         track,
    slideSelector: ".dep-carousel__slide",
    dotsContainer: document.getElementById("depDots"),
    prevBtn:       document.getElementById("depPrev"),
    nextBtn:       document.getElementById("depNext"),
    pauseTarget:   pauseTarget,
    interval:      5200
  });
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll(".accordion__btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    var item   = btn.closest(".accordion__item");
    var body   = item.querySelector(".accordion__body");
    var isOpen = btn.getAttribute("aria-expanded") === "true";

    /* Close all items */
    document.querySelectorAll(".accordion__item").forEach(function(otherItem) {
      otherItem.querySelector(".accordion__btn").setAttribute("aria-expanded", "false");
      otherItem.querySelector(".accordion__body").classList.remove("is-open");
    });

    /* Open clicked item (if it was closed) */
    if (!isOpen) {
      btn.setAttribute("aria-expanded", "true");
      body.classList.add("is-open");
    }
  });
});

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */
(function() {
  /* Add stagger delays to grouped elements before observing */
  function addStaggerToGroup(selector) {
    document.querySelectorAll(selector).forEach(function(el, i) {
      el.style.transitionDelay = (i * 90) + "ms";
    });
  }

  addStaggerToGroup(".cards-grid .card");
  addStaggerToGroup(".steps .step");

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: "0px 0px -36px 0px"
  });

  document.querySelectorAll(".fade-up").forEach(function(el) {
    observer.observe(el);
  });
})();
