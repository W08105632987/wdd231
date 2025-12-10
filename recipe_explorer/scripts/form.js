/* ===============================================
   FORM.JS - FORM VALIDATION & SUBMISSION
   Recipe Explorer Project
   =============================================== */

/* VIDEO DEMO: Form with URLSearchParams
   - Show form submission process
   - Demonstrate URLSearchParams building query string
   - Show data display on thanks.html page
*/

// === FORM VALIDATION ===
function validateForm(formData) {
  const errors = [];

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.push("Please enter a valid email address");
  }

  // Favorite recipe validation
  if (!formData.favoriteRecipe || formData.favoriteRecipe.trim().length < 2) {
    errors.push("Please enter your favorite recipe");
  }

  // Message is now optional - no validation needed

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// === DISPLAY VALIDATION ERRORS ===
function displayErrors(errors) {
  // Remove any existing error messages
  const existingErrors = document.querySelector(".form-errors");
  if (existingErrors) {
    existingErrors.remove();
  }

  if (errors.length === 0) return;

  // Create error container using DOM manipulation
  const errorContainer = document.createElement("div");
  errorContainer.className = "alert alert-error form-errors";

  // Use template literals for error list
  errorContainer.innerHTML = `
        <strong>Please fix the following errors:</strong>
        <ul>
            ${errors.map((error) => `<li>${error}</li>`).join("")}
        </ul>
    `;

  // Insert before form
  const form = document.getElementById("contactForm");
  if (form) {
    form.parentNode.insertBefore(errorContainer, form);

    // Scroll to errors
    errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// === HANDLE FORM SUBMISSION ===
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  // Collect form data using FormData API
  const formData = {
    name: form.name.value,
    email: form.email.value,
    favoriteRecipe: form.favoriteRecipe.value,
    message: form.message.value,
    submittedAt: new Date().toISOString(),
  };

  // Validate form
  const validation = validateForm(formData);

  if (!validation.isValid) {
    displayErrors(validation.errors);
    return;
  }

  // Store form data in localStorage before redirecting
  localStorage.setItem("contactFormSubmission", JSON.stringify(formData));

  // Build URL with search params for thanks page
  const params = new URLSearchParams({
    name: formData.name,
    email: formData.email,
    favoriteRecipe: formData.favoriteRecipe,
    message: formData.message,
  });

  // Redirect to thanks page with data
  window.location.href = `thanks.html?${params.toString()}`;
}

// === INITIALIZE FORM ON TIPS PAGE ===
function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", handleFormSubmit);

  // Add input event listeners for real-time feedback
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      // Remove error styling when user starts typing
      input.style.borderColor = "";
    });
  });

  console.log("Contact form initialized");
}

// === DISPLAY SUBMISSION DATA ON THANKS PAGE (URLSearchParams) ===
/* VIDEO DEMO: URLSearchParams in action
   - Show window.location.search containing form data
   - Show params.get() retrieving specific values
   - Demonstrate how data appears on thanks.html
*/
function displaySubmissionData() {
  // Check if we're on the thanks page
  if (!window.location.pathname.includes("thanks.html")) return;

  // Get URL parameters
  const params = new URLSearchParams(window.location.search);

  // Extract data
  const submissionData = {
    name: params.get("name"),
    email: params.get("email"),
    favoriteRecipe: params.get("favoriteRecipe"),
    message: params.get("message"),
  };

  // Check if we have data
  if (!submissionData.name) {
    // No data in URL, try localStorage
    const storedData = localStorage.getItem("contactFormSubmission");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      Object.assign(submissionData, parsedData);
    } else {
      // No data available, redirect to tips page
      window.location.href = "tips.html";
      return;
    }
  }

  // Display the data using DOM manipulation and template literals
  const detailsContainer = document.querySelector(".submission-details");

  if (detailsContainer) {
    detailsContainer.innerHTML = `
            <h2>Your Submission</h2>
            <div class="detail-item">
                <strong>👤 Name:</strong>
                <p>${escapeHtml(submissionData.name)}</p>
            </div>
            <div class="detail-item">
                <strong>📧 Email:</strong>
                <p>${escapeHtml(submissionData.email)}</p>
            </div>
            <div class="detail-item">
                <strong>🍳 Favorite Recipe:</strong>
                <p>${escapeHtml(submissionData.favoriteRecipe)}</p>
            </div>
            <div class="detail-item">
                <strong>💬 Message:</strong>
                <p>${escapeHtml(submissionData.message)}</p>
            </div>
        `;
  }

  // Store in localStorage for record
  localStorage.setItem("lastFormSubmission", JSON.stringify(submissionData));

  console.log("Submission data displayed successfully");
}

// === ESCAPE HTML TO PREVENT XSS ===
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// === INITIALIZE ON PAGE LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "tips.html") {
    initContactForm();
  } else if (currentPage === "thanks.html") {
    displaySubmissionData();
  }
});

// === EXPORT FUNCTIONS ===
export {
  validateForm,
  handleFormSubmit,
  displaySubmissionData,
  initContactForm,
};
