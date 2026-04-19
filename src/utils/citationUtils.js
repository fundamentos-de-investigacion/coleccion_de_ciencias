/**
 * Utility for generating academic citations for scientific specimens.
 */

export const generateAPACitation = (specimen) => {
  const author = specimen.recordedBy || 'Colección Institucional';
  const year = specimen.eventDate ? specimen.eventDate.split('-')[0] : 'n.d.';
  const scientificName = specimen.scientificName || 'Ejemplar no identificado';
  const family = specimen.family || '';
  const kingdom = specimen.kingdom || '';
  const occurrenceID = specimen.occurrenceID || '';
  const herbarium = 'Colección de Ciencias Naturales';

  return `${author} (${year}). _${scientificName}_ (${family}: ${kingdom}). [Espécimen Biológico]. ${herbarium}. ID Digital: ${occurrenceID}`;
};

export const generateBibTeXCitation = (specimen) => {
  const id = (specimen.scientificName || 'specimen').toLowerCase().replace(/\s+/g, '_') + '_' + (specimen.occurrenceID || '0').slice(0, 8);
  const author = specimen.recordedBy || 'Institution';
  const title = specimen.scientificName || 'Unidentified Specimen';
  const year = specimen.eventDate ? specimen.eventDate.split('-')[0] : new Date().getFullYear();
  const note = `Biological specimen from ${specimen.family || 'Unknown Family'}. Digital ID: ${specimen.occurrenceID}`;

  return `@misc{${id},
  author = {${author}},
  title = {${title}},
  howpublished = {Colección de Ciencias Naturales},
  year = {${year}},
  note = {${note}}
}`;
};
