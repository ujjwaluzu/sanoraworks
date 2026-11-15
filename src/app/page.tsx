import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Approach } from "@/components/home/Approach";

export default function Home() {
  return <main id="main-content"><Hero /><ServicesOverview /><SelectedWork /><Approach /></main>;
}
