export const CANONICAL_ORIGIN = "https://bloomelectronics.my";

export const brand = {
  publicName: "Bloom Electronic",
  legalName: "Bloom Electronics",
  primaryEmail: "alif.f@bloomelectronics.my",
  serviceArea: "Malaysia",
  registrationNumber: "",
  phone: "+60 19-219 0043",
  linkedInUrl: "https://www.linkedin.com/in/alif-firdaus-050530245",
  businessAddress: "",
  businessHours: "",
  founder: {
    name: "Muhammad Alif Firdaus",
    title: "Hardware Engineer",
    biography: "Founder-led hardware engineering focused on PCB design, embedded controllers and practical prototype development.",
    engineeringFocus: ["PCB design", "Embedded controllers", "Prototype development"],
    certifications: [],
  },
};

export const navigation = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const trustPoints = [
  "Malaysia-based engineering support",
  "Hardware and firmware integration",
  "Prototype-to-manufacturing workflow",
  "Confidential project handling",
  "Direct communication with the engineer",
];

export const audiences = [
  "Malaysian SMEs developing electronic products",
  "Product founders and technology startups",
  "Automation system integrators and machine builders",
  "Industrial equipment companies",
  "R&D and engineering teams needing external support",
  "PCB manufacturers and assemblers needing a design partner",
];

export const offers = [
  {
    slug: "pcb-review-rescue",
    number: "01",
    title: "PCB Design Review & Rescue",
    forWho: "Teams with an unstable board, a non-working first prototype, or a design that needs an independent technical assessment.",
    problem: "Reduce uncertainty before committing to another PCB revision.",
    deliverables: ["Schematic and layout risk review", "Component and availability observations", "Power, grounding, interfaces and DFM review", "Prioritised issue report and next-revision plan"],
    structure: "A bounded technical review based on the design files, available measurements and the current failure evidence.",
    startingPrice: "",
    typicalTimeline: "",
    servicePath: "/services/pcb-troubleshooting",
  },
  {
    slug: "custom-pcb-prototype",
    number: "02",
    title: "Custom PCB & Embedded Prototype",
    forWho: "Product teams that need hardware and firmware developed together around a new controller or connected-device concept.",
    problem: "Turn requirements into a coherent prototype package without fragmented engineering handoffs.",
    deliverables: ["Requirements and system architecture", "Component selection, schematic and PCB layout", "Embedded firmware and manufacturing outputs", "Bring-up plan and prototype support"],
    structure: "A phased development engagement with scope gates from requirements through prototype support.",
    startingPrice: "",
    typicalTimeline: "",
    servicePath: "/services/pcb-design-malaysia",
  },
  {
    slug: "prototype-troubleshooting",
    number: "03",
    title: "Prototype Troubleshooting & Revision",
    forWho: "Teams whose fabricated board does not meet specification or behaves unreliably under real operating conditions.",
    problem: "Build an evidence-led path from symptoms to a controlled design revision.",
    deliverables: ["Test-plan development and bench investigation", "Failure-hypothesis register", "Circuit or firmware change recommendations", "Revision package and retest recommendations"],
    structure: "Investigation is scoped around the available hardware, documentation and access to the failure condition.",
    startingPrice: "",
    typicalTimeline: "",
    servicePath: "/services/pcb-troubleshooting",
  },
  {
    slug: "manufacturing-handoff",
    number: "04",
    title: "Manufacturing Handoff",
    forWho: "Engineering teams preparing a design for prototype assembly or a more controlled supplier handoff.",
    problem: "Reduce avoidable manufacturing questions and incomplete production documentation.",
    deliverables: ["BOM and DFM review", "Gerber, drill and pick-and-place files", "Assembly drawings and production notes", "Supplier coordination support"],
    structure: "A documentation and readiness engagement based on the maturity of the source design.",
    startingPrice: "",
    typicalTimeline: "",
    servicePath: "/services/prototype-and-production-support",
  },
];

