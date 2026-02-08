/**
 * Wedding Card - DOM Population
 *
 * Reads from WEDDING_CONFIG (defined in config.js) and populates all
 * text content and image sources in the HTML. Config.js must be loaded first.
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

  // --- Populate Hero ---------------------------------------------------------

  function populateHero() {
    const { couple, hero } = WEDDING_CONFIG;

    setText(".hero__groom-name", couple.groom.shortName);
    setText(".hero__bride-name", couple.bride.shortName);
    setText(".hero__day-of-week", hero.dayOfWeek);
    setText(".hero__day", hero.day);
    setText(".hero__time", hero.time);
    setText(".hero__month-year", hero.monthYear);
    setText(".hero__venue-label", hero.venueLabel);

    const address = document.querySelector(".hero__venue-address");
    if (address) {
      address.textContent = `${hero.venueName} ${hero.venueAddress}`;
    }
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

  // --- Populate Gallery ------------------------------------------------------

  function populateGallery() {
    const { gallery } = WEDDING_CONFIG;

    setText(".gallery__tagline-top", gallery.tagline);
    setText(".gallery__title", gallery.title);

    const grid = document.querySelector(".gallery__grid");
    if (!grid) return;

    grid.innerHTML = "";

    gallery.images.forEach((image) => {
      const figure = document.createElement("figure");
      figure.className = "gallery__item";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      img.className = "gallery__img";
      img.loading = "lazy";

      figure.appendChild(img);
      grid.appendChild(figure);
    });
  }

  // --- Populate Wishes -------------------------------------------------------

  function populateWishes() {
    const { wishes } = WEDDING_CONFIG;

    const headingEl = document.querySelector(".wishes__heading");
    if (headingEl) {
      const iconSpan = headingEl.querySelector(".wishes__icon");
      headingEl.textContent = "";
      if (iconSpan) headingEl.appendChild(iconSpan);
      headingEl.appendChild(document.createTextNode(` ${wishes.heading}`));
    }

    // Render initial wishes
    const list = document.getElementById("wishes-list");
    if (list) {
      list.innerHTML = "";
      wishes.initialWishes.forEach((wish) => {
        const article = document.createElement("article");
        article.className = "wishes__item";
        article.innerHTML = `
          <p class="wishes__author"></p>
          <p class="wishes__message"></p>
        `;
        setText(".wishes__author", wish.author, article);
        setText(".wishes__message", wish.message, article);
        list.appendChild(article);
      });
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
        a.textContent = link.label;

        if (link.platform !== "copy") {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        li.appendChild(a);
        linksList.appendChild(li);
      });
    }

    // Copyright
    const copyright = document.querySelector(".footer__copyright");
    if (copyright) {
      copyright.innerHTML =
        `&copy; <a href="${footer.copyrightUrl}" target="_blank" rel="noopener noreferrer">${footer.copyrightName}</a>. ` +
        `All rights reserved. Powered by ` +
        `<a href="${footer.copyrightUrl}" target="_blank" rel="noopener noreferrer">${footer.copyrightName}</a>.`;
    }
  }

  // --- Initialize ------------------------------------------------------------

  function init() {
    populateMeta();
    populateHero();
    populateCouple();
    populateCountdown();
    populateEvents();
    populateLoveStory();
    populateGallery();
    populateWishes();
    populateRsvp();
    populateThankYou();
    populateFooter();
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
