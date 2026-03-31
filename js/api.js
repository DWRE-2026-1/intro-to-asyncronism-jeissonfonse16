import { extractEvolutionChainId } from "./utils.js";

const BASE_URL = "https://pokeapi.co/api/v2";

async function fetchJson(path) {
  const response = await fetch(`${BASE_URL}/${path}`);
  if (!response.ok) {
    throw new Error(`No se pudo consultar ${path}`);
  }
  return response.json();
}

export async function searchPokemon(query) {
  return fetchJson(`pokemon/${query}`);
}

export async function searchByType(type) {
  return fetchJson(`type/${type}`);
}

export async function getPokemonSpecies(id) {
  return fetchJson(`pokemon-species/${id}`);
}

export async function getEvolutionData(url) {
  const chainId = extractEvolutionChainId(url);
  if (!chainId) {
    throw new Error("Cadena evolutiva inválida");
  }
  return fetchJson(`evolution-chain/${chainId}`);
}

function findParentInEvolutionChain(node, targetName, parent = null) {
  if (!node) return null;
  if (node.species?.name === targetName) {
    return parent;
  }

  for (const evo of node.evolves_to || []) {
    const result = findParentInEvolutionChain(evo, targetName, node.species?.name || null);
    if (result !== null) return result;
  }

  return null;
}

export async function getEvolutionLabel(pokemonId, pokemonName) {
  try {
    const species = await getPokemonSpecies(pokemonId);
    const evolutionData = await getEvolutionData(species.evolution_chain.url);
    const parentName = findParentInEvolutionChain(evolutionData.chain, pokemonName);

    if (!parentName) return "Basic Pokemon";
    return `Evoluciona de ${parentName}`;
  } catch (_error) {
    return "Dato evolutivo no disponible";
  }
}
