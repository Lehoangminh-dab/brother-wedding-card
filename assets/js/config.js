/**
 * Wedding Card Configuration
 *
 * All text content, image paths, and data values are centralized here
 * for easy modification. Change any value below to customize the card.
 */

const WEDDING_CONFIG = {

  // ──────────────────────────────────────────────
  // META / PAGE-LEVEL
  // ──────────────────────────────────────────────
  meta: {
    title: "Phuc – Van | Wedding Invitation",
    description: "Thiệp cưới Phuc & Van - Wedding Invitation",
  },

  // ──────────────────────────────────────────────
  // COUPLE (names used on cover only)
  // ──────────────────────────────────────────────
  couple: {
    groom: { shortName: "Phuc" },
    bride: { shortName: "Van" },
  },

  // ──────────────────────────────────────────────
  // COVER (opening section: names + date only)
  // Canva-style: looped video bg, staggered text animations
  // Uses hero date values. Set videoUrl for looped video, or backgroundImage as fallback
  // ──────────────────────────────────────────────
  cover: {
    videoUrl: "https://assets.mixkit.co/videos/48527/48527-720.mp4", // aerial ocean waves; leave "" for image only
    posterImage: "", // optional poster before video loads
    backgroundImage: "", // fallback when no video; leave empty to use hero.backgroundImage
    // Canva-style date format; leave empty to build from hero
    dateLine1: "Thứ Năm, 28 Tháng 5 Năm 2026",
    dateLine2: "11h00",
  },

  // ──────────────────────────────────────────────
  // HERO / HEADER
  // ──────────────────────────────────────────────
  hero: {
    backgroundImage: "assets/images/placeholder.jpg",
    dayOfWeek: "Thứ Hai",
    day: "12",
    time: "11h00",
    monthYear: "01.2026",
    venueLabel: "Địa điểm tổ chức",
    venueName: "Trung tâm Tổ chức sự kiện Bách Đại Dũng",
    venueAddress: "TDP 6, xã Hương Sơn, tỉnh Hà Tĩnh",
    actionButtons: [
      { type: "phone", icon: "ri-phone-fill", href: "tel:+84", ariaLabel: "Gọi điện" },
      { type: "gift", icon: "ri-gift-2-fill", href: "#wishes", ariaLabel: "Gửi lời chúc" },
      { type: "map", icon: "ri-map-2-line", href: "https://maps.app.goo.gl/TmKBaF94cfrp9q8V7?g_st=ipc", ariaLabel: "Xem bản đồ", external: true },
    ],
  },

  // ──────────────────────────────────────────────
  // UNTIL THE BIG DAY (countdown + welcome)
  // ──────────────────────────────────────────────
  untilTheDay: {
    backgroundImage: "assets/images/placeholder.jpg",
    dateLine: "Thứ Hai, 12 Tháng 1",
    heading: "Until The Big Day!",
    weddingDateISO: "2026-01-12T11:00:00+07:00",
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
    backgroundImage: "assets/images/placeholder.jpg",
    line1: "Save",
    line2: "the",
    line3: "Date",
    dateLine: "Thứ Hai, 12 Tháng 1",
    timeLine: "11 giờ sáng",
  },

  // ──────────────────────────────────────────────
  // WEDDING TIMELINE
  // ──────────────────────────────────────────────
  timeline: {
    subtitle: "Timeline",
    heading: "Wedding Day",
    items: [
      { time: "10:00", label: "Đón khách" },
      { time: "10:30", label: "Lễ thành hôn" },
      { time: "11:00", label: "Tiệc cưới" },
      { time: "12:00", label: "Cắt bánh" },
      { time: "13:00", label: "Tiệc trà" },
    ],
  },

  // ──────────────────────────────────────────────
  // EVENTS
  // ──────────────────────────────────────────────
  events: [
    {
      title: "Lễ ăn hỏi & Lễ Cưới tại nhà gái",
      location: "Nhà văn hóa thôn Tòng Chú 3 - xã Cốc San, tỉnh Lào Cai",
      time: "10:30",
      dayOfWeek: "Thứ Bảy",
      day: "10",
      month: "01",
      year: "2026",
      dateISO: "2026-01-10",
      lunar: "(22/11 Âm lịch)",
      rsvpValue: "nha-gai",
    },
    {
      title: "Lễ thành hôn nhà trai",
      location: "Trung tâm Tổ chức sự kiện Bách Đại Dũng - TDP 6, xã Hương Sơn, tỉnh Hà Tĩnh",
      time: "11:00",
      dayOfWeek: "Thứ Hai",
      day: "12",
      month: "01",
      year: "2026",
      dateISO: "2026-01-12",
      lunar: "(24/11 Âm lịch)",
      rsvpValue: "nha-trai",
    },
  ],

  // ──────────────────────────────────────────────
  // GALLERY
  // ──────────────────────────────────────────────
  gallery: {
    tagline: "cherish every",
    title: "our moment",
    images: [
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 1" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 2" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 3" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 4" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 5" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 6" },
    ],
  },

  // ──────────────────────────────────────────────
  // WISHES / GUESTBOOK
  // ──────────────────────────────────────────────
  wishes: {
    backgroundImage: "assets/images/placeholder.jpg",
    heading: "Gửi lời chúc đến cặp đôi",
    formTitle: "Gửi lời chúc",
    nameLabel: "Tên của bạn",
    namePlaceholder: "Tên của bạn",
    messageLabel: "Lời nhắn gửi",
    messagePlaceholder: "Lời nhắn gửi",
    submitText: "Gửi lời chúc",
    successMessage: "Lời chúc của bạn đã được gửi đến cô dâu và chú rể!",
  },

  // ──────────────────────────────────────────────
  // GIFTS / MONEY TRANSFER
  // ──────────────────────────────────────────────
  gifts: {
    backgroundImage: "assets/images/placeholder.jpg",
    heading: "Mừng cưới",
    subtitle: "Gửi quà tặng đến cô dâu & chú rể",
    groom: {
      label: "Chú rể",
      name: "NGUYEN VAN PHUC",
      bank: "Vietcombank",
      accountNumber: "0123456789",
      qrImage: "assets/images/placeholder.jpg",
    },
    bride: {
      label: "Cô dâu",
      name: "NGUYEN THI VAN",
      bank: "Vietcombank",
      accountNumber: "0123456789",
      qrImage: "assets/images/placeholder.jpg",
    },
  },

  // ──────────────────────────────────────────────
  // RSVP
  // ──────────────────────────────────────────────
  rsvp: {
    heading: "Xác nhận tham dự",
    description: "Hãy cho chúng tôi biết bạn sẽ đến tham dự nhé!",
    guestNameLabel: "Tên Khách Mời",
    guestNamePlaceholder: "Tên Khách Mời",
    attendanceLegend: "Xác nhận",
    attendanceOptions: [
      { value: "yes", label: "Có tôi sẽ đến" },
      { value: "no", label: "Xin Lỗi tôi không tham dự được !" },
    ],
    submitText: "Xác nhận",
  },

  // ──────────────────────────────────────────────
  // THANK YOU
  // ──────────────────────────────────────────────
  thankYou: {
    backgroundImage: "assets/images/placeholder.jpg",
    heading: "Thank you",
    message: "Sự xuất hiện của bạn là niềm vui đối với chúng tôi!",
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
