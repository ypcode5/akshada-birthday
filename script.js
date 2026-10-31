document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // CONFIGURATION
  // ========================================

  const WORKER_URL =
    "https://white-art-f109.yogeshpimpare5.workers.dev";

  const TOTAL_SLIDES = 8;

  let currentSlide = 1;
  let candlesBlown = false;
  let musicPlaying = false;
  let selectedCorrectAnswer = false;
  let toastTimeout;

  // ========================================
  // ELEMENTS
  // ========================================

  const slides = document.querySelectorAll(".slide");
  const progressBar = document.getElementById("progressBar");
  const slideCounter = document.getElementById("slideCounter");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const navDots = document.getElementById("navDots");

  const musicBtn = document.getElementById("musicBtn");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");
  const birthdayMusic = document.getElementById("birthdayMusic");

  const heartLayer = document.getElementById("heartLayer");
  const sparkleLayer = document.querySelector(".sparkle-layer");
  const toast = document.getElementById("toast");

  const blowBtn = document.getElementById("blowBtn");
  const cakeMessage = document.getElementById("cakeMessage");

  const quizOptions = document.querySelectorAll(".quiz-option");
  const quizMessage = document.getElementById("quizMessage");
  const quizNext = document.getElementById("quizNext");

  const wishForm = document.getElementById("wishForm");
  const wishStatus = document.getElementById("wishStatus");
  const sendWishBtn = document.getElementById("sendWishBtn");

  const restartBtn = document.getElementById("restartBtn");

  // ========================================
  // WEBSITE NOTIFICATIONS
  // ========================================

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // ========================================
  // TELEGRAM BUTTON NOTIFICATIONS
  // ========================================

  async function sendButtonNotification(buttonName) {

    const message =
      "🔔 BUTTON CLICKED\n\n" +
      "🎀 Website: Akshada Birthday\n" +
      "🔘 Button: " + buttonName + "\n" +
      "📄 Slide: " + currentSlide;

    try {

      const response = await fetch(
        `${WORKER_URL}/notify?event=${encodeURIComponent(message)}`,
        { method: "GET" }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        console.error("Telegram notification error:", result);
        return;
      }

      console.log("Telegram notification sent:", buttonName);

    } catch (error) {
      console.error("Telegram notification failed:", error);
    }
  }

  // Capture button presses, including dynamically created navigation dots.
  // Capture phase runs before the individual button handlers.
  document.addEventListener("click", (event) => {

    const button = event.target.closest("button");

    if (!button || button.disabled) return;

    let buttonName = button.textContent.trim().replace(/\s+/g, " ");

    if (button.id === "musicBtn") {
      buttonName = "Music button";

    } else if (button.id === "blowBtn") {
      buttonName = "Blow candles button";

    } else if (button.id === "sendWishBtn") {
      buttonName = "Send birthday wish button";

    } else if (button.id === "restartBtn") {
      buttonName = "Restart button";

    } else if (button.id === "prevBtn") {
      buttonName = "Back button";

    } else if (button.id === "nextBtn") {
      buttonName = "Next button";

    } else if (button.classList.contains("quiz-option")) {
      buttonName = "Quiz answer: " + buttonName;

    } else if (button.classList.contains("nav-dot")) {
      buttonName = "Navigation dot clicked";

    }

    sendButtonNotification(buttonName);

  }, true);

  // ========================================
  // SLIDE NAVIGATION
  // ========================================

  function showSlide(number) {

    if (number < 1 || number > TOTAL_SLIDES) return;

    currentSlide = number;

    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === number - 1);
    });

    progressBar.style.width =
      `${(number / TOTAL_SLIDES) * 100}%`;

    slideCounter.textContent =
      `${String(number).padStart(2, "0")} / ${TOTAL_SLIDES}`;

    prevBtn.disabled = number === 1;
    nextBtn.disabled = number === TOTAL_SLIDES;

    document.querySelectorAll(".nav-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === number - 1);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function nextSlide() {

    if (currentSlide < TOTAL_SLIDES) {
      showSlide(currentSlide + 1);
      showToast("Another beautiful surprise awaits! 💗");
    }

  }

  function previousSlide() {

    if (currentSlide > 1) {
      showSlide(currentSlide - 1);
      showToast("Going back to a lovely moment! ♡");
    }

  }

  // Create navigation dots
  for (let i = 1; i <= TOTAL_SLIDES; i++) {

    const dot = document.createElement("button");

    dot.className = "nav-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i}`);

    dot.addEventListener("click", () => {
      showSlide(i);
      showToast(`Welcome to surprise ${i}! ✨`);
    });

    navDots.appendChild(dot);

  }

  prevBtn.addEventListener("click", previousSlide);
  nextBtn.addEventListener("click", nextSlide);

  document.querySelectorAll('[data-action="next"]').forEach(button => {
    button.addEventListener("click", nextSlide);
  });

  // ========================================
  // MUSIC
  // ========================================

  musicBtn.addEventListener("click", async () => {

    if (!musicPlaying) {

      try {

        await birthdayMusic.play();

        musicPlaying = true;
        musicIcon.textContent = "♫";
        musicLabel.textContent = "Music On";

        showToast("Music is playing! ♫");

      } catch (error) {

        showToast("Please check your music file.");

      }

    } else {

      birthdayMusic.pause();

      musicPlaying = false;
      musicIcon.textContent = "♪";
      musicLabel.textContent = "Music Off";

      showToast("Music paused ♡");

    }

  });

  // ========================================
  // BLOW CANDLES
  // ========================================

  blowBtn.addEventListener("click", () => {

    if (candlesBlown) {
      showToast("Your wish is already made! ❤️");
      return;
    }

    candlesBlown = true;

    document.querySelectorAll(".flame").forEach(flame => {
      flame.classList.add("off");
    });

    cakeMessage.textContent =
      "Your wish has been sent to the universe! ✨❤️";

    blowBtn.textContent = "Wish Made! ♡";
    blowBtn.disabled = true;

    showToast("Make a beautiful wish! 🎂");

    createConfetti();

  });

  // ========================================
  // QUIZ
  // ========================================

  quizNext.disabled = true;
  quizNext.style.opacity = "0.5";

  quizOptions.forEach(option => {

    option.addEventListener("click", () => {

      quizOptions.forEach(button => {
        button.classList.remove("selected");
      });

      option.classList.add("selected");

      if (option.dataset.answer === "correct") {

        selectedCorrectAnswer = true;

        quizMessage.textContent =
          "Correct! Your birthday deserves endless happiness! ❤️";

        quizNext.disabled = false;
        quizNext.style.opacity = "1";

        showToast("Correct answer! Well done! 💗");

        createConfetti();

      } else {

        selectedCorrectAnswer = false;

        quizMessage.textContent =
          "Try again! Your birthday deserves happiness! ♡";

        quizNext.disabled = true;
        quizNext.style.opacity = "0.5";

        showToast("Try another answer! 💕");

      }

    });

  });

  // ========================================
  // WISH FORM - TELEGRAM
  // ========================================

  wishForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
      document.getElementById("guestName").value.trim();

    const wish =
      document.getElementById("birthdayWish").value.trim();

    if (!name || !wish) {

      wishStatus.textContent = "Please fill in both fields.";

      showToast("Please complete both fields.");

      return;
    }

    sendWishBtn.disabled = true;
    sendWishBtn.textContent = "Sending...";

    wishStatus.textContent = "Sending your birthday wish... ♡";

    try {

      const response = await fetch(`${WORKER_URL}/wish`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: name,
          wish: wish
        })

      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to send wish");
      }

      wishStatus.textContent =
        "Your wish has been sent successfully! Thank you! ❤️";

      sendWishBtn.textContent = "Wish Sent ✓";

      showToast("Your wish has been received! 💌");

    } catch (error) {

      console.error("Wish submission error:", error);

      wishStatus.textContent =
        "Could not send your wish. Please try again.";

      sendWishBtn.disabled = false;
      sendWishBtn.textContent = "Send My Wish ♡";

      showToast("Sending failed. Please try again.");

    }

  });

  // ========================================
  // FLOATING HEARTS
  // ========================================

  const heartSymbols = ["♡", "💗", "💕", "💖", "♥"];

  function createFloatingHeart() {

    const heart = document.createElement("span");

    heart.className = "floating-heart";

    heart.textContent =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    heart.style.left = `${Math.random() * 100}%`;

    heart.style.fontSize =
      `${14 + Math.random() * 22}px`;

    heart.style.animationDuration =
      `${7 + Math.random() * 8}s`;

    heartLayer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 16000);

  }

  for (let i = 0; i < 12; i++) {
    setTimeout(createFloatingHeart, i * 350);
  }

  setInterval(createFloatingHeart, 900);

  // ========================================
  // SPARKLES
  // ========================================

  function createSparkle() {

    const sparkle = document.createElement("span");

    sparkle.className = "page-sparkle";

    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;

    sparkle.style.animationDuration =
      `${3 + Math.random() * 4}s`;

    sparkle.style.animationDelay =
      `${Math.random() * 2}s`;

    sparkleLayer.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 8000);

  }

  for (let i = 0; i < 25; i++) {
    createSparkle();
  }

  setInterval(createSparkle, 450);

  // ========================================
  // CONFETTI
  // ========================================

  function createConfetti() {

    const colors = [
      "#e779a7",
      "#f5b5d0",
      "#d9a5df",
      "#ffcfb3",
      "#ffffff"
    ];

    for (let i = 0; i < 65; i++) {

      const piece = document.createElement("span");

      piece.style.position = "fixed";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = "-15px";

      piece.style.width = `${5 + Math.random() * 7}px`;
      piece.style.height = `${8 + Math.random() * 9}px`;

      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.borderRadius = "3px";
      piece.style.zIndex = "30";
      piece.style.pointerEvents = "none";

      document.body.appendChild(piece);

      const animation = piece.animate([

        {
          transform: "translateY(0) rotate(0deg)",
          opacity: 1
        },

        {
          transform:
            `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 900}deg)`,
          opacity: 0
        }

      ], {

        duration: 2000 + Math.random() * 2500,
        easing: "ease-out"

      });

      animation.onfinish = () => piece.remove();

    }

  }

  // ========================================
  // RESTART EXPERIENCE
  // ========================================

  restartBtn.addEventListener("click", () => {

    candlesBlown = false;

    document.querySelectorAll(".flame").forEach(flame => {
      flame.classList.remove("off");
    });

    blowBtn.disabled = false;
    blowBtn.textContent = "Blow the Candles 🕯️";

    cakeMessage.textContent =
      "Your wish is waiting to come true ✨";

    selectedCorrectAnswer = false;

    quizOptions.forEach(option => {
      option.classList.remove("selected");
    });

    quizMessage.textContent = "";

    quizNext.disabled = true;
    quizNext.style.opacity = "0.5";

    wishForm.reset();

    wishStatus.textContent = "";

    sendWishBtn.disabled = false;
    sendWishBtn.textContent = "Send My Wish ♡";

    showSlide(1);

    createConfetti();

    showToast("Let's celebrate again! ❤️");

  });

  // ========================================
  // KEYBOARD NAVIGATION
  // ========================================

  document.addEventListener("keydown", event => {

    if (
      event.target.matches("input, textarea") ||
      event.target.isContentEditable
    ) {
      return;
    }

    if (event.key === "ArrowRight") {
      nextSlide();
    }

    if (event.key === "ArrowLeft") {
      previousSlide();
    }

  });

  // ========================================
  // INITIALIZE
  // ========================================

  showSlide(1);

  showToast("Welcome to your birthday surprise! ♡");

});