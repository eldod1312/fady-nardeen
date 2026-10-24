const INVITE = {
  invitationId: "fady-nardeen-2026",
  slug: "fady-nardeen",
  shareUrl: window.location.href,
  weddingDate: "2026-11-09T18:00:00+02:00", // الساعة 6:00 مساءً يوم 9 نوفمبر 2026
  churchUrl: "https://maps.app.goo.gl/Zz2BpuQC9R6SToet7",
  hallUrl: "https://maps.app.goo.gl/TQJFhUevALJnQSH86"
};

const TRANSLATIONS = {
  ar: {
    verse: "«وَيَكُونُ الاثْنَانِ جَسَدًا وَاحِدًا»",
    verseRef: "مرقس ١٠ : ٨",
    announcement: "بكل فرح نعلن عن حفل زفافنا",
    dateShort: "٩ - ١١ - ٢٠٢٦",
    openBtn: "افتح الدعوة",
    weddingLabel: "حفل زفاف",
    fullDate: "الأثنين · ٩ نوفمبر ٢٠٢٦",
    weddingDay: "يوم الزفاف",
    receptionDay: "حفل الزفاف",
    dayNumber: "٩",
    monthYear: "نوفمبر<br>٢٠٢٦",
    churchEvent: "مراسم الإكليل",
    churchName: "كنيسة الأنبا شنودة",
    churchTime: "الساعة ٦:٠٠ مساءً",
    hallEvent: "حفل الزفاف",
    hallName: "قاعة الداون تاون",
    hallTime: "الساعة ٨:٠٠ مساءً",
    churchLocationTitle: "الإكليل",
    hallLocationTitle: "حفل الزفاف",
    openMap: "فتح اللوكيشن",
    googleMaps: "خرائط Google",
    countKicker: "موعدنا يقترب",
    countTitle: "العد التنازلي",
    days: "يوم",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثانية",
    calendarTitle: "نوفمبر ٢٠٢٦",
    addCalendar: "أضف إلى التقويم",
    copied: "تم نسخ رابط الدعوة",
    finalThanksUpper: "شكرًا لكم",
    finalTitle: "بكل الحب ",
    finalSub: "ننتظركم بكل حب لمشاركتنا فرحتنا  .",
  },
  en: {
    verse: "“AND THE TWO SHALL BECOME ONE FLESH.”",
    verseRef: "MARK 10:8",
    announcement: "WE JOYFULLY ANNOUNCE THE WEDDING OF",
    dateShort: "9 · 11 · 2026",
    openBtn: "OPEN INVITATION",
    weddingLabel: "WEDDING CELEBRATION",
    fullDate: "MONDAY · 9 NOVEMBER 2026",
    weddingDay: "WEDDING DAY",
    receptionDay: "WEDDING RECEPTION",
    dayNumber: "9",
    monthYear: "NOVEMBER<br>2026",
    churchEvent: "WEDDING CEREMONY",
    churchName: "ST. ANBA SHENOUDA CATHEDRAL",
    churchTime: "6:00 PM",
    hallEvent: "WEDDING RECEPTION",
    hallName: "DOWN TOWN HALL",
    hallTime: "8:00 PM",
    churchLocationTitle: "CEREMONY VENUE",
    hallLocationTitle: "RECEPTION VENUE",
    openMap: "OPEN LOCATION",
    googleMaps: "GOOGLE MAPS",
    countKicker: "COUNTING DOWN TO OUR DAY",
    countTitle: "COUNTDOWN",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    calendarTitle: "NOVEMBER 2026",
    addCalendar: "ADD TO CALENDAR",
    copied: "INVITATION LINK COPIED",
    finalThanksUpper: "THANK YOU",
    finalTitle: "With love and gratitude",
    finalSub: "We cannot wait to share this special day with you.",
  }
};

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
let heartTimer = null;
let currentLang = "ar";

