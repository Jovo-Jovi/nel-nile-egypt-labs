// Pair lists the Programmes module will enforce at write time.
// Declared on catalogEntities so guard:schema compares them to the
// bilingual_when_published set. ProgrammeLabTest stays declared-only
// until T24B.

export {
  LAB_TEST_BILINGUAL_PAIRS,
  PROGRAMME_BILINGUAL_PAIRS,
} from "./catalogEntities";

export const PROGRAMME_LAB_TEST_BILINGUAL_PAIRS = [["note_ar", "note_en"]] as const;
