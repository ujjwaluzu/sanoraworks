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
      <picture>
        <source
          type="image/webp"
          srcSet={`/projects/${image.file}-concept-320.webp 320w, /projects/${image.file}-concept-640.webp 640w, /projects/${image.file}-concept.webp 1536w`}
          sizes={large ? "(max-width: 800px) calc(100vw - 80px), calc(100vw - 400px)" : "(max-width: 599px) calc(100vw - 100px), (max-width: 800px) 30vw, 24vw"}
        />
        <Image
          src={`/projects/${image.file}-concept${large ? "" : "-640"}.webp`}
          alt={image.alt}
          width={large ? 1536 : 640}
          height={large ? 1024 : 427}
          className={styles.artwork}
          loading="lazy"
          unoptimized
        />
      </picture>
      <figcaption className={`preview-disclaimer ${styles.disclaimer}`}>
        Illustrative interface concept.
      </figcaption>
    </figure>
  );
}
