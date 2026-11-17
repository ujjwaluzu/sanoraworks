import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";

const plan = JSON.parse(
  readFileSync(
    new URL("../docs/agent-dns-records.json", import.meta.url),
    "utf8",
  ),
);
const apply = process.argv.includes("--apply");
const tokenFile = new URL("../.env.dns.local", import.meta.url);
const token =
  process.env.CLOUDFLARE_DNS_API_TOKEN ||
  (existsSync(tokenFile)
    ? readFileSync(tokenFile, "utf8")
        .match(/^CLOUDFLARE_DNS_API_TOKEN\s*=\s*([^\r\n]+)/m)?.[1]
        ?.trim()
        .replace(/^["']|["']$/g, "")
    : "");
if (!token)
  throw new Error(
    "Save the zone-scoped DNS Edit token to ignored .env.dns.local or CLOUDFLARE_DNS_API_TOKEN. Never paste tokens into chat.",
  );
const zoneId = "0b6408c915adf319c1d443305f1bd86a";
async function api(path, method = "GET", body) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok || !data.success)
    throw new Error(
      `Cloudflare ${method} ${path}: ${JSON.stringify(data.errors)}`,
    );
  return data.result;
}
async function records() {
  const result = [];
  for (let page = 1; ; page++) {
    const batch = await api(
      `/zones/${zoneId}/dns_records?per_page=100&page=${page}`,
    );
    result.push(...batch);
    if (batch.length < 100) return result;
  }
}
const zone = await api(`/zones/${zoneId}`);
if (zone.name !== plan.zone) throw new Error("Refusing a different DNS zone");
const before = await records();
const protectedRecords = (list) =>
  list
    .filter(
      (r) => !plan.records.some((p) => p.type === r.type && p.name === r.name),
    )
    .map((r) => ({
      id: r.id,
      type: r.type,
      name: r.name,
      content: r.content,
      data: r.data,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
console.log(
  `Zone confirmed: ${zone.name}. Mode: ${apply ? "apply" : "read-only plan"}. Existing nameservers: ${zone.name_servers.join(", ")}`,
);
for (const record of plan.records) {
  const existing = before.filter(
    (r) => r.type === record.type && r.name === record.name,
  );
  const conflict = before.find(
    (r) => r.name === record.name && r.type === "CNAME",
  );
  if (conflict)
    throw new Error(
      `CNAME at ${record.name} prevents coexisting SVCB/TXT. Inspect the Worker custom domain; no record was removed.`,
    );
  const same = existing.find((r) =>
    record.type === "SVCB"
      ? r.data?.priority === record.data.priority &&
        r.data?.target.replace(/\.$/, "") === record.data.target &&
        r.data?.value === record.data.value
      : r.content === record.content,
  );
  if (same) {
    console.log(`Already present: ${record.type} ${record.name}`);
    continue;
  }
  if (existing.length)
    throw new Error(
      `Existing ${record.type} at ${record.name} differs from the plan. Review it before making changes.`,
    );
  console.log(
    `${apply ? "Creating" : "Would create"}: ${record.type} ${record.name}`,
  );
  if (apply) await api(`/zones/${zoneId}/dns_records`, "POST", record);
}
let dnssec = await api(`/zones/${zoneId}/dnssec`);
if (apply && dnssec.status === "disabled")
  dnssec = await api(`/zones/${zoneId}/dnssec`, "PATCH", { status: "active" });
if (apply) {
  const after = await records();
  if (
    JSON.stringify(protectedRecords(before)) !==
    JSON.stringify(protectedRecords(after))
  )
    throw new Error(
      "Unrelated DNS records changed during the operation; inspect account activity.",
    );
  const afterZone = await api(`/zones/${zoneId}`);
  if (
    JSON.stringify(zone.name_servers) !== JSON.stringify(afterZone.name_servers)
  )
    throw new Error(
      "Nameservers changed during the operation; inspect account activity.",
    );
  mkdirSync("artifacts/seo", { recursive: true });
  writeFileSync(
    "artifacts/seo/dns-provisioning.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        zone: zone.name,
        nameservers: zone.name_servers,
        records: after.filter((r) =>
          plan.records.some((p) => p.type === r.type && p.name === r.name),
        ),
        dnssec,
        unrelatedRecordsPreserved: true,
      },
      null,
      2,
    ),
  );
}
// DS values are public DNS material, never the API token or signing private key.
console.log(
  JSON.stringify(
    {
      dnssecStatus: dnssec.status,
      hostingerDS: {
        keyTag: dnssec.key_tag,
        algorithm: dnssec.algorithm,
        digestType: dnssec.digest_type,
        digest: dnssec.digest,
        ds: dnssec.ds,
      },
    },
    null,
    2,
  ),
);
console.log(
  "Hostinger must publish the matching DS at the registrar. Then run npm run test:agents and require both validating resolvers to report authenticated answers.",
);
