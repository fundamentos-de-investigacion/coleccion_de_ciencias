export const validateSpecimen = (specimen) => {
  const errors = {};

  if (!specimen.scientificName || specimen.scientificName.trim().length < 3) {
    errors.scientificName = 'Nombre científico requerido (mínimo 3 caracteres).';
  }

  if (!specimen.kingdom) {
    errors.kingdom = 'El Reino es obligatorio.';
  }

  if (specimen.eventDate) {
    const date = new Date(specimen.eventDate);
    if (isNaN(date.getTime())) {
      errors.eventDate = 'Fecha de evento no válida.';
    }
  }

  if (specimen.decimalLatitude !== null && specimen.decimalLatitude !== undefined) {
    const lat = parseFloat(specimen.decimalLatitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.decimalLatitude = 'Latitud debe estar entre -90 y 90.';
    }
  }

  if (specimen.decimalLongitude !== null && specimen.decimalLongitude !== undefined) {
    const lng = parseFloat(specimen.decimalLongitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.decimalLongitude = 'Longitud debe estar entre -180 y 180.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a JSON imported file structure.
 * Must be an array of objects.
 */
export const validateImportFile = (data) => {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'La estructura debe ser un arreglo de especímenes.' };
  }
  
  if (data.length === 0) {
    return { isValid: false, error: 'El archivo está vacío.' };
  }

  // Basic version check if exists
  const hasVersion = data.some(item => item.version);
  if (hasVersion) {
    // Logic for version compatibility would go here
  }

  return { isValid: true };
};
