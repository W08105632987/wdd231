// ============================================
// ABUJA CHAMBER OF COMMERCE - DIRECTORY JAVASCRIPT
// ============================================

// DOM Elements
const directoryContainer = document.getElementById("directoryContainer");
const gridViewBtn = document.getElementById("gridViewBtn");
const listViewBtn = document.getElementById("listViewBtn");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

// ============================================
// FETCH AND DISPLAY MEMBERS
// ============================================

async function fetchMembers() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }

    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    directoryContainer.innerHTML = `
            <div class="error-message">
                <p>⚠️ Unable to load member directory. Please try again later.</p>
            </div>
        `;
  }
}

// ============================================
// DISPLAY MEMBERS
// ============================================

function displayMembers(members) {
  directoryContainer.innerHTML = "";

  members.forEach((member) => {
    const memberCard = createMemberCard(member);
    directoryContainer.appendChild(memberCard);
  });
}

// ============================================
// CREATE MEMBER CARD
// ============================================

function createMemberCard(member) {
  const card = document.createElement("div");
  card.classList.add("member-card");

  // Determine membership level text and class
  let membershipLevel = "Member";
  let membershipClass = "member";

  if (member.membershipLevel === 3) {
    membershipLevel = "Gold";
    membershipClass = "gold";
  } else if (member.membershipLevel === 2) {
    membershipLevel = "Silver";
    membershipClass = "silver";
  }

  card.innerHTML = `
        <span class="membership-badge ${membershipClass}">${membershipLevel}</span>
        <img src="images/${member.image}" alt="${
    member.name
  }" class="member-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%22 font-size=%2218%22%3EImage Not Available%3C/text%3E%3C/svg%3E'">
        <div class="member-content">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-info"><strong>Address:</strong> ${
              member.address
            }</p>
            <p class="member-info"><strong>Phone:</strong> ${member.phone}</p>
            <p class="member-info"><strong>Email:</strong> ${
              member.email || "N/A"
            }</p>
            <a href="${
              member.website
            }" target="_blank" class="member-website">Visit Website →</a>
            ${
              member.otherInfo
                ? `<p class="member-info" style="margin-top: 0.5rem; font-style: italic;">${member.otherInfo}</p>`
                : ""
            }
        </div>
    `;

  return card;
}

// ============================================
// VIEW TOGGLE FUNCTIONALITY
// ============================================

function toggleView(view) {
  if (view === "grid") {
    directoryContainer.classList.remove("list-view");
    directoryContainer.classList.add("grid-view");
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    localStorage.setItem("viewPreference", "grid");
  } else {
    directoryContainer.classList.remove("grid-view");
    directoryContainer.classList.add("list-view");
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
    localStorage.setItem("viewPreference", "list");
  }
}

// Event Listeners for View Toggle
gridViewBtn.addEventListener("click", () => toggleView("grid"));
listViewBtn.addEventListener("click", () => toggleView("list"));

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate hamburger icon
  const spans = hamburger.querySelectorAll("span");
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translateY(10px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translateY(-10px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// ============================================
// FOOTER DATE FUNCTIONS
// ============================================

function updateFooterDates() {
  // Update current year
  const currentYearSpan = document.getElementById("currentYear");
  const currentYear = new Date().getFullYear();
  currentYearSpan.textContent = currentYear;

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
  lastModifiedSpan.textContent = lastModified.toLocaleDateString(
    "en-US",
    options
  );
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display members
  fetchMembers();

  // Update footer dates
  updateFooterDates();

  // Set default view or restore saved preference
  const savedView = localStorage.getItem("viewPreference") || "grid";
  toggleView(savedView);

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