function applyLanguage(lang){
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $$('[data-i18n]').forEach(element => {
    const value = t[element.dataset.i18n];
    if (value !== undefined) element.innerHTML = value;
  });
  const languageButton = $("#langBtn");
  if (languageButton) {
    languageButton.textContent = lang === "ar" ? "EN" : "عربي";
    languageButton.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
  }
  buildCalendar();
}

function createHeart(){
  const heart = document.createElement("span");
  heart.className = "fall-heart";
  heart.textContent = Math.random() > .5 ? "✦" : "✧";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${9 + Math.random() * 9}px`;
  heart.style.animationDuration = `${10 + Math.random() * 7}s`;
  const container = $("#heartsLayer");
  if (container) {
    container.appendChild(heart);
    window.setTimeout(() => heart.remove(), 17500);
  }
}

function openInvitation(){
  // 1. Instantly unhide the app structure layout wrapper
  $("#app").classList.remove("hidden");
  
  // 2. Trigger the smooth fade-out animation on the intro screen overlay
  $("#introScreen").classList.add("fade-out");
  
  // 3. Immediately reset scroll view position safely
  window.scrollTo(0, 0);
  
  // 4. Slight delay (200ms) to let the overlay start fading out before cleanly fading in the invitation data
  setTimeout(() => {
    $("#app").classList.add("activated");
    revealSections();
  }, 200);

  // 5. Clean up body scrolling states once everything finishes animating
  setTimeout(() => {
    document.body.classList.remove("intro-active");
  }, 1500); 
}



function revealSections(){
  const trigger = window.innerHeight * .9;
  $$(".reveal").forEach(section => {
    if (section.getBoundingClientRect().top < trigger) section.classList.add("visible");
  });
}

function updateCountdown(){
  const remaining = Math.max(0, new Date(INVITE.weddingDate).getTime() - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor(remaining / 3600000) % 24;
  const minutes = Math.floor(remaining / 60000) % 60;
  const seconds = Math.floor(remaining / 1000) % 60;
  if ($("#days")) $("#days").textContent = String(days).padStart(2, "0");
  if ($("#hours")) $("#hours").textContent = String(hours).padStart(2, "0");
  if ($("#minutes")) $("#minutes").textContent = String(minutes).padStart(2, "0");
  if ($("#seconds")) $("#seconds").textContent = String(seconds).padStart(2, "0");
}

function buildCalendar(){
  const grid = $("#calendarGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const weekdays = currentLang === "ar"
    ? ["ن","ث","ر","خ","ج","س","ح"]
    : ["Mo","Tu","We","Th","Fr","Sa","Su"];
  weekdays.forEach(day => {
    const cell = document.createElement("div");
    cell.className = "weekday";
    cell.textContent = day;
    grid.appendChild(cell);
  });
  // نوفمبر 2026 يبدأ بيوم الأحد (عجز 6 أيام قبل الإثنين)
  for (let i = 0; i < 6; i++) grid.appendChild(document.createElement("div"));
  for (let day = 1; day <= 30; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;
    if (day === 9) cell.className = "selected";
    grid.appendChild(cell);
  }
}

function setupCalendar(){
  const btn = $("#calendarBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Fady & Nardeen Wedding",
      dates: "20261109T160000Z/20261109T220000Z",
      details: `Wedding ceremony at St. Anba Shenouda Cathedral at 6:00 PM, followed by the reception at Down Town Hall at 8:00 PM.`,
      location: "St. Anba Shenouda Cathedral, Hurghada"
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener");
  });
}

$("#openBtn").addEventListener("click", openInvitation);
$("#langBtn").addEventListener("click", () => applyLanguage(currentLang === "ar" ? "en" : "ar"));

window.addEventListener("scroll", revealSections, { passive: true });
window.addEventListener("resize", revealSections, { passive: true });

setupCalendar();
applyLanguage("ar");
updateCountdown();
window.setInterval(updateCountdown, 1000);
heartTimer = window.setInterval(createHeart, 1900);