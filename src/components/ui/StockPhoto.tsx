import styles from "./StockPhoto.module.css";

export type StockSlot =
  | "hero"
  | "labClean"
  | "microscope"
  | "samples"
  | "clinic"
  | "stethoscope"
  | "care"
  | "family";

const SRC: Record<StockSlot, string> = {
  hero: "/preview-stock/hero.jpg?v=owner1",
  labClean: "/preview-stock/lab-clean.jpg",
  microscope: "/preview-stock/microscope.jpg",
  samples: "/preview-stock/samples.jpg",
  clinic: "/preview-stock/clinic.jpg",
  stethoscope: "/preview-stock/stethoscope.jpg",
  care: "/preview-stock/care.jpg",
  family: "/preview-stock/family.jpg",
};

interface StockPhotoProps {
  slot: StockSlot;
  alt: string;
}

// Local Unsplash stills for the owner design-decision mock only. Not
// client photography, not a third-party lab's files, never hotlinked.
export function StockPhoto({ slot, alt }: StockPhotoProps) {
  return (
    // Layout judgment needs a real photograph; next/image cannot swap
    // on error the way MarkSlot does, and these files are static.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={SRC[slot]} alt={alt} className={styles.photo} />
  );
}
