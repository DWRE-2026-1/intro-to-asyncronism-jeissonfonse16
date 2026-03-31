import { capitalize, getTypeColor } from "./utils.js";

function createInfoLine(label, value) {
  return `<p><strong>${label}:</strong> ${value}</p>`;
}

export function renderPokemonCard(data, size = "large") {
  const primaryType = data.types[0]?.type?.name || "normal";
  const color = getTypeColor(primaryType);
  const sprite =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default ||
    "";

  return `
    <article class="pokemon-card ${size}" style="--card-bg: ${color}">
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
          ${createInfoLine("ID", `#${data.id}`)}
          ${createInfoLine("Tipo principal", capitalize(primaryType))}
          ${createInfoLine("Altura", `${data.height} dm`)}
          ${createInfoLine("Peso", `${data.weight} hg`)}
        </section>
        <p class="card-footnote">Carta web inspirada en el estilo clásico del Base Set.</p>
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
