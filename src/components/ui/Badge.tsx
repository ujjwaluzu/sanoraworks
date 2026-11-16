import Link from "next/link";

export function Badge({
  label,
  top,
  symbol,
  href,
  tone = "teal",
}: {
  label: string;
  top: string;
  symbol: string;
  href?: string;
  tone?: "teal" | "navy" | "cream";
}) {
  const content = (
    <>
      <span className="badge-symbol" aria-hidden="true">
        {symbol}
      </span>
      <span>
        <small>{top}</small>
        <strong>{label}</strong>
      </span>
    </>
  );
  return href ? (
    <Link className={`web-badge badge-${tone}`} href={href}>
      {content}
    </Link>
  ) : (
    <span className={`web-badge badge-${tone}`}>{content}</span>
  );
}
