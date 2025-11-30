// ============================================
// ABUJA CHAMBER OF COMMERCE - DISCOVER PAGE
// ============================================

// Import places data
import placesOfInterest from "../data/discover-data.mjs";

// DOM Elements
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const placesGrid = document.getElementById("placesGrid");
const visitMessage = document.getElementById("visitMessage");

// ============================================
// DISPLAY PLACES OF INTEREST
// ============================================

function displayPlaces() {
  placesGrid.innerHTML = "";

  placesOfInterest.forEach((place) => {
    const card = createPlaceCard(place);
    placesGrid.appendChild(card);
  });
}

// ============================================
// CREATE PLACE CARD
// ============================================

function createPlaceCard(place) {
  const card = document.createElement("article");
  card.classList.add("place-card");

  card.innerHTML = `
        <h2>${place.name}</h2>
        <figure>
            <img src="images/${place.image}" 
                 alt="${place.name}" 
                 loading="lazy"
                 width="300" 
                 height="200">
            <span class="category-badge">${place.category}</span>
        </figure>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <button type="button">Learn More</button>
    `;

  return card;
}

// ============================================
// VISIT TRACKING WITH LOCALSTORAGE
// ============================================

function displayVisitMessage() {
  const lastVisit = localStorage.getItem("lastVisit");
  const currentVisit = Date.now();
  let message = "";

  if (!lastVisit) {
    // First visit
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const timeDifference = currentVisit - lastVisit;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 1) {
      // Less than a day
      message = "Back so soon! Awesome!";
    } else if (daysDifference === 1) {
      // Exactly 1 day
      message = "You last visited 1 day ago.";
    } else {
      // More than 1 day
      message = `You last visited ${daysDifference} days ago.`;
    }
  }

  // Display the message
  visitMessage.textContent = message;

  // Store current visit
  localStorage.setItem("lastVisit", currentVisit);
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
  // Display places of interest
  displayPlaces();

  // Display visit message
  displayVisitMessage();

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
