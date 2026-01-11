import {
  Code,
  Palette,
  Rocket,
  Zap,
  FolderDot,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BorderMagicButton } from "@/components/ui/tailwindcss-buttons";
import { useEffect, useRef, useState, useMemo, memo, useCallback } from "react";
import { getGitHubTotals, GitHubTotals, GitHubRepo } from "@/lib/github";

// Memoized components for better performance
interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  description: string;
  stats: string;
}

interface Technology {
  name: string;
  color: string;
}

const SkillCard = memo(({ skill, index }: { skill: Skill; index: number }) => {
  const Icon = skill.icon;
  const darkBgClasses = [
    "dark:bg-blue-950/50", // Development
    "dark:bg-purple-950/50", // Design
    "dark:bg-orange-950/50", // Performance
    "dark:bg-green-950/50", // Innovation
  ];
  const lightBgClasses = [
    "bg-blue-50/80", // Development
    "bg-purple-50/80", // Design
    "bg-orange-50/80", // Performance
    "bg-green-50/80", // Innovation
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.15 },
      }}
      className="relative group h-full"
    >
      <Card
        className={`group/card relative h-full border border-gray-200/50 dark:border-gray-800/50 ${lightBgClasses[index]} ${darkBgClasses[index]} hover:shadow-xl transition-shadow duration-200 overflow-hidden rounded-xl`}
      >
        {/* Simple gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${skill.color} opacity-0 group-hover/card:opacity-10 transition-opacity duration-200`}
        />

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl bg-linear-to-br ${skill.color} flex items-center justify-center shadow-lg group-hover/card:scale-105 transition-transform duration-200`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Stats badge */}
            <Badge
              variant="secondary"
              className="text-xs font-semibold px-2 py-1 bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50"
            >
              {skill.stats}
            </Badge>
          </div>

          {/* Title */}
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {skill.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {skill.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SkillCard.displayName = "SkillCard";

const TechnologyBadge = memo(
  ({ tech, index }: { tech: Technology; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        delay: index * 0.02,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        y: -2,
        transition: { duration: 0.15, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      style={{ willChange: "transform" }}
    >
      <Card className="group inline-flex items-center gap-3 px-6 py-3 border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl hover:shadow-xl hover:border-gray-300/50 dark:hover:border-gray-700/50 transition-all duration-300 cursor-pointer">
        <CardContent className="p-0 flex items-center gap-2">
          <span className="font-semibold text-sm">{tech.name}</span>
        </CardContent>
      </Card>
    </motion.div>
  )
);

TechnologyBadge.displayName = "TechnologyBadge";

const AboutPage = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  // GitHub data state - optimized structure
  const [gitHubData, setGitHubData] = useState({
    totals: { totalStars: 0, totalForks: 0, repositories: [] as GitHubRepo[] },
    previousTotals: {
      totalStars: 0,
      totalForks: 0,
      repositories: [] as GitHubRepo[],
    },
    error: null as string | null,
    isLoading: false,
    retryCount: 0,
    lastUpdateTime: null as Date | null,
    starIncrease: 0,
    hasInitialData: false,
  });

  // Optimized data fetching function
  const fetchGitHubData = useCallback(
    async (isRetry = false) => {
      try {
        // Reset error state on new fetch
        if (!isRetry) {
          setGitHubData((prev) => ({ ...prev, error: null }));
        }

        // Fetch fresh data from GitHub API
        const freshData = await getGitHubTotals();

        // Reset retry count on success
        if (isRetry) {
          setGitHubData((prev) => ({ ...prev, retryCount: 0 }));
        }

        // Use functional update to get current state and compare
        setGitHubData((prev) => {
          const { previousTotals, hasInitialData } = prev;
          const starsChanged =
            freshData.totalStars !== previousTotals.totalStars;
          const forksChanged =
            freshData.totalForks !== previousTotals.totalForks;
          const hasChanges = starsChanged || forksChanged;

          console.log(`🔍 GitHub data comparison:`, {
            fresh: freshData,
            previous: previousTotals,
            starsChanged,
            forksChanged,
            hasChanges,
          });

          // Only update UI if data has actually changed
          if (hasChanges || !hasInitialData) {
            console.log(`✅ GitHub data changed! Updating UI...`);

            // Calculate changes for animations
            const starsIncrease =
              freshData.totalStars - previousTotals.totalStars;
            const forksIncrease =
              freshData.totalForks - previousTotals.totalForks;

            // Log changes
            if (starsIncrease > 0) {
              console.log(
                `⭐ Stars increased! ${previousTotals.totalStars} → ${freshData.totalStars} (+${starsIncrease})`
              );
              // Reset star increase animation after 3 seconds
              setTimeout(() => {
                setGitHubData((prev) => ({ ...prev, starIncrease: 0 }));
              }, 3000);
            } else if (starsIncrease < 0) {
              console.log(
                `⭐ Stars decreased: ${previousTotals.totalStars} → ${freshData.totalStars} (${starsIncrease})`
              );
            }

            if (forksIncrease > 0) {
              console.log(
                `🍴 Forks increased! ${previousTotals.totalForks} → ${freshData.totalForks} (+${forksIncrease})`
              );
            } else if (forksIncrease < 0) {
              console.log(
                `🍴 Forks decreased: ${previousTotals.totalForks} → ${freshData.totalForks} (${forksIncrease})`
              );
            }

            return {
              ...prev,
              totals: freshData,
              previousTotals: freshData,
              lastUpdateTime: new Date(),
              hasInitialData: true,
              isLoading: false,
              starIncrease: starsIncrease > 0 ? starsIncrease : 0,
            };
          } else {
            console.log(
              `⏭️ No GitHub data changes detected. Skipping UI update.`
            );
            return prev; // No changes, return previous state
          }
        });
      } catch (error) {
        console.error("❌ Failed to fetch GitHub data:", error);

        // Handle different error types
        let errorMessage = "API unavailable";
        if (error instanceof Error) {
          if (error.message.includes("No internet connection")) {
            errorMessage = "No internet connection";
          } else if (error.message.includes("Rate limit exceeded")) {
            // Don't retry rate limit errors, just show the error
            errorMessage =
              "Rate limit exceeded - please wait before trying again";
          } else if (error.message.includes("Network error")) {
            // Retry network errors up to 3 times
            setGitHubData((prev) => {
              if (prev.retryCount < 3) {
                console.log(
                  `🔄 Retrying GitHub fetch (attempt ${
                    prev.retryCount + 1
                  }/3)...`
                );
                setTimeout(
                  () => fetchGitHubData(true),
                  5000 * (prev.retryCount + 1) // Increased delay
                );
                return {
                  ...prev,
                  retryCount: prev.retryCount + 1,
                  isLoading: false,
                };
              } else {
                return {
                  ...prev,
                  error: "Network error - please check your connection",
                  isLoading: false,
                };
              }
            });
            return;
          } else if (error.message.includes("User not found")) {
            errorMessage = "GitHub user not found";
          } else if (error.message.includes("Unauthorized")) {
            errorMessage = "GitHub API unauthorized";
          }
        }

        setGitHubData((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
      }
    },
    [] // Empty dependency array to prevent infinite loops
  );

  // Optimized GitHub data fetching with visibility API
  useEffect(() => {
    let isMounted = true;
    const intervalId = setInterval(() => {
      if (isMounted && document.visibilityState === "visible") {
        console.log("🔄 300-second interval: Fetching GitHub data...");
        fetchGitHubData();
      }
    }, 300000); // Increased to 300 seconds (5 minutes) to prevent rate limiting

    // Initial fetch
    fetchGitHubData();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isMounted) {
        fetchGitHubData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array - fetchGitHubData is stable with empty deps

  // Memoized data to prevent unnecessary re-renders
  const skills = useMemo(
    () => [
      {
        name: "Development",
        icon: Code,
        title: "Development",
        description:
          "Building scalable web applications with modern technologies and best practices.",
        color: "from-blue-500 to-cyan-500",
        stats: "20+ Projects",
      },
      {
        name: "Design",
        icon: Palette,
        title: "Design",
        description:
          "Creating beautiful, intuitive interfaces that users love to interact with.",
        color: "from-purple-500 to-pink-500",
        stats: "50+ Designs",
      },
      {
        name: "Performance",
        icon: Rocket,
        title: "Performance",
        description:
          "Optimizing applications for speed, efficiency, and exceptional user experience.",
        color: "from-orange-500 to-red-500",
        stats: "99% Uptime",
      },
      {
        name: "Innovation",
        icon: Zap,
        title: "Innovation",
        description:
          "Staying ahead with cutting-edge technologies and creative problem-solving.",
        color: "from-yellow-500 to-green-500",
        stats: "10+ Years",
      },
    ],
    []
  );

  const technologies = useMemo(
    () => [
      { name: "React", color: "bg-blue-500" },
      { name: "TypeScript", color: "bg-blue-600" },
      { name: "Node.js", color: "bg-green-500" },
      { name: "Express", color: "bg-pink-500" },
      { name: "Next.js", color: "bg-gray-800" },
      { name: "Redux Toolkit", color: "bg-red-500" },
      { name: "Tailwind CSS", color: "bg-cyan-500" },
      { name: "PostgreSQL", color: "bg-blue-700" },
      { name: "MongoDB", color: "bg-green-600" },
      // { name: "AWS", color: "bg-orange-500" },
      // { name: "Docker", color: "bg-blue-400" },
      // { name: "GraphQL", color: "bg-pink-500" },
      // { name: "Redis", color: "bg-red-500" },
      { name: "Socket.io", color: "bg-blue-600" },
      { name: "Clerk", color: "bg-orange-500" },
      { name: "DBMS", color: "bg-blue-400" },
    ],
    []
  );

  // Optimized achievements with GitHub data
  const achievements = useMemo(() => {
    const { totals, error, isLoading, lastUpdateTime, starIncrease } =
      gitHubData;

    return [
      {
        icon: Users,
        label: "LinkedIn Connections",
        value: "100+",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: TrendingUp,
        label: "Success Rate",
        value: "98%",
        color: "from-green-500 to-emerald-500",
      },
      {
        icon: FolderDot,
        label: "Projects Completed",
        value: gitHubData.error
          ? "N/A"
          : gitHubData.isLoading
          ? "..."
          : gitHubData.totals.repositories.length === 0
          ? "0"
          : `${gitHubData.totals.repositories.length}`,
        color: gitHubData.error
          ? "from-red-500 to-red-600"
          : gitHubData.isLoading
          ? "from-yellow-500 to-orange-500"
          : "from-yellow-500 to-orange-500",
        isLive: true,
        subtitle: gitHubData.lastUpdateTime
          ? `Updated ${gitHubData.lastUpdateTime.toLocaleTimeString()}`
          : undefined,
      },
      {
        icon: Star,
        label: "Projects Loved",
        value: error
          ? error.includes("Rate limit")
            ? "⏳"
            : "N/A"
          : isLoading
          ? "..."
          : totals.totalStars === 0
          ? "0"
          : `${totals.totalStars}`,
        color: error
          ? error.includes("Rate limit")
            ? "from-yellow-500 to-orange-500"
            : "from-red-500 to-red-600"
          : isLoading
          ? "from-yellow-500 to-orange-500"
          : "from-pink-500 to-rose-500",
        isLive: true,
        subtitle: lastUpdateTime
          ? `Updated ${lastUpdateTime.toLocaleTimeString()}${
              starIncrease > 0 ? ` (+${starIncrease} new!)` : ""
            }`
          : undefined,
      },
    ];
  }, [gitHubData]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-6 overflow-hidden min-h-screen"
      style={{ contain: "layout style paint" }}
    >
      {/* Optimized background - GPU accelerated */}
      <div className="absolute inset-0 pointer-events-none will-change-transform">
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-linear-to-br from-blue-500/15 via-cyan-500/15 to-transparent rounded-full blur-3xl transform-gpu" />
        <div className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-linear-to-br from-purple-500/15 via-pink-500/15 to-transparent rounded-full blur-3xl transform-gpu" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-linear-to-br from-orange-500/8 via-yellow-500/8 to-transparent rounded-full blur-3xl transform-gpu" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative max-w-7xl mx-auto"
        style={{ willChange: "opacity" }}
      >
        {/* Header - Optimized animations */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-6 py-2.5 text-sm font-semibold tracking-widest shadow-lg"
            >
              ABOUT ME
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
              Passionate About Building
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-4xl md:text-5xl text-gray-600 dark:text-gray-400"
            >
              Exceptional Digital Products
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            With over a decade of experience in crafting digital experiences, I
            specialize in building scalable, performant, and beautiful web
            applications that users love.
          </motion.p>
        </div>

        {/* Optimized Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const darkBgClasses = [
              "dark:bg-[#0a0a1a]", // Very dark blue tint (LinkedIn)
              "dark:bg-[#0a0f1a]", // Very dark teal tint (Success Rate)
              "dark:bg-[#1a0f0a]", // Very dark orange tint (Projects Completed)
              "dark:bg-[#1a0a1a]", // Very dark pink tint (Projects Loved)
            ];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.1 + index * 0.03,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.1, ease: "easeOut" },
                }}
                className="relative group"
                style={{ willChange: "transform" }}
              >
                <div className="relative p-[2px] rounded-xl bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-all duration-300">
                  <Card
                    className={`relative text-center border-0 bg-white/90 ${darkBgClasses[index]} backdrop-blur-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-xl group/card before:absolute before:inset-0 before:bg-linear-to-br ${achievement.color} before:opacity-0 before:group-hover/card:opacity-10 before:transition-opacity before:duration-500`}
                  >
                    {/* Animated gradient overlay with glow */}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${achievement.color} opacity-0 group-hover/card:opacity-20 transition-opacity duration-500 blur-xl`}
                      style={{ willChange: "opacity" }}
                    />

                    {/* Animated corner gradients */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className={`absolute top-0 right-0 w-14 h-14 bg-linear-to-br ${achievement.color} opacity-10 rounded-bl-full blur-sm`}
                    />
                    <motion.div
                      animate={{
                        rotate: [360, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className={`absolute bottom-0 left-0 w-12 h-12 bg-linear-to-tr ${achievement.color} opacity-10 rounded-tr-full blur-sm`}
                    />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />

                    {achievement.isLive && (
                      <div className="absolute top-3 right-3 z-20">
                        {gitHubData.error ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                              OFFLINE
                            </span>
                          </div>
                        ) : achievement.label === "Projects Completed" ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                              LIVE
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                              LIVE
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <CardContent className="pt-4 pb-4 relative z-10">
                      {/* Icon with glowing gradient background */}
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br ${achievement.color} mb-3 shadow-lg group-hover/card:shadow-2xl transition-all duration-300`}
                        style={{ willChange: "transform" }}
                      >
                        {/* Glow effect */}
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${achievement.color} opacity-50 blur-md group-hover/card:opacity-75 transition-opacity duration-300 -z-10`}
                        />
                        <Icon className="w-5 h-5 text-white relative z-10 drop-shadow-lg" />
                      </motion.div>

                      {/* Value with animated gradient */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="mb-1.5"
                      >
                        <div className="relative inline-block">
                          {/* Glow effect behind */}
                          <span
                            className={`absolute inset-0 bg-linear-to-r ${achievement.color} bg-clip-text text-transparent blur-sm opacity-50 text-2xl font-black pointer-events-none`}
                          >
                            {achievement.value}
                          </span>
                          {/* Main text with gradient and visible fallback */}
                          <span
                            className={`relative text-2xl font-black text-gray-900 dark:text-white bg-linear-to-r ${achievement.color} bg-clip-text`}
                          >
                            {achievement.value}
                          </span>
                        </div>
                      </motion.div>

                      {/* Label with gradient border */}
                      <div className="relative inline-block px-2 py-0.5 rounded-full">
                        <div
                          className={`absolute inset-0 bg-linear-to-r ${achievement.color} opacity-20 blur rounded-full`}
                        />
                        <div className="relative text-[10px] font-bold text-gray-700 dark:text-gray-200 tracking-wider uppercase">
                          {achievement.label}
                        </div>
                      </div>

                      {/* Animated gradient underline */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "2rem" }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className={`mt-2 mx-auto h-0.5 bg-linear-to-r ${achievement.color} rounded-full shadow-lg`}
                      />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skills - memoized components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} />
          ))}
        </div>

        {/* Optimized Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3, ease: "easeOut" }}
          className="text-center"
          style={{ willChange: "transform" }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Technologies I Work With
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks I use
            to bring ideas to life.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <TechnologyBadge key={index} tech={tech} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Optimized CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4, ease: "easeOut" }}
          className="mt-20"
          style={{ willChange: "transform" }}
        >
          <Card className="relative border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            <CardContent className="relative p-12 text-center bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
                Let's Build Something Amazing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Ready to bring your ideas to life? Let's collaborate and create
                exceptional digital experiences together.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                style={{ willChange: "transform" }}
                className="flex justify-center"
              >
                <BorderMagicButton className="hover:shadow-2xl transition-all duration-150">
                  Get In Touch
                </BorderMagicButton>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutPage;
