/**
 * Wedding Card Configuration
 *
 * All text content, image paths, and data values are centralized here
 * for easy modification. Change any value below to customize the card.
 */

// Default placeholder used until real photos are provided
const PLACEHOLDER_IMAGE = "assets/images/placeholder.jpg";
const UNTIL_THE_BIG_DAY_IMAGE =
  "assets/images/phuc_van_pics/phuc_van_1/Album 30 x 30 Phuc Van/HL.jpg";
const SAVE_THE_DATE_IMAGE =
  "assets/images/phuc_van_pics/phuc_van_1/DSC_6293.jpg";
const LOCATION_IMAGE = "assets/images/hon_dau_resort.jpg";
const WISHES_IMAGE = "assets/images/phuc_van_pics/phuc_van_1/BRS06403.jpg";
const THANK_YOU_IMAGE =
  "assets/images/phuc_van_pics/phuc_van_1/Album 30 x 30 Phuc Van/G.jpg";

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
    heading: "Lễ Cưới",
    inviteTitle: "Trân trọng kính mời",
    inviteLine: "Tham dự lễ cưới của chúng mình",
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
    backgroundImage: UNTIL_THE_BIG_DAY_IMAGE,
    heading: "Đếm ngược cùng chúng mình nhé",
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
    backgroundImage: SAVE_THE_DATE_IMAGE,
    heading: "Hẹn gặp bạn vào ngày",
    timeLine: "3 giờ chiều",
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
    backgroundImage: LOCATION_IMAGE,
    heading: "Địa điểm",
    venueName: "KHÁCH SẠN HOLIDAY",
    venueAddress: "Trong Hòn Dáu Resort, Đồ Sơn, Hải Phòng",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=Kh%C3%A1ch%20s%E1%BA%A1n%20Holiday%20H%C3%B2n%20D%E1%BA%A5u%20Resort%2C%20%C4%90%E1%BB%93%20S%C6%A1n%2C%20H%E1%BA%A3i%20Ph%C3%B2ng&z=13&output=embed",
    mapLinkText: "Mở trên Google Maps",
    mapLinkHref: "https://maps.app.goo.gl/SRDaoq3A8kUVkyg37",
    sketchHeading: "SƠ ĐỒ NỘI BỘ",
    sketchMapImage:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png",
    sketchMapAlt: "Sơ đồ chỉ dẫn nội bộ",
    sketchMapCaption: "Sơ đồ chỉ dẫn lối đi trong khu vực tổ chức",
  },

  // ──────────────────────────────────────────────
  // WISHES / GUESTBOOK
  // ──────────────────────────────────────────────
  wishes: {
    backgroundImage: WISHES_IMAGE,
    heading: "Gửi lời chúc đến chúng mình nhé",
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
    heading: "Gửi gắm yêu thương",
    subtitle:
      "Nếu bạn muốn gửi thêm một chút bất ngờ để tiếp sức cho hành trình mới của chúng mình, bạn có thể gửi qua đây nhé!",
    groom: {
      label: "CHÚ RỂ\nHOÀNG PHÚC",
      subtitle:
        'Bố: Lê Tự Khanh - Mẹ: Nguyễn Thị Thanh Thủy<br><em>Chú rể: Lê Hoàng Phúc</em><br><span class="gifts__card-cta">(Bấm vào đây để gửi quà)</span>',
      name: "NGUYEN VAN PHUC",
      bank: "Vietcombank",
      accountNumber: "0123456789",
      qrImage: PLACEHOLDER_IMAGE,
    },
    bride: {
      label: "CÔ DÂU\nHỒNG VÂN",
      subtitle:
        'Bố: Nguyễn Trung Toản - Mẹ: Đặng Thị Thắng<br><em>Cô dâu: Nguyễn Thị Hồng Vân</em><br><span class="gifts__card-cta">(Bấm vào đây để gửi quà)</span>',
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
    backgroundImage: THANK_YOU_IMAGE,
    heading: "Trân trọng cảm ơn",
    message: "Sự hiện diện của bạn là niềm vui của chúng mình!",
  },

  // ──────────────────────────────────────────────
  // HEADING ICONS (Remix Icons prepended by selector)
  // ──────────────────────────────────────────────
  headingIcons: {
    ".family__heading": "ri-heart-3-line",
    ".until__heading": "ri-hourglass-line",
    ".gallery__title": "ri-gallery-line",
    ".save-date__title": "ri-calendar-check-line",
    ".timeline__heading": "ri-time-line",
    ".location__heading": "ri-map-pin-line",
    ".rsvp__heading": "ri-checkbox-circle-line",
    ".wishes__heading": "ri-chat-heart-line",
    ".gifts__heading": "ri-gift-2-line",
    ".contact-info__heading": "ri-phone-line",
    ".thank-you__heading": "ri-hand-heart-line",
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
    baseUrl:
      "https://script.google.com/macros/s/AKfycbxyAjfENKitNWb7mIQjkmVOQYToYsRBquUgb3gnrdn2VYph95bgkDPus6SVDMm447tS/exec",
  },
};
