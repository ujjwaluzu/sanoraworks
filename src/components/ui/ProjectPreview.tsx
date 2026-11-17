import Image from "next/image";
import type { Project } from "@/data/projects";
import styles from "./project-content.module.css";

const artwork: Record<Project["theme"], { file: string; alt: string }> = {
  booking: {
    file: "slotbreeze",
    alt: "SlotBreeze concept: a home-service website with cleaning options, a date picker, available times, and booking confirmation.",
  },
  approval: {
    file: "proofhuddle",
    alt: "ProofHuddle concept: a design poster with numbered feedback pins, client comments, version history, and approval actions.",
  },
  enquiry: {
    file: "enquirywing",
    alt: "EnquiryWing concept: an incoming message becomes an organised brief and a suggested reply awaiting human approval.",
  },
  monitoring: {
    file: "uptimeperch",
    alt: "UptimePerch concept: a dark monitoring console showing service availability, response times, incidents, and recovery.",
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
