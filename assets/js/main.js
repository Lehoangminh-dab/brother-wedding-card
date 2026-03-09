/**
 * Wedding Card - DOM Population & Interactive Features
 *
 * Reads from WEDDING_CONFIG (defined in config.js) and populates all
 * text content and image sources in the HTML. Also handles:
 *  - Page preloader
 *  - Auto-scroll hint (after cover fade-in, until user interaction)
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
  // CONSTANTS
  // =========================================================================

  // Time durations (milliseconds)
  var MS_PER_DAY  = 86400000;
  var MS_PER_HOUR = 3600000;
  var MS_PER_MIN  = 60000;
  var MS_PER_SEC  = 1000;

  // UI timing
  var PRELOADER_HIDE_DELAY    = 800;   // ms after load before starting fade
  var PRELOADER_FADE_DURATION = 400;   // ms CSS fade duration + cleanup
  var ERROR_MSG_TTL           = 5000;  // ms before error message auto-removes

  // Gallery Swiper
  var GALLERY_AUTOPLAY_DELAY   = 3000;  // ms between vertical carousel slides
  var GALLERY_SCROLL_SPEED     = 8000;  // ms for one horizontal filmstrip pass

  // Ambient audio
  var AMBIENT_AUDIO_SRC_COVER = "assets/audio/ocean_waves_sound.mp3";
  var AMBIENT_AUDIO_SRC_AFTER_COVER = "assets/audio/ghibli.mp3";
  var AMBIENT_AUDIO_VOLUME = 0.08;
  var AMBIENT_AUDIO_RETRY_EVENTS = ["pointerdown", "touchstart", "keydown"];
  var AMBIENT_AUDIO_CONSENT_SELECTOR = "#ambient-audio-consent";
  var COVER_VIDEO_RETRY_EVENTS = ["pointerdown", "touchstart", "keydown"];
  var COVER_VIDEO_FAIL_TIMEOUT = 3500;

  // Scroll animations
  var SCROLL_ANIM_THRESHOLD = 0.15; // fraction of element visible before animating

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

  /** Read a CSS custom property as px number, with numeric fallback. */
  function getCssPixelVar(varName, fallbackPx) {
    var raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    var value = parseFloat(raw);
    return Number.isFinite(value) ? value : fallbackPx;
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

  /** Submit a JSON payload to the API; calls onSuccess or onError. */
  function submitFormToApi(api, payload, onSuccess, onError) {
    fetch(api.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json(); })
      .then(onSuccess)
      .catch(onError);
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
      setTimeout(function () { msg.remove(); }, ERROR_MSG_TTL);
    }
  }

  /** Show a persistent section-level success confirmation below a heading. */
  function showSectionSuccess(section, heading, text) {
    if (!section || !heading) return;

    var existing = section.querySelector(".section-success");
    if (existing) {
      setText(".section-success__text", text, existing);
      return;
    }

    var confirmation = document.createElement("div");
    confirmation.className = "section-success";
    confirmation.innerHTML = '<p class="section-success__text"></p>';
    setText(".section-success__text", text, confirmation);

    var insertBefore = heading.nextElementSibling;
    if (insertBefore) {
      section.insertBefore(confirmation, insertBefore);
    } else {
      section.appendChild(confirmation);
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
    var coverGroomName = cover.groomName || (couple.groom && couple.groom.shortName) || "";
    var coverBrideName = cover.brideName || (couple.bride && couple.bride.shortName) || "";

    var coverSection = document.getElementById("cover");
    var coverVideo = document.querySelector(".cover__video");
    var coverBg = document.querySelector(".cover__bg--fallback");
    if (coverBg && cover.backgroundImage) {
      coverBg.style.backgroundImage = "url('" + cover.backgroundImage + "')";
    } else if (coverBg) {
      coverBg.style.removeProperty("background-image");
    }

    populateText({
      ".cover__groom-name": coverGroomName,
      ".cover__bride-name": coverBrideName,
      ".cover__date": (cover.dateLine || "").toUpperCase(),
      ".cover__venue": (cover.locationLine || "").toUpperCase(),
    });

    if (!coverSection || !coverVideo) return;

    coverSection.classList.remove("cover--video-ready");
    coverSection.classList.remove("cover--video-unavailable");
    coverSection.classList.remove("cover--has-video-src");
    coverSection.classList.remove("cover--no-fallback-image");
    if (!cover.backgroundImage) {
      coverSection.classList.add("cover--no-fallback-image");
    }

    // Keep playback settings explicit for cross-browser consistency.
    coverVideo.preload = "metadata";
    coverVideo.muted = true;
    coverVideo.defaultMuted = true;
    coverVideo.loop = true;
    coverVideo.playsInline = true;
    coverVideo.setAttribute("playsinline", "");
    coverVideo.setAttribute("webkit-playsinline", "");

    var poster = cover.posterImage || cover.backgroundImage || "";
    if (poster) {
      coverVideo.poster = poster;
    }

    var prefersReducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var configuredSources = [];
    if (Array.isArray(cover.videoSources)) {
      configuredSources = cover.videoSources.slice();
    } else if (cover.videoUrl) {
      configuredSources = [{ src: cover.videoUrl, type: "video/mp4" }];
    }

    var usableSources = configuredSources.filter(function (source) {
      return source && typeof source.src === "string" && source.src.trim() !== "";
    });
    if (!usableSources.length) {
      coverSection.classList.add("cover--video-unavailable");
      return;
    }

    if (typeof coverVideo.canPlayType === "function") {
      var playableSources = usableSources.filter(function (source) {
        if (!source.type) return true;
        var support = coverVideo.canPlayType(source.type);
        return support === "probably" || support === "maybe";
      });
      if (playableSources.length) usableSources = playableSources;
    }

    // Let the browser choose the best source from an ordered list.
    coverVideo.removeAttribute("src");
    while (coverVideo.firstChild) {
      coverVideo.removeChild(coverVideo.firstChild);
    }
    usableSources.forEach(function (source) {
      var sourceEl = document.createElement("source");
      sourceEl.src = source.src;
      if (source.type) sourceEl.type = source.type;
      coverVideo.appendChild(sourceEl);
    });
    coverSection.classList.add("cover--has-video-src");
    coverVideo.load();

    var playbackConfirmed = false;
    var retryAttached = false;
    var failureTimeoutId = null;

    function clearFailureTimeout() {
      if (failureTimeoutId) {
        clearTimeout(failureTimeoutId);
        failureTimeoutId = null;
      }
    }

    function removeRetryListeners() {
      if (!retryAttached) return;
      COVER_VIDEO_RETRY_EVENTS.forEach(function (evt) {
        document.removeEventListener(evt, onFirstGesture);
      });
      retryAttached = false;
    }

    function addRetryListeners() {
      if (retryAttached || prefersReducedMotion) return;
      COVER_VIDEO_RETRY_EVENTS.forEach(function (evt) {
        document.addEventListener(evt, onFirstGesture);
      });
      retryAttached = true;
    }

    function setUnavailable() {
      clearFailureTimeout();
      removeRetryListeners();
      coverSection.classList.remove("cover--video-ready");
      coverSection.classList.remove("cover--has-video-src");
      coverSection.classList.add("cover--video-unavailable");
    }

    function onPlaybackStarted() {
      playbackConfirmed = true;
      clearFailureTimeout();
      removeRetryListeners();
      coverSection.classList.remove("cover--video-unavailable");
      coverSection.classList.add("cover--video-ready");
    }

    function scheduleFailureFallback() {
      clearFailureTimeout();
      failureTimeoutId = setTimeout(function () {
        if (!playbackConfirmed) setUnavailable();
      }, COVER_VIDEO_FAIL_TIMEOUT);
    }

    function attemptPlay() {
      if (prefersReducedMotion) return;
      var playAttempt;
      try {
        playAttempt = coverVideo.play();
      } catch (e) {
        addRetryListeners();
        scheduleFailureFallback();
        return;
      }

      // Older engines may not return a Promise from play().
      if (!playAttempt || typeof playAttempt.then !== "function") {
        onPlaybackStarted();
        return;
      }

      playAttempt
        .then(onPlaybackStarted)
        .catch(function () {
          addRetryListeners();
          scheduleFailureFallback();
        });
    }

    function onFirstGesture() {
      attemptPlay();
    }

    coverVideo.addEventListener("loadedmetadata", scheduleFailureFallback);
    coverVideo.addEventListener("canplay", attemptPlay);
    coverVideo.addEventListener("playing", onPlaybackStarted);
    coverVideo.addEventListener("error", function () {
      if (!playbackConfirmed) setUnavailable();
    });
    coverVideo.addEventListener("stalled", function () {
      if (!playbackConfirmed) scheduleFailureFallback();
    });

    // Fallback in case a browser intermittently misses native loop behavior.
    coverVideo.addEventListener("ended", function () {
      try {
        coverVideo.currentTime = 0;
      } catch (e) {}
      attemptPlay();
    });

    if (!prefersReducedMotion) {
      scheduleFailureFallback();
      attemptPlay();
    } else {
      setUnavailable();
    }
  }

  function populateUntilTheDay() {
    var cfg = WEDDING_CONFIG.untilTheDay;

    setSectionBackground("until-the-day", cfg.backgroundImage);
    setAttr(".until__timer", "data-wedding-date", WEDDING_CONFIG.weddingDate);

    populateText({
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
      row.className = "timeline__item stagger-item";

      var entry = document.createElement("div");
      entry.className = "timeline__entry";

      var time = document.createElement("span");
      time.className = "timeline__time";
      time.textContent = item.time;

      var detail = document.createElement("div");
      detail.className = "timeline__detail";

      var iconWrap = document.createElement("div");
      iconWrap.className = "timeline__icon-wrap";

      var icon = document.createElement("img");
      icon.className = "timeline__icon";
      icon.src = item.iconSrc || "";
      icon.alt = item.iconAlt || item.label || "Biểu tượng sự kiện";
      icon.loading = "lazy";

      var event = document.createElement("span");
      event.className = "timeline__event";
      event.textContent = item.label;

      iconWrap.appendChild(icon);
      detail.appendChild(iconWrap);
      detail.appendChild(event);
      entry.appendChild(time);
      entry.appendChild(detail);
      row.appendChild(entry);
      track.appendChild(row);
    });
  }

  function populateGallery() {
    var cfg = WEDDING_CONFIG.gallery;

    setText(".gallery__title", cfg.title);
    var vImages = cfg.images;
    var loopImages = vImages.concat(vImages).concat(vImages);
    buildSlides(".gallery__slider .swiper-wrapper", loopImages, "vertical");
    var hImages = cfg.horizontalImages || [];
    var marqueeImages = hImages.concat(hImages).concat(hImages);
    buildSlides(".gallery__horizontal-slider .swiper-wrapper", marqueeImages, "horizontal");
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
      a.setAttribute("data-lightbox-index", index % ((pool === "horizontal" ? (WEDDING_CONFIG.gallery.horizontalImages || []).length : (WEDDING_CONFIG.gallery.images || []).length) || images.length));
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
      var optionsGroup = document.createElement("div");
      optionsGroup.className = "rsvp__attendance-options";
      attendanceFieldset.appendChild(optionsGroup);

      cfg.attendanceOptions.forEach(function (option) {
        var label = document.createElement("label");
        label.className = "rsvp__attendance-option";
        label.innerHTML =
          '<input type="radio" name="attendance" value="" class="rsvp__radio">' +
          "<span></span>";
        label.querySelector("input").value = option.value;
        label.querySelector("span").textContent = option.label;
        optionsGroup.appendChild(label);
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

      var subtitleEl = card.querySelector(".gifts__card-subtitle");
      if (subtitleEl && data.subtitle) {
        subtitleEl.innerHTML = data.subtitle;
      }

      populateAttrs({
        ".gifts__qr-img": { src: data.qrImage, alt: "Mã QR " + data.label },
      }, card);
    });
  }

  function populateContactInfo() {
    var cfg = WEDDING_CONFIG.contactInfo;
    if (!cfg) return;

    populateText({
      ".contact-info__heading": cfg.heading,
      ".contact-info__phone": cfg.phone,
      ".contact-info__name": cfg.name,
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
          if (cover) {
            cover.classList.add("cover--ready");
            initAutoScrollHint(cover);
          }
        }, PRELOADER_FADE_DURATION);
      }, PRELOADER_HIDE_DELAY);
    }

    if (document.readyState === "complete") {
      hideLoaderAndStartCover();
    } else {
      window.addEventListener("load", hideLoaderAndStartCover);
    }
  }

  // --- 3b. Ambient Audio ---------------------------------------------------

  function initAmbientAudio() {
    var consentWrap = document.getElementById("ambient-audio-consent");
    var consentBtn = consentWrap
      ? consentWrap.querySelector(".ambient-audio__button")
      : null;
    var consentIcon = consentBtn
      ? consentBtn.querySelector(".ambient-audio__icon")
      : null;
    var consentLabel = consentBtn
      ? consentBtn.querySelector(".ambient-audio__label")
      : null;

    var ambientAudio = new Audio(AMBIENT_AUDIO_SRC_COVER);
    ambientAudio.loop = true;
    ambientAudio.preload = "auto";
    ambientAudio.volume = AMBIENT_AUDIO_VOLUME;
    var AUDIO_LABEL_ON = "Bật Âm Thanh";
    var AUDIO_LABEL_OFF = "Tắt Âm Thanh";
    var isAudioOn = true;
    // Fallback in case a browser intermittently misses native loop behavior.
    ambientAudio.addEventListener("ended", function () {
      if (!isAudioOn) return;
      try {
        ambientAudio.currentTime = 0;
      } catch (e) {}
      tryPlay();
    });

    var currentTrackSrc = AMBIENT_AUDIO_SRC_COVER;
    var retryAttached = false;

    function showControl() {
      if (!consentWrap) return;
      consentWrap.classList.add("ambient-audio--visible");
      consentWrap.setAttribute("aria-hidden", "false");
    }

    function setButtonState(isOn) {
      if (consentWrap) {
        consentWrap.classList.toggle("ambient-audio--on", isOn);
        consentWrap.classList.toggle("ambient-audio--off", !isOn);
      }
      if (!consentBtn) return;
      consentBtn.classList.toggle("ambient-audio__button--on", isOn);
      consentBtn.classList.toggle("ambient-audio__button--off", !isOn);
      consentBtn.setAttribute("aria-pressed", isOn ? "true" : "false");

      if (consentIcon) {
        consentIcon.classList.toggle("ri-volume-up-line", isOn);
        consentIcon.classList.toggle("ri-volume-mute-line", !isOn);
      }
      if (consentLabel) {
        consentLabel.textContent = isOn ? AUDIO_LABEL_ON : AUDIO_LABEL_OFF;
      }
    }

    function removeRetryListeners() {
      if (!retryAttached) return;
      AMBIENT_AUDIO_RETRY_EVENTS.forEach(function (evt) {
        document.removeEventListener(evt, onFirstGesture);
      });
      retryAttached = false;
    }

    function addRetryListeners() {
      if (retryAttached) return;
      AMBIENT_AUDIO_RETRY_EVENTS.forEach(function (evt) {
        document.addEventListener(evt, onFirstGesture);
      });
      retryAttached = true;
    }

    function tryPlay() {
      if (!isAudioOn) return;
      var playAttempt = ambientAudio.play();

      // Older engines may not return a Promise from play().
      if (!playAttempt || typeof playAttempt.then !== "function") {
        removeRetryListeners();
        return;
      }

      playAttempt
        .then(removeRetryListeners)
        .catch(function () {
          showControl();
          addRetryListeners();
        });
    }

    function onFirstGesture() {
      tryPlay();
    }

    function setAudioState(nextIsOn) {
      isAudioOn = !!nextIsOn;
      setButtonState(isAudioOn);

      if (isAudioOn) {
        tryPlay();
        return;
      }

      removeRetryListeners();
      ambientAudio.pause();
    }

    if (consentBtn) {
      consentBtn.addEventListener("click", function () {
        setAudioState(!isAudioOn);
      });
    }

    showControl();
    setButtonState(true);
    tryPlay();

    function switchAmbientTrack(nextSrc) {
      if (!nextSrc || nextSrc === currentTrackSrc) return;
      currentTrackSrc = nextSrc;

      ambientAudio.src = nextSrc;
      ambientAudio.load();
      if (isAudioOn) tryPlay();
    }

    return {
      switchAmbientTrack: switchAmbientTrack,
    };
  }

  // --- 3c. Cover Exit Audio Switch ----------------------------------------

  function initCoverExitAudioSwitch(ambientControl) {
    if (!ambientControl || typeof ambientControl.switchAmbientTrack !== "function") return;

    var cover = document.getElementById("cover");
    if (!cover) return;

    var hasSwitchedAfterCover = false;

    function switchOnce() {
      if (hasSwitchedAfterCover) return;
      hasSwitchedAfterCover = true;
      ambientControl.switchAmbientTrack(AMBIENT_AUDIO_SRC_AFTER_COVER);
    }

    function isCoverOutOfView() {
      var rect = cover.getBoundingClientRect();
      return rect.bottom <= 0;
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (hasSwitchedAfterCover) return;
            if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) {
              switchOnce();
              observer.unobserve(cover);
            }
          });
        },
        { threshold: 0 }
      );

      observer.observe(cover);
      return;
    }

    function onViewportChange() {
      if (!isCoverOutOfView()) return;
      switchOnce();
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
    }

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);
    onViewportChange();
  }

  // --- 3d. Scroll Stagger Animations --------------------------------------

  var STAGGER_DELAY = 150; // ms between each sibling in a batch

  function initStaggerAnimations() {
    var items = document.querySelectorAll("[data-stagger] .stagger-item");

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("stagger--visible"); });
      return;
    }

    var revealQueue = [];
    var frameScheduled = false;

    function processQueue() {
      var batch = revealQueue.slice();
      revealQueue = [];
      frameScheduled = false;
      batch.forEach(function (item, i) {
        item.style.transitionDelay = (i * STAGGER_DELAY) + "ms";
        item.classList.add("stagger--visible");
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealQueue.push(entry.target);
            observer.unobserve(entry.target);
          }
        });
        if (revealQueue.length && !frameScheduled) {
          frameScheduled = true;
          requestAnimationFrame(processQueue);
        }
      },
      { threshold: SCROLL_ANIM_THRESHOLD, rootMargin: "-10% 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  // --- 3d. Countdown Timer -------------------------------------------------

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
      var d = Math.floor(diff / MS_PER_DAY);
      var h = Math.floor((diff / MS_PER_HOUR) % 24);
      var m = Math.floor((diff / MS_PER_MIN) % 60);
      var s = Math.floor((diff / MS_PER_SEC) % 60);

      if (els.days) els.days.textContent = String(d).padStart(2, "0");
      if (els.hours) els.hours.textContent = String(h).padStart(2, "0");
      if (els.minutes) els.minutes.textContent = String(m).padStart(2, "0");
      if (els.seconds) els.seconds.textContent = String(s).padStart(2, "0");
    }

    update();
    setInterval(update, MS_PER_SEC);
  }

  // --- 3e. Gallery Swiper Carousel -----------------------------------------

  function initGallerySwiper() {
    if (typeof Swiper === "undefined") return;
    var gallerySpacing = getCssPixelVar("--gallery-track-spacing", 16);

    var verticalSwiper = new Swiper(".gallery__slider", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: Math.floor(WEDDING_CONFIG.gallery.images.length / 2),
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      autoplay: { delay: GALLERY_AUTOPLAY_DELAY, disableOnInteraction: false },
      pagination: { el: ".gallery__slider .swiper-pagination", clickable: true },
      loop: true,
      observer: true,
      observeParents: true,
    });

    var horizontalSwiper = new Swiper(".gallery__horizontal-slider", {
      slidesPerView: "auto",
      spaceBetween: gallerySpacing,
      grabCursor: true,
      loop: true,
      autoplay: { delay: 1, disableOnInteraction: false },
      speed: GALLERY_SCROLL_SPEED,
      observer: true,
      observeParents: true,
    });

  }

  // --- 3f. Gallery Lightbox ------------------------------------------------

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

  // --- 3g. Wishes Form Submission ------------------------------------------

  function initWishesForm() {
    var form = document.getElementById("wishes-form");
    if (!form) return;

    var api = WEDDING_CONFIG.api;
    var cfg = WEDDING_CONFIG.wishes;
    var section = document.getElementById("wishes");
    var heading = section ? section.querySelector(".wishes__heading") : null;

    function markSuccess(submitBtn) {
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = cfg.submittedText;
        submitBtn.disabled = true;
        submitBtn.classList.add("wishes__submit--success");
      }
      showSectionSuccess(section, heading, cfg.successMessage);
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
        submitFormToApi(api, payload,
          function () { markSuccess(submitBtn); },
          function () {
            showFormMessage(form, cfg.errorMessage, "error");
            if (submitBtn) submitBtn.textContent = cfg.submitText;
          }
        );
      } else {
        markSuccess(submitBtn);
      }
    });
  }

  // --- 3h. RSVP Form Submission --------------------------------------------

  function initRsvpForm() {
    var form = document.getElementById("rsvp-form");
    if (!form) return;

    var api = WEDDING_CONFIG.api;
    var cfg = WEDDING_CONFIG.rsvp;
    var section = document.getElementById("rsvp");
    var heading = section ? section.querySelector(".rsvp__heading") : null;

    function markSuccess(submitBtn) {
      if (submitBtn) {
        submitBtn.textContent = cfg.submittedText;
        submitBtn.disabled = true;
        submitBtn.classList.add("rsvp__submit--success");
      }

      var existingMessage = form.querySelector(".form-message");
      if (existingMessage) existingMessage.remove();
      showSectionSuccess(section, heading, cfg.successMessage);
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
        submitFormToApi(api, payload,
          function () { markSuccess(submitBtn); },
          function () {
            showFormMessage(form, cfg.errorMessage, "error");
            if (submitBtn) submitBtn.textContent = cfg.submitText;
          }
        );
      } else {
        markSuccess(submitBtn);
      }
    });
  }

  // --- 3j. Auto-scroll Hint (discoverability for scrollable page) -----------

  var AUTO_SCROLL_FALLBACK_MS = 4000; // if transitionend never fires

  function initAutoScrollHint(coverSection) {
    if (!coverSection || !coverSection.classList.contains("cover--ready")) return;

    var cfg = (WEDDING_CONFIG.autoScrollHint || {});
    if (cfg.enabled === false) return;

    var prefersReducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    var bufferMs = typeof cfg.bufferAfterFadeMs === "number" ? cfg.bufferAfterFadeMs : 500;
    var speedPxPerSec = typeof cfg.speedPxPerSec === "number" ? cfg.speedPxPerSec : 50;

    var lastEl = null;
    var maxDelay = -1;
    var all = coverSection.querySelectorAll(".cover__animate");
    for (var i = 0; i < all.length; i++) {
      var d = parseInt(all[i].getAttribute("data-cover-delay") || "0", 10);
      if (d > maxDelay) {
        maxDelay = d;
        lastEl = all[i];
      }
    }
    if (!lastEl) return;

    var scheduled = false;
    var fallbackId = null;

    function startAutoScroll() {
      if (scheduled) return;
      scheduled = true;
      if (fallbackId) clearTimeout(fallbackId);
      lastEl.removeEventListener("transitionend", onTransitionEnd);

      setTimeout(function () {
        runAutoScroll();
      }, bufferMs);
    }

    function onTransitionEnd() {
      startAutoScroll();
    }

    lastEl.addEventListener("transitionend", onTransitionEnd);
    fallbackId = setTimeout(startAutoScroll, AUTO_SCROLL_FALLBACK_MS);

    function runAutoScroll() {
      var rafId = null;
      var lastTime = performance.now();
      var stopped = false;
      var consentElement = document.querySelector(AMBIENT_AUDIO_CONSENT_SELECTOR);

      function isAudioConsentInteraction(event) {
        if (!event || !event.target || !consentElement) return false;
        if (typeof event.target.closest !== "function") return false;
        return !!event.target.closest(AMBIENT_AUDIO_CONSENT_SELECTOR);
      }

      function stop(event) {
        // Let users enable ambient audio without canceling auto-scroll hint.
        if (isAudioConsentInteraction(event)) return;
        stopped = true;
        if (rafId) cancelAnimationFrame(rafId);
        document.removeEventListener("touchstart", stop, { passive: true });
        document.removeEventListener("touchmove", stop, { passive: true });
        document.removeEventListener("wheel", stop, { passive: true });
        document.removeEventListener("keydown", onKeyDown);
      }

      function onKeyDown(e) {
        var scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Space"];
        if (scrollKeys.indexOf(e.key) !== -1) stop();
      }

      document.addEventListener("touchstart", stop, { passive: true });
      document.addEventListener("touchmove", stop, { passive: true });
      document.addEventListener("wheel", stop, { passive: true });
      document.addEventListener("keydown", onKeyDown);

      function tick(now) {
        if (stopped) return;
        var raw = (now - lastTime) / 1000;
        var dt = raw <= 0 ? 0.016 : Math.min(raw, 0.05);
        lastTime = now;
        var maxScroll = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight;
        if (maxScroll <= 0) return;
        var current = window.scrollY || window.pageYOffset;
        if (current >= maxScroll) {
          stop();
          return;
        }
        var step = speedPxPerSec * dt;
        document.documentElement.scrollTop = Math.min(current + step, maxScroll);
        rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    }
  }

  // --- 3k. Cover viewport fit (cover-only special rule) ----------------------

  function initCoverViewportFit() {
    var coverSection = document.getElementById("cover");
    if (!coverSection) return;

    var coverContent = coverSection.querySelector(".cover__content");
    var andEl = coverSection.querySelector(".cover__and");
    var dateEl = coverSection.querySelector(".cover__date");
    if (!coverContent || !andEl || !dateEl) return;

    var resizeTimer = null;
    var rafId = null;

    function getViewportHeight() {
      // On mobile, visualViewport tracks the visible area after browser UI changes.
      var vv = window.visualViewport;
      if (vv && typeof vv.height === "number" && vv.height > 0) return vv.height;
      return window.innerHeight || document.documentElement.clientHeight || 0;
    }

    function applyCoverViewportFit() {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function () {
        // Reset first so each pass starts from the default design spacing.
        coverSection.style.removeProperty("--cover-windsong-next-gap");
        coverContent.style.removeProperty("padding-top");

        var viewportHeight = getViewportHeight();
        if (!viewportHeight) return;

        var coverHeight = Math.ceil(coverSection.getBoundingClientRect().height);
        var overflow = coverHeight - viewportHeight;
        if (overflow <= 0) return;

        var andGap = parseFloat(window.getComputedStyle(andEl).marginTop) || 0;
        var dateGap = parseFloat(window.getComputedStyle(dateEl).marginTop) || 0;
        var baseTopPadding = parseFloat(window.getComputedStyle(coverContent).paddingTop) || 0;
        var baseBottomPadding = parseFloat(window.getComputedStyle(coverContent).paddingBottom) || 0;

        var remainingOverflow = overflow;

        // Preserve a visible gap rhythm while trimming only what is necessary.
        var minWindsongGap = 6;
        var minTopPadding = 8;
        var minBottomPadding = 8;

        // 1) Reduce the two windsong-following gaps first (shared by AND + date).
        var currentSharedGap = Math.min(andGap, dateGap);
        var maxSharedGapTrim = Math.max(0, currentSharedGap - minWindsongGap);
        if (maxSharedGapTrim > 0 && remainingOverflow > 0) {
          var trimPerSpot = Math.min(maxSharedGapTrim, remainingOverflow / 2);
          var nextSharedGap = currentSharedGap - trimPerSpot;
          coverSection.style.setProperty("--cover-windsong-next-gap", nextSharedGap.toFixed(3) + "px");
          remainingOverflow -= trimPerSpot * 2;
        }

        if (remainingOverflow <= 0) return;

        // 2) Then reduce date-to-bottom spacing (cover bottom padding).
        var maxBottomTrim = Math.max(0, baseBottomPadding - minBottomPadding);
        if (maxBottomTrim > 0 && remainingOverflow > 0) {
          var bottomTrim = Math.min(maxBottomTrim, remainingOverflow);
          coverContent.style.paddingBottom = (baseBottomPadding - bottomTrim).toFixed(3) + "px";
          remainingOverflow -= bottomTrim;
        }

        if (remainingOverflow <= 0) return;

        // 3) Last resort: reduce top spacing above "ĐÁM CƯỚI".
        var maxTopTrim = Math.max(0, baseTopPadding - minTopPadding);
        if (maxTopTrim > 0 && remainingOverflow > 0) {
          var topTrim = Math.min(maxTopTrim, remainingOverflow);
          coverContent.style.paddingTop = (baseTopPadding - topTrim).toFixed(3) + "px";
        }
      });
    }

    function scheduleCoverViewportFit() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyCoverViewportFit, 60);
    }

    window.addEventListener("resize", scheduleCoverViewportFit);
    window.addEventListener("orientationchange", scheduleCoverViewportFit);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleCoverViewportFit);
    }

    applyCoverViewportFit();
    window.setTimeout(applyCoverViewportFit, 250);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyCoverViewportFit).catch(function () {});
    }
  }

  // --- 3i. Gift Card QR Toggle ---------------------------------------------

  function initGifts() {
    var cards = document.querySelectorAll(".gifts__card");

    function refreshPanelHeight(panel) {
      if (!panel || !panel.classList.contains("gifts__qr-panel--open")) return;
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    function closeAllCards() {
      cards.forEach(function (c) {
        var p = c.querySelector(".gifts__qr-panel");
        if (p) {
          p.classList.remove("gifts__qr-panel--open");
          p.style.maxHeight = "0px";
          p.style.removeProperty("margin-top");
        }
        c.classList.remove("gifts__card--active");
      });
    }

    function resolveDownloadFilename(card, imageSrc) {
      var role = card.getAttribute("data-gift");
      var fallbackName = role === "bride" ? "qr-nha-gai.png" : "qr-nha-trai.png";
      try {
        var parsed = new URL(imageSrc, window.location.href);
        var pathName = parsed.pathname || "";
        var fromPath = pathName.slice(pathName.lastIndexOf("/") + 1);
        return fromPath ? decodeURIComponent(fromPath) : fallbackName;
      } catch (err) {
        return fallbackName;
      }
    }

    function triggerQrDownload(card) {
      var qrImg = card.querySelector(".gifts__qr-img");
      if (!qrImg) return false;

      var src = qrImg.currentSrc || qrImg.getAttribute("src") || qrImg.src;
      if (!src) return false;

      var link = document.createElement("a");
      link.href = src;
      link.download = resolveDownloadFilename(card, src);
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    }

    function markDownloadSuccess(button, panel) {
      if (!button) return;

      var icon = button.querySelector(".gifts__download-icon");
      var text = button.querySelector(".gifts__download-text");

      button.classList.add("gifts__download-btn--success");
      button.setAttribute("aria-label", "Tải về thành công");

      if (icon) {
        icon.classList.remove("ri-download-2-line");
        icon.classList.add("ri-check-line");
      }
      if (text) text.textContent = "Tải về thành công";

      refreshPanelHeight(panel);
    }

    cards.forEach(function (card) {
      var panel = card.querySelector(".gifts__qr-panel");
      var qrImg = card.querySelector(".gifts__qr-img");
      var downloadBtn = card.querySelector(".gifts__download-btn");

      card.addEventListener("click", function () {
        var isOpen = panel && panel.classList.contains("gifts__qr-panel--open");

        closeAllCards();

        if (!isOpen && panel) {
          panel.classList.add("gifts__qr-panel--open");
          refreshPanelHeight(panel);
          card.classList.add("gifts__card--active");
        }
      });

      if (downloadBtn) {
        downloadBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (triggerQrDownload(card)) {
            markDownloadSuccess(downloadBtn, panel);
          }
        });
      }

      if (qrImg) {
        qrImg.addEventListener("load", function () {
          refreshPanelHeight(panel);
        });
      }
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
    populateContactInfo();
    populateThankYou();

    var ambientControl = initAmbientAudio();
    initCoverExitAudioSwitch(ambientControl);
    initCountdown();
    initGallerySwiper();
    initLightbox();
    initStaggerAnimations();
    initWishesForm();
    initGifts();
    initRsvpForm();
    initCoverViewportFit();
  }

  initPreloader();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