export const services = [
  {
    slug: "pcb-design-malaysia",
    shortTitle: "Circuit & PCB Design",
    h1: "Circuit & PCB Design Services in Malaysia",
    title: "PCB Design Malaysia | Bloom Electronic",
    description: "Circuit design, schematic capture, PCB layout, component selection and manufacturing outputs for Malaysian product teams and industrial applications.",
    summary: "Develop a manufacturable electronic design around the electrical, mechanical, sourcing and operational constraints of the product.",
    problems: ["A controller concept needs a complete circuit and PCB", "An existing schematic requires layout and manufacturing preparation", "Board size, interfaces or component availability are constraining the design", "Hardware and firmware decisions need to be coordinated"],
    audiences: ["Product founders and SMEs", "Automation and machine-building teams", "R&D teams with defined requirements", "Manufacturers needing an external design partner"],
    deliverables: ["Requirements and interface review", "System and power architecture", "Component selection", "Schematic capture", "PCB placement and routing", "Design-rule and DFM review", "BOM and manufacturing outputs", "Bring-up and revision planning"],
    inputs: ["Functional requirements and operating environment", "Mechanical constraints or enclosure information", "Power, interface and regulatory constraints", "Existing design files, if the project is a continuation"],
    process: ["Define requirements and design boundaries", "Review architecture and component strategy", "Develop schematic and PCB layout", "Prepare manufacturing and bring-up outputs", "Support prototype findings and controlled revision"],
    risks: ["Final manufacturability depends on the selected assembler and process capabilities.", "Component availability and lifecycle can change during development.", "Regulatory testing and certification are separate unless explicitly scoped."],
    faqs: [
      ["Can Bloom continue an existing PCB design?", "Yes, when editable source files and sufficient design context are available. The first step is a technical review to establish what can be reused safely."],
      ["Do you provide Gerber and assembly files?", "Manufacturing outputs can be included in the agreed scope, together with the BOM, drill data, pick-and-place files and assembly information required for the selected process."],
      ["Is firmware included?", "Firmware can be scoped with the hardware when the product requires embedded control, sensing or connectivity."],
    ],
    relatedProjects: ["compact-esp32-controller", "networked-electronics-controller"],
  },
  {
    slug: "embedded-systems-malaysia",
    shortTitle: "Embedded Systems & Firmware",
    h1: "Embedded Systems & Firmware Development in Malaysia",
    title: "Embedded Systems Development Malaysia | Bloom Electronic",
    description: "Embedded firmware and hardware integration for controllers, connected products, sensing systems and industrial electronic equipment in Malaysia.",
    summary: "Coordinate firmware, electronics and interfaces so the embedded system behaves predictably in its actual operating environment.",
    problems: ["A custom controller needs production-oriented embedded firmware", "Hardware and firmware teams are blocked by unclear interfaces", "A proof of concept needs a structured path toward a maintainable prototype", "Communication, sensing or control behaviour is unreliable"],
    audiences: ["Machine builders and system integrators", "Connected-product teams", "Industrial equipment companies", "R&D teams needing external embedded support"],
    deliverables: ["Firmware requirements and state modelling", "Microcontroller and peripheral strategy", "Driver and interface implementation", "Control, sensing and communication logic", "Diagnostics and fault-handling approach", "Hardware-in-the-loop bring-up support", "Source code and build documentation within the agreed scope"],
    inputs: ["Required behaviours and timing constraints", "Hardware documentation or target board", "Communication protocols and external interfaces", "Known fault cases and acceptance criteria"],
    process: ["Define system states and interfaces", "Establish firmware architecture", "Implement and integrate in increments", "Bring up on target hardware", "Document findings, limitations and next validation steps"],
    risks: ["Field reliability requires testing in representative operating conditions.", "Third-party libraries and cloud services introduce dependencies that must be assessed.", "Safety-critical or regulated software requires a separately defined assurance process."],
    faqs: [
      ["Which microcontrollers do you support?", "Platform selection is based on the application. Existing work includes ESP32 and STM32-class systems, but the device choice should follow the interfaces, performance, sourcing and lifecycle requirements."],
      ["Can you troubleshoot existing firmware?", "Yes, when source access, a reproducible failure and suitable hardware access are available. The investigation scope depends on the evidence and test setup."],
      ["Can hardware and firmware be developed together?", "Yes. Coordinating both disciplines is often the clearest way to control interfaces and reduce integration risk."],
    ],
    relatedProjects: ["compact-esp32-controller", "networked-electronics-controller"],
  },
  {
    slug: "pcb-troubleshooting",
    shortTitle: "PCB Troubleshooting",
    h1: "PCB Prototype Troubleshooting & Design Revision",
    title: "PCB Troubleshooting & Design Revision | Bloom Electronic",
    description: "Evidence-led PCB troubleshooting, schematic and layout review, bench investigation and revision planning for non-working or unstable prototypes.",
    summary: "Move from symptoms and assumptions toward testable failure hypotheses and a controlled next-revision plan.",
    problems: ["A fabricated board does not power or start reliably", "Outputs, communications or measurements are unstable", "The design behaves differently under load or in the target environment", "A second revision is planned but the root risk is unclear"],
    audiences: ["Founders with a non-working prototype", "Engineering teams needing an independent review", "Manufacturers supporting a customer design", "Teams inheriting incomplete PCB documentation"],
    deliverables: ["Evidence and documentation review", "Schematic and layout risk assessment", "Test-plan development", "Bench investigation when practical", "Failure-hypothesis register", "Prioritised hardware or firmware changes", "Revision and retest recommendations"],
    inputs: ["Schematic, PCB files and BOM", "A clear description of expected and observed behaviour", "Measurements, logs and photographs already collected", "Physical boards and test access when bench work is required"],
    process: ["Triage the symptoms and available evidence", "Identify high-risk circuits and interfaces", "Define measurements that separate likely causes", "Record findings and recommended changes", "Plan the next revision and retest"],
    risks: ["Not every failure can be diagnosed remotely.", "Intermittent faults may require the original hardware and a representative load or environment.", "A review can identify design risks without proving they caused the reported symptom."],
    faqs: [
      ["Can you guarantee the failure will be found?", "No. The engagement is designed to improve the evidence and reduce uncertainty, but diagnosis depends on reproducibility, access and the quality of the available design information."],
      ["Can the review be performed remotely?", "Document and design reviews can be remote. Bench failures may require the board, test equipment and a representative setup."],
      ["Will I receive a revised design?", "A revised design can be scoped after the review establishes the likely changes and the quality of the source files."],
    ],
    relatedProjects: ["triple-buck-converter-module", "compact-esp32-controller"],
  },
  {
    slug: "iot-controller-development-malaysia",
    shortTitle: "IoT & Controller Development",
    h1: "IoT Controller Development for Malaysian Businesses",
    title: "IoT Controller Development Malaysia | Bloom Electronic",
    description: "Custom IoT controllers combining electronics, embedded firmware and practical connectivity for products, equipment and monitoring applications.",
    summary: "Develop a connected controller that keeps local operation, diagnostics and real deployment constraints in view from the start.",
    problems: ["A product needs sensing, control and connectivity in one custom platform", "A proof of concept depends too heavily on development boards", "The device must continue meaningful local operation during connectivity loss", "Cloud, firmware and hardware responsibilities are unclear"],
    audiences: ["Industrial IoT product teams", "Automation integrators", "Equipment companies adding connected functions", "Startups developing custom controllers"],
    deliverables: ["System and connectivity architecture", "Controller electronics and interface design", "Embedded communication and local-control logic", "Provisioning and diagnostic approach", "Prototype manufacturing outputs", "Bring-up and connectivity test plan"],
    inputs: ["Sensor, actuator and interface requirements", "Connectivity coverage and operating constraints", "Local behaviour required during network loss", "Cloud or integration requirements, if already selected"],
    process: ["Define local and connected behaviours", "Select controller and communication architecture", "Develop electronics and firmware interfaces", "Prototype and exercise failure cases", "Document limitations and field-validation needs"],
    risks: ["Wireless performance depends on enclosure, antenna and field conditions.", "Cloud platforms and carrier services create external dependencies.", "Security, device identity and update strategy must be explicitly scoped."],
    faqs: [
      ["Does every IoT device need a cloud platform?", "No. The architecture should follow the operational need. Some systems use local networks, gateways or direct integration rather than a general cloud dashboard."],
      ["Can the controller work without internet access?", "Offline behaviour can be designed, but the required local functions and data handling must be defined during architecture."],
      ["Can Bloom integrate with an existing platform?", "Integration can be assessed when the platform APIs, authentication model and operational constraints are available."],
    ],
    relatedProjects: ["networked-electronics-controller", "field-installed-controller-assembly"],
  },
  {
    slug: "prototype-and-production-support",
    shortTitle: "Prototype & Production Support",
    h1: "Electronics Prototype & Production Handoff Support",
    title: "Electronics Prototype & Production Support | Bloom Electronic",
    description: "Prototype bring-up, DFM review, BOM and manufacturing-file preparation, supplier coordination and production handoff support.",
    summary: "Prepare the design, documentation and validation plan for a more controlled transition from engineering files to physical hardware.",
    problems: ["Manufacturing files are incomplete or inconsistent", "A prototype needs a structured bring-up plan", "Supplier questions are delaying assembly", "The design needs a controlled revision before another build"],
    audiences: ["Product teams approaching their first PCB build", "Engineering teams preparing a revision", "PCB assemblers supporting incomplete customer packages", "SMEs coordinating external suppliers"],
    deliverables: ["BOM and component-readiness review", "Gerber, drill and pick-and-place review", "Assembly drawings and production notes", "DFM observations", "Bring-up and measurement plan", "Supplier technical coordination", "Revision package support"],
    inputs: ["Editable PCB source files and BOM", "Assembler capabilities or quotation feedback", "Known prototype risks and acceptance criteria", "Mechanical and test constraints"],
    process: ["Audit the design package", "Resolve manufacturing and sourcing questions", "Prepare controlled outputs", "Support fabrication and assembly queries", "Record bring-up evidence and revision needs"],
    risks: ["Production readiness cannot be established from files alone; prototype evidence matters.", "Supplier substitutions require engineering review.", "Compliance, certification and production test fixtures are separate unless explicitly scoped."],
    faqs: [
      ["Can you send files directly to a manufacturer?", "Supplier coordination can be included, but release authority, commercial terms and the selected manufacturer remain the customer’s responsibility unless agreed otherwise."],
      ["Do you provide production testing?", "A production-test approach can be scoped. Fixtures, certification and volume test operations require separate definition."],
      ["Can you review a BOM for availability?", "Yes. Availability, lifecycle and substitution risk can be reviewed at a point in time, but supply conditions continue to change."],
    ],
    relatedProjects: ["field-installed-controller-assembly", "triple-buck-converter-module"],
  },
];

