const API_URL = "https://anurella.github.io/json/planet.json";
const PLANET_ORDER = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

const PLANET_DETAILS = {
  Mercury: {
    category: "TERRESTRIAL",
    kicker: "THE SWIFT PLANET",
    distance: "0.39 AU",
    mass: "3.30 × 10²³ kg",
    diameter: "4,879 km",
    period: "88 Earth days",
    temperature: "167 °C avg.",
    gravity: "3.7 m/s²",
    moons: "0",
    description: "A small, cratered world racing around the Sun faster than any other planet."
  },
  Venus: {
    category: "TERRESTRIAL",
    kicker: "THE VEILED PLANET",
    distance: "0.72 AU",
    mass: "4.87 × 10²⁴ kg",
    diameter: "12,104 km",
    period: "225 Earth days",
    temperature: "464 °C avg.",
    gravity: "8.87 m/s²",
    moons: "0",
    description: "A brilliant world wrapped in thick clouds, with a surface hot enough to melt lead."
  },
  Earth: {
    category: "TERRESTRIAL",
    kicker: "THE BLUE PLANET",
    distance: "1.00 AU",
    mass: "5.97 × 10²⁴ kg",
    diameter: "12,756 km",
    period: "365.25 days",
    temperature: "15 °C avg.",
    gravity: "9.81 m/s²",
    moons: "1",
    description: "Our pale blue home: the only world we know of with liquid oceans on its surface and life among the stars."
  },
  Mars: {
    category: "TERRESTRIAL",
    kicker: "THE RED PLANET",
    distance: "1.52 AU",
    mass: "6.42 × 10²³ kg",
    diameter: "6,792 km",
    period: "687 Earth days",
    temperature: "−65 °C avg.",
    gravity: "3.71 m/s²",
    moons: "2",
    description: "A cold desert world of towering volcanoes, ancient river valleys and two tiny moons."
  },
  Jupiter: {
    category: "GAS GIANT",
    kicker: "KING OF THE PLANETS",
    distance: "5.20 AU",
    mass: "1.90 × 10²⁷ kg",
    diameter: "142,984 km",
    period: "11.86 Earth years",
    temperature: "−110 °C avg.",
    gravity: "24.79 m/s²",
    moons: "95",
    description: "A vast gas giant whose swirling cloud bands and centuries-old Great Red Spot dwarf Earth."
  },
  Saturn: {
    category: "GAS GIANT",
    kicker: "THE RINGED PLANET",
    distance: "9.58 AU",
    mass: "5.68 × 10²⁶ kg",
    diameter: "120,536 km",
    period: "29.45 Earth years",
    temperature: "−140 °C avg.",
    gravity: "10.44 m/s²",
    moons: "146",
    description: "A world of ice and dust rings, with a family of moons that includes hazy Titan and ocean-bearing Enceladus."
  },
  Uranus: {
    category: "ICE GIANT",
    kicker: "THE SIDEWAYS PLANET",
    distance: "19.2 AU",
    mass: "8.68 × 10²⁵ kg",
    diameter: "51,118 km",
    period: "84 Earth years",
    temperature: "−195 °C avg.",
    gravity: "8.69 m/s²",
    moons: "28",
    description: "An icy blue giant that rolls around the Sun on its side, with seasons unlike any other planet."
  },
  Neptune: {
    category: "ICE GIANT",
    kicker: "THE WINDY WORLD",
    distance: "30.05 AU",
    mass: "1.02 × 10²⁶ kg",
    diameter: "49,528 km",
    period: "165 Earth years",
    temperature: "−200 °C avg.",
    gravity: "11.15 m/s²",
    moons: "16",
    description: "A distant, deep-blue ice giant swept by supersonic winds at the edge of the planetary neighbourhood."
  }
};

const DEFAULT_PLANETS = PLANET_ORDER.map((name) => ({
  name,
  ...PLANET_DETAILS[name]
}));

