import { capitalize, getTypeColor } from "./utils.js";

const TYPE_ICONS = {
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  electric: "⚡",
  psychic: "🔮",
  ice: "❄️",
  poison: "☠️",
  normal: "⚪",
  fighting: "🥊",
  rock: "🪨",
  ground: "🟤",
  ghost: "👻",
  dark: "🌑",
  dragon: "🐉",
  fairy: "✨",
  steel: "⚙️",
  flying: "🪶",
  bug: "🐛"
};

function formatTypeBadges(types = []) {
  return types
    .map((item) => {
      const type = item.type.name;
      const icon = TYPE_ICONS[type] || "◆";
      return `<span class="type-pill type-pill--${type}">${icon} ${capitalize(type)}</span>`;
    })
    .join("");
}

function formatAbilities(abilities = []) {
  return abilities
    .map((item) => capitalize(item.ability.name.replace("-", " ")))
    .slice(0, 4)
    .join(" · ");
}

function formatMeters(decimeters) {
  return (decimeters / 10).toFixed(1).replace(".0", "");
}

function formatKilograms(hectograms) {
  return (hectograms / 10).toFixed(1).replace(".0", "");
}

function renderMainStats(stats = [], primaryType) {
  const preferred = ["hp", "attack", "defense", "speed"];
  const chosen = preferred
    .map((key) => stats.find((item) => item.stat.name === key))
    .filter(Boolean);

  return chosen
    .map((item) => {
      const value = item.base_stat;
      const segments = 12;
      const filled = Math.round((value / 150) * segments);
      const blocks = Array.from({ length: segments }, (_, i) => {
        const on = i < filled ? "stat-block stat-block--on" : "stat-block";
        return `<span class="${on}" aria-hidden="true"></span>`;
      }).join("");

      return `
        <div class="stat-row stat-row--segmented">
          <span class="stat-name">${capitalize(item.stat.name.replace("-", " "))}</span>
          <div class="stat-track-seg" role="img" aria-label="${value}">${blocks}</div>
          <span class="stat-value">${value}</span>
        </div>
      `;
    })
    .join("");
}

function renderPokedexMainView(data) {
  const primaryType = data.types[0]?.type?.name || "normal";
  const color = getTypeColor(primaryType);
  const hp = data.stats.find((s) => s.stat.name === "hp")?.base_stat ?? "?";
  const sprite =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default ||
    "";

  const idStr = String(data.id).padStart(3, "0");

  return `
    <article class="pokemon-card pokedex-main large type-${primaryType}" style="--card-bg: ${color}">
      <div class="pokedex-card-inner">
        <div class="pokedex-col pokedex-col--art">
          <div class="card-gold-bezel">
            <div class="lcd-screen lcd-screen--art">
              <figure class="image-frame">
                <img src="${sprite}" alt="${capitalize(data.name)}" loading="lazy" />
              </figure>
            </div>
          </div>
          ${
            data.evolutionLabel
              ? `<p class="dex-evolve-chip">${data.evolutionLabel}</p>`
              : ""
          }
        </div>
        <div class="pokedex-col pokedex-col--data">
          <div class="dex-title-block">
            <h2 class="pokemon-name">${capitalize(data.name)}</h2>
            <span class="dex-hp-pill">${hp} HP</span>
          </div>
          <p class="dex-id">#${idStr}</p>
          <div class="dex-types-row">${formatTypeBadges(data.types)}</div>
          <div class="dex-measures">
            <span><em>Alt.</em> ${formatMeters(data.height)} m</span>
            <span class="dex-measures-sep">|</span>
            <span><em>Peso</em> ${formatKilograms(data.weight)} kg</span>
          </div>
          <p class="dex-species-line">${data.genus || "—"}</p>
          <p class="dex-abilities-line"><strong>Habil.</strong> ${formatAbilities(data.abilities)}</p>
          <section class="stats-panel stats-panel--pokedex">
            ${renderMainStats(data.stats, primaryType)}
          </section>
          ${
            data.flavorText
              ? `<p class="dex-flavor">"${data.flavorText}"</p>`
              : ""
          }
        </div>
      </div>
    </article>
  `;
}

function renderCompactCard(data) {
  const primaryType = data.types[0]?.type?.name || "normal";
  const color = getTypeColor(primaryType);
  const sprite =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default ||
    "";
  const hp = data.stats.find((s) => s.stat.name === "hp")?.base_stat ?? "?";

  return `
    <article class="pokemon-card pokemon-card--compact small type-${primaryType}" style="--card-bg: ${color}">
      <div class="compact-inner">
        <figure class="compact-art"><img src="${sprite}" alt="" loading="lazy" /></figure>
        <div class="compact-meta">
          <h3 class="compact-name">${capitalize(data.name)}</h3>
          <p class="compact-id">#${String(data.id).padStart(3, "0")}</p>
          <p class="compact-hp">${hp} HP</p>
        </div>
      </div>
    </article>
  `;
}

export function renderPokemonCard(data, size = "large") {
  if (size === "large") {
    return renderPokedexMainView(data);
  }
  return renderCompactCard(data);
}

export function renderPokemonCarousel(list) {
  const cards = list.map((pokemon) => renderPokemonCard(pokemon, "small")).join("");
  return `<div class="carousel-container">${cards}</div>`;
}

export function showLoading(container, messageElement, text = "Cargando...") {
  messageElement.textContent = text;
  container.innerHTML = `
    <div class="pokedex-loading" role="status">
      <div class="pokedex-loading-inner">
        <span class="pokedex-loading-scan"></span>
        <span class="pokedex-loading-label">SCAN</span>
      </div>
    </div>
  `;
}

export function showMessage(messageElement, text) {
  messageElement.textContent = text;
}
