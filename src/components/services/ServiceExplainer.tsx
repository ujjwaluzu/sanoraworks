import { useId } from "react";
import { explainers, type ServiceSlug } from "@/lib/service-explainer";
import { ServiceScene } from "./ServiceScenes";
import { ExplainerPlayback } from "./ExplainerPlayback";
import styles from "./service-explainer.module.css";

// Trim the unused canvas while keeping room for every animated pose.
const sceneBounds: Record<ServiceSlug, string> = {
  "software-web-development": "0 48 800 320",
  "product-engineering": "0 52 800 368",
  "ai-intelligent-automation": "0 76 800 282",
  "cloud-infrastructure": "0 8 800 398",
};

export function ServiceExplainer({ slug }: { slug: ServiceSlug }) {
  const id = `service-figure-${useId().replaceAll(":", "")}`;
  const definition = explainers[slug];
  return (
    <ExplainerPlayback definition={definition} slug={slug} titleId={`${id}-title`}>
      <span className="sr-only" id={`${id}-title`} key="title">{definition.title}</span>
      <svg key="scene" className={styles.scene} viewBox={sceneBounds[slug]} role="img" aria-labelledby={`${id}-description`} focusable="false">
        <title id={`${id}-description`}>{`${definition.description} Simplified conceptual animation.`}</title>
        <svg width="800" height="420" viewBox="0 0 800 420" overflow="visible" aria-hidden="true">
          <ServiceScene slug={slug} id={id} />
        </svg>
      </svg>
    </ExplainerPlayback>
  );
}
