/**
 * Normalizes text by converting to lowercase and removing diacritics
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // split letters and diacritics
    .replace(/[\u0300-\u036f]/g, ""); // remove diacritics
}
