import { useState, useEffect } from "react";
import {
  Heart,
  Github,
  Linkedin,
  Twitter,
  Dribbble,
  Figma,
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"; // Import AnimatePresence

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  // A snappy spring for interactive elements
  const spring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  };

  // --- Scroll-to-Top Button Logic ---
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button if scrolled more than 200px
      if (window.scrollY > 200) {
        setIsScrollTopVisible(true);
      } else {
        setIsScrollTopVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/BishnuMukherjee123",
      icon: Github,
      color: "hover:text-white",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/bishnu-mukherjee-a235a621a/",
      icon: Linkedin,
      color: "hover:text-blue-400",
    },
    {
      name: "Twitter",
      href: "https://x.com/BishnuMukherj11",
      icon: Twitter,
      color: "hover:text-sky-400",
    },
    // { name: 'Figma', href: '#', icon: Figma, color: 'hover:text-pink-400' },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "bm908444@gmail.com",
      href: "mailto:bm908444@gmail.com",
    },
    { icon: Phone, text: "+91 97494 21631", href: "tel:+919749421631" },
    { icon: MapPin, text: "Durgapur, West Bengal", href: "#" },
  ];

  // --- Animation Variants for Lists ---
  const listVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger children by 0.1s
      },
    },
    hidden: { opacity: 0 },
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
    hidden: { opacity: 0, x: -20 },
  };

  return (
    <>
      {" "}
      {/* Use Fragment to house Footer and Scroll-to-Top Button */}
      <footer className="relative bg-black border-t border-white/10 overflow-hidden pt-">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none">
          <motion.div
            className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            style={{ willChange: "transform" }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            style={{ willChange: "transform" }}
            animate={{
              scale: [1, 1.1, 1],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-5">
          {/* Main Content Grid (Made Brand column wider on LG screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-8">
            {/* Brand Section (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-3xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  PORTFOLIO
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Crafting exceptional digital experiences with passion,
                  creativity, and cutting-edge technology.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <span>Made with</span>
                {/* Replaced CSS pulse with smoother motion animation */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.div>
                <span>by a passionate developer</span>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <motion.ul
                className="space-y-3"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {quickLinks.map((link) => (
                  <motion.li key={link.name} variants={itemVariants}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center text-gray-400 hover:text-white transition-all duration-300"
                    >
                      {link.name}
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Contact</h4>
              <motion.ul
                className="space-y-3"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.li key={index} variants={itemVariants}>
                      <a
                        href={info.href}
                        className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 transition-all duration-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{info.text}</span>
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Connect</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        ...spring,
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/10 hover:border-white/20`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Let's connect and create something amazing together!
              </motion.p>
            </div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-8"
          />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-sm text-gray-500"
            >
              © {currentYear} Portfolio. All rights reserved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex items-center gap-6 text-sm text-gray-500"
            >
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span className="w-1 h-1 bg-gray-700 rounded-full" />
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
            </motion.div>
          </div>
        </div>
      </footer>
      {/* --- Floating Scroll-to-Top Button --- */}
      <AnimatePresence>
        {isScrollTopVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={spring}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 z-40 group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
