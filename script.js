document.documentElement.classList.add("js");

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const locations = [...document.querySelectorAll(".map-location")];
const sections = [...document.querySelectorAll(".story-section")];
const landmarks = [...document.querySelectorAll(".map-landmark")];
const traveler = document.querySelector(".traveler");
const arrivalStatus = document.querySelector("#arrival-status");
const panelNumber = document.querySelector("#panel-number");
const footprintTrail = document.querySelector(".footprint-trail");
const SVG_NS = "http://www.w3.org/2000/svg";
// Map stops are stored as percentages; the map art uses a 1000 x 760 viewBox.
const castleStop = { x: 50, y: 50 };
let currentStop = null;
let currentLocation = null;

function stopOf(location) {
  return { x: Number(location.dataset.x), y: Number(location.dataset.y) };
}

function walkFootprints(from, to) {
  if (!footprintTrail) return;
  const x0 = from.x * 10, y0 = from.y * 7.6, x1 = to.x * 10, y1 = to.y * 7.6;
  const dx = x1 - x0, dy = y1 - y0, length = Math.hypot(dx, dy);
  // Bend the path away from the castle so the steps wander around it, not across it.
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const away = (mx + dy * 0.3 - 500) ** 2 + (my - dx * 0.3 - 400) ** 2 > (mx - dy * 0.3 - 500) ** 2 + (my + dx * 0.3 - 400) ** 2 ? 1 : -1;
  const cx = mx + dy * 0.3 * away, cy = my - dx * 0.3 * away;
  const point = (t) => [
    (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1,
    (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1,
  ];
  const steps = Math.max(3, Math.round(length / 34));
  footprintTrail.replaceChildren();
  for (let i = 0; i <= steps; i += 1) {
    const t = 0.08 + (0.84 * i) / steps;
    const [x, y] = point(t);
    const [nx, ny] = point(Math.min(t + 0.01, 1));
    const angle = (Math.atan2(ny - y, nx - x) * 180) / Math.PI + 90;
    const step = document.createElementNS(SVG_NS, "use");
    step.setAttribute("href", "#footprints");
    step.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(0)})`);
    step.style.animationDelay = `${i * 140}ms`;
    footprintTrail.append(step);
  }
}

function setTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeButton.querySelector(".theme-label").textContent = isDark ? "Lumos" : "Nox";
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to parchment light mode" : "Switch to black dark mode",
  );
}

try {
  const savedTheme = localStorage.getItem("shiyuan-map-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  }
} catch (error) {
  console.warn("Your saved map theme could not be read.", error);
}

themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  try {
    localStorage.setItem("shiyuan-map-theme", theme);
  } catch (error) {
    console.warn("Your map theme could not be saved for your next visit.", error);
  }
});

function selectLocation(location) {
  if (location === currentLocation) return;
  const nextStop = stopOf(location);
  walkFootprints(currentStop ?? castleStop, nextStop);
  currentStop = nextStop;
  currentLocation = location;
  const sectionId = location.getAttribute("aria-controls");
  locations.forEach((button) => {
    const active = button === location;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  sections.forEach((section) => {
    section.hidden = section.id !== sectionId;
  });
  landmarks.forEach((landmark) => {
    landmark.classList.toggle("is-active", landmark.dataset.landmark === location.dataset.section);
  });
  traveler.style.setProperty("--ghost-x", `${location.dataset.x}%`);
  traveler.style.setProperty("--ghost-y", `${location.dataset.y}%`);
  panelNumber.textContent = `${String(locations.indexOf(location) + 1).padStart(2, "0")} / 04`;
  arrivalStatus.textContent = `Casting ${location.querySelector(".location-name").textContent}`;
}

locations.forEach((location) => {
  location.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") {
      selectLocation(location);
    }
  });
  location.addEventListener("focus", () => selectLocation(location));
  location.addEventListener("click", () => selectLocation(location));
});

selectLocation(locations.find((location) => location.classList.contains("is-active")) ?? locations[0]);

document.querySelector("#year").textContent = new Date().getFullYear();
