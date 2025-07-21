export const extractMultiplerFromLocation = input => {
  const parts = input.split('-');
  for (let part of parts) {
    part = part.trim();
    if (part.endsWith('X')) {
      return part;
    }
  }
  return null; // If no part ends with X
};
