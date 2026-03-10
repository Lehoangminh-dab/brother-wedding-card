/**
 * Wedding Card Configuration
 *
 * All text content, image paths, and data values are centralized here
 * for easy modification. Change any value below to customize the card.
 */

// Default placeholder used until real photos are provided
const PLACEHOLDER_IMAGE = "assets/images/placeholder.jpg";

const WEDDING_CONFIG = {

  // ──────────────────────────────────────────────
  // META / PAGE-LEVEL
  // ──────────────────────────────────────────────
  meta: {
    title: "Phúc – Vân | Thiệp Cưới",
    description: "Thiệp cưới Phúc & Vân",
  },

  // ──────────────────────────────────────────────
  // COUPLE (names used on cover)
  // ──────────────────────────────────────────────
  couple: {
    groom: { shortName: "Phúc" },
    bride: { shortName: "Vân" },
  },

  // ──────────────────────────────────────────────
  // FAMILY (standalone house information section)
  // If any field is blank, JS falls back to parsing gifts subtitles.
  // ──────────────────────────────────────────────
  family: {
    heading: "Đám Cưới",
    inviteTitle: "Trân trọng kính mời",
    inviteLine: "Tham dự lễ thành hôn của chúng mình",
    topCenterSymbol: "♡",
    bottomCenterSymbol: "❤",
    groom: {
      houseLabel: "Nhà Trai",
      fatherLabel: "Bố",
      fatherName: "Lê Tự Khanh",
      motherLabel: "Mẹ",
      motherName: "Nguyễn Thị Thanh Thủy",
      personName: "Lê Hoàng Phúc",
    },
    bride: {
      houseLabel: "Nhà Gái",
      fatherLabel: "Bố",
      fatherName: "Nguyễn Trung Toản",
      motherLabel: "Mẹ",
      motherName: "Đặng Thị Thắng",
      personName: "Nguyễn Thị Hồng Vân",
    },
  },

  // ──────────────────────────────────────────────
  // WEDDING DATE (single source of truth)
  // All date displays derive from or reference this value
  // ──────────────────────────────────────────────
  weddingDate: "2026-05-28T15:00:00+07:00",

  // ──────────────────────────────────────────────
  // COVER (opening section: names + date)
  // Prefer videoSources (ordered by browser compatibility).
  // Keep videoUrl for backward compatibility with older script logic.
  // For broad support, encode MP4 as H.264 + AAC (+faststart).
  // ──────────────────────────────────────────────
  cover: {
    groomName: "Hoàng Phúc",
    brideName: "Hồng Vân",
    locationLine: "BIỂN ĐỒ SƠN, HẢI PHÒNG",
    videoSources: [
      { src: "assets/videos/ocean_waves_background.mp4", type: "video/mp4" },
      // Optional modern format (add file before enabling):
      // { src: "assets/videos/ocean_waves_background.webm", type: "video/webm" },
    ],
    videoUrl: "assets/videos/ocean_waves_background.mp4",
    posterImage: "assets/images/ocean_waves_background.png",
    backgroundImage: "assets/images/ocean_waves_background.png",
  },

  // ──────────────────────────────────────────────
  // UNTIL THE BIG DAY (countdown + welcome)
  // ──────────────────────────────────────────────
  untilTheDay: {
    backgroundImage: PLACEHOLDER_IMAGE,
    heading: "Thời gian cho đến ngày cưới",
    labels: {
      days: "Ngày",
      hours: "Giờ",
      minutes: "Phút",
      seconds: "Giây",
    },
    message:
      "Chúng mình rất vui mừng được chia sẻ ngày trọng đại này cùng bạn. Tại đây, bạn sẽ tìm thấy mọi thông tin về buổi lễ và tiệc cưới của chúng mình.",
  },

  // ──────────────────────────────────────────────
  // SAVE THE DATE (elegant date display)
  // ──────────────────────────────────────────────
  saveTheDate: {
    backgroundImage: PLACEHOLDER_IMAGE,
    line1: "Lưu",
    line2: "lại",
    line3: "ngày\nvui",
    timeLine: "3 GIỜ CHIỀU",
  },

  // ──────────────────────────────────────────────
  // WEDDING TIMELINE
  // ──────────────────────────────────────────────
  timeline: {
    subtitle: "Chương trình",
    heading: "Lễ cưới",
    items: [
      {
        time: "15:00",
        label: "TIỆC TRÀ CẠNH BIỂN",
        iconSrc: "assets/images/timeline-icons/cocktail-hour.svg",
        iconAlt: "Biểu tượng tiệc trà view biển",
      },
      {
        time: "17:00",
        label: "LỄ THÀNH HÔN",
        iconSrc: "assets/images/timeline-icons/wedding-rings.svg",
        iconAlt: "Biểu tượng lễ thành hôn",
      },
      {
        time: "17:30",
        label: "TIỆC CƯỚI PHÚC VÂN",
        iconSrc: "assets/images/timeline-icons/wedding-lunch.svg",
        iconAlt: "Biểu tượng tiệc cưới",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // GALLERY
  // ──────────────────────────────────────────────
  gallery: {
    title: "Kỷ niệm của chúng mình",
    images: [
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 1" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 2" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 3" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 4" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 5" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 6" },
    ],
    horizontalImages: [
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 7" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 8" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 9" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 10" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 11" },
      { src: PLACEHOLDER_IMAGE, alt: "Ảnh cưới Phuc và Van - 12" },
    ],
  },

  // ──────────────────────────────────────────────
  // LOCATION (Google Maps + sketch map)
  // ──────────────────────────────────────────────
  location: {
    backgroundImage: PLACEHOLDER_IMAGE,
    heading: "Địa điểm",
    venueName: "KHÁCH SẠN HOLIDAY",
    venueAddress: "Trong Hòn Dáu Resort, Đồ Sơn, Hải Phòng",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Kh%C3%A1ch%20s%E1%BA%A1n%20Holiday%20H%C3%B2n%20D%E1%BA%A5u%20Resort%2C%20%C4%90%E1%BB%93%20S%C6%A1n%2C%20H%E1%BA%A3i%20Ph%C3%B2ng&output=embed",
    mapLinkText: "Mở trên Google Maps",
    mapLinkHref: "https://maps.app.goo.gl/SRDaoq3A8kUVkyg37",
    sketchHeading: "SƠ ĐỒ NỘI BỘ",
    sketchMapImage: "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png",
    sketchMapAlt: "Sơ đồ chỉ dẫn nội bộ",
    sketchMapCaption: "Sơ đồ chỉ dẫn lối đi trong khu vực tổ chức",
  },

  // ──────────────────────────────────────────────
  // WISHES / GUESTBOOK
  // ──────────────────────────────────────────────
  wishes: {
    backgroundImage: PLACEHOLDER_IMAGE,
    heading: "Gửi lời chúc đến cặp đôi",
    nameLabel: "Tên của bạn",
    namePlaceholder: "Tên của bạn",
    messageLabel: "Lời nhắn gửi",
    messagePlaceholder: "Lời nhắn gửi",
    submitText: "Gửi lời chúc",
    submittingText: "Đang gửi...",
    submittedText: "Đã gửi",
    successMessage: "Lời chúc của bạn đã được gửi đến cô dâu và chú rể!",
    errorMessage: "Có lỗi xảy ra, vui lòng thử lại!",
  },

  // ──────────────────────────────────────────────
  // GIFTS / MONEY TRANSFER
  // ──────────────────────────────────────────────
  gifts: {
    heading: "Mừng cưới",
    subtitle: "Gửi quà tặng đến cô dâu & chú rể",
    groom: {
      label: "NHÀ TRAI",
      subtitle: "Bố: Lê Tự Khanh - Mẹ: Nguyễn Thị Thanh Thủy<br><em>Chú rể: Lê Hoàng Phúc</em><br><span class=\"gifts__card-cta\">(Bấm vào đây để gửi quà)</span>",
      name: "NGUYEN VAN PHUC",
      bank: "Vietcombank",
      accountNumber: "0123456789",
      qrImage: PLACEHOLDER_IMAGE,
    },
    bride: {
      label: "NHÀ GÁI",
      subtitle: "Bố: Nguyễn Trung Toản - Mẹ: Đặng Thị Thắng<br><em>Cô dâu: Nguyễn Thị Hồng Vân</em><br><span class=\"gifts__card-cta\">(Bấm vào đây để gửi quà)</span>",
      name: "NGUYEN THI VAN",
      bank: "Vietcombank",
      accountNumber: "0123456789",
      qrImage: PLACEHOLDER_IMAGE,
    },
  },

  // ──────────────────────────────────────────────
  // RSVP
  // ──────────────────────────────────────────────
  rsvp: {
    heading: "Xác nhận tham dự",
    description: "",
    guestNameLabel: "Tên Khách Mời",
    guestNamePlaceholder: "Tên Khách Mời",
    attendanceLegend: "Xác nhận",
    attendanceOptions: [
      { value: "yes", label: "Có, tôi sẽ đến!" },
      { value: "no", label: "Xin lỗi, tôi không tham dự được!" },
    ],
    submitText: "Xác nhận",
    submittingText: "Đang gửi...",
    submittedText: "Đã xác nhận",
    validationError: "Vui lòng điền đầy đủ thông tin!",
    successMessage: "Chúng mình xin chân thành cảm ơn!",
    errorMessage: "Có lỗi xảy ra, vui lòng thử lại!",
  },

  // ──────────────────────────────────────────────
  // CONTACT INFO
  // ──────────────────────────────────────────────
  contactInfo: {
    heading: "Thông Tin Liên Lạc",
    phone: "0913041410",
    name: "Lê Tự Khanh",
  },

  // ──────────────────────────────────────────────
  // THANK YOU
  // ──────────────────────────────────────────────
  thankYou: {
    backgroundImage: PLACEHOLDER_IMAGE,
    heading: "Trân trọng cảm ơn",
    message: "Sự xuất hiện của bạn là niềm vui của chúng tôi!",
  },

  // ──────────────────────────────────────────────
  // HEADING ICONS (Remix Icons prepended by selector)
  // ──────────────────────────────────────────────
  headingIcons: {
    ".until__heading": "ri-time-line",
    ".gallery__title": "ri-image-line",
    ".save-date__line3": "ri-calendar-check-line",
    ".timeline__heading": "ri-calendar-event-line",
    ".location__heading": "ri-map-pin-line",
    ".rsvp__heading": "ri-mail-send-line",
    ".wishes__heading": "ri-chat-heart-line",
    ".gifts__heading": "ri-gift-2-line",
    ".contact-info__heading": "ri-phone-line",
    ".thank-you__heading": "ri-hearts-line",
  },

  // ──────────────────────────────────────────────
  // AUTO-SCROLL HINT (helps users discover scrollable content)
  // Starts after cover text fades in, stops on first user interaction
  // ──────────────────────────────────────────────
  autoScrollHint: {
    enabled: true,
    bufferAfterFadeMs: 500,
    speedPxPerSec: 80,
  },

  // ──────────────────────────────────────────────
  // API — Google Apps Script Web App
  // Replace the URL below with your deployed Apps Script URL
  // (see backend/Code.gs for full setup instructions)
  // ──────────────────────────────────────────────
  api: {
    baseUrl: "https://script.google.com/macros/s/AKfycbxyAjfENKitNWb7mIQjkmVOQYToYsRBquUgb3gnrdn2VYph95bgkDPus6SVDMm447tS/exec",
  },
};
