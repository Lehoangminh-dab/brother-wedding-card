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

  // --- Populate Couple -------------------------------------------------------

  function populateCouple() {
    const { couple } = WEDDING_CONFIG;

    // Bride
    const brideSection = document.querySelector(".couple__bride");
    if (brideSection) {
      const img = brideSection.querySelector(".couple__img");
      if (img) {
        img.src = couple.bride.image;
        img.alt = couple.bride.imageAlt;
      }
      setText(".couple__name", couple.bride.fullName, brideSection);
      const time = brideSection.querySelector(".couple__dob time");
      if (time) {
        time.textContent = couple.bride.dob;
        time.setAttribute("datetime", couple.bride.dobISO);
      }
    }

    // Groom
    const groomSection = document.querySelector(".couple__groom");
    if (groomSection) {
      const img = groomSection.querySelector(".couple__img");
      if (img) {
        img.src = couple.groom.image;
        img.alt = couple.groom.imageAlt;
      }
      setText(".couple__name", couple.groom.fullName, groomSection);
      const time = groomSection.querySelector(".couple__dob time");
      if (time) {
        time.textContent = couple.groom.dob;
        time.setAttribute("datetime", couple.groom.dobISO);
      }
    }
  }

  // --- Populate Countdown ----------------------------------------------------

  function populateCountdown() {
    const { countdown } = WEDDING_CONFIG;

    // Set background image
    const countdownSection = document.getElementById("countdown");
    if (countdownSection && countdown.backgroundImage) {
      countdownSection.style.backgroundImage = `url('${countdown.backgroundImage}')`;
    }

    const headingEl = document.querySelector(".countdown__heading");
    if (headingEl) {
      // Preserve the icon span, replace rest
      const iconSpan = headingEl.querySelector(".countdown__icon");
      headingEl.textContent = "";
      if (iconSpan) headingEl.appendChild(iconSpan);
      headingEl.appendChild(document.createTextNode(` ${countdown.heading}`));
    }

    setAttr(".countdown__timer", "data-wedding-date", countdown.weddingDateISO);

    const labels = document.querySelectorAll(".countdown__unit");
    const labelKeys = ["days", "hours", "minutes", "seconds"];
    labels.forEach((unit, i) => {
      const key = labelKeys[i];
      if (key) setText(".countdown__label", countdown.labels[key], unit);
    });
  }

  // --- Populate Events -------------------------------------------------------

  function populateEvents() {
    const { events } = WEDDING_CONFIG;
    const container = document.getElementById("events");
    if (!container) return;

    // Clear existing cards
    container.innerHTML = "";

    events.forEach((event) => {
      const card = document.createElement("article");
      card.className = "events__card";

      card.innerHTML = `
        <h3 class="events__title"></h3>
        <address class="events__location"></address>
        <div class="events__details">
          <p class="events__time">Vào lúc <strong></strong></p>
          <p class="events__date">
            <span class="events__day-of-week"></span>
            <time>
              <span class="events__day"></span>
              <span class="events__separator">/</span>
              <span class="events__month"></span>
              <span class="events__year"></span>
            </time>
          </p>
          <p class="events__lunar"></p>
        </div>
      `;

      setText(".events__title", event.title, card);
      setText(".events__location", event.location, card);
      setText(".events__time strong", event.time, card);
      setText(".events__day-of-week", event.dayOfWeek, card);
      setAttr(".events__date time", "datetime", event.dateISO, card);
      setText(".events__day", event.day, card);
      setText(".events__month", event.month, card);
      setText(".events__year", event.year, card);
      setText(".events__lunar", event.lunar, card);

      container.appendChild(card);
    });
  }

  // --- Populate Love Story ---------------------------------------------------

  function populateLoveStory() {
    const { loveStory } = WEDDING_CONFIG;

    // Set background image
    const loveStorySection = document.getElementById("love-story");
    if (loveStorySection && loveStory.backgroundImage) {
      loveStorySection.style.backgroundImage = `url('${loveStory.backgroundImage}')`;
    }

    const headingEl = document.querySelector(".love-story__heading");
    if (headingEl) {
      const iconSpan = headingEl.querySelector(".love-story__icon");
      headingEl.textContent = "";
      if (iconSpan) headingEl.appendChild(iconSpan);
      headingEl.appendChild(document.createTextNode(` ${loveStory.heading}`));
    }

    const timeline = document.querySelector(".love-story__timeline");
    if (!timeline) return;

    timeline.innerHTML = "";

    loveStory.milestones.forEach((milestone) => {
      const li = document.createElement("li");
      li.className = "love-story__milestone";

      const timeEl = document.createElement("time");
      timeEl.className = "love-story__date";
      timeEl.setAttribute("datetime", milestone.dateISO);
      timeEl.textContent = milestone.dateDisplay;
      li.appendChild(timeEl);

      const h3 = document.createElement("h3");
      h3.className = "love-story__title";
      h3.textContent = milestone.title;
      li.appendChild(h3);

      if (milestone.description) {
        const p = document.createElement("p");
        p.className = "love-story__description";
        p.textContent = milestone.description;
        li.appendChild(p);
      }

      timeline.appendChild(li);
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

    // Render initial wishes from config
    renderWishes(wishes.initialWishes);

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

  /** Render an array of wish objects into the wishes list. */
  function renderWishes(wishes) {
    const list = document.getElementById("wishes-list");
    if (!list) return;
    list.innerHTML = "";
    wishes.forEach((wish) => {
      prependWish(wish.author || wish.author_name, wish.message || wish.content);
    });
  }

  /** Prepend a single wish to the top of the wishes list. */
  function prependWish(author, message) {
    const list = document.getElementById("wishes-list");
    if (!list) return;
    const article = document.createElement("article");
    article.className = "wishes__item";
    article.innerHTML = `
      <p class="wishes__author"></p>
      <p class="wishes__message"></p>
    `;
    setText(".wishes__author", author, article);
    setText(".wishes__message", message, article);
    list.prepend(article);
  }

  // --- Populate RSVP ---------------------------------------------------------

  function populateRsvp() {
    const { rsvp, events } = WEDDING_CONFIG;

    setText(".rsvp__heading", rsvp.heading);
    setText(".rsvp__description", rsvp.description);

    // Event selection
    const eventsFieldset = document.querySelector(".rsvp__events");
    if (eventsFieldset) {
      setText(".rsvp__legend", rsvp.eventLegend, eventsFieldset);

      // Rebuild event options from config
      const legend = eventsFieldset.querySelector(".rsvp__legend");
      eventsFieldset.innerHTML = "";
      if (legend) eventsFieldset.appendChild(legend);

      events.forEach((event) => {
        const label = document.createElement("label");
        label.className = "rsvp__event-option";
        label.innerHTML = `
          <input type="radio" name="event" value="" class="rsvp__radio">
          <span class="rsvp__event-name"></span>
          <span class="rsvp__event-location"></span>
        `;
        label.querySelector("input").value = event.rsvpValue;
        setText(".rsvp__event-name", event.title, label);
        setText(".rsvp__event-location", event.location, label);
        eventsFieldset.appendChild(label);
      });
    }

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

    // Guest count options
    const guestCountFieldset = document.querySelector(".rsvp__guest-count");
    if (guestCountFieldset) {
      setText(".rsvp__legend", rsvp.guestCountLegend, guestCountFieldset);

      const legend = guestCountFieldset.querySelector(".rsvp__legend");
      guestCountFieldset.innerHTML = "";
      if (legend) guestCountFieldset.appendChild(legend);

      rsvp.guestCountOptions.forEach((option) => {
        const label = document.createElement("label");
        label.className = "rsvp__count-option";
        label.innerHTML = `
          <input type="radio" name="guest_count" value="" class="rsvp__radio">
          <span></span>
        `;
        label.querySelector("input").value = option.value;
        label.querySelector("span").textContent = option.label;
        guestCountFieldset.appendChild(label);
      });
    }

    setText(".rsvp__submit", rsvp.submitText);
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

  // --- Populate Footer -------------------------------------------------------

  function populateFooter() {
    const { footer } = WEDDING_CONFIG;

    setText(".footer__share-title", footer.shareTitle);

    // Rebuild share links
    const linksList = document.querySelector(".footer__share-links");
    if (linksList) {
      linksList.innerHTML = "";

      footer.shareLinks.forEach((link) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = `footer__share-link footer__share-link--${link.platform}`;
        a.href = link.url;
        a.setAttribute("aria-label", link.ariaLabel);
        a.setAttribute("data-platform", link.platform);
        a.textContent = link.label;

        if (link.platform !== "copy") {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        li.appendChild(a);
        linksList.appendChild(li);
      });
    }
  }

  // --- Countdown Timer -------------------------------------------------------

  function startCountdownTimer() {
    const timerEl = document.querySelector(".countdown__timer");
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
      ".couple__person, .events__card, .love-story__milestone, " +
        ".wishes__item, .wishes__form-wrapper, .gallery__heading"
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

    const { api } = WEDDING_CONFIG;

    // Fetch existing wishes from Google Sheets API on load
    if (api && api.baseUrl) {
      fetch(api.baseUrl + "?action=getWishes")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch wishes");
        })
        .then((json) => {
          var data = json.data || json;
          if (Array.isArray(data) && data.length > 0) {
            renderWishes(
              data.map((w) => ({
                author: w.author_name || w.author,
                message: w.content || w.message,
              }))
            );
          }
        })
        .catch(() => {
          // API not available yet – keep initial wishes from config
        });
    }

    // Form submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("wish-name");
      const messageInput = document.getElementById("wish-message");
      const submitBtn = form.querySelector(".wishes__submit");

      const name = nameInput ? nameInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !message) return;

      // Update button state
      const originalText = submitBtn ? submitBtn.textContent : "";
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
            prependWish(name, message);
            form.reset();
            if (submitBtn) submitBtn.textContent = originalText;
          })
          .catch(() => {
            // API not available – still show the wish locally
            prependWish(name, message);
            form.reset();
            if (submitBtn) submitBtn.textContent = originalText;
          });
      } else {
        // No API configured – just add locally
        prependWish(name, message);
        form.reset();
        if (submitBtn) submitBtn.textContent = originalText;
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
      const eventRadio = form.querySelector('input[name="event"]:checked');
      const nameInput = document.getElementById("rsvp-name");
      const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
      const guestCountRadio = form.querySelector('input[name="guest_count"]:checked');

      // Validate
      if (!eventRadio || !nameInput || !nameInput.value.trim() || !attendanceRadio) {
        showFormMessage(form, "Vui lòng điền đầy đủ thông tin!", "error");
        return;
      }

      const payload = {
        action: "rsvp",
        event: eventRadio.value,
        guest_name: nameInput.value.trim(),
        attendance: attendanceRadio.value,
        guest_count: guestCountRadio ? guestCountRadio.value : "1",
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
  // FEATURE 7: SHARE LINKS
  // =========================================================================

  function initShareLinks() {
    const pageUrl = encodeURIComponent(window.location.href);

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-platform]");
      if (!link) return;

      const platform = link.getAttribute("data-platform");

      switch (platform) {
        case "facebook":
          e.preventDefault();
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
            "_blank",
            "width=600,height=400"
          );
          break;

        case "zalo":
          e.preventDefault();
          window.open(
            `https://zalo.me/share?url=${pageUrl}`,
            "_blank",
            "width=600,height=400"
          );
          break;

        case "copy":
          e.preventDefault();
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              // Show copied tooltip
              const original = link.getAttribute("aria-label");
              link.setAttribute("aria-label", "Đã sao chép!");
              link.classList.add("footer__share-link--copied");
              setTimeout(() => {
                link.setAttribute("aria-label", original);
                link.classList.remove("footer__share-link--copied");
              }, 2000);
            })
            .catch(() => {
              // Fallback: select and copy
              const input = document.createElement("input");
              input.value = window.location.href;
              document.body.appendChild(input);
              input.select();
              document.execCommand("copy");
              input.remove();
            });
          break;
      }
    });
  }

  // --- Initialize ------------------------------------------------------------

  function init() {
    // Populate DOM from config
    populateMeta();
    populateCover();
    populateCouple();
    populateCountdown();
    populateEvents();
    populateLoveStory();
    populateGallery();
    populateWishes();
    populateRsvp();
    populateThankYou();
    populateFooter();

    // Interactive features
    startCountdownTimer();
    initGallerySwiper();
    initLightbox();
    initScrollAnimations();
    initWishesForm();
    initRsvpForm();
    initShareLinks();
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
