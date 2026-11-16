import { ArrowUpRight } from "lucide-react";
import { socialProfiles } from "@/data/site";

export function SocialLinks({ label = "Social media" }: { label?: string }) {
  return (
    <nav className="social-links" aria-label={label}>
      {socialProfiles.map((profile) => (
        <a key={profile.label} href={profile.url} target="_blank" rel="noopener noreferrer">
          {profile.label}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
