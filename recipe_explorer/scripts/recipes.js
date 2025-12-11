/* ===============================================
   RECIPES.JS - FETCH JSON, RENDER RECIPES, MODAL
   Recipe Explorer Project
   =============================================== */

import { openModal } from "./modal.js";
import { showLoading } from "./main.js";

// === FETCH RECIPES FROM JSON (ASYNC/AWAIT + TRY/CATCH) ===
async function fetchRecipes() {
  try {
    const response = await fetch("data/recipes.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

// === RENDER RECIPE CARD (TEMPLATE LITERALS) ===
function createRecipeCard(recipe) {
  // Template literal for dynamic HTML generation
  return `
        <article class="recipe-card hover-lift" data-recipe-id="${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.name}" loading="lazy">
            <div class="recipe-card-content">
                <h3>${recipe.name}</h3>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span class="badge badge-easy">${recipe.difficulty}</span>
                </div>
            </div>
        </article>
    `;
}

// === RENDER ALL RECIPES TO CONTAINER (DOM MANIPULATION + ARRAY METHODS) ===
function renderRecipes(recipes, container) {
  if (!container) {
    console.error("Recipe container not found");
    return;
  }

  // Clear loading spinner
  container.innerHTML = "";

  // Use .map() array method to create HTML for each recipe
  const recipesHTML = recipes
    .map((recipe) => createRecipeCard(recipe))
    .join("");

  // DOM manipulation - insert HTML into container
  container.innerHTML = recipesHTML;

  // Add click event listeners to each card
  addRecipeCardListeners(recipes);
}

// === ADD CLICK LISTENERS TO RECIPE CARDS ===
function addRecipeCardListeners(recipes) {
  const recipeCards = document.querySelectorAll(".recipe-card");

  recipeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const recipeId = parseInt(card.dataset.recipeId);
      // Use .find() array method to locate the recipe
      const recipe = recipes.find((r) => r.id === recipeId);

      if (recipe) {
        openModal(recipe);
        saveLastViewedRecipe(recipe);
      }
    });

    // Keyboard accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
}

// === SAVE LAST VIEWED RECIPE TO LOCAL STORAGE ===
function saveLastViewedRecipe(recipe) {
  const recipeData = {
    id: recipe.id,
    name: recipe.name,
    time: recipe.time,
    viewedAt: new Date().toISOString(),
  };

  localStorage.setItem("lastViewedRecipe", JSON.stringify(recipeData));
  console.log("Saved last viewed recipe:", recipe.name);
}

// === GET LAST VIEWED RECIPE FROM LOCAL STORAGE ===
function getLastViewedRecipe() {
  const data = localStorage.getItem("lastViewedRecipe");
  return data ? JSON.parse(data) : null;
}

// === DISPLAY LAST VIEWED RECIPE MESSAGE ===
function displayLastViewed() {
  const lastViewed = getLastViewedRecipe();

  if (lastViewed) {
    const message = `Welcome back! Last viewed: ${lastViewed.name}`;
    console.log(message);

    
  }
}

// === FILTER RECIPES (ARRAY METHOD - .filter()) ===
function filterRecipes(recipes, searchTerm) {
  if (!searchTerm) return recipes;

  const term = searchTerm.toLowerCase();

  // Use .filter() array method for searching
  return recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(term)
      )
  );
}

// === LOAD FEATURED RECIPES (FIRST 3) ===
async function loadFeaturedRecipes() {
  const container = document.querySelector(".featured-recipes");

  if (!container) return;

  try {
    showLoading(container);
    const recipes = await fetchRecipes();

    // Use .slice() array method to get first 3 recipes
    const featuredRecipes = recipes.slice(0, 3);

    renderRecipes(featuredRecipes, container);
  } catch (error) {
    container.innerHTML = `
            <div class="alert alert-error">
                <p>Error loading featured recipes. Please try again later.</p>
            </div>
        `;
  }
}

// === LOAD ALL RECIPES FOR RECIPES PAGE ===
async function loadAllRecipes() {
  const container = document.querySelector(".recipe-grid");

  if (!container) return;

  try {
    showLoading(container);
    const recipes = await fetchRecipes();

    renderRecipes(recipes, container);
    displayLastViewed();
  } catch (error) {
    container.innerHTML = `
            <div class="alert alert-error">
                <p>Error loading recipes. Please try again later.</p>
            </div>
        `;
  }
}

// === INITIALIZE RECIPES ON PAGE LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  // Check which page we're on
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "index.html" || currentPage === "") {
    loadFeaturedRecipes();
  } else if (currentPage === "recipes.html") {
    loadAllRecipes();
  }
});

// === EXPORT FUNCTIONS ===
export {
  fetchRecipes,
  renderRecipes,
  filterRecipes,
  saveLastViewedRecipe,
  getLastViewedRecipe,
  loadFeaturedRecipes,
  loadAllRecipes,
};
