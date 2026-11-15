import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Approach } from "@/components/home/Approach";
import { Principles } from "@/components/home/Principles";
import { AboutPreview } from "@/components/home/AboutPreview";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";

export default function Home() {
  return <main id="main-content"><Hero /><ServicesOverview /><SelectedWork /><Approach /><Principles /><AboutPreview /><BrandPhilosophy /></main>;
}
