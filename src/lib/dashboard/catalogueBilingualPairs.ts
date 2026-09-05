// Pair lists the Programmes module will enforce at write time.
// Declared here so guard:schema can compare them to the database
// bilingual_when_published set before that module exists.
// Do not treat this file as the start of the Programmes module.

export const LAB_TEST_BILINGUAL_PAIRS = [["name_ar", "name_en"]] as const;

export const PROGRAMME_BILINGUAL_PAIRS = [
  ["name_ar", "name_en"],
  ["description_ar", "description_en"],
  ["preparation_notes_ar", "preparation_notes_en"],
] as const;

export const PROGRAMME_LAB_TEST_BILINGUAL_PAIRS = [["note_ar", "note_en"]] as const;
