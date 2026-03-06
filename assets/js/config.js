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
  // COUPLE (names used on cover)
  // ──────────────────────────────────────────────
  couple: {
    groom: { shortName: "Phuc" },
    bride: { shortName: "Van" },
  },

  // ──────────────────────────────────────────────
  // WEDDING DATE (single source of truth)
  // All date displays derive from or reference this value
  // ──────────────────────────────────────────────
  weddingDate: "2026-01-12T11:00:00+07:00",

  // ──────────────────────────────────────────────
  // COVER (opening section: names + date)
  // Set videoUrl for looped video, or backgroundImage as fallback
  // ──────────────────────────────────────────────
  cover: {
    videoUrl: "https://assets.mixkit.co/videos/48527/48527-720.mp4",
    posterImage: "",
    backgroundImage: "assets/images/placeholder.jpg",
    dateLine: "Thứ Năm, 28 Tháng 5 Năm 2026",
  },

  // ──────────────────────────────────────────────
  // UNTIL THE BIG DAY (countdown + welcome)
  // ──────────────────────────────────────────────
  untilTheDay: {
    backgroundImage: "assets/images/placeholder.jpg",
    dateLine: "Thứ Hai, 12 Tháng 1",
    heading: "Until The Big Day!",
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
  // GALLERY
  // ──────────────────────────────────────────────
  gallery: {
    title: "Cherish our moments",
    images: [
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 1" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 2" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 3" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 4" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 5" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 6" },
    ],
    horizontalImages: [
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 7" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 8" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 9" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 10" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 11" },
      { src: "assets/images/placeholder.jpg", alt: "Ảnh cưới Phuc và Van - 12" },
    ],
  },

  // ──────────────────────────────────────────────
  // LOCATION (Google Maps + sketch map)
  // ──────────────────────────────────────────────
  location: {
    backgroundImage: "assets/images/placeholder.jpg",
    heading: "Địa điểm",
    venueName: "Trung tâm Tổ chức sự kiện Bách Đại Dũng",
    venueAddress: "TDP 6, xã Hương Sơn, tỉnh Hà Tĩnh",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Trung+t%C3%A2m+T%E1%BB%95+ch%E1%BB%A9c+s%E1%BB%B1+ki%E1%BB%87n+B%C3%A1ch+%C4%90%E1%BA%A1i+D%C5%A9ng+H%C6%B0%C6%A1ng+S%C6%A1n+H%C3%A0+T%C4%A9nh&output=embed",
    mapLinkText: "Mở trong Google Maps",
    mapLinkHref: "https://maps.app.goo.gl/TmKBaF94cfrp9q8V7?g_st=ipc",
    sketchHeading: "Sơ đồ nội bộ",
    sketchMapImage: "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png",
    sketchMapAlt: "Sơ đồ chỉ dẫn nội bộ",
    sketchMapCaption: "Sơ đồ chỉ dẫn lối đi trong khu vực tổ chức",
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
    submittingText: "Đang gửi...",
    submittedText: "Đã gửi",
    successMessage: "Lời chúc của bạn đã được gửi đến cô dâu và chú rể!",
    errorMessage: "Có lỗi xảy ra, vui lòng thử lại!",
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
    submittingText: "Đang gửi...",
    submittedText: "Đã xác nhận",
    validationError: "Vui lòng điền đầy đủ thông tin!",
    successMessage: "Chúng mình xin chân thành cám ơn!",
    errorMessage: "Có lỗi xảy ra, vui lòng thử lại!",
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
