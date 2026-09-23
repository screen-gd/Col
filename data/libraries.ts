/**
 * The library registry — the heart of this project.
 *
 * Community members add new UI libraries by adding an entry to the
 * `libraries` array below and opening a pull request.
 *
 * Guidelines:
 * - `slug` must be unique, lowercase, kebab-case.
 * - `url` must be the library's primary website or docs.
 * - Pick from the existing Category / Stack / UseCase values when possible.
 * - Keep descriptions to one or two short sentences.
 */

export const CATEGORIES = [
  "Component Library",
  "Animation & Motion",
  "Templates & Blocks",
  "Icons",
  "Charts & Data Viz",
  "3D & WebGL",
  "CSS Framework",
] as const;

export const STACKS = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Tailwind CSS",
  "Vanilla JS",
  "TypeScript",
] as const;

export const USE_CASES = [
  "Landing Pages",
  "Dashboards",
  "Micro-interactions",
  "Marketing Sites",
  "Data Visualization",
  "Accessibility-first",
  "Rapid Prototyping",
  "Creative & Experimental",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Stack = (typeof STACKS)[number];
export type UseCase = (typeof USE_CASES)[number];

export interface Library {
  name: string;
  slug: string;
  description: string;
  url: string;
  category: Category;
  stacks: Stack[];
  useCases: UseCase[];
  /** Free-form tags for extra search keywords. */
  tags?: string[];
}

export const libraries: Library[] = [
  {
    name: "21st.dev",
    slug: "21st-dev",
    description:
      "A marketplace of community-built React components, installable in one command.",
    url: "https://21st.dev",
    category: "Component Library",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Landing Pages", "Rapid Prototyping"],
    tags: ["marketplace", "copy paste", "shadcn"],
  },
  {
    name: "React Bits",
    slug: "react-bits",
    description:
      "A collection of animated, interactive React components — text effects, backgrounds, and micro-interactions.",
    url: "https://reactbits.dev",
    category: "Animation & Motion",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Micro-interactions", "Creative & Experimental"],
    tags: ["animated", "text effects", "backgrounds"],
  },
  {
    name: "Transitions.dev",
    slug: "transitions-dev",
    description:
      "A collection of copyable UI transitions for web applications.",
    url: "https://transitions.dev",
    category: "Animation & Motion",
    stacks: ["React", "TypeScript"],
    useCases: ["Micro-interactions", "Marketing Sites"],
    tags: ["transitions", "motion", "page transitions"],
  },
  {
    name: "shadcn/ui",
    slug: "shadcn-ui",
    description:
      "Accessible components you copy into your project, built on Radix UI and Tailwind CSS.",
    url: "https://ui.shadcn.com",
    category: "Component Library",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Dashboards", "Accessibility-first", "Rapid Prototyping"],
    tags: ["radix", "copy paste", "accessible"],
  },
  {
    name: "Magic UI",
    slug: "magic-ui",
    description:
      "150+ free animated components and effects for landing pages, built with React, TypeScript and Tailwind.",
    url: "https://magicui.design",
    category: "Animation & Motion",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Landing Pages", "Marketing Sites", "Micro-interactions"],
    tags: ["animated", "effects", "framer motion"],
  },
  {
    name: "Aceternity UI",
    slug: "aceternity-ui",
    description:
      "Animated components and sections, including hero effects, 3D cards, and scroll experiences.",
    url: "https://ui.aceternity.com",
    category: "Animation & Motion",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Landing Pages", "Creative & Experimental", "Marketing Sites"],
    tags: ["animated", "hero", "scroll animations"],
  },
  {
    name: "Motion",
    slug: "motion",
    description:
      "An animation library for React, Vue, and JavaScript (formerly Framer Motion).",
    url: "https://motion.dev",
    category: "Animation & Motion",
    stacks: ["React", "Vue", "Vanilla JS", "TypeScript"],
    useCases: ["Micro-interactions", "Creative & Experimental"],
    tags: ["framer motion", "gestures", "spring"],
  },
  {
    name: "GSAP",
    slug: "gsap",
    description:
      "A JavaScript animation library with ScrollTrigger, timelines, and physics-based motion.",
    url: "https://gsap.com",
    category: "Animation & Motion",
    stacks: ["Vanilla JS", "React", "Vue", "TypeScript"],
    useCases: ["Creative & Experimental", "Micro-interactions", "Marketing Sites"],
    tags: ["scrolltrigger", "timeline", "animation"],
  },
  {
    name: "Radix UI",
    slug: "radix-ui",
    description:
      "Unstyled, accessible primitives for building design systems and web apps in React.",
    url: "https://www.radix-ui.com",
    category: "Component Library",
    stacks: ["React", "TypeScript"],
    useCases: ["Accessibility-first", "Dashboards"],
    tags: ["primitives", "headless", "a11y"],
  },
  {
    name: "Base UI",
    slug: "base-ui",
    description:
      "Unstyled, accessible React components from the creators of Radix, Floating UI, and Material UI.",
    url: "https://base-ui.com",
    category: "Component Library",
    stacks: ["React", "TypeScript"],
    useCases: ["Accessibility-first", "Dashboards"],
    tags: ["headless", "primitives", "unstyled"],
  },
  {
    name: "HeroUI",
    slug: "heroui",
    description:
      "A React UI library with built-in theming (formerly NextUI).",
    url: "https://www.heroui.com",
    category: "Component Library",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Dashboards", "Rapid Prototyping", "Landing Pages"],
    tags: ["nextui", "theming", "dark mode"],
  },
  {
    name: "Mantine",
    slug: "mantine",
    description:
      "A fully featured React component library with 100+ components, hooks, and native dark theme support.",
    url: "https://mantine.dev",
    category: "Component Library",
    stacks: ["React", "TypeScript"],
    useCases: ["Dashboards", "Rapid Prototyping"],
    tags: ["hooks", "forms", "full featured"],
  },
  {
    name: "Chakra UI",
    slug: "chakra-ui",
    description:
      "A simple, modular and accessible React component library with a style-props API.",
    url: "https://chakra-ui.com",
    category: "Component Library",
    stacks: ["React", "TypeScript"],
    useCases: ["Accessibility-first", "Rapid Prototyping", "Dashboards"],
    tags: ["style props", "accessible", "theming"],
  },
  {
    name: "Material UI (MUI)",
    slug: "mui",
    description:
      "A React implementation of Google's Material Design with components and customization tools.",
    url: "https://mui.com",
    category: "Component Library",
    stacks: ["React", "TypeScript"],
    useCases: ["Dashboards", "Rapid Prototyping"],
    tags: ["material design", "google", "enterprise"],
  },
  {
    name: "Ant Design",
    slug: "ant-design",
    description:
      "A React UI design system with components for enterprise applications.",
    url: "https://ant.design",
    category: "Component Library",
    stacks: ["React", "TypeScript"],
    useCases: ["Dashboards", "Data Visualization"],
    tags: ["enterprise", "design system", "tables"],
  },
  {
    name: "daisyUI",
    slug: "daisyui",
    description:
      "A Tailwind CSS component plugin with semantic class names and no JavaScript requirement.",
    url: "https://daisyui.com",
    category: "CSS Framework",
    stacks: ["Tailwind CSS", "Vanilla JS"],
    useCases: ["Rapid Prototyping", "Landing Pages"],
    tags: ["tailwind plugin", "themes", "semantic"],
  },
  {
    name: "Flowbite",
    slug: "flowbite",
    description:
      "Open-source components built on Tailwind CSS, with versions for React, Vue, Svelte and Angular.",
    url: "https://flowbite.com",
    category: "Component Library",
    stacks: ["Tailwind CSS", "React", "Vue", "Svelte", "Angular"],
    useCases: ["Rapid Prototyping", "Dashboards", "Landing Pages"],
    tags: ["tailwind", "multi framework"],
  },
  {
    name: "Preline",
    slug: "preline",
    description:
      "Open-source Tailwind CSS components with Figma design files — marketing, e-commerce and application UI.",
    url: "https://preline.co",
    category: "Templates & Blocks",
    stacks: ["Tailwind CSS", "Vanilla JS", "React"],
    useCases: ["Marketing Sites", "Landing Pages", "Rapid Prototyping"],
    tags: ["tailwind", "figma", "blocks"],
  },
  {
    name: "HyperUI",
    slug: "hyperui",
    description:
      "Free, unstyled Tailwind CSS components for marketing, e-commerce and application interfaces.",
    url: "https://www.hyperui.dev",
    category: "Templates & Blocks",
    stacks: ["Tailwind CSS"],
    useCases: ["Marketing Sites", "Rapid Prototyping"],
    tags: ["copy paste", "unstyled", "free"],
  },
  {
    name: "Origin UI",
    slug: "origin-ui",
    description:
      "Copy-and-paste components built with Tailwind CSS and React, focused on inputs and application UI.",
    url: "https://originui.com",
    category: "Component Library",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Dashboards", "Rapid Prototyping"],
    tags: ["copy paste", "inputs", "shadcn"],
  },
  {
    name: "Motion Primitives",
    slug: "motion-primitives",
    description:
      "Animated components powered by Motion that you can copy and customize.",
    url: "https://motion-primitives.com",
    category: "Animation & Motion",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Micro-interactions", "Creative & Experimental"],
    tags: ["animated", "copy paste", "motion"],
  },
  {
    name: "Animata",
    slug: "animata",
    description:
      "Hand-crafted animated components and interaction experiments for React and Tailwind.",
    url: "https://animata.design",
    category: "Animation & Motion",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Creative & Experimental", "Micro-interactions"],
    tags: ["animated", "experimental"],
  },
  {
    name: "Lucide",
    slug: "lucide",
    description:
      "Open-source icons available for React, Vue, Svelte, Angular, and vanilla JavaScript.",
    url: "https://lucide.dev",
    category: "Icons",
    stacks: ["React", "Vue", "Svelte", "Angular", "Vanilla JS"],
    useCases: ["Rapid Prototyping", "Dashboards"],
    tags: ["icons", "svg", "feather"],
  },
  {
    name: "Recharts",
    slug: "recharts",
    description:
      "A composable, React-native charting library built on SVG components.",
    url: "https://recharts.github.io/en-US/",
    category: "Charts & Data Viz",
    stacks: ["React", "TypeScript"],
    useCases: ["Data Visualization", "Dashboards"],
    tags: ["charts", "svg", "graphs"],
  },
  {
    name: "Tremor",
    slug: "tremor",
    description:
      "React components purpose-built for dashboards — charts, KPI cards, and data display built on Tailwind.",
    url: "https://tremor.so",
    category: "Charts & Data Viz",
    stacks: ["React", "Tailwind CSS", "TypeScript"],
    useCases: ["Dashboards", "Data Visualization"],
    tags: ["dashboard", "charts", "analytics"],
  },
  {
    name: "React Three Fiber",
    slug: "react-three-fiber",
    description:
      "A React renderer for Three.js — build 3D scenes and WebGL experiences declaratively.",
    url: "https://r3f.docs.pmnd.rs",
    category: "3D & WebGL",
    stacks: ["React", "TypeScript"],
    useCases: ["Creative & Experimental", "Landing Pages"],
    tags: ["three.js", "3d", "webgl"],
  },
  {
    name: "shadcn-svelte",
    slug: "shadcn-svelte",
    description:
      "The shadcn/ui experience, ported to Svelte — accessible, copy-and-paste components for Svelte apps.",
    url: "https://www.shadcn-svelte.com",
    category: "Component Library",
    stacks: ["Svelte", "Tailwind CSS", "TypeScript"],
    useCases: ["Rapid Prototyping", "Dashboards"],
    tags: ["svelte", "copy paste"],
  },
  {
    name: "PrimeVue",
    slug: "primevue",
    description:
      "A Vue component suite with 90+ components, themes, and blocks.",
    url: "https://primevue.org",
    category: "Component Library",
    stacks: ["Vue", "TypeScript"],
    useCases: ["Dashboards", "Rapid Prototyping"],
    tags: ["vue", "enterprise", "themes"],
  },
];