const FIELD_ALIASES = {
  type: ["type", "planet_type", "planetType", "classification"],
  distance: ["distance", "distance_from_sun", "distanceFromSun", "distance_from_sun_km"],
  mass: ["mass", "planet_mass"],
  diameter: ["diameter", "planet_diameter"],
  period: ["period", "orbital_period", "orbitalPeriod", "revolution_period"],
  temperature: ["temperature", "mean_temperature", "meanTemperature", "average_temperature"],
  gravity: ["gravity", "surface_gravity", "surfaceGravity"],
  moons: ["moons", "moon", "number_of_moons", "numberOfMoons"],
  description: ["description", "overview", "summary"],
  image: ["image", "img", "image_url", "imageUrl", "picture", "photo"]
};

const elements = {
  list: document.querySelector("#planet-list"),
  count: document.querySelector("#planet-count"),
  status: document.querySelector("#data-status"),
  statusDot: document.querySelector(".status-dot"),
  panel: document.querySelector("#planet-details"),
  position: document.querySelector("#planet-position"),
  distance: document.querySelector("#distance-value"),
  name: document.querySelector("#planet-name"),
  kicker: document.querySelector("#planet-kicker"),
  description: document.querySelector("#planet-description"),
  visual: document.querySelector("#planet-visual"),
  image: document.querySelector("#planet-image"),
  caption: document.querySelector("#planet-image-caption"),
  index: document.querySelector("#visual-index"),
  themeToggle: document.querySelector(".theme-toggle"),
  themeLabel: document.querySelector(".theme-label")
};

let planets = DEFAULT_PLANETS;
let selectedPlanet = "Earth";
let planetButtons = [];

function toText(value) {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) return String(value.length);
  if (typeof value === "object") {
    if ("count" in value) return String(value.count);
    if ("value" in value) return toText(value.value);
    return "";
  }
  return String(value);
}

function firstValue(record, aliases) {
  for (const key of aliases) {
    if (Object.hasOwn(record, key)) {
      const value = toText(record[key]);
      if (value) return value;
    }
  }
  return "";
}

function normalizeName(value) {
  const name = toText(value).trim();
  return PLANET_ORDER.find((planet) => planet.toLowerCase() === name.toLowerCase());
}

function normalizePlanet(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  const name = normalizeName(firstValue(record, ["name", "planet", "planet_name", "planetName"]));
  if (!name) return null;

  const details = PLANET_DETAILS[name];
  const fields = Object.fromEntries(
    Object.entries(FIELD_ALIASES).map(([field, aliases]) => [field, firstValue(record, aliases)])
  );

  return {
    name,
    category: fields.type || details.category,
    kicker: details.kicker,
    distance: fields.distance || details.distance,
    mass: fields.mass || details.mass,
    diameter: fields.diameter || details.diameter,
    period: fields.period || details.period,
    temperature: fields.temperature || details.temperature,
    gravity: fields.gravity || details.gravity,
    moons: fields.moons || details.moons,
    description: fields.description || details.description,
    image: fields.image
  };
}

function getPlanetRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    for (const key of ["planets", "data", "results"]) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  throw new Error("The planet archive returned an unexpected response.");
}