export const projects = [
  {
    slug: "compact-esp32-controller",
    code: "BE / 001",
    title: "Compact ESP32 Controller",
    pageTitle: "Compact ESP32 Controller Project | Bloom Electronic",
    description: "A compact two-layer ESP32 controller PCB designed, fabricated and assembled with RTC, user inputs and field wiring terminals.",
    category: "Compact Control",
    status: "Built",
    image: "/assets/project-compact-controller-front.jpg",
    imageAlt: "Assembled compact ESP32 controller PCB with screw terminals, buttons and buzzer",
    summary: "A compact controller board integrating an ESP32-WROOM-32E, coin-cell RTC, piezo buzzer, two buttons and screw-terminal field interfaces.",
    challenge: "Fit the core control, timekeeping, user input and external wiring interfaces into a compact custom board that could be fabricated and assembled in small batches.",
    constraints: ["Compact two-layer PCB", "Accessible field wiring", "Real component footprints", "Prototype-level evidence only"],
    approach: ["Captured the controller circuitry and footprints in KiCad", "Routed the design on two layers", "Prepared fabrication outputs and hand-assembled the produced boards"],
    scope: ["Schematic capture", "PCB placement and routing", "Manufacturing output preparation", "Prototype assembly"],
    deliverables: ["Editable PCB design", "Two-layer manufacturing package", "Assembled controller hardware", "Small-batch build evidence"],
    technology: ["ESP32-WROOM-32E", "KiCad", "RTC", "2-layer PCB"],
    validation: "Fabricated and hand-assembled boards are documented in the portfolio photographs. This supports a built prototype claim, not production qualification.",
    outcome: "The design progressed from PCB files to assembled physical hardware in a compact controller format.",
    limitations: ["No published environmental or compliance testing", "No production-volume claim", "Application-specific firmware performance is not represented here"],
    confidentiality: "Only the approved board photographs and high-level engineering details are published.",
    relatedServices: ["pcb-design-malaysia", "embedded-systems-malaysia"],
    gallery: [
      { src: "/assets/project-compact-controller-front.jpg", alt: "Front of an assembled compact ESP32 controller PCB", caption: "Assembled controller—component side." },
      { src: "/assets/project-compact-controller-back.jpg", alt: "Back of the fabricated compact ESP32 controller PCB", caption: "Fabricated board—routing side." },
      { src: "/assets/project-controller-batch.jpg", alt: "Small batch of compact ESP32 controller boards", caption: "Small-batch assembly evidence." },
    ],
  },
  {
    slug: "networked-electronics-controller",
    code: "BE / 002",
    title: "Networked Electronics Controller 01R1",
    pageTitle: "Networked Electronics Controller Project | Bloom Electronic",
    description: "An assembled ESP32 controller platform with wired Ethernet, USB-C, RTC, buzzer and local user inputs across two photographed revisions.",
    category: "Connected Control",
    status: "Iterated",
    image: "/assets/project-network-controller-black.jpg",
    imageAlt: "Black assembled networked electronics controller PCB with Ethernet and USB-C",
    summary: "An ESP32-based controller platform combining wired Ethernet, USB-C, timekeeping and local controls, represented by two assembled hardware revisions.",
    challenge: "Combine network connectivity, USB power and programming, timekeeping and controller interfaces in a practical custom PCB platform.",
    constraints: ["Wired Ethernet interface", "USB-C integration", "Controller and RTC placement", "Revision-specific hardware evidence"],
    approach: ["Integrated an ESP32-S3-WROOM-1 with RJ45 Ethernet and USB-C", "Reviewed placement and routing in PCB CAD", "Produced and assembled black and white soldermask revisions"],
    scope: ["Controller architecture", "PCB design and routing", "Interface integration", "Hardware revision work"],
    deliverables: ["Networked controller PCB", "Manufacturing outputs", "Two assembled revisions", "Documented hardware iteration"],
    technology: ["ESP32-S3", "Ethernet", "USB-C", "RTC"],
    validation: "Two assembled revisions are documented photographically. The evidence supports hardware iteration, not a claim of field or cybersecurity qualification.",
    outcome: "The work produced an assembled, iterated controller platform with physical network and local-control interfaces.",
    limitations: ["No published network-throughput or security testing", "No environmental qualification", "Firmware and application behaviour remain project-specific"],
    confidentiality: "Application-specific operating details are not published.",
    relatedServices: ["iot-controller-development-malaysia", "embedded-systems-malaysia"],
    gallery: [
      { src: "/assets/project-network-controller-black.jpg", alt: "Black soldermask networked ESP32 controller revision", caption: "Assembled black-soldermask revision." },
      { src: "/assets/project-network-controller-white.jpg", alt: "White soldermask networked ESP32 controller revision", caption: "Assembled white-soldermask revision documented in December 2024." },
    ],
  },
  {
    slug: "triple-buck-converter-module",
    code: "BE / 003",
    title: "Triple Buck Converter Module",
    pageTitle: "Triple Buck Converter Module Project | Bloom Electronic",
    description: "An assembled power module with three independently adjustable buck-converter stages and screw-terminal connections.",
    category: "Power Electronics",
    status: "Assembled",
    image: "/assets/project-triple-buck.jpg",
    imageAlt: "Assembled triple buck converter PCB with inductors and screw terminals",
    summary: "A custom module arranging three independent adjustable buck-converter stages with accessible screw-terminal input and output connections.",
    challenge: "Integrate three adjustable DC-DC conversion stages on one serviceable PCB while keeping their terminal connections clear and accessible.",
    constraints: ["Three independent power stages", "Adjustable outputs", "Screw-terminal wiring", "Prototype-level performance evidence"],
    approach: ["Partitioned the board into three repeated conversion channels", "Placed inductors, controllers and terminals for clear channel separation", "Fabricated and assembled the custom module"],
    scope: ["Power-stage layout", "PCB routing", "Manufacturing preparation", "Prototype assembly"],
    deliverables: ["Triple-channel PCB design", "Manufacturing package", "Assembled prototype module", "Photographic build evidence"],
    technology: ["Buck converter", "Power PCB", "Screw terminals", "PCBA"],
    validation: "The assembled module is documented in a genuine project photograph. No efficiency, thermal, compliance or production qualification is claimed.",
    outcome: "Three adjustable converter stages were integrated into one assembled board for further application-specific evaluation.",
    limitations: ["No published efficiency or thermal results", "No compliance certification", "Final ratings depend on the selected components and operating conditions"],
    confidentiality: "The application and customer-specific electrical requirements are not disclosed.",
    relatedServices: ["pcb-design-malaysia", "prototype-and-production-support"],
    gallery: [
      { src: "/assets/project-triple-buck.jpg", alt: "Assembled triple-channel buck converter PCB", caption: "Assembled three-channel adjustable buck-converter module." },
    ],
  },
  {
    slug: "field-installed-controller-assembly",
    code: "BE / 004",
    title: "Field-Installed Controller Assembly",
    pageTitle: "Field-Installed Controller Assembly Project | Bloom Electronic",
    description: "A controller and power assembly arranged in an enclosure for an 8 cm by 17 cm installation fit-check with terminal wiring and battery backup.",
    category: "Installation Integration",
    status: "Field fit-check",
    image: "/assets/project-field-installation.jpg",
    imageAlt: "Controller and power modules wired inside a compact field enclosure",
    summary: "A practical enclosure fit-check bringing controller, power conversion, terminal wiring and a battery-backup module into one compact installation.",
    challenge: "Arrange the controller and supporting power hardware inside a constrained field enclosure with accessible wiring and backup power.",
    constraints: ["Approximately 8 cm by 17 cm installation area", "Terminal wiring access", "Battery-backup integration", "Field arrangement evidence only"],
    approach: ["Arranged the control and power modules around the available enclosure space", "Connected field terminals and supporting wiring", "Documented the assembled fit-check before further installation validation"],
    scope: ["Mechanical fit-check", "Module arrangement", "Terminal wiring", "Battery-backup integration"],
    deliverables: ["Assembled enclosure layout", "Controller and power integration", "Wiring fit-check", "Photographic field evidence"],
    technology: ["ESP32 controller", "DC-DC power", "Battery backup", "Field wiring"],
    validation: "The photograph supports an assembled enclosure and wiring fit-check. It does not establish long-term field reliability or regulatory compliance.",
    outcome: "The hardware was physically integrated into the available enclosure space for the next stage of installation testing.",
    limitations: ["No published long-term field results", "No environmental or compliance qualification", "Final installation details depend on the target equipment"],
    confidentiality: "The customer, installation location and application-specific details are withheld.",
    relatedServices: ["prototype-and-production-support", "iot-controller-development-malaysia"],
    gallery: [
      { src: "/assets/project-field-installation.jpg", alt: "Compact controller and power assembly installed in an enclosure", caption: "Controller, power and battery-backup fit-check in the field enclosure." },
    ],
  },
];

