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
  // COUPLE
  // ──────────────────────────────────────────────
  couple: {
    groom: {
      shortName: "Phuc",
      fullName: "Lê Hoàng Phúc",
      dob: "13/09/2000",
      dobISO: "2000-09-13",
      image: "assets/images/placeholder.jpg",
      imageAlt: "Chú rể - Lê Hoàng Phúc",
    },
    bride: {
      shortName: "Van",
      fullName: "Nguyễn Thị Hồng Vân",
      dob: "04/02/1999",
      dobISO: "1999-02-04",
      image: "assets/images/placeholder.jpg",
      imageAlt: "Cô dâu - Nguyễn Thị Hồng Vân",
    },
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
    dateLine1: "Thứ Hai, 12 Tháng 1",
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
  // COUNTDOWN
  // ──────────────────────────────────────────────
  countdown: {
    backgroundImage: "assets/images/placeholder.jpg",
    heading: "SAVE THE DATE",
    weddingDateISO: "2026-01-12T11:00:00+07:00",
    labels: {
      days: "Ngày",
      hours: "Giờ",
      minutes: "Phút",
      seconds: "Giây",
    },
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
  // LOVE STORY
  // ──────────────────────────────────────────────
  loveStory: {
    backgroundImage: "assets/images/placeholder.jpg",
    heading: "Love Story",
    milestones: [
      {
        dateDisplay: "01/03/2019",
        dateISO: "2019-03-01",
        title: "Ngày đầu hẹn hò",
        description: "",
      },
      {
        dateDisplay: "11/08/2025",
        dateISO: "2025-08-11",
        title: "Ngày cầu hôn",
        description: "Anh nói đã đến lúc chúng ta cùng nhau bước sang 1 trang mới của cuộc đời",
      },
      {
        dateDisplay: "12/01/2026",
        dateISO: "2026-01-12",
        title: "Ngày thành hôn",
        description: "Chúng mình chính thức về chung một nhà",
      },
    ],
  },

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
    initialWishes: [
      {
        author: "Phương Nguyễn",
        message:
          "Chúc bạn thân của tao lấy một chồng, đẻ hai con đủ nếp đủ tẻ, sống ở nhà ba tầng, mua xe 4 bánh nhé. Phải thật hạnh phúc mày nhé! Hi hi.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // RSVP
  // ──────────────────────────────────────────────
  rsvp: {
    heading: "Xác nhận tham dự",
    description: "Hãy cho chúng tôi biết bạn sẽ đến tham dự nhé!",
    eventLegend: "Chọn sự kiện",
    guestNameLabel: "Tên Khách Mời",
    guestNamePlaceholder: "Tên Khách Mời",
    attendanceLegend: "Xác nhận",
    attendanceOptions: [
      { value: "yes", label: "Có tôi sẽ đến" },
      { value: "no", label: "Xin Lỗi tôi không tham dự được !" },
    ],
    guestCountLegend: "Số người tham dự",
    guestCountOptions: [
      { value: "1", label: "1 Người" },
      { value: "2", label: "2 Người" },
      { value: "3", label: "3 Người" },
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
  // FOOTER
  // ──────────────────────────────────────────────
  footer: {
    shareTitle: "Chia sẻ thiệp",
    shareLinks: [
      { platform: "facebook", label: "Facebook", ariaLabel: "Chia sẻ qua Facebook", url: "#" },
      { platform: "zalo", label: "Zalo", ariaLabel: "Chia sẻ qua Zalo", url: "#" },
      { platform: "copy", label: "Sao chép liên kết", ariaLabel: "Sao chép liên kết", url: "#" },
    ],
  },

  // ──────────────────────────────────────────────
  // AUDIO / BACKGROUND MUSIC
  // ──────────────────────────────────────────────
  audio: {
    src: "assets/audio/wedding-music.mp3",
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