function getSafeImageUrl(image) {
  if (!image) return "";
  try {
    const url = new URL(image, API_URL);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function setField(id, value) {
  document.querySelector(`#${id}`).textContent = value || "—";
}

function renderPlanetList() {
  const fragment = document.createDocumentFragment();
  planetButtons = [];

  planets.forEach((planet, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const number = document.createElement("span");
    const name = document.createElement("span");
    const dot = document.createElement("span");

    button.type = "button";
    button.dataset.planet = planet.name;
    button.setAttribute("aria-label", `Explore ${planet.name}`);
    button.addEventListener("click", () => selectPlanet(planet.name));

    number.className = "list-number";
    number.textContent = String(index + 1).padStart(2, "0");
    name.className = "list-name";
    name.textContent = planet.name;
    dot.className = "list-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.style.setProperty("--planet-color", getPlanetColor(planet.name));

    button.append(number, name, dot);
    item.append(button);
    fragment.append(item);
    planetButtons.push(button);
  });

  elements.list.replaceChildren(fragment);
  elements.count.textContent = `— / ${String(planets.length).padStart(2, "0")}`;
}

function getPlanetColor(name) {
  return {
    Mercury: "#aaa397",
    Venus: "#d39c68",
    Earth: "#67a8cc",
    Mars: "#c86e55",
    Jupiter: "#c99e76",
    Saturn: "#d0b278",
    Uranus: "#75b9b4",
    Neptune: "#6686dc"
  }[name] || "#d1a97a";
}

function selectPlanet(name) {
  const planet = planets.find((item) => item.name === name);
  if (!planet) return;

  selectedPlanet = name;
  const planetIndex = planets.indexOf(planet);
  elements.name.textContent = planet.name;
  elements.kicker.textContent = planet.kicker;
  elements.description.textContent = planet.description;
  const positionSeparator = document.createElement("span");
  positionSeparator.className = "eyebrow-separator";
  positionSeparator.textContent = "/";
  elements.position.replaceChildren(
    document.createTextNode(`PLANET ${String(planetIndex + 1).padStart(2, "0")} `),
    positionSeparator,
    document.createTextNode(` ${planet.category}`)
  );
  elements.count.textContent = `${String(planetIndex + 1).padStart(2, "0")} / ${String(planets.length).padStart(2, "0")}`;
  elements.distance.textContent = planet.distance;
  elements.visual.dataset.planet = planet.name.toLowerCase();
  elements.index.textContent = String(planetIndex + 1).padStart(2, "0");
  elements.caption.textContent = `Illustration of ${planet.name}`;
  elements.image.hidden = true;
  elements.image.removeAttribute("src");

  const imageUrl = getSafeImageUrl(planet.image);
  if (imageUrl) {
    elements.image.onload = () => {
      if (selectedPlanet === planet.name) elements.image.hidden = false;
    };
    elements.image.onerror = () => {
      elements.image.hidden = true;
      console.warn(`Planet image could not be loaded for ${planet.name}.`);
    };
    elements.image.src = imageUrl;
  }

  setField("fact-type", planet.category);
  setField("fact-mass", planet.mass);
  setField("fact-diameter", planet.diameter);
  setField("fact-period", planet.period);
  setField("fact-temperature", planet.temperature);
  setField("fact-gravity", planet.gravity);
  setField("fact-moons", planet.moons);

  planetButtons.forEach((button) => {
    const isSelected = button.dataset.planet === planet.name;
    button.setAttribute("aria-current", String(isSelected));
  });
  elements.panel.setAttribute("aria-busy", "false");
}

async function loadPlanets() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`The planet archive returned HTTP ${response.status}.`);
    }

    const payload = await response.json();
    const fetchedPlanets = getPlanetRecords(payload)
      .map(normalizePlanet)
      .filter(Boolean)
      .sort((first, second) => PLANET_ORDER.indexOf(first.name) - PLANET_ORDER.indexOf(second.name));

    if (fetchedPlanets.length === 0) {
      throw new Error("The planet archive did not include any recognised planets.");
    }

    planets = fetchedPlanets;
    elements.status.textContent = "Live data from the planet archive";
    elements.statusDot.classList.remove("is-offline");
  } catch (error) {
    console.error("Unable to load the planet archive; showing built-in planet data instead.", error);
    planets = DEFAULT_PLANETS;
    elements.status.textContent = "Archive unavailable · showing reference data";
    elements.statusDot.classList.add("is-offline");
  } finally {
    window.clearTimeout(timeout);
    renderPlanetList();
    selectPlanet(planets.some((planet) => planet.name === selectedPlanet) ? selectedPlanet : planets[0].name);
  }
}

function setTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
  elements.themeLabel.textContent = isLight ? "DARK MODE" : "LIGHT MODE";
  elements.themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
  elements.themeToggle.title = `Switch to ${isLight ? "dark" : "light"} mode`;
  document.querySelector('meta[name="theme-color"]').content = isLight ? "#f5f3ef" : "#10131d";
}

function initializeTheme() {
  let savedTheme;
  try {
    savedTheme = localStorage.getItem("solar-system-theme");
  } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
  }
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

  setTheme(theme);
  elements.themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("solar-system-theme", nextTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved to local storage.", error);
    }
  });
}

initializeTheme();
loadPlanets();
