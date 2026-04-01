export function normalizeSearchInput(value) {
  return value.trim().toLowerCase();
}

export function isNumericQuery(value) {
  return /^\d+$/.test(value);
}

export function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function extractEvolutionChainId(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export function getTypeColor(type) {
  const map = {
    fire: "#f19a4f",
    water: "#68b2ff",
    grass: "#78c974",
    electric: "#f4d44e",
    psychic: "#b27adf",
    fighting: "#c89b6a",
    rock: "#bda27e",
    ground: "#d4b98b",
    normal: "#b9b9b9",
    poison: "#a786d4",
    ice: "#9adfed"
  };

  return map[type] || "#d4c5a5";
}

export function parseOptionalNumber(value) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
