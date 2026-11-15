import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return <main id="main-content" className="container not-found"><p className="eyebrow">404 / A different direction</p><h1>There’s nothing<br />built here. Yet.</h1><p>The page you’re looking for doesn’t exist. Let’s get you back to somewhere useful.</p><Button href="/">Back to home</Button></main>;
}
