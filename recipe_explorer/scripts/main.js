/* ===============================================
   MAIN.JS - NAVIGATION, HAMBURGER MENU, WAYFINDING
   Recipe Explorer Project
   =============================================== */

// === HAMBURGER MENU FUNCTIONALITY ===
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav ul");
  const navLinks = document.querySelectorAll("nav ul li a");

  if (!hamburger || !nav) return;

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = nav.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !hamburger.contains(e.target) &&
      !nav.contains(e.target) &&
      nav.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// === WAYFINDING - HIGHLIGHT ACTIVE PAGE (REMOVED) ===
function initWayfinding() {
  // Wayfinding removed per user request
  // No active state highlighting on navigation
}

// === TYPING TEXT ANIMATION ===
function initTypingText() {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement) return;

  const texts = ["Recipe explorer...", "Begin your culinary journey today..."];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentText = texts[textIndex];

    if (!isDeleting && charIndex <= currentText.length) {
      // Typing forward
      typingElement.textContent = currentText.substring(0, charIndex);
      charIndex++;
      setTimeout(type, 100);
    } else if (isDeleting && charIndex >= 0) {
      // Deleting
      typingElement.textContent = currentText.substring(0, charIndex);
      charIndex--;
      setTimeout(type, 50);
    } else if (!isDeleting && charIndex > currentText.length) {
      // Pause at end before deleting
      if (!isPaused) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, 2000);
      }
    } else if (isDeleting && charIndex < 0) {
      // Move to next text
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    }
  }

  // Start typing animation
  type();
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Only handle non-empty hash links
      if (href !== "#" && href !== "") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// === UPDATE FOOTER YEAR ===
function updateFooterYear() {
  const yearElement = document.querySelector(".current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// === LOCAL STORAGE - USER PREFERENCES ===
function initLocalStorage() {
  // Store user's last visit
  const lastVisit = localStorage.getItem("lastVisit");
  const currentVisit = new Date().toISOString();

  if (lastVisit) {
    console.log(
      "Welcome back! Last visit:",
      new Date(lastVisit).toLocaleDateString()
    );
  } else {
    console.log("Welcome to Recipe Explorer!");
  }

  localStorage.setItem("lastVisit", currentVisit);

  // Store current page view
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  localStorage.setItem("lastPage", currentPage);
}

// === DOM MANIPULATION - ADD LOADING INDICATOR ===
function showLoading(container) {
  if (!container) return;

  container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// === INITIALIZE ALL ON PAGE LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initWayfinding();
  initSmoothScroll();
  updateFooterYear();
  initLocalStorage();
  initTypingText();

  console.log("Recipe Explorer initialized successfully! 🍳");
});

// === EXPORT FUNCTIONS FOR USE IN OTHER MODULES ===
export {
  initHamburgerMenu,
  initWayfinding,
  initTypingText,
  showLoading,
  initLocalStorage,
};

