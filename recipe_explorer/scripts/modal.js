/* ===============================================
   MODAL.JS - MODAL DIALOG FUNCTIONALITY
   Recipe Explorer Project
   =============================================== */

// === CREATE MODAL ELEMENT IF IT DOESN'T EXIST ===
function createModalElement() {
  let modal = document.querySelector(".modal");

  if (!modal) {
    // DOM Manipulation - create modal structure
    modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modal-title");

    document.body.appendChild(modal);
  }

  return modal;
}

// === GENERATE MODAL CONTENT (TEMPLATE LITERALS) ===
function generateModalContent(recipe) {
  // Use template literals for dynamic HTML
  return `
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">${recipe.name}</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${recipe.image}" alt="${
    recipe.name
  }" class="modal-image">
                
                <div class="modal-meta">
                    <div class="modal-meta-item">
                        <strong>⏱️ Time</strong>
                        <span>${recipe.time}</span>
                    </div>
                    <div class="modal-meta-item">
                        <strong>📊 Difficulty</strong>
                        <span class="badge badge-easy">${
                          recipe.difficulty
                        }</span>
                    </div>
                    <div class="modal-meta-item">
                        <strong>🥗 Ingredients</strong>
                        <span>${recipe.ingredients.length} items</span>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>🛒 Ingredients</h3>
                    <ul class="ingredients-list">
                        ${recipe.ingredients
                          .map(
                            (ingredient) => `
                            <li>${ingredient}</li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>📝 Instructions</h3>
                    <p>${recipe.instructions}</p>
                </div>
            </div>
        </div>
    `;
}

// === OPEN MODAL ===
function openModal(recipe) {
  const modal = createModalElement();

  // Insert modal content using DOM manipulation
  modal.innerHTML = generateModalContent(recipe);

  // Show modal with animation
  modal.classList.add("active");

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Add close event listeners
  addModalCloseListeners(modal);

  // Focus management for accessibility
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }

  console.log("Opened modal for:", recipe.name);
}

// === CLOSE MODAL ===
function closeModal() {
  const modal = document.querySelector(".modal");

  if (modal) {
    modal.classList.remove("active");

    // Re-enable body scroll
    document.body.style.overflow = "";

    // Small delay before clearing content for smooth animation
    setTimeout(() => {
      modal.innerHTML = "";
    }, 300);
  }
}

// === ADD CLOSE EVENT LISTENERS ===
function addModalCloseListeners(modal) {
  // Close button click
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Click outside modal content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key press
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
    }
  };

  document.addEventListener("keydown", handleEscape);
}

// === EXPORT FUNCTIONS ===
export { openModal, closeModal, createModalElement, generateModalContent };