export const processSteps = [
  ["01", "Define", "Requirements, constraints, available evidence and the real operational problem."],
  ["02", "Engineer", "Architecture, circuit design, firmware interfaces and component strategy."],
  ["03", "Prototype", "Manufacturing preparation, assembly, bring-up and measurable iteration."],
  ["04", "Validate", "Functional checks, risk review, documented limitations and design refinement."],
  ["05", "Support", "Controlled handoff, supplier questions and continued engineering assistance."],
];

export const homeFaqs = [
  ["What information should I provide for an initial discussion?", "Share the application, current project stage, the problem you are trying to solve, available design files and any important technical or manufacturing constraints."],
  ["Can Bloom help with an existing non-working prototype?", "Yes. The first step is to review the available evidence and determine whether a remote design review, bench investigation or both would be appropriate."],
  ["Does Bloom only work on PCB design?", "No. Projects can combine circuit design, PCB layout, embedded firmware, connectivity, prototype bring-up and manufacturing preparation."],
  ["Can confidential details be withheld from the website?", "Yes. Published project summaries intentionally omit client identities and sensitive specifications. Project information should still be shared through an agreed confidential channel."],
  ["Are timelines and prices fixed?", "No. Scope depends on design maturity, evidence, technical risk and the required deliverables. An initial discussion is used to identify the appropriate engagement structure."],
];

