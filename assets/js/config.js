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
    title: "Long Nhật – Thanh Hiền | Wedding Invitation",
    description: "Thiệp cưới Long Nhật & Thanh Hiền - Wedding Invitation",
  },

  // ──────────────────────────────────────────────
  // COUPLE
  // ──────────────────────────────────────────────
  couple: {
    groom: {
      shortName: "Long Nhật",
      fullName: "Lê Long Nhật",
      dob: "13/09/2000",
      dobISO: "2000-09-13",
      image: "assets/images/groom.jpg",
      imageAlt: "Chú rể - Lê Long Nhật",
    },
    bride: {
      shortName: "Thanh Hiền",
      fullName: "Vũ Thị Thanh Hiền",
      dob: "04/02/1999",
      dobISO: "1999-02-04",
      image: "assets/images/bride.jpg",
      imageAlt: "Cô dâu - Vũ Thị Thanh Hiền",
    },
  },

  // ──────────────────────────────────────────────
  // HERO / HEADER
  // ──────────────────────────────────────────────
  hero: {
    backgroundImage: "assets/images/hero-bg.jpg",
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
    backgroundImage: "assets/images/countdown-bg.jpg",
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
    backgroundImage: "assets/images/love-story-bg.jpg",
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
      { src: "assets/images/gallery-01.jpg", alt: "Ảnh cưới Long Nhật và Thanh Hiền - 1" },
      { src: "assets/images/gallery-02.jpg", alt: "Ảnh cưới Long Nhật và Thanh Hiền - 2" },
      { src: "assets/images/gallery-03.jpg", alt: "Ảnh cưới Long Nhật và Thanh Hiền - 3" },
      { src: "assets/images/gallery-04.jpg", alt: "Ảnh cưới Long Nhật và Thanh Hiền - 4" },
      { src: "assets/images/gallery-05.jpg", alt: "Ảnh cưới Long Nhật và Thanh Hiền - 5" },
      { src: "assets/images/gallery-06.jpg", alt: "Ảnh cưới Long Nhật và Thanh Hiền - 6" },
    ],
  },

  // ──────────────────────────────────────────────
  // WISHES / GUESTBOOK
  // ──────────────────────────────────────────────
  wishes: {
    backgroundImage: "assets/images/wishes-bg.jpg",
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
    backgroundImage: "assets/images/thankyou-bg.jpg",
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
  // API ENDPOINTS (placeholder URLs for backend)
  // ──────────────────────────────────────────────
  api: {
    wishesGet: "/api/wishes",
    wishesPost: "/api/wishes",
    rsvpPost: "/api/rsvp",
  },
};
