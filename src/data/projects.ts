export type Project = {
  slug: string;
  name: string;
  category: string;
  discipline: string;
  serviceSlug: string;
  status: "In development";
  description: string;
  overview: string;
  problem: string;
  theme: "booking" | "approval" | "enquiry" | "monitoring";
  audience: string[];
  features: { title: string; description: string }[];
  businessUses: { title: string; description: string }[];
  businessValue: string;
  technologies: string[];
  liveUrl: string | null;
  repositoryUrl: string | null;
};

// These projects are in development. Features describe the intended direction.
// Publish technology stacks and external URLs only when verified.
export const projects: Project[] = [
  {
    "slug": "slotbreeze",
    "name": "SlotBreeze",
    "category": "Booking & scheduling",
    "discipline": "Software & Web Development",
    "serviceSlug": "software-web-development",
    "theme": "booking",
    "status": "In development",
    "description": "A service business website and booking system designed to help customers find your services, choose an available appointment, and manage their booking.",
    "overview": "SlotBreeze brings a business website and appointment management into one place. We are building it around the needs of service businesses that take bookings through calls, messages, or spreadsheets. Customers would have a clear route from understanding a service to reserving a suitable time, while the owner would have an organised view of upcoming work.",
    "problem": "When service details, availability, and customer requests live in different places, arranging an appointment can take several conversations. SlotBreeze is intended to make that journey easier for both the customer and the person managing the business.",
    "audience": [
      "Cleaning and home service businesses",
      "Independent consultants and studios",
      "Small teams offering scheduled services"
    ],
    "features": [
      {
        "title": "A clear home for your services",
        "description": "Present what you offer, what each service includes, and the information a customer needs before booking."
      },
      {
        "title": "Appointments that fit your availability",
        "description": "Let customers choose from available times while giving the owner control over working hours and days away."
      },
      {
        "title": "One view of upcoming work",
        "description": "Bring booking details, customer information, and appointment status together so your team can prepare for the day."
      },
      {
        "title": "Easier booking changes",
        "description": "Give customers a straightforward way to cancel or reschedule, with confirmation messages that keep both sides informed."
      }
    ],
    "businessUses": [
      {
        "title": "For a cleaning company",
        "description": "A customer could compare cleaning services and reserve a suitable visit. The owner could review the address, selected service, and appointment details before the team arrives."
      },
      {
        "title": "For a consultant or studio",
        "description": "A similar approach could let clients book a consultation or session, with your services and booking options presented on the same website."
      }
    ],
    "businessValue": "A similar system could give your customers a clearer way to book and help your team spend less time coordinating appointments. The services, booking rules, and information collected would be agreed around the way your business works.",
    "technologies": [],
    "liveUrl": null,
    "repositoryUrl": null
  },
  {
    "slug": "proofhuddle",
    "name": "ProofHuddle",
    "category": "Feedback & approvals",
    "discipline": "Product Engineering",
    "serviceSlug": "product-engineering",
    "theme": "approval",
    "status": "In development",
    "description": "A client review workspace designed to keep deliverables, feedback, revision requests, and final approvals together, with a clear record of each decision.",
    "overview": "ProofHuddle is a product we are developing for freelancers, agencies, and teams that share work with clients. It is intended to give each deliverable a clear place for review, so everyone can see which version needs attention, what changes have been requested, and whether the client has approved it.",
    "problem": "Feedback can become difficult to follow when it is scattered across email, chat, and different versions of a file. A casual approval can also leave uncertainty about which version was agreed. ProofHuddle is designed to make those conversations and decisions easier to follow.",
    "audience": [
      "Freelancers sharing work with clients",
      "Design, marketing, and software agencies",
      "Internal teams reviewing deliverables"
    ],
    "features": [
      {
        "title": "Deliverables with context",
        "description": "Share a piece of work with its version, review notes, and deadline, so the reviewer knows what needs a decision."
      },
      {
        "title": "Feedback in one place",
        "description": "Keep comments and change requests attached to the deliverable being discussed, rather than spread across conversations."
      },
      {
        "title": "Clear review decisions",
        "description": "Let a reviewer request changes or approve a specific version, with the decision visible to the people working on it."
      },
      {
        "title": "A history you can follow",
        "description": "See earlier review rounds and decisions so the team can understand what changed and what was agreed."
      }
    ],
    "businessUses": [
      {
        "title": "For a design or marketing agency",
        "description": "A team could share a campaign concept, collect client comments, publish a revised version, and record approval before preparing the final deliverable."
      },
      {
        "title": "For an internal team",
        "description": "A similar workspace could help colleagues review a proposal, presentation, or website draft and keep the latest decision easy to find."
      }
    ],
    "businessValue": "A similar product could make the next action clearer for your team and your clients. It could support a review process where deliverables, versions, and decisions stay connected as the work moves forward.",
    "technologies": [],
    "liveUrl": null,
    "repositoryUrl": null
  },
  {
    "slug": "enquirywing",
    "name": "EnquiryWing",
    "category": "AI & enquiry automation",
    "discipline": "AI & Intelligent Automation",
    "serviceSlug": "ai-intelligent-automation",
    "theme": "enquiry",
    "status": "In development",
    "description": "An AI enquiry assistant designed to organise incoming requests, highlight the details that matter, and prepare relevant replies for a person to review.",
    "overview": "EnquiryWing is an enquiry management tool we are building for service businesses. It is intended to turn an incoming message into an organised request: a short summary, the relevant service, any budget or timeline the sender has provided, and the questions still worth asking. A person would review and approve a prepared reply before it is sent.",
    "problem": "A new enquiry may contain a useful opportunity but leave important details unstated. Reading every message, identifying the next step, and writing similar follow-up questions can take time. EnquiryWing is designed to help prepare that work while keeping the business owner in control of the conversation.",
    "audience": [
      "Agencies and consultancies receiving project enquiries",
      "Small service businesses with a shared inbox",
      "Teams handling requests from a website"
    ],
    "features": [
      {
        "title": "An organised enquiry inbox",
        "description": "Bring new requests into a clear list with their contact details, relevant service, and current follow-up status."
      },
      {
        "title": "A useful summary of each request",
        "description": "Highlight what the sender is asking for and any budget or timeline they have actually stated. Missing details remain visible as unknown."
      },
      {
        "title": "Relevant replies ready for review",
        "description": "Prepare a draft acknowledgement and follow-up questions based on the enquiry and the services the business offers."
      },
      {
        "title": "People stay in control",
        "description": "Let the team edit and approve replies, handle unclear requests directly, and track enquiries from new to contacted or closed."
      }
    ],
    "businessUses": [
      {
        "title": "For a software or creative agency",
        "description": "An enquiry about a booking website could be organised under web development, with a short brief and draft questions about services, availability, and the existing website."
      },
      {
        "title": "For a home service business",
        "description": "A similar workflow could highlight a requested service, location, and preferred date, then prepare questions about any missing details for the owner to review."
      }
    ],
    "businessValue": "A similar workflow could help your team respond more consistently and spend less time preparing routine follow-ups. The service categories and reply guidance would reflect your business, with a person responsible for outgoing messages.",
    "technologies": [],
    "liveUrl": null,
    "repositoryUrl": null
  },
  {
    "slug": "uptimeperch",
    "name": "UptimePerch",
    "category": "Monitoring & cloud operations",
    "discipline": "Cloud & Infrastructure",
    "serviceSlug": "cloud-infrastructure",
    "theme": "monitoring",
    "status": "In development",
    "description": "A website monitoring and cloud operations project designed to make availability, incidents, and application releases easier for a small team to follow.",
    "overview": "UptimePerch combines website availability monitoring with a considered approach to running an application online. We are developing it to give small teams a clear view of whether their websites are reachable, when a problem started, and when service recovered, alongside a more organised release process.",
    "problem": "A website may stop responding before the team responsible for it notices. When releases and incident updates are also handled informally, understanding what happened can take longer. UptimePerch is intended to make those events visible and easier to communicate.",
    "audience": [
      "Small businesses relying on a website or portal",
      "Agencies looking after several client websites",
      "Product teams preparing and operating an application"
    ],
    "features": [
      {
        "title": "Regular availability checks",
        "description": "Check whether monitored websites respond and keep a history of availability and response times."
      },
      {
        "title": "Outage and recovery notifications",
        "description": "Notify the responsible person when a confirmed problem starts and when the website becomes reachable again."
      },
      {
        "title": "A clear incident history",
        "description": "Keep an understandable record of detected interruptions and recovery, with a status page for the people who need updates."
      },
      {
        "title": "Visibility around releases",
        "description": "Pair monitoring with a documented release process so a team can see which application version was released and investigate problems with better context."
      }
    ],
    "businessUses": [
      {
        "title": "For an agency maintaining client websites",
        "description": "The team could review monitored sites in one place and identify which client needs attention when an availability check fails."
      },
      {
        "title": "For a business running a customer portal",
        "description": "A similar setup could give the team earlier notice of an interruption and provide a clear place to communicate an incident and its recovery."
      }
    ],
    "businessValue": "A similar setup could help your team notice availability problems sooner, communicate incidents more clearly, and make application releases easier to manage. Monitoring records what its checks observe; the project is not a promise of uninterrupted service.",
    "technologies": [],
    "liveUrl": null,
    "repositoryUrl": null
  }
];
