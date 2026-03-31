import { getPokemonCardMeta, searchByType, searchPokemon } from "./api.js";
import { renderPokemonCard, renderPokemonCarousel, showLoading, showMessage } from "./ui.js";
import { normalizeSearchInput, isNumericQuery, parseOptionalNumber } from "./utils.js";

const simpleSearchForm = document.querySelector("#simple-search-form");
const advancedSearchForm = document.querySelector("#advanced-search-form");
const queryInput = document.querySelector("#pokemon-query");
const toggleAdvancedBtn = document.querySelector("#toggle-advanced-btn");
const typeFilter = document.querySelector("#type-filter");
const heightFilter = document.querySelector("#height-filter");
const weightFilter = document.querySelector("#weight-filter");
const resultsContainer = document.querySelector("#results");
const statusMessage = document.querySelector("#status-message");

const TYPE_RESULT_LIMIT = 40;

function decoratePokemonWithEvolution(pokemon) {
  return getPokemonCardMeta(pokemon.id, pokemon.name).then((meta) => ({
    ...pokemon,
    ...meta
  }));
}

function clearResults() {
  resultsContainer.innerHTML = "";
}

async function handleSimpleSearch(event) {
  event.preventDefault();
  const normalized = normalizeSearchInput(queryInput.value);

  if (!normalized) {
    clearResults();
    showMessage(statusMessage, "Escribe un nombre o número para buscar.");
    return;
  }

  showLoading(resultsContainer, statusMessage, "Buscando Pokémon...");

  try {
    const query = isNumericQuery(normalized) ? Number(normalized) : normalized;
    const pokemon = await searchPokemon(query);
    const cardData = await decoratePokemonWithEvolution(pokemon);
    resultsContainer.innerHTML = renderPokemonCard(cardData);
    showMessage(statusMessage, "Resultado encontrado.");
  } catch (_error) {
    clearResults();
    showMessage(statusMessage, "No se encontró ningún Pokémon con ese criterio.");
  }
}

async function handleAdvancedSearch(event) {
  event.preventDefault();

  const selectedType = typeFilter.value;
  const maxHeight = parseOptionalNumber(heightFilter.value);
  const maxWeight = parseOptionalNumber(weightFilter.value);

  if (!selectedType) {
    clearResults();
    showMessage(statusMessage, "Selecciona un tipo para la búsqueda avanzada.");
    return;
  }

  showLoading(resultsContainer, statusMessage, "Consultando por tipo y aplicando filtros...");

  try {
    const typeData = await searchByType(selectedType);
    const selectedEntries = typeData.pokemon.slice(0, TYPE_RESULT_LIMIT);

    const detailedList = await Promise.all(
      selectedEntries.map((entry) => searchPokemon(entry.pokemon.name).catch(() => null))
    );

    const validPokemons = detailedList.filter(Boolean);
    const filtered = validPokemons.filter((pokemon) => {
      const heightOk = maxHeight ? pokemon.height <= maxHeight : true;
      const weightOk = maxWeight ? pokemon.weight <= maxWeight : true;
      return heightOk && weightOk;
    });

    if (filtered.length === 0) {
      clearResults();
      showMessage(statusMessage, "No hay resultados con esos filtros.");
      return;
    }

    const withEvolution = await Promise.all(filtered.map((pokemon) => decoratePokemonWithEvolution(pokemon)));
    resultsContainer.innerHTML = renderPokemonCarousel(withEvolution);
    const suffix = typeData.pokemon.length > TYPE_RESULT_LIMIT ? ` (mostrando ${TYPE_RESULT_LIMIT} por rendimiento)` : "";
    showMessage(statusMessage, `Se encontraron ${withEvolution.length} resultados.${suffix}`);
  } catch (_error) {
    clearResults();
    showMessage(statusMessage, "Ocurrió un error consultando la PokeAPI.");
  }
}

function toggleAdvancedSearch() {
  const isHidden = advancedSearchForm.classList.toggle("hidden");
  toggleAdvancedBtn.textContent = isHidden ? "Mostrar búsqueda avanzada" : "Ocultar búsqueda avanzada";
  toggleAdvancedBtn.setAttribute("aria-expanded", String(!isHidden));
}

simpleSearchForm.addEventListener("submit", handleSimpleSearch);
advancedSearchForm.addEventListener("submit", handleAdvancedSearch);
toggleAdvancedBtn.addEventListener("click", toggleAdvancedSearch);
