// ============================================
// ABUJA CHAMBER OF COMMERCE - HOME PAGE JAVASCRIPT
// ============================================

// OpenWeatherMap API Configuration
const WEATHER_API_KEY = "31e0c99aaefd0c6f056b9a7c9799d8fd"; // Replace with your actual API key
const ABUJA_COORDS = {
  lat: 9.0765,
  lon: 7.3986,
};

// DOM Elements
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const weatherContainer = document.getElementById("weatherContainer");
const spotlightsContainer = document.getElementById("spotlightsContainer");

// ============================================
// FETCH WEATHER DATA
// ============================================

async function fetchWeather() {
  try {
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${ABUJA_COORDS.lat}&lon=${ABUJA_COORDS.lon}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!currentResponse.ok) {
      throw new Error("Failed to fetch current weather");
    }

    const currentData = await currentResponse.json();

    // 3-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${ABUJA_COORDS.lat}&lon=${ABUJA_COORDS.lon}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error("Failed to fetch forecast");
    }

    const forecastData = await forecastResponse.json();

    displayWeather(currentData, forecastData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherContainer.innerHTML = `
            <p style="color: #999;">⚠️ Unable to load weather data</p>
        `;
  }
}

// ============================================
// DISPLAY WEATHER DATA
// ============================================

function displayWeather(current, forecast) {
  // Get weather icon
  const iconCode = current.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Current weather HTML
  const currentHTML = `
        <div class="weather-current">
            <img src="${iconUrl}" alt="${
    current.weather[0].description
  }" class="weather-icon">
            <div class="weather-temp">${Math.round(current.main.temp)}°C</div>
            <div class="weather-description">${
              current.weather[0].description
            }</div>
            
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">Feels Like</div>
                    <div class="weather-detail-value">${Math.round(
                      current.main.feels_like
                    )}°C</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Humidity</div>
                    <div class="weather-detail-value">${
                      current.main.humidity
                    }%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Wind Speed</div>
                    <div class="weather-detail-value">${Math.round(
                      current.wind.speed
                    )} m/s</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Pressure</div>
                    <div class="weather-detail-value">${
                      current.main.pressure
                    } hPa</div>
                </div>
            </div>
        </div>
    `;

  // Get forecast for next 3 days (using noon data)
  const forecastDays = getForecastDays(forecast.list);

  const forecastHTML = `
        <div class="weather-forecast">
            <h3>3-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastDays
                  .map(
                    (day) => `
                    <div class="forecast-day">
                        <div class="forecast-date">${day.date}</div>
                        <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}" class="forecast-icon">
                        <div class="forecast-temp">${day.temp}°C</div>
                        <div class="forecast-desc">${day.description}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  weatherContainer.innerHTML = currentHTML + forecastHTML;
}

// ============================================
// GET 3-DAY FORECAST
// ============================================

function getForecastDays(forecastList) {
  const days = [];
  const processedDates = new Set();

  // Get forecast data for noon (12:00) for next 3 days
  for (const item of forecastList) {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toLocaleDateString();
    const hour = date.getHours();

    // Only process noon time (12:00) and avoid duplicates
    if (hour === 12 && !processedDates.has(dateStr) && days.length < 3) {
      processedDates.add(dateStr);

      days.push({
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    }

    if (days.length === 3) break;
  }

  return days;
}

// ============================================
// FETCH AND DISPLAY MEMBER SPOTLIGHTS
// ============================================

async function fetchSpotlights() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }

    const members = await response.json();

    // Filter Gold (3) and Silver (2) members
    const qualifiedMembers = members.filter(
      (member) => member.membershipLevel === 3 || member.membershipLevel === 2
    );

    // Randomly select 2-3 members
    const spotlightCount = Math.random() > 0.5 ? 3 : 2;
    const selectedMembers = getRandomMembers(qualifiedMembers, spotlightCount);

    displaySpotlights(selectedMembers);
  } catch (error) {
    console.error("Error fetching spotlights:", error);
    spotlightsContainer.innerHTML = `
            <p style="color: #999;">⚠️ Unable to load member spotlights</p>
        `;
  }
}

// ============================================
// GET RANDOM MEMBERS
// ============================================

function getRandomMembers(members, count) {
  const shuffled = [...members].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ============================================
// DISPLAY SPOTLIGHTS
// ============================================

function displaySpotlights(members) {
  spotlightsContainer.innerHTML = "";

  members.forEach((member) => {
    const card = createSpotlightCard(member);
    spotlightsContainer.appendChild(card);
  });
}

// ============================================
// CREATE SPOTLIGHT CARD
// ============================================

function createSpotlightCard(member) {
  const card = document.createElement("div");
  card.classList.add("spotlight-card");

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
        <span class="spotlight-badge ${membershipClass}">${membershipLevel}</span>
        <img src="images/${member.image}" alt="${
    member.name
  }" class="spotlight-logo" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%22 font-size=%2218%22%3EImage Not Available%3C/text%3E%3C/svg%3E'">
        <h3 class="spotlight-name">${member.name}</h3>
        <p class="spotlight-info"><strong>📍</strong> ${member.address}</p>
        <p class="spotlight-info"><strong>📞</strong> ${member.phone}</p>
        <p class="spotlight-info"><strong>📧</strong> ${
          member.email || "N/A"
        }</p>
        <a href="${
          member.website
        }" target="_blank" class="spotlight-website">Visit Website →</a>
        ${
          member.otherInfo
            ? `<p class="spotlight-info" style="margin-top: 0.5rem; font-style: italic; font-size: 0.85rem;">${member.otherInfo}</p>`
            : ""
        }
    `;

  return card;
}

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate hamburger icon to X
  const spans = hamburger.querySelectorAll("span");
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
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
  // Fetch and display weather
  fetchWeather();

  // Fetch and display member spotlights
  fetchSpotlights();

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
