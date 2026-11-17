"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

const categories = [
  "All projects",
  ...new Set(projects.map((project) => project.category)),
];

export function ProjectGallery() {
  const [category, setCategory] = useState("All projects");
  const visible =
    category === "All projects"
      ? projects
      : projects.filter((project) => project.category === category);
  return (
    <>
      <div
        className="work-filters"
        role="group"
        aria-label="Filter projects by category"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === category}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
        <span className="work-count mono" role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <div className="selected-work-grid">
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
          />
        ))}
      </div>
    </>
  );
}
