import type { Project } from "@/data/projects";
import styles from "./project-content.module.css";

const concepts = {
  booking: { label: "Your appointments", title: "A clearer day ahead.", rows: [["09:00", "Home cleaning"], ["11:00", "Consultation"], ["14:00", "Available slot"]] },
  approval: { label: "Client review", title: "Feedback to final nod.", rows: [["V1", "Feedback received"], ["V2", "Changes requested"], ["V3", "Ready for approval"]] },
  enquiry: { label: "Enquiry workspace", title: "A useful first reply.", rows: [["01", "New request"], ["02", "Details organised"], ["03", "Draft for review"]] },
  monitoring: { label: "Availability overview", title: "Keep an eye on what runs.", rows: [["WEB", "Website checks"], ["APP", "Incident history"], ["OPS", "Release activity"]] },
};

export function ProjectPreview({ project, large = false }: { project: Project; large?: boolean }) {
  const concept = concepts[project.theme];
  return (
    <div className={`project-preview ${styles.preview} ${large ? styles.large : ""}`} role="img" aria-label={`Illustrative interface concept for ${project.name}, in development; not a live product screenshot`}>
      <div className={styles.window} aria-hidden="true">
        <div className={styles.titlebar}><strong>{project.name}</strong><span>_ □ ×</span></div>
        <div className={styles.toolbar}>{concept.label}</div>
        <div className={styles.canvas}>
          <strong className={styles.conceptHeading}>{concept.title}</strong>
          {concept.rows.map(([label, text]) => (
            <div className={styles.row} key={label}><span>{label}</span><span>{text}</span><i /></div>
          ))}
        </div>
      </div>
      <span className={styles.disclaimer}>Illustrative interface concept.</span>
    </div>
  );
}
