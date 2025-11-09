// ========== MENU TOGGLE ==========
const menuButton = document.querySelector("#menuButton");
const navMenu = document.querySelector("#navMenu");

menuButton.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  menuButton.classList.toggle("open");
});

// ========== FOOTER DATES ==========
const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;

// ========== MEMBER DIRECTORY FUNCTIONALITY ==========

// Get DOM elements
const memberCardsContainer = document.querySelector("#memberCards");
const gridViewBtn = document.querySelector("#gridViewBtn");
const listViewBtn = document.querySelector("#listViewBtn");

// Async function to fetch member data from JSON
async function fetchMembers() {
  try {
    // Show loading state
    memberCardsContainer.innerHTML =
      '<p class="loading">Loading members...</p>';

    // Fetch data from JSON file
    const response = await fetch("data/members.json");

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON data
    const data = await response.json();

    // Display members
    displayMembers(data.members);
  } catch (error) {
    console.error("Error fetching members:", error);
    memberCardsContainer.innerHTML =
      '<p class="loading">Error loading members. Please try again later.</p>';
  }
}

// Function to display members in cards
function displayMembers(members) {
  memberCardsContainer.innerHTML = "";

  members.forEach((member) => {
    const card = createMemberCard(member);
    memberCardsContainer.appendChild(card);
  });
}

// Function to create a member card
function createMemberCard(member) {
  const card = document.createElement("div");
  card.classList.add("member-card");

  // Determine membership badge class
  const badgeClass = member.membershipLevel.toLowerCase();

  card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name}" class="member-image" loading="lazy">
        <div class="member-content">
            <h3>${member.name}</h3>
            <span class="membership-badge ${badgeClass}">${member.membershipLevel} Member</span>
            <div class="member-info">
                <p><strong>Industry:</strong> ${member.industry}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
                <p class="member-description">${member.description}</p>
            </div>
            <a href="${member.website}" class="member-link" target="_blank" rel="noopener">Visit Website</a>
        </div>
    `;

  return card;
}

// View toggle functionality
if (gridViewBtn && listViewBtn) {
  gridViewBtn.addEventListener("click", () => {
    memberCardsContainer.classList.remove("list-view");
    memberCardsContainer.classList.add("grid-view");
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
  });

  listViewBtn.addEventListener("click", () => {
    memberCardsContainer.classList.remove("grid-view");
    memberCardsContainer.classList.add("list-view");
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
  });
}

// Initialize page - fetch and display members
if (memberCardsContainer) {
  fetchMembers();
}
