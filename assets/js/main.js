/**
 * Wedding Card - DOM Population & Interactive Features
 *
 * Reads from WEDDING_CONFIG (defined in config.js) and populates all
 * text content and image sources in the HTML. Also handles:
 *  - Page preloader
 *  - Scroll animations (AOS-like)
 *  - Gallery Swiper carousel + lightbox
 *  - Wishes form AJAX submission
 *  - RSVP form AJAX submission
 *
 * Config.js and Swiper must be loaded first.
 */

(function () {
  "use strict";

  // =========================================================================
  // REGION 1: HELPERS
  // =========================================================================

  function setText(selector, text, parent) {
    var el = (parent || document).querySelector(selector);
    if (el) el.textContent = text;
  }

  function setAttr(selector, attr, value, parent) {
    var el = (parent || document).querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  /** Bulk-set textContent from a { selector: text } map. */
  function populateText(mapping, parent) {
    var root = parent || document;
    var selectors = Object.keys(mapping);
    for (var i = 0; i < selectors.length; i++) {
      var el = root.querySelector(selectors[i]);
      if (el) el.textContent = mapping[selectors[i]];
    }
  }

  /** Bulk-set attributes from a { selector: { attr: value, ... } } map. */
  function populateAttrs(mapping, parent) {
    var root = parent || document;
    var selectors = Object.keys(mapping);
    for (var i = 0; i < selectors.length; i++) {
      var el = root.querySelector(selectors[i]);
      if (!el) continue;
      var attrs = mapping[selectors[i]];
      var keys = Object.keys(attrs);
      for (var j = 0; j < keys.length; j++) {
        el.setAttribute(keys[j], attrs[keys[j]]);
      }
    }
  }

  /** Set background-image on a section element by ID. */
  function setSectionBackground(sectionId, imageUrl) {
    if (!imageUrl) return;
    var section = document.getElementById(sectionId);
    if (section) section.style.backgroundImage = "url('" + imageUrl + "')";
  }

  /** Show a temporary message inside a form. */
  function showFormMessage(form, text, type) {
    var existing = form.querySelector(".form-message");
    if (existing) existing.remove();

    var msg = document.createElement("p");
    msg.className = "form-message form-message--" + type;
    msg.textContent = text;
    form.appendChild(msg);

    if (type === "error") {
      setTimeout(function () { msg.remove(); }, 5000);
    }
  }

  // =========================================================================
  // REGION 2: POPULATE FUNCTIONS (config -> DOM)
  // =========================================================================

  function populateMeta() {
    var meta = WEDDING_CONFIG.meta;
    document.title = meta.title;
    setAttr('meta[name="description"]', "content", meta.description);
  }

  function populateCover() {
    var couple = WEDDING_CONFIG.couple;
    var cover = WEDDING_CONFIG.cover;

    var coverVideo = document.querySelector(".cover__video");
    if (coverVideo && cover.videoUrl) {
      coverVideo.src = cover.videoUrl;
      coverVideo.poster = cover.posterImage || cover.backgroundImage || "";
      coverVideo.play().catch(function () {});
    }

    var coverBg = document.querySelector(".cover__bg--fallback");
    if (coverBg && cover.backgroundImage) {
      coverBg.style.backgroundImage = "url('" + cover.backgroundImage + "')";
    }

    populateText({
      ".cover__groom-name": couple.groom.shortName,
      ".cover__bride-name": couple.bride.shortName,
      ".cover__date": (cover.dateLine || "").toUpperCase(),
    });
  }

  function populateUntilTheDay() {
    var cfg = WEDDING_CONFIG.untilTheDay;

    setSectionBackground("until-the-day", cfg.backgroundImage);
    setAttr(".until__timer", "data-wedding-date", WEDDING_CONFIG.weddingDate);

    populateText({
      ".until__date": cfg.dateLine,
      ".until__heading": cfg.heading,
      ".until__message": cfg.message,
    });

    var items = document.querySelectorAll(".until__item");
    var labelKeys = ["days", "hours", "minutes", "seconds"];
    for (var i = 0; i < items.length; i++) {
      if (labelKeys[i]) setText(".until__label", cfg.labels[labelKeys[i]], items[i]);
    }
  }

  function populateSaveTheDate() {
    var cfg = WEDDING_CONFIG.saveTheDate;

    setSectionBackground("save-the-date", cfg.backgroundImage);

    populateText({
      ".save-date__line1": cfg.line1,
      ".save-date__line2": cfg.line2,
      ".save-date__line3": cfg.line3,
      ".save-date__date": cfg.dateLine,
      ".save-date__time": cfg.timeLine,
    });
  }

  function populateTimeline() {
    var cfg = WEDDING_CONFIG.timeline;

    populateText({
      ".timeline__subtitle": cfg.subtitle,
      ".timeline__heading": cfg.heading,
    });

    var track = document.querySelector(".timeline__track");
    if (!track) return;

    track.innerHTML = "";

    cfg.items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "timeline__item";

      var time = document.createElement("span");
      time.className = "timeline__time";
      time.textContent = item.time;

      var event = document.createElement("span");
      event.className = "timeline__event";
      event.textContent = item.label;

      row.appendChild(time);
      row.appendChild(event);
      track.appendChild(row);
    });
  }

  function populateGallery() {
    var cfg = WEDDING_CONFIG.gallery;

    setText(".gallery__title", cfg.title);
    buildSlides(".gallery__slider .swiper-wrapper", cfg.images, "vertical");
    buildSlides(".gallery__horizontal-slider .swiper-wrapper", cfg.horizontalImages || [], "horizontal");
  }

  function buildSlides(wrapperSelector, images, pool) {
    var wrapper = document.querySelector(wrapperSelector);
    if (!wrapper || !images.length) return;

    wrapper.innerHTML = "";
    images.forEach(function (image, index) {
      var slide = document.createElement("div");
      slide.className = "swiper-slide";

      var a = document.createElement("a");
      a.href = image.src;
      a.className = "gallery__link";
      a.setAttribute("data-lightbox-index", index);
      a.setAttribute("data-lightbox-pool", pool);

      var img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      img.className = "gallery__img";
      img.loading = "lazy";

      a.appendChild(img);
      slide.appendChild(a);
      wrapper.appendChild(slide);
    });
  }

  function populateLocation() {
    var cfg = WEDDING_CONFIG.location;
    if (!cfg) return;

    setSectionBackground("location", cfg.backgroundImage);

    populateText({
      ".location__heading": cfg.heading,
      ".location__venue-name": cfg.venueName,
      ".location__venue-address": cfg.venueAddress,
      ".location__sketch-heading": cfg.sketchHeading,
      ".location__sketch-caption": cfg.sketchMapCaption,
    });

    setAttr(".location__map-iframe", "src", cfg.googleMapsEmbedUrl);

    var mapLink = document.querySelector(".location__map-link");
    if (mapLink) {
      mapLink.href = cfg.mapLinkHref;
      mapLink.textContent = cfg.mapLinkText;
    }

    populateAttrs({
      ".location__sketch-img": { src: cfg.sketchMapImage, alt: cfg.sketchMapAlt },
    });
  }

  function populateWishes() {
    var cfg = WEDDING_CONFIG.wishes;

    setSectionBackground("wishes", cfg.backgroundImage);

    setText(".wishes__heading", cfg.heading);

    populateText({
      ".wishes__form-title": cfg.formTitle,
      '.wishes__label[for="wish-name"]': cfg.nameLabel,
      '.wishes__label[for="wish-message"]': cfg.messageLabel,
      ".wishes__submit": cfg.submitText,
    });

    populateAttrs({
      "#wish-name": { placeholder: cfg.namePlaceholder },
      "#wish-message": { placeholder: cfg.messagePlaceholder },
    });
  }

  function populateRsvp() {
    var cfg = WEDDING_CONFIG.rsvp;

    populateText({
      ".rsvp__heading": cfg.heading,
      ".rsvp__description": cfg.description || "",
      '.rsvp__label[for="rsvp-name"]': cfg.guestNameLabel,
      ".rsvp__submit": cfg.submitText,
    });

    var descEl = document.querySelector(".rsvp__description");
    if (descEl && !cfg.description) descEl.style.display = "none";

    setAttr("#rsvp-name", "placeholder", cfg.guestNamePlaceholder);

    var attendanceFieldset = document.querySelector(".rsvp__attendance");
    if (attendanceFieldset) {
      setText(".rsvp__legend", cfg.attendanceLegend, attendanceFieldset);

      var legend = attendanceFieldset.querySelector(".rsvp__legend");
      attendanceFieldset.innerHTML = "";
      if (legend) attendanceFieldset.appendChild(legend);

      cfg.attendanceOptions.forEach(function (option) {
        var label = document.createElement("label");
        label.className = "rsvp__attendance-option";
        label.innerHTML =
          '<input type="radio" name="attendance" value="" class="rsvp__radio">' +
          "<span></span>";
        label.querySelector("input").value = option.value;
        label.querySelector("span").textContent = option.label;
        attendanceFieldset.appendChild(label);
      });
    }
  }

  function populateGifts() {
    var cfg = WEDDING_CONFIG.gifts;
    if (!cfg) return;

    populateText({
      ".gifts__heading": cfg.heading,
      ".gifts__subtitle": cfg.subtitle,
    });

    ["groom", "bride"].forEach(function (role) {
      var card = document.querySelector('.gifts__card[data-gift="' + role + '"]');
      if (!card || !cfg[role]) return;

      var data = cfg[role];
      populateText({
        ".gifts__card-label": data.label,
        ".gifts__account-name": data.name,
        ".gifts__bank-name": data.bank,
        ".gifts__account-number": data.accountNumber,
      }, card);

      populateAttrs({
        ".gifts__qr-img": { src: data.qrImage, alt: "QR " + data.label },
      }, card);
    });
  }

  function populateThankYou() {
    var cfg = WEDDING_CONFIG.thankYou;

    setSectionBackground("thank-you", cfg.backgroundImage);

    populateText({
      ".thank-you__heading": cfg.heading,
      ".thank-you__message": cfg.message,
    });
  }

  // =========================================================================
  // REGION 3: INTERACTIVE FEATURES
  // =========================================================================

  // --- 3a. Page Preloader ---------------------------------------------------

  function initPreloader() {
    var loader = document.getElementById("loader");
    if (!loader) return;

    document.body.style.overflow = "hidden";

    function hideLoaderAndStartCover() {
      setTimeout(function () {
        loader.classList.add("loader--hidden");
        setTimeout(function () {
          loader.style.display = "none";
          document.body.style.overflow = "";
          var cover = document.getElementById("cover");
          if (cover) cover.classList.add("cover--ready");
        }, 400);
      }, 800);
    }

    if (document.readyState === "complete") {
      hideLoaderAndStartCover();
    } else {
      window.addEventListener("load", hideLoaderAndStartCover);
    }
  }

  // --- 3b. Scroll Animations (AOS-like) ------------------------------------

  function initScrollAnimations() {
    var animTargets = document.querySelectorAll(
      ".wishes__form-wrapper, .wishes__gifts, .gallery__heading, .location__inner"
    );

    animTargets.forEach(function (el) {
      el.setAttribute("data-aos", "fade-up");
    });

    if (!("IntersectionObserver" in window)) {
      animTargets.forEach(function (el) { el.classList.add("aos-animate"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.getAttribute("data-aos-delay") || "0", 10);
            setTimeout(function () {
              entry.target.classList.add("aos-animate");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animTargets.forEach(function (el) { observer.observe(el); });
  }

  // --- 3c. Countdown Timer -------------------------------------------------

  function initCountdown() {
    var timerEl = document.querySelector(".until__timer");
    if (!timerEl) return;

    var weddingDate = new Date(timerEl.getAttribute("data-wedding-date"));
    var els = {
      days: document.getElementById("countdown-days"),
      hours: document.getElementById("countdown-hours"),
      minutes: document.getElementById("countdown-minutes"),
      seconds: document.getElementById("countdown-seconds"),
    };

    function update() {
      var diff = Math.max(0, weddingDate - new Date());
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff / 3600000) % 24);
      var m = Math.floor((diff / 60000) % 60);
      var s = Math.floor((diff / 1000) % 60);

      if (els.days) els.days.textContent = String(d).padStart(2, "0");
      if (els.hours) els.hours.textContent = String(h).padStart(2, "0");
      if (els.minutes) els.minutes.textContent = String(m).padStart(2, "0");
      if (els.seconds) els.seconds.textContent = String(s).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  // --- 3d. Gallery Swiper Carousel -----------------------------------------

  function initGallerySwiper() {
    if (typeof Swiper === "undefined") return;

    new Swiper(".gallery__slider", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      loop: true,
    });

    new Swiper(".gallery__horizontal-slider", {
      slidesPerView: "auto",
      spaceBetween: 16,
      grabCursor: true,
      freeMode: true,
      loop: true,
      loopAdditionalSlides: 3,
      autoplay: { delay: 0, disableOnInteraction: false, reverseDirection: true },
      speed: 4000,
      observer: true,
      observeParents: true,
    });
  }

  // --- 3e. Gallery Lightbox ------------------------------------------------

  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-img");
    if (!lightbox || !lightboxImg) return;

    var gallery = WEDDING_CONFIG.gallery;
    var pools = {
      vertical: gallery.images,
      horizontal: gallery.horizontalImages || [],
    };
    var currentPool = [];
    var currentIndex = 0;

    function show(pool, index) {
      currentPool = pool;
      currentIndex = index;
      lightboxImg.src = currentPool[currentIndex].src;
      lightboxImg.alt = currentPool[currentIndex].alt;
      lightbox.classList.add("lightbox--open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("lightbox--open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function prev() {
      currentIndex = (currentIndex - 1 + currentPool.length) % currentPool.length;
      lightboxImg.src = currentPool[currentIndex].src;
      lightboxImg.alt = currentPool[currentIndex].alt;
    }

    function next() {
      currentIndex = (currentIndex + 1) % currentPool.length;
      lightboxImg.src = currentPool[currentIndex].src;
      lightboxImg.alt = currentPool[currentIndex].alt;
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-lightbox-index]");
      if (link) {
        e.preventDefault();
        var idx = parseInt(link.getAttribute("data-lightbox-index"), 10);
        var poolName = link.getAttribute("data-lightbox-pool");
        show(pools[poolName] || pools.vertical, idx);
      }
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", close);
    lightbox.querySelector(".lightbox__prev").addEventListener("click", prev);
    lightbox.querySelector(".lightbox__next").addEventListener("click", next);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("lightbox--open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  }

  // --- 3f. Wishes Form Submission ------------------------------------------

  function initWishesForm() {
    var form = document.getElementById("wishes-form");
    if (!form) return;

    var api = WEDDING_CONFIG.api;
    var cfg = WEDDING_CONFIG.wishes;

    function markSuccess(submitBtn) {
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = cfg.submittedText;
        submitBtn.disabled = true;
        submitBtn.classList.add("wishes__submit--success");
      }

      var wrapper = form.closest(".wishes__form-wrapper");
      var target = wrapper || form;
      if (!target.parentElement.querySelector(".wishes__success")) {
        var confirmation = document.createElement("div");
        confirmation.className = "wishes__success";
        confirmation.innerHTML = '<p class="wishes__success-text"></p>';
        setText(".wishes__success-text", cfg.successMessage, confirmation);
        target.parentElement.insertBefore(confirmation, target);
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameInput = document.getElementById("wish-name");
      var messageInput = document.getElementById("wish-message");
      var submitBtn = form.querySelector(".wishes__submit");

      var name = nameInput ? nameInput.value.trim() : "";
      var message = messageInput ? messageInput.value.trim() : "";
      if (!name || !message) return;

      if (submitBtn) submitBtn.textContent = cfg.submittingText;

      var payload = { action: "wish", author_name: name, content: message };

      if (api && api.baseUrl) {
        fetch(api.baseUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        })
          .then(function (res) { return res.json(); })
          .then(function () { markSuccess(submitBtn); })
          .catch(function () {
            showFormMessage(form, cfg.errorMessage, "error");
            if (submitBtn) submitBtn.textContent = cfg.submitText;
          });
      } else {
        markSuccess(submitBtn);
      }
    });
  }

  // --- 3g. RSVP Form Submission --------------------------------------------

  function initRsvpForm() {
    var form = document.getElementById("rsvp-form");
    if (!form) return;

    var api = WEDDING_CONFIG.api;
    var cfg = WEDDING_CONFIG.rsvp;

    function markSuccess(submitBtn) {
      if (submitBtn) {
        submitBtn.textContent = cfg.submittedText;
        submitBtn.disabled = true;
        submitBtn.classList.add("rsvp__submit--success");
      }
      showFormMessage(form, cfg.successMessage, "success");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector(".rsvp__submit");
      var nameInput = document.getElementById("rsvp-name");
      var attendanceRadio = form.querySelector('input[name="attendance"]:checked');

      if (!nameInput || !nameInput.value.trim() || !attendanceRadio) {
        showFormMessage(form, cfg.validationError, "error");
        return;
      }

      var payload = {
        action: "rsvp",
        guest_name: nameInput.value.trim(),
        attendance: attendanceRadio.value,
      };

      if (submitBtn) submitBtn.textContent = cfg.submittingText;

      if (api && api.baseUrl) {
        fetch(api.baseUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        })
          .then(function (res) { return res.json(); })
          .then(function () { markSuccess(submitBtn); })
          .catch(function () {
            showFormMessage(form, cfg.errorMessage, "error");
            if (submitBtn) submitBtn.textContent = cfg.submitText;
          });
      } else {
        markSuccess(submitBtn);
      }
    });
  }

  // --- 3h. Gift Card QR Toggle ---------------------------------------------

  function initGifts() {
    var cards = document.querySelectorAll(".gifts__card");
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var panel = card.querySelector(".gifts__qr-panel");
        var isOpen = panel && panel.classList.contains("gifts__qr-panel--open");

        cards.forEach(function (c) {
          var p = c.querySelector(".gifts__qr-panel");
          if (p) p.classList.remove("gifts__qr-panel--open");
          c.classList.remove("gifts__card--active");
        });

        if (!isOpen && panel) {
          panel.classList.add("gifts__qr-panel--open");
          card.classList.add("gifts__card--active");
        }
      });
    });
  }

  // =========================================================================
  // REGION 4: INITIALIZATION
  // =========================================================================

  function init() {
    populateMeta();
    populateCover();
    populateUntilTheDay();
    populateSaveTheDate();
    populateTimeline();
    populateGallery();
    populateLocation();
    populateWishes();
    populateGifts();
    populateRsvp();
    populateThankYou();

    initCountdown();
    initGallerySwiper();
    initLightbox();
    initScrollAnimations();
    initWishesForm();
    initGifts();
    initRsvpForm();
  }

  initPreloader();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
