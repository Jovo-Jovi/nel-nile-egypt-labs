// Pair lists the Programmes module enforces at write time.
// Declared on catalogEntities so guard:schema compares them to the
// bilingual_when_published set. ProgrammeLabTest note pair is enforced
// on publish by parseProgrammeLabTestWrite.

export {
  LAB_TEST_BILINGUAL_PAIRS,
  PROGRAMME_BILINGUAL_PAIRS,
  PROGRAMME_LAB_TEST_BILINGUAL_PAIRS,
} from "./catalogEntities";
