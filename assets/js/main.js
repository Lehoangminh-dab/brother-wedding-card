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
 *  - Share link handlers
 *
 * Config.js and Swiper must be loaded first.
 */

(function () {
  "use strict";

  // --- Helpers ---------------------------------------------------------------

  /** Set text content of an element selected within a parent. */
  function setText(selector, text, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.textContent = text;
  }

  /** Set an attribute on an element selected within a parent. */
  function setAttr(selector, attr, value, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  // --- Populate Meta ---------------------------------------------------------

  function populateMeta() {
    const { meta } = WEDDING_CONFIG;
    document.title = meta.title;
    setAttr('meta[name="description"]', "content", meta.description);
  }

  // --- Populate Cover --------------------------------------------------------

  function populateCover() {
    const { couple, hero, cover } = WEDDING_CONFIG;

    // Video background (looped, muted, autoplay)
    const coverVideo = document.querySelector(".cover__video");
    if (coverVideo && cover.videoUrl) {
      coverVideo.src = cover.videoUrl;
      coverVideo.poster = cover.posterImage || hero.backgroundImage || "";
      coverVideo.play().catch(() => {}); // autoplay may be blocked; play() handles it
    }

    // Fallback: background image when no video
    const coverBg = document.querySelector(".cover__bg--fallback");
    const bgImage = cover.backgroundImage || hero.backgroundImage;
    if (coverBg && bgImage) {
      coverBg.style.backgroundImage = `url('${bgImage}')`;
    }

    setText(".cover__groom-name", couple.groom.shortName);
    setText(".cover__bride-name", couple.bride.shortName);

    // Single line, uppercase (like Canva ref: "SATURDAY, 25 OCTOBER")
    const dateStr = cover.dateLine1 || `${hero.dayOfWeek}, ${hero.day} ${hero.monthYear}`;
    setText(".cover__date", dateStr.toUpperCase());
  }

  // --- Populate Until The Big Day --------------------------------------------

  function populateUntilTheDay() {
    const { untilTheDay } = WEDDING_CONFIG;

    const section = document.getElementById("until-the-day");
    if (section && untilTheDay.backgroundImage) {
      section.style.backgroundImage = `url('${untilTheDay.backgroundImage}')`;
    }

    setText(".until__date", untilTheDay.dateLine);
    setText(".until__heading", untilTheDay.heading);
    setAttr(".until__timer", "data-wedding-date", untilTheDay.weddingDateISO);

    const items = document.querySelectorAll(".until__item");
    const labelKeys = ["days", "hours", "minutes", "seconds"];
    items.forEach((item, i) => {
      const key = labelKeys[i];
      if (key) setText(".until__label", untilTheDay.labels[key], item);
    });

    setText(".until__message", untilTheDay.message);
  }

  // --- Populate Save The Date ------------------------------------------------

  function populateSaveTheDate() {
    const { saveTheDate } = WEDDING_CONFIG;

    const section = document.getElementById("save-the-date");
    if (section && saveTheDate.backgroundImage) {
      section.style.backgroundImage = `url('${saveTheDate.backgroundImage}')`;
    }

    setText(".save-date__line1", saveTheDate.line1);
    setText(".save-date__line2", saveTheDate.line2);
    setText(".save-date__line3", saveTheDate.line3);
    setText(".save-date__date", saveTheDate.dateLine);
    setText(".save-date__time", saveTheDate.timeLine);
  }

  // --- Populate Timeline -----------------------------------------------------

  function populateTimeline() {
    const { timeline } = WEDDING_CONFIG;

    setText(".timeline__subtitle", timeline.subtitle);
    setText(".timeline__heading", timeline.heading);

    const track = document.querySelector(".timeline__track");
    if (!track) return;

    track.innerHTML = "";

    timeline.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "timeline__item";

      const time = document.createElement("span");
      time.className = "timeline__time";
      time.textContent = item.time;

      const event = document.createElement("span");
      event.className = "timeline__event";
      event.textContent = item.label;

      row.appendChild(time);
      row.appendChild(event);
      track.appendChild(row);
    });
  }

  // --- Populate Gallery (Swiper slides) -------------------------------------

  function populateGallery() {
    const { gallery } = WEDDING_CONFIG;

    setText(".gallery__tagline-top", gallery.tagline);
    setText(".gallery__title", gallery.title);

    const wrapper = document.querySelector(".gallery__slider .swiper-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    gallery.images.forEach((image, index) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const a = document.createElement("a");
      a.href = image.src;
      a.setAttribute("data-lightbox-index", index);
      a.className = "gallery__link";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      img.className = "gallery__img";
      img.loading = "lazy";

      a.appendChild(img);
      slide.appendChild(a);
      wrapper.appendChild(slide);
    });
  }

  // --- Populate Wishes -------------------------------------------------------

  function populateWishes() {
    const { wishes } = WEDDING_CONFIG;

    // Set background image
    const wishesSection = document.getElementById("wishes");
    if (wishesSection && wishes.backgroundImage) {
      wishesSection.style.backgroundImage = `url('${wishes.backgroundImage}')`;
    }

    const headingEl = document.querySelector(".wishes__heading");
    if (headingEl) {
      const iconSpan = headingEl.querySelector(".wishes__icon");
      headingEl.textContent = "";
      if (iconSpan) headingEl.appendChild(iconSpan);
      headingEl.appendChild(document.createTextNode(` ${wishes.heading}`));
    }

    // Populate form
    setText(".wishes__form-title", wishes.formTitle);

    const nameLabel = document.querySelector('.wishes__label[for="wish-name"]');
    if (nameLabel) nameLabel.textContent = wishes.nameLabel;

    const nameInput = document.getElementById("wish-name");
    if (nameInput) nameInput.placeholder = wishes.namePlaceholder;

    const msgLabel = document.querySelector('.wishes__label[for="wish-message"]');
    if (msgLabel) msgLabel.textContent = wishes.messageLabel;

    const msgInput = document.getElementById("wish-message");
    if (msgInput) msgInput.placeholder = wishes.messagePlaceholder;

    setText(".wishes__submit", wishes.submitText);
  }

  // --- Populate RSVP ---------------------------------------------------------

  function populateRsvp() {
    const { rsvp } = WEDDING_CONFIG;

    setText(".rsvp__heading", rsvp.heading);
    setText(".rsvp__description", rsvp.description);

    // Guest name
    const nameLabel = document.querySelector('.rsvp__label[for="rsvp-name"]');
    if (nameLabel) nameLabel.textContent = rsvp.guestNameLabel;

    const nameInput = document.getElementById("rsvp-name");
    if (nameInput) nameInput.placeholder = rsvp.guestNamePlaceholder;

    // Attendance options
    const attendanceFieldset = document.querySelector(".rsvp__attendance");
    if (attendanceFieldset) {
      setText(".rsvp__legend", rsvp.attendanceLegend, attendanceFieldset);

      const legend = attendanceFieldset.querySelector(".rsvp__legend");
      attendanceFieldset.innerHTML = "";
      if (legend) attendanceFieldset.appendChild(legend);

      rsvp.attendanceOptions.forEach((option) => {
        const label = document.createElement("label");
        label.className = "rsvp__attendance-option";
        label.innerHTML = `
          <input type="radio" name="attendance" value="" class="rsvp__radio">
          <span></span>
        `;
        label.querySelector("input").value = option.value;
        label.querySelector("span").textContent = option.label;
        attendanceFieldset.appendChild(label);
      });
    }

    setText(".rsvp__submit", rsvp.submitText);
  }

  // --- Populate Gifts -------------------------------------------------------

  function populateGifts() {
    const { gifts } = WEDDING_CONFIG;
    if (!gifts) return;

    const section = document.getElementById("gifts");
    if (section && gifts.backgroundImage) {
      section.style.backgroundImage = `url('${gifts.backgroundImage}')`;
    }

    setText(".gifts__heading", gifts.heading);
    setText(".gifts__subtitle", gifts.subtitle);

    ["groom", "bride"].forEach((role) => {
      const card = document.querySelector(`.gifts__card[data-gift="${role}"]`);
      if (!card || !gifts[role]) return;

      const data = gifts[role];
      setText(".gifts__card-label", data.label, card);

      const img = card.querySelector(".gifts__qr-img");
      if (img) {
        img.src = data.qrImage;
        img.alt = `QR ${data.label}`;
      }

      setText(".gifts__account-name", data.name, card);
      setText(".gifts__bank-name", data.bank, card);
      setText(".gifts__account-number", data.accountNumber, card);
    });
  }

  // --- Populate Thank You ----------------------------------------------------

  function populateThankYou() {
    const { thankYou } = WEDDING_CONFIG;

    // Set background image
    const thankYouSection = document.getElementById("thank-you");
    if (thankYouSection && thankYou.backgroundImage) {
      thankYouSection.style.backgroundImage = `url('${thankYou.backgroundImage}')`;
    }

    setText(".thank-you__heading", thankYou.heading);
    setText(".thank-you__message", thankYou.message);
  }

  // --- Countdown Timer -------------------------------------------------------

  function startCountdownTimer() {
    const timerEl = document.querySelector(".until__timer");
    if (!timerEl) return;

    const weddingDate = new Date(timerEl.getAttribute("data-wedding-date"));

    function update() {
      const now = new Date();
      const diff = Math.max(0, weddingDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const daysEl = document.getElementById("countdown-days");
      const hoursEl = document.getElementById("countdown-hours");
      const minutesEl = document.getElementById("countdown-minutes");
      const secondsEl = document.getElementById("countdown-seconds");

      if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // FEATURE 1: PAGE PRELOADER
  // =========================================================================

  function initPreloader() {
    const loader = document.getElementById("loader");
    if (!loader) return;

    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    function hideLoaderAndStartCover() {
      setTimeout(() => {
        loader.classList.add("loader--hidden");
        setTimeout(() => {
          loader.style.display = "none";
          document.body.style.overflow = "";
          const cover = document.getElementById("cover");
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

  // =========================================================================
  // FEATURE 2: SCROLL ANIMATIONS (AOS-like with IntersectionObserver)
  // =========================================================================

  function initScrollAnimations() {
    const animTargets = document.querySelectorAll(
      ".wishes__form-wrapper, .gallery__heading, .gifts__card"
    );

    // Add data-aos attributes for fade-up animation
    animTargets.forEach((el, index) => {
      el.setAttribute("data-aos", "fade-up");
      // Stagger siblings by 200ms increments
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((c) =>
            c.matches(el.tagName.toLowerCase() + "." + [...el.classList].join("."))
          )
        : [];
      const sibIndex = siblings.indexOf(el);
      const delay = sibIndex > 0 ? sibIndex * 200 : 0;
      if (delay > 0) {
        el.setAttribute("data-aos-delay", String(delay));
      }
    });

    if (!("IntersectionObserver" in window)) {
      // Fallback: show everything immediately
      animTargets.forEach((el) => el.classList.add("aos-animate"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute("data-aos-delay") || "0", 10);
            setTimeout(() => {
              entry.target.classList.add("aos-animate");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animTargets.forEach((el) => observer.observe(el));
  }

  // =========================================================================
  // FEATURE 3: GALLERY SWIPER CAROUSEL
  // =========================================================================

  let gallerySwiper = null;

  function initGallerySwiper() {
    if (typeof Swiper === "undefined") return;

    gallerySwiper = new Swiper(".gallery__slider", {
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
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      loop: true,
    });
  }

  // =========================================================================
  // FEATURE 4: GALLERY LIGHTBOX
  // =========================================================================

  let lightboxIndex = 0;

  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (!lightbox || !lightboxImg) return;

    const { gallery } = WEDDING_CONFIG;
    const images = gallery.images;

    function openLightbox(index) {
      lightboxIndex = index;
      lightboxImg.src = images[lightboxIndex].src;
      lightboxImg.alt = images[lightboxIndex].alt;
      lightbox.classList.add("lightbox--open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("lightbox--open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function showPrev() {
      lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[lightboxIndex].src;
      lightboxImg.alt = images[lightboxIndex].alt;
    }

    function showNext() {
      lightboxIndex = (lightboxIndex + 1) % images.length;
      lightboxImg.src = images[lightboxIndex].src;
      lightboxImg.alt = images[lightboxIndex].alt;
    }

    // Delegate click on gallery links
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-lightbox-index]");
      if (link) {
        e.preventDefault();
        openLightbox(parseInt(link.getAttribute("data-lightbox-index"), 10));
      }
    });

    // Close button
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);

    // Prev / Next
    lightbox.querySelector(".lightbox__prev").addEventListener("click", showPrev);
    lightbox.querySelector(".lightbox__next").addEventListener("click", showNext);

    // Click on overlay (outside image) closes
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("lightbox--open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });
  }

  // =========================================================================
  // FEATURE 5: WISHES FORM SUBMISSION
  // =========================================================================

  function initWishesForm() {
    const form = document.getElementById("wishes-form");
    if (!form) return;

    const { api, wishes } = WEDDING_CONFIG;

    function markWishSuccess(submitBtn) {
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = "Đã gửi";
        submitBtn.disabled = true;
        submitBtn.classList.add("wishes__submit--success");
      }

      const wrapper = form.closest(".wishes__form-wrapper");
      const target = wrapper || form;
      const existing = target.parentElement.querySelector(".wishes__success");
      if (!existing) {
        const confirmation = document.createElement("div");
        confirmation.className = "wishes__success";
        confirmation.innerHTML = '<p class="wishes__success-text"></p>';
        setText(".wishes__success-text", wishes.successMessage, confirmation);
        target.parentElement.insertBefore(confirmation, target);
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("wish-name");
      const messageInput = document.getElementById("wish-message");
      const submitBtn = form.querySelector(".wishes__submit");

      const name = nameInput ? nameInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !message) return;

      if (submitBtn) submitBtn.textContent = "Đang gửi...";

      const payload = { action: "wish", author_name: name, content: message };

      if (api && api.baseUrl) {
        fetch(api.baseUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then(() => {
            markWishSuccess(submitBtn);
          })
          .catch(() => {
            markWishSuccess(submitBtn);
          });
      } else {
        markWishSuccess(submitBtn);
      }
    });
  }

  // =========================================================================
  // FEATURE 6: RSVP FORM SUBMISSION
  // =========================================================================

  function initRsvpForm() {
    const form = document.getElementById("rsvp-form");
    if (!form) return;

    const { api } = WEDDING_CONFIG;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector(".rsvp__submit");

      // Collect form data
      const nameInput = document.getElementById("rsvp-name");
      const attendanceRadio = form.querySelector('input[name="attendance"]:checked');

      // Validate
      if (!nameInput || !nameInput.value.trim() || !attendanceRadio) {
        showFormMessage(form, "Vui lòng điền đầy đủ thông tin!", "error");
        return;
      }

      const payload = {
        action: "rsvp",
        guest_name: nameInput.value.trim(),
        attendance: attendanceRadio.value,
      };

      // Update button state
      if (submitBtn) submitBtn.textContent = "Đang gửi...";

      if (api && api.baseUrl) {
        fetch(api.baseUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then(() => {
            markRsvpSuccess(submitBtn, form);
          })
          .catch(() => {
            // API not available – still show success locally
            markRsvpSuccess(submitBtn, form);
          });
      } else {
        // No API configured – show success locally
        markRsvpSuccess(submitBtn, form);
      }
    });
  }

  function markRsvpSuccess(submitBtn, form) {
    if (submitBtn) {
      submitBtn.textContent = "Đã xác nhận";
      submitBtn.disabled = true;
      submitBtn.classList.add("rsvp__submit--success");
    }
    showFormMessage(form, "Chúng mình xin chân thành cám ơn!", "success");
  }

  function showFormMessage(form, text, type) {
    // Remove existing message
    const existing = form.querySelector(".form-message");
    if (existing) existing.remove();

    const msg = document.createElement("p");
    msg.className = `form-message form-message--${type}`;
    msg.textContent = text;
    form.appendChild(msg);

    // Auto-hide after 5 seconds for error messages
    if (type === "error") {
      setTimeout(() => msg.remove(), 5000);
    }
  }

  // =========================================================================
  // FEATURE 7: GIFT CARD QR TOGGLE
  // =========================================================================

  function initGifts() {
    const cards = document.querySelectorAll(".gifts__card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const panel = card.querySelector(".gifts__qr-panel");
        const isOpen = panel && panel.classList.contains("gifts__qr-panel--open");

        // Close all panels first
        cards.forEach((c) => {
          const p = c.querySelector(".gifts__qr-panel");
          if (p) p.classList.remove("gifts__qr-panel--open");
          c.classList.remove("gifts__card--active");
        });

        // Toggle the clicked one (if it wasn't already open)
        if (!isOpen && panel) {
          panel.classList.add("gifts__qr-panel--open");
          card.classList.add("gifts__card--active");
        }
      });
    });
  }

  // --- Initialize ------------------------------------------------------------

  function init() {
    // Populate DOM from config
    populateMeta();
    populateCover();
    populateUntilTheDay();
    populateSaveTheDate();
    populateTimeline();
    populateGallery();
    populateWishes();
    populateGifts();
    populateRsvp();
    populateThankYou();

    // Interactive features
    startCountdownTimer();
    initGallerySwiper();
    initLightbox();
    initScrollAnimations();
    initWishesForm();
    initGifts();
    initRsvpForm();
  }

  // Preloader must run immediately (before DOMContentLoaded)
  initPreloader();

  // Run the rest when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
