  import { useState, useEffect, useCallback, memo, useMemo } from "react";
  import { Link, useLocation } from "react-router-dom";
  import { ModeToggle } from "./mode-toggle";
  import { motion, AnimatePresence } from "motion/react";
  import { useTheme } from "./use-theme";
  import butterfly from "../assets/butterfly.png";

  // Memoized navigation item component for better performance
  const NavItem = memo(
    ({
      item,
      index,
      isActive,
      spring,
      isScrolled,
      isDark,
    }: {
      item: { name: string; path: string };
      index: number;
      isActive: boolean;
      spring: any;
      isScrolled: boolean;
      isDark: boolean;
    }) => {
      return (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0 + index * 0.08 }}
          style={{ position: "relative" }}
        >
          <Link
            to={item.path}
            className="relative group px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span
              className={`relative z-10 transition-colors ${
                isActive
                  ? "text-white"
                  : isDark
                  ? "text-gray-300 group-hover:text-white"
                  : isScrolled
                  ? "text-gray-300 group-hover:text-white"
                  : "text-gray-500 group-hover:text-gray-900"
              }`}
            >
              {item.name}
            </span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 rounded-full"
                layoutId="activeNav"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={spring}
                style={{ position: "absolute" }}
              />
            )}

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ position: "absolute" }}
            />
          </Link>
        </motion.div>
      );
    }
  );

  NavItem.displayName = "NavItem";

  // Memoized mobile nav item
  const MobileNavItem = memo(
    ({
      item,
      index,
      isActive,
      gentleSpring,
      onClick,
    }: {
      item: { name: string; path: string };
      index: number;
      isActive: boolean;
      gentleSpring: any;
      onClick: () => void;
    }) => {
      return (
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            ...gentleSpring,
            delay: 0.2 + index * 0.08,
          }}
        >
          <Link
            to={item.path}
            onClick={onClick}
            className={`block px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-300 ${
              isActive
                ? "bg-linear-to-r from-blue-500/40 to-purple-500/40 border border-blue-500/60 text-white"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        </motion.div>
      );
    }
  );

  MobileNavItem.displayName = "MobileNavItem";

  const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { theme } = useTheme();
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Memoized spring configurations
    const spring = useMemo(
      () => ({
        type: "spring",
        stiffness: 500,
        damping: 35,
      }),
      []
    );

    const gentleSpring = useMemo(
      () => ({
        type: "spring",
        stiffness: 200,
        damping: 30,
      }),
      []
    );

    // Memoized nav items
    const navItems = useMemo(
      () => [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Projects", path: "/projects" },
        { name: "Contact", path: "/contact" },
      ],
      []
    );

    // Optimized scroll handler with better performance
    useEffect(() => {
      let rafId: number;
      let lastScrollY = 0;
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          rafId = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);

            // Only update if scroll position changed significantly
            if (scrollDelta > 2) {
              const newIsScrolled = currentScrollY > 10;
              if (newIsScrolled !== isScrolled) {
                setIsScrolled(newIsScrolled);
              }
              lastScrollY = currentScrollY;
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }, [isScrolled]);

    // Close menu on route change
    useEffect(() => {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = "auto";
    }, [location.pathname]);

    // Disable scrolling when mobile menu is open
    useEffect(() => {
      if (isMobileMenuOpen) {
        // Store the current scroll position
        const scrollY = window.scrollY;

        // Add class to body to disable scrolling
        document.body.classList.add("menu-open");
        document.body.style.top = `-${scrollY}px`;
      } else {
        // Remove class and restore scroll position
        const scrollY = document.body.style.top;
        document.body.classList.remove("menu-open");
        document.body.style.top = "";

        // Restore scroll position
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }

      // Cleanup function to restore scrolling when component unmounts
      return () => {
        document.body.classList.remove("menu-open");
        document.body.style.top = "";
      };
    }, [isMobileMenuOpen]);

    // Memoized toggle function
    const toggleMobileMenu = useCallback(() => {
      setIsMobileMenuOpen((prev) => !prev);
    }, []);

    // Memoized overlay click handler
    const handleOverlayClick = useCallback(() => {
      toggleMobileMenu();
    }, [toggleMobileMenu]);

    // Prevent propagation callback
    const stopPropagation = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    return (
      <header
        className={`z-50 transition-all duration-300 ease-out ${
          isScrolled ? "bg-black/90 backdrop-blur-xl" : "bg-transparent"
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          willChange: "transform, background-color, backdrop-filter",
          backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: "none",
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
          style={{
            willChange: "auto",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="relative group -ml-2 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
            >
              <div className="group-hover:scale-105 transition-transform duration-200 ease-out">
                <span className="text-xl sm:text-2xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-0">
                  <div className="relative inline-block">
                    <img
                      src={butterfly}
                      alt="butterfly"
                      className="w-7 h-7 sm:w-8 sm:h-8 absolute inset-0 blur-[1px] opacity-50"
                    />
                    <img
                      src={butterfly}
                      alt="butterfly"
                      className="w-7 h-7 sm:w-8 sm:h-8 relative"
                    />
                  </div>
                  <h1 className="m-0 p-0 text-inherit font-inherit">AZZLE</h1>
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-blue-400 to-purple-400 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ position: "absolute" }}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <NavItem
                  key={item.path}
                  item={item}
                  index={index}
                  isActive={location.pathname === item.path}
                  spring={spring}
                  isScrolled={isScrolled}
                  isDark={isDark}
                />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.1 + navItems.length * 0.08 }}
                className="ml-3"
                style={{
                  position: "relative",
                  willChange: "transform",
                }}
              >
                <ModeToggle />
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ModeToggle />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className={`relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-300 ease-out z-50 ${
                  isScrolled
                    ? "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                    : "bg-gray-200/80 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 hover:bg-gray-300/80 dark:hover:bg-white/10"
                }`}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                style={{
                  willChange: "transform, background-color, border-color",
                }}
              >
                <motion.span
                  animate={
                    isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }
                  }
                  transition={spring}
                  className={`w-5 h-0.5 rounded-full origin-center transition-colors duration-300 ${
                    isScrolled ? "bg-white" : "bg-gray-800 dark:bg-white"
                  }`}
                  style={{ willChange: "transform" }}
                />
                <motion.span
                  animate={
                    isMobileMenuOpen
                      ? { opacity: 0, scale: 0 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.15 }}
                  className={`w-5 h-0.5 rounded-full transition-colors duration-300 ${
                    isScrolled ? "bg-white" : "bg-gray-800 dark:bg-white"
                  }`}
                  style={{ willChange: "transform, opacity" }}
                />
                <motion.span
                  animate={
                    isMobileMenuOpen
                      ? { rotate: -45, y: -5 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={spring}
                  className={`w-5 h-0.5 rounded-full origin-center transition-colors duration-300 ${
                    isScrolled ? "bg-white" : "bg-gray-800 dark:bg-white"
                  }`}
                  style={{ willChange: "transform" }}
                />
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Optimized Mobile Menu */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed min-h-screen inset-0 bg-black/70 z-40 md:hidden"
              onClick={handleOverlayClick}
              style={{ willChange: "opacity, backdrop-filter" }}
            >
              <motion.div
                onClick={stopPropagation}
                className="absolute top-0 left-0 right-0 bottom-0 mt-[70px] p-6 pointer-events-none"
                style={{ willChange: "transform" }}
              >
                <div className="flex flex-col gap-4 pointer-events-auto">
                  {navItems.map((item, index) => (
                    <MobileNavItem
                      key={item.path}
                      item={item}
                      index={index}
                      isActive={location.pathname === item.path}
                      gentleSpring={gentleSpring}
                      onClick={toggleMobileMenu}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  };

  export default Header;
