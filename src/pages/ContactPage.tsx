import { useState, useRef, useMemo } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { insertContactMessage } from "@/lib/supabase";
import { sendContactEmail, sendConfirmationEmail } from "@/lib/email";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Static values for optimized background animations
  const y1 = 0;
  const y2 = 0;
  const opacity = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Save to Supabase database (if configured)
      try {
        await insertContactMessage({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });
      } catch (dbError) {
        console.warn(
          "Database save failed, but continuing with email:",
          dbError
        );
        // Continue with email sending even if database fails
      }

      // Send notification email to you
      await sendContactEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      // Send confirmation email to the user
      await sendConfirmationEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      // Show success message
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "text" in error
          ? (error as { text: string }).text
          : "Failed to send message. Please try again.";

      // Provide more helpful error message for configuration issues
      if (
        errorMessage.includes("Supabase is not configured") ||
        errorMessage.includes("Resend API key is not configured") ||
        errorMessage.includes("Email service is not configured")
      ) {
        setSubmitError(
          "Contact form is not fully configured yet. Please contact me directly via email."
        );
      } else {
        setSubmitError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Memoized contact info
  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        label: "Email",
        value: "bishnumukherjee1551@gmail.com",
        href: "mailto:bishnumukherjee1551@gmail.com",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: Phone,
        label: "Phone",
        value: "+91 (974) 942-1631",
        href: "tel:+919749421631",
        color: "from-purple-500 to-pink-500",
      },
      {
        icon: MapPin,
        label: "Location",
        value: "Durgapur, West Bengal",
        href: "#",
        color: "from-orange-500 to-red-500",
      },
    ],
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden min-h-screen"
      style={{
        position: "relative",
        contain: "layout style paint",
      }}
    >
      {/* Optimized static background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-linear-to-br from-blue-500/20 via-cyan-500/20 to-transparent rounded-full blur-3xl"
          style={{ willChange: "auto" }}
        />
        <div
          className="absolute bottom-20 left-[10%] w-[600px] h-[600px] bg-linear-to-br from-purple-500/20 via-pink-500/20 to-transparent rounded-full blur-3xl"
          style={{ willChange: "auto" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-7xl mx-auto"
        style={{
          position: "relative",
          willChange: "opacity",
        }}
      >
        {/* Optimized Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ willChange: "opacity" }}
          >
            <Badge
              variant="secondary"
              className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-widest shadow-lg"
            >
              GET IN TOUCH
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6"
            style={{ willChange: "transform" }}
          >
            <span className="bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
              Let's Work Together
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
            style={{ willChange: "transform" }}
          >
            Have a project in mind? I'd love to hear about it. Let's discuss how
            we can bring your ideas to life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Optimized Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform" }}
          >
            <Card className="relative border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
              {/* Success Message Overlay */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl rounded-2xl z-10"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="text-2xl font-bold mb-2"
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      I'll get back to you soon.
                    </motion.p>
                  </div>
                </motion.div>
              )}

              <CardContent className="p-5 sm:p-6 md:p-8 lg:p-12">
                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {submitError}
                      </p>
                    </div>
                  </motion.div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 mt-4 sm:space-y-6 sm:mt-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{ willChange: "transform" }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 text-sm sm:text-base"
                      placeholder="Your name"
                      style={{ willChange: "transform" }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    style={{ willChange: "transform" }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 text-sm sm:text-base"
                      placeholder="your.email@example.com"
                      style={{ willChange: "transform" }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    style={{ willChange: "transform" }}
                  >
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300"
                    >
                      Message
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-700 text-sm sm:text-base"
                      placeholder="Tell me about your project..."
                      style={{ willChange: "transform" }}
                    />
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full px-6 sm:px-8 py-4 sm:py-5 rounded-full font-bold shadow-xl transition-all duration-200 flex items-center justify-center gap-3 overflow-hidden text-sm sm:text-base ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl"
                    }`}
                    style={{ willChange: "transform" }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <motion.div
                            whileHover={{ x: 2, y: -2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.div>
                        </>
                      )}
                    </span>
                    {!isSubmitting && (
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-blue-700 via-purple-700 to-pink-700"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Optimized Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: "transform" }}
            >
              <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 md:mb-10">
                    Contact Information
                  </h3>
                  <div className="space-y-6 sm:space-y-8">
                    {contactInfo.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.a
                          key={index}
                          href={item.href}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.25 + index * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          whileHover={{
                            x: 8,
                            transition: { duration: 0.15, ease: "easeOut" },
                          }}
                          className="group flex items-start gap-3 sm:gap-4 md:gap-5"
                          style={{ willChange: "transform" }}
                        >
                          <motion.div
                            whileHover={{
                              rotate: 8,
                              scale: 1.05,
                              transition: { duration: 0.15, ease: "easeOut" },
                            }}
                            className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg`}
                            style={{ willChange: "transform" }}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                            <div
                              className={`absolute inset-0 bg-linear-to-br ${item.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                            />
                          </motion.div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 font-semibold">
                              {item.label}
                            </p>
                            <p className="font-bold text-sm sm:text-base md:text-lg">
                              {item.value}
                            </p>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Optimized Availability Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: "transform" }}
            >
              <Card className="relative overflow-hidden border-gray-200/50 dark:border-gray-800/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{ willChange: "background-position" }}
                />
                <CardContent className="relative p-4 sm:p-6 md:p-8 lg:p-12 bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-black">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 dark:bg-black/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                      Available for Work
                    </h3>
                    <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      I'm currently available for freelance projects and
                      full-time opportunities. Let's create something amazing
                      together!
                    </p>
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      style={{ willChange: "opacity" }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-3 h-3 bg-green-500 rounded-full"
                        style={{ willChange: "transform" }}
                      />
                      <span className="font-semibold text-sm sm:text-base">
                        Available Now
                      </span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactPage;
