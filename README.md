# SANORA WORKS

The independent technology and engineering company website. Built with Next.js App Router, React, strict TypeScript, Tailwind CSS, and Lucide icons.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production checks:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

## Configuration

Copy `.env.example` to `.env.local` and configure verified contact details when available. Keep secrets out of Git. Project, service, company, and navigation content lives in `src/data`. Unconfigured external links are not rendered as working links.

The contact experience supports downloading a local project brief before an enquiry service is connected. It must never claim a message was delivered without a successful backend response. Integration instructions will be added with the contact milestone.

## Development milestones

Implementation is committed and pushed incrementally: project setup, global navigation and layout, homepage sections, secondary pages, enquiry handling, and final validation.

All rights reserved. This repository does not grant an open-source license.
