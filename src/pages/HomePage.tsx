import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import me from "../assets/me.jpg";

const HomePage = () => {
  const [currentWord, setCurrentWord] = useState(0);

  // Memoized words array
  const words = useMemo(
    () => ["Digital", "Beautiful", "Modern", "Stunning"],
    []
  );

  // Memoized spring configurations
  const spring = useMemo(
    () => ({
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    }),
    []
  );

  const gentleSpring = useMemo(
    () => ({
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    }),
    []
  );

  // Optimized mouse tracking with RAF and passive listeners
  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--mouse-x",
          `${e.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--mouse-y",
          `${e.clientY}px`
        );
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Optimized word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 py-28 pt-28 sm:pt-32 lg:pt-20 overflow-hidden"
      style={{ contain: "layout style paint" }}
    >
      {/* Optimized Background Gradient */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-black">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-100"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15), transparent 80%)`,
            willChange: "auto",
          }}
        />
      </div>

      {/* Optimized Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {useMemo(
          () =>
            [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gray-400 dark:bg-gray-700 rounded-full opacity-30"
                style={{
                  willChange: "transform",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -15, 10, -20, 0],
                  x: [0, 10, -10, 5, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            )),
          []
        )}
      </div>

      {/* Main Content Grid */}
      <div className="relative max-w-7xl mx-auto z-10 grid lg:grid-cols-5 gap-16 items-center">
        {/* --- Image Column --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, duration: 1, delay: 0.3 }}
          className="lg:col-span-2 order-first lg:order-last"
        >
          <motion.div
            animate={{
              scale: [1, 1.03, 1],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform" }}
            className="relative aspect-square w-full max-w-sm mx-auto"
          >
            {/* Optimized Blob Shape */}
            <div
              className="absolute inset-0 bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 opacity-60 dark:opacity-40 blur-3xl rounded-[40%_60%_60%_40%/30%_30%_70%_70%]"
              style={{ willChange: "auto" }}
            />

            {/* Optimized Image */}
            <div className="relative w-full h-full bg-gray-300 dark:bg-gray-800 rounded-[40%_60%_60%_40%/30%_30%_70%_70%] shadow-2xl flex items-center justify-center">
              <img
                src={me}
                alt="A picture of me"
                className="relative w-full h-full object-cover rounded-[40%_60%_60%_40%/30%_30%_70%_70%] shadow-2xl"
                loading="eager"
                style={{ willChange: "auto" }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Optimized Text Content Column */}
        <div className="lg:col-span-3 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, duration: 1, delay: 0.2 }}
              style={{ willChange: "transform" }}
              className=""
            >
              <span className="inline-block bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent pb-2 z-50">
                Creating
              </span>
            </motion.div>

            {/* Optimized Text Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={words[currentWord]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={gentleSpring}
                className=""
                style={{ willChange: "transform, opacity" }}
              >
                <span className="relative">
                  <span className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {words[currentWord]}
                  </span>
                  <span className="absolute -inset-2 bg-linear-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 blur-2xl -z-10" />
                </span>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, duration: 1, delay: 0.6 }}
              style={{ willChange: "transform" }}
            >
              <span className="inline-block bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
                Experiences
              </span>
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed"
            style={{ willChange: "transform" }}
          >
            <span className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 font-medium">
              Hi, I am{" "}
              <span className="bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold">
                Bishnu Mukherjee
              </span>
              <motion.span
                animate={{ rotate: [0, 20, -20, 20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                style={{ display: "inline-block", transformOrigin: "70% 70%" }}
                className="ml-2"
              >
                👋
              </motion.span>
            </span>
            <br className="hidden sm:block" />
            <span className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              A Full Stack Developer & UI/UX Enthusiast passionate about
              crafting beautiful, functional, and user-centered digital
              experiences with precision and innovation.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center"
            style={{ willChange: "transform" }}
          >
            {/* Optimized Button 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              style={{ willChange: "transform" }}
            >
              <Link
                to="/projects"
                className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-semibold overflow-hidden shadow-2xl w-full sm:w-auto flex justify-center"
              >
                <span className="relative z-10 flex items-center gap-3">
                  View My Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>

            {/* Optimized Button 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              style={{ willChange: "transform" }}
            >
              <Link
                to="/contact"
                className="group relative px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-full font-semibold hover:border-gray-900 dark:hover:border-white transition-all duration-300 overflow-hidden w-full sm:w-auto flex justify-center"
              >
                <span className="relative z-10">Get In Touch</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Optimized Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-0 right-0"
        style={{ willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
          className="relative inline-block"
        >
          <div className="w-8 h-12 border-2 border-gray-400 dark:border-gray-600 rounded-full mx-auto flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              style={{ willChange: "transform, opacity" }}
              className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomePage;