export const baseSeo = {
  title: "PCB Design & Embedded Systems Malaysia | Bloom Electronic",
  description: "Bloom Electronic provides PCB design, embedded firmware, IoT controller development, prototype troubleshooting and manufacturing support for Malaysian businesses.",
  image: "/assets/bloom-hero-pcb.webp",
};

export const staticPages = {
  "/": { h1: "PCB & Embedded Product Development for Malaysian Businesses", ...baseSeo },
  "/services": { h1: "Electronics Engineering Services", title: "Electronics Engineering Services Malaysia | Bloom Electronic", description: "Explore PCB design, embedded systems, IoT controller development, prototype troubleshooting and manufacturing support services from Bloom Electronic." },
  "/projects": { h1: "Engineering Projects & Technical Work", title: "Electronics Engineering Projects | Bloom Electronic", description: "Explore honest technical summaries of Bloom Electronic work across custom PCB development, embedded control, IoT and power electronics." },
  "/about": { h1: "Founder-Led Electronics Engineering Support", title: "About Bloom Electronic | Electronics Engineering Malaysia", description: "Bloom Electronic is a founder-led Malaysia-based engineering business supporting PCB, embedded, IoT, prototype and manufacturing work." },
  "/contact": { h1: "Discuss an Electronics Project", title: "Contact Bloom Electronic | Discuss Your Project", description: "Contact Bloom Electronic about PCB design, embedded firmware, IoT controllers, prototype troubleshooting or production handoff support." },
  "/privacy": { h1: "Privacy Notice", title: "Privacy Notice | Bloom Electronic", description: "How Bloom Electronic handles website enquiries, contact information, analytics choices and project communications." },
};

export const publicRoutes = [
  ...Object.keys(staticPages),
  ...services.map((service) => `/services/${service.slug}`),
  ...projects.map((project) => `/projects/${project.slug}`),
];

export function normalizePathname(pathname = "/") {
  const withoutQuery = pathname.split(/[?#]/)[0] || "/";
  if (withoutQuery === "/") return "/";
  return `/${withoutQuery.split("/").filter(Boolean).join("/")}`;
}

export function getService(slug) {
  return services.find((service) => service.slug === slug);
}

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getRouteContent(pathname) {
  const path = normalizePathname(pathname);
  if (staticPages[path]) return { type: "page", path, ...staticPages[path] };
  if (path.startsWith("/services/")) {
    const service = getService(path.split("/").pop());
    if (service) return { type: "service", path, ...service };
  }
  if (path.startsWith("/projects/")) {
    const project = getProject(path.split("/").pop());
    if (project) return { type: "project", path, ...project, h1: project.title, projectTitle: project.title, title: project.pageTitle, description: project.description };
  }
  return { type: "404", path, h1: "Page not found", title: "Page Not Found | Bloom Electronic", description: "The requested Bloom Electronic page could not be found.", noindex: true };
}
