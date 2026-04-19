/**
 * Normalizes scientific names: Capitalizes first letter (Genus) and lowercases the rest (species).
 * Example: "esPELEtia GRANDiflora" -> "Espeletia grandiflora"
 */
export const normalizeScientificName = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  
  const genus = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  const species = parts.slice(1).map(p => p.toLowerCase()).join(' ');
  
  return species ? `${genus} ${species}` : genus;
};

/**
 * Trims all string values in an object and normalizes empty strings to null.
 */
export const normalizeSpecimenData = (data) => {
  const normalized = { ...data };
  
  Object.keys(normalized).forEach(key => {
    if (typeof normalized[key] === 'string') {
      const trimmed = normalized[key].trim();
      normalized[key] = trimmed === '' ? null : trimmed;
    }
  });
  
  if (normalized.scientificName) {
    normalized.scientificName = normalizeScientificName(normalized.scientificName);
  }
  
  return normalized;
};

/**
 * Standardizes date to ISO YYYY-MM-DD
 */
export const normalizeDate = (dateString) => {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
};
