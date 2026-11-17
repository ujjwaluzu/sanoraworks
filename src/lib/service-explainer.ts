import type { services } from "../data/services.ts";

export type ServiceSlug = (typeof services)[number]["slug"];
export interface ExplainerStage { title: string; caption: string }
export interface ServiceExplainerDefinition {
  title: string;
  description: string;
  stages: readonly [ExplainerStage, ExplainerStage, ExplainerStage, ExplainerStage, ExplainerStage];
}
export const STAGE_DURATION = 3_000;
export const LOOP_DURATION = STAGE_DURATION * 5;
export const explainers: Record<ServiceSlug, ServiceExplainerDefinition> = {
  "software-web-development": {
    title: "From request to response",
    description: "A browser interface assembles, a cursor interacts with a card, and the page updates.",
    stages: [
      { title: "Build the interface", caption: "The browser navigation and first interface components appear." },
      { title: "Arrange components", caption: "Cards and actions assemble into a usable page." },
      { title: "Interact with the page", caption: "A cursor moves to an interactive control." },
      { title: "Process the interaction", caption: "The selected control responds to the interaction." },
      { title: "Update the interface", caption: "The interface displays the completed result." },
    ],
  },
  "product-engineering": {
    title: "From prototype to iteration",
    description: "Navigation, content and feature modules dock into an application frame. An inspection sweep checks the assembly, then an improved feature replaces the original.",
    stages: [
      { title: "Assemble components", caption: "Separate interface components move into the product frame." },
      { title: "Connect modules", caption: "The modules form a complete product interface." },
      { title: "Validate behavior", caption: "A test sweep checks the assembled interface." },
      { title: "Release the product", caption: "The validation indicator confirms the product is ready." },
      { title: "Improve a module", caption: "An updated module replaces the original as the product evolves." },
    ],
  },
  "ai-intelligent-automation": {
    title: "From trigger to approved action",
    description: "A document enters a processing surface. A scan isolates three information fields, which align into structured records and pass sequential validation.",
    stages: [
      { title: "Receive trigger", caption: "An incoming document triggers a defined processing workflow." },
      { title: "Prepare information", caption: "The workflow extracts and organises the information the AI needs." },
      { title: "AI processes information", caption: "An AI model interprets the prepared information for the task." },
      { title: "Validate and review", caption: "Rules check the result, with human review where the workflow requires it." },
      { title: "Perform approved action", caption: "Only a result that passes the review step proceeds to the approved action." },
    ],
  },
  "cloud-infrastructure": {
    title: "From release to healthy traffic",
    description: "A cloud uploads a release to a cluster of server towers. An additional tower starts while a graph monitors activity.",
    stages: [
      { title: "Prepare release", caption: "A deployment packages the application and its configuration for release." },
      { title: "Start updated instance", caption: "An updated instance starts alongside the existing running instance." },
      { title: "Check health", caption: "Health checks confirm the updated instance is ready to serve requests." },
      { title: "Route healthy traffic", caption: "The load balancer routes requests to instances that pass their health checks." },
      { title: "Monitor operation", caption: "Monitoring follows the running system so the team can respond to problems." },
    ],
  },
};

export function stageAt(elapsed: number) {
  const time = ((elapsed % LOOP_DURATION) + LOOP_DURATION) % LOOP_DURATION;
  return { index: Math.floor(time / STAGE_DURATION), progress: (time % STAGE_DURATION) / STAGE_DURATION };
}
export function canPlay({ visible, hidden, reduced }: { visible: boolean; hidden: boolean; reduced: boolean }) {
  return visible && !hidden && !reduced;
}
