import { useRef, useMemo, memo } from "react";
import {
  ExternalLink,
  Github,
  Sparkles,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import creditCardFraudImg from "../assets/credit-card-fraud.png";
import dynamicDataTableImg from "../assets/Gemini-Generated.png";
import netflixCloneImg from "../assets/netflix.png";
import chatAppImg from "../assets/chat-app.png";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  year: string;
  rating: number;
  users: string;
  growth: string;
}

// Static transition configs - matched to AboutPage
const cardTransition = {
  duration: 0.3,
  ease: "easeOut" as const,
};

const hoverTransition = {
  duration: 0.15,
  ease: "easeOut" as const,
};

// Memoized Project Card Component with proper comparison
const ProjectCard = memo(
  ({ project, index }: { project: Project; index: number }) => {
    const transition = useMemo(
      () => ({
        ...cardTransition,
        delay: index * 0.05, // Retained matching delay logic from AboutPage (index * 0.05)
      }),
      [index]
    );

    const hoverProps = useMemo(
      () => ({
        y: -8,
        transition: hoverTransition,
      }),
      []
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        whileHover={hoverProps}
        className="group relative project-card"
        style={{ willChange: "transform" }}
      >
        {/* Card */}
        <div className="relative h-full rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-500">
          {/* Glow Effect - CSS only for better performance */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 pointer-events-none transition-opacity duration-300" />

          {/* Project Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            {/* Year Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {project.year}
              </span>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/90 backdrop-blur-sm flex items-center gap-1">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs font-semibold text-white">
                {project.rating}
              </span>
            </div>

            {/* Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <Award className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {project.users}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
                <TrendingUp className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white">
                  {project.growth}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href={project.demoUrl}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-colors duration-200 group/btn"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-200" />
              </a>
              <a
                href={project.githubUrl}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

// Static projects data - moved outside component to prevent recreation
const PROJECTS_DATA: Project[] = [
  {
    title: "Credit Card Fraud Detection System",
    description:
      "A comprehensive full-stack application for detecting credit card fraud using Machine Learning. Features real-time predictions, analytics dashboards, and history tracking.",
    image: creditCardFraudImg,
    tags: ["React", "Node.js", "Python", "FastAPI", "ML", "Clerk Authentication"],
    demoUrl: "https://credit-card-default-prediction-cqml.vercel.app/",
    githubUrl: "https://github.com/BishnuMukherjee123/credit-card-default-prediction",
    year: "2025",
    rating: 5.0,
    users: "Active",
    growth: "New",
  },
  {
    title: "Dynamic Data Table Manager",
    description:
      "A modern, feature-rich data table management application built with Next.js, Redux Toolkit, Material UI, and React Hook Form. This application allows users to manage, manipulate, and visualize data tables with advanced features like inline editing, column management, CSV import/export, and theme switching.",
    image: dynamicDataTableImg,
    tags: ["Next.js", "TypeScript", "Redux Toolkit", "Material UI", "React Hook Form"],
    demoUrl: "https://dynamic-data-table-manager-rho.vercel.app/",
    githubUrl: "https://github.com/BishnuMukherjee123/Dynamic-Data-Table-Manager",
    year: "2025",
    rating: 4.9,
    users: "Active",
    growth: "New",
  },
  {
    title: "Quick Chat Application",
    description:
      "A cutting-edge real-time chat application built with the MERN stack featuring ultra-modern dark glass morphism design, cyberpunk aesthetics, and advanced visual effects. Experience the future of messaging with stunning dark themes, glass morphism, and smooth animations.",
    image: chatAppImg,
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Cloudinary", "JWT"],
    demoUrl: "https://chat-app-five-blush-32.vercel.app/",
    githubUrl: "https://github.com/BishnuMukherjee123/chat-project",
    year: "2025",
    rating: 4.8,
    users: "Active",
    growth: "New",
  },
  {
    title: "Blockchain Analytics Dashboard",
    description:
      "Comprehensive analytics platform for tracking cryptocurrency transactions, market trends, and portfolio performance across multiple blockchain networks.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    tags: ["Web3", "React", "Solidity", "GraphQL"],
    demoUrl: "#",
    githubUrl: "#",
    year: "2023",
    rating: 4.7,
    users: "inactive",
    growth: "+156%",
  },
  {
    title: "Netflix Clone",
    description:
      "A production-ready Netflix clone featuring secure authentication, real-time data syncing, and a modern interface built with React 19, Redux, and Tailwind CSS.",
    image: netflixCloneImg,
    tags: ["React", "Appwrite", "Firebase", "Redux"],
    demoUrl: "https://moviewatching-clone-react-js.vercel.app",
    githubUrl: "https://github.com/BishnuMukherjee123/Netflix-clone-react.js",
    year: "2024",
    rating: 4.9,
    users: "Active",
    growth: "New",
  },
  {
    title: "Neural Network Visualizer",
    description:
      "Interactive tool for visualizing and debugging deep learning models in real-time. Features layer-by-layer analysis, gradient flow visualization, and performance metrics.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    tags: ["Python", "TensorFlow", "D3.js", "Flask"],
    demoUrl: "#",
    githubUrl: "#",
    year: "2023",
    rating: 4.8,
    users: "inactive",
    growth: "+198%",
  },
];

export default function ProjectsPage() {
  const containerRef = useRef<HTMLElement>(null);

  // Memoized projects data
  const projects = useMemo(() => PROJECTS_DATA, []);

  // Memoized animation configs - Matched to AboutPage
  const headerTransition = useMemo(() => ({ duration: 0.2, ease: "easeOut" as const }), []);
  const titleTransition = useMemo(() => ({ duration: 0.3, delay: 0.05, ease: "easeOut" as const }), []);
  const subtitleTransition = useMemo(
    () => ({ duration: 0.3, delay: 0.1, ease: "easeOut" as const }),
    []
  );
  const descriptionTransition = useMemo(
    () => ({ duration: 0.3, delay: 0.15, ease: "easeOut" as const }),
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-6 overflow-hidden min-h-screen"
      style={{ contain: "layout style paint" }}
    >
      {/* Optimized background - GPU accelerated (matched from AboutPage) */}
      <div className="absolute inset-0 pointer-events-none will-change-transform">
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-linear-to-br from-blue-500/15 via-cyan-500/15 to-transparent rounded-full blur-3xl transform-gpu" />
        <div className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-linear-to-br from-purple-500/15 via-pink-500/15 to-transparent rounded-full blur-3xl transform-gpu" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-linear-to-br from-orange-500/8 via-yellow-500/8 to-transparent rounded-full blur-3xl transform-gpu" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto"
        style={{ willChange: "opacity" }}
      >
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={headerTransition}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Featured Projects
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={titleTransition}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
              Innovation
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={subtitleTransition}
              className="text-gray-900 dark:text-white"
            >
              in Every Line
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={descriptionTransition}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Explore cutting-edge projects that push the boundaries of technology
            and redefine what's possible in software development.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
