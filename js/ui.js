import { capitalize, getTypeColor } from "./utils.js";

function createInfoItem(label, value, extraClass = "") {
  return `
    <div class="info-item ${extraClass}">
      <span class="info-label">${label}</span>
      <span class="info-value">${value}</span>
    </div>
  `;
}

function formatTypeBadges(types = []) {
  return types
    .map((item) => `<span class="type-pill">${capitalize(item.type.name)}</span>`)
    .join("");
}

function formatAbilities(abilities = []) {
  return abilities
    .map((item) => capitalize(item.ability.name.replace("-", " ")))
    .slice(0, 3)
    .join(" · ");
}

function formatMeters(decimeters) {
  return (decimeters / 10).toFixed(1).replace(".0", "");
}

function formatKilograms(hectograms) {
  return (hectograms / 10).toFixed(1).replace(".0", "");
}

function renderMainStats(stats = []) {
  const preferred = ["hp", "attack", "defense", "speed"];
  const chosen = preferred
    .map((key) => stats.find((item) => item.stat.name === key))
    .filter(Boolean);

  return chosen
    .map((item) => {
      const value = item.base_stat;
      const width = Math.min(100, Math.round((value / 180) * 100));
      return `
        <div class="stat-row">
          <span class="stat-name">${capitalize(item.stat.name.replace("-", " "))}</span>
          <div class="stat-track"><span class="stat-bar" style="width: ${width}%"></span></div>
          <span class="stat-value">${value}</span>
        </div>
      `;
    })
    .join("");
}

export function renderPokemonCard(data, size = "large") {
  const primaryType = data.types[0]?.type?.name || "normal";
  const color = getTypeColor(primaryType);
  const sprite =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default ||
    "";

  return `
    <article class="pokemon-card ${size} type-${primaryType}" style="--card-bg: ${color}">
      <div class="card-shell">
        <div class="card-top">
          <span class="evolution-badge">${data.evolutionLabel}</span>
          <h2 class="pokemon-name">${capitalize(data.name)}</h2>
          <p class="hp">${data.stats[0]?.base_stat || "?"} HP</p>
        </div>
        <figure class="image-frame">
          <img src="${sprite}" alt="Imagen de ${data.name}" loading="lazy" />
        </figure>
        <section class="card-info">
          ${createInfoItem("ID", `#${data.id}`)}
          ${createInfoItem("Especie", data.genus || "No disponible")}
          ${createInfoItem("Altura", `${formatMeters(data.height)} m`)}
          ${createInfoItem("Peso", `${formatKilograms(data.weight)} kg`)}
        </section>
        <section class="card-meta">
          <p><strong>Tipos:</strong> ${formatTypeBadges(data.types)}</p>
          <p><strong>Habilidades:</strong> ${formatAbilities(data.abilities)}</p>
        </section>
        <section class="stats-panel">
          ${renderMainStats(data.stats)}
        </section>
        ${
          data.flavorText
            ? `<p class="card-footnote">"${data.flavorText}"</p>`
            : `<p class="card-footnote">Carta web inspirada en el estilo clásico del Base Set.</p>`
        }
      </div>
    </article>
  `;
}

export function renderPokemonCarousel(list) {
  const cards = list.map((pokemon) => renderPokemonCard(pokemon, "small")).join("");
  return `<div class="carousel-container">${cards}</div>`;
}

export function showLoading(container, messageElement, text = "Cargando...") {
  messageElement.textContent = text;
  container.innerHTML = "";
}

export function showMessage(messageElement, text) {
  messageElement.textContent = text;
}
