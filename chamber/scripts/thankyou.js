// ============================================
// ABUJA CHAMBER OF COMMERCE - THANK YOU PAGE JAVASCRIPT
// ============================================

// DOM Elements
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

// ============================================
// DISPLAY FORM DATA FROM URL PARAMETERS
// ============================================

function displayFormData() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Extract form data
  const firstName = urlParams.get("firstName") || "";
  const lastName = urlParams.get("lastName") || "";
  const email = urlParams.get("email") || "";
  const phone = urlParams.get("phone") || "";
  const orgName = urlParams.get("orgName") || "";
  const timestamp = urlParams.get("timestamp") || "";

  // Display data in the page
  document.getElementById(
    "displayName"
  ).textContent = `${firstName} ${lastName}`;
  document.getElementById("displayEmail").textContent = email;
  document.getElementById("displayPhone").textContent = phone;
  document.getElementById("displayOrg").textContent = orgName;

  // Format and display timestamp
  if (timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    document.getElementById("displayTimestamp").textContent =
      date.toLocaleDateString("en-US", options);
  }
}

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// Close menu when clicking a nav link
const navLinks = document.querySelectorAll(".nav-menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// ============================================
// FOOTER DATE FUNCTIONS
// ============================================

function updateFooterDates() {
  // Update current year
  const currentYearSpan = document.getElementById("currentYear");
  const currentYear = new Date().getFullYear();
  if (currentYearSpan) {
    currentYearSpan.textContent = currentYear;
  }

  // Update last modified date
  const lastModifiedSpan = document.getElementById("lastModified");
  const lastModified = new Date(document.lastModified);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = lastModified.toLocaleDateString(
      "en-US",
      options
    );
  }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Display form data from URL
  displayFormData();

  // Update footer dates
  updateFooterDates();

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
