import Image from "next/image";
import type { Project } from "@/data/projects";
import styles from "./project-content.module.css";

const artwork: Record<Project["theme"], { file: string; alt: string }> = {
  booking: {
    file: "slotbreeze",
    alt: "SlotBreeze concept: a weekly service calendar with appointment blocks and booking details.",
  },
  approval: {
    file: "proofhuddle",
    alt: "ProofHuddle concept: a website design proof beside client feedback, version history, and approval actions.",
  },
  enquiry: {
    file: "enquirywing",
    alt: "EnquiryWing concept: an incoming enquiry, an organised brief, and a reply draft awaiting human review.",
  },
  monitoring: {
    file: "uptimeperch",
    alt: "UptimePerch concept: website availability checks, response times, and incident and release history.",
  },
};

export function ProjectPreview({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const image = artwork[project.theme];

  return (
    <figure
      className={`project-preview ${styles.preview} ${large ? styles.large : ""}`}
    >
      <Image
        src={`/projects/${image.file}-concept${large ? "" : "-640"}.webp`}
        alt={image.alt}
        width={large ? 1536 : 640}
        height={large ? 1024 : 427}
        className={styles.artwork}
        loading="lazy"
        unoptimized
      />
      <figcaption className={`preview-disclaimer ${styles.disclaimer}`}>
        Illustrative interface concept.
      </figcaption>
    </figure>
  );
}
