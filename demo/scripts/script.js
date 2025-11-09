// Menu toggle
const menuButton = document.querySelector("#menuButton");
const navMenu = document.querySelector("#navMenu");

menuButton.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  menuButton.classList.toggle("open");
});

// Footer dates
const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;
