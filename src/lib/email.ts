import emailjs from "@emailjs/browser";

// Get EmailJS configuration from environment variables
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  if (!serviceId || !templateId || !publicKey) {
    console.error("EmailJS environment variables missing");
    throw new Error(
      "Email service is not configured. Please check your .env file."
    );
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        reply_to: formData.email,
      },
      publicKey
    );

    return response;
  } catch (error) {
    console.error("EmailJS sending error:", error);
    throw error;
  }
};

export const sendConfirmationEmail = async (formData: ContactFormData) => {
  // EmailJS typically handles auto-replies via the dashboard configuration
  // or by creating a second template.
  // For now, we'll skip the explicit confirmation email from code
  // to keep the setup simple for the user.
  // You can enable "Auto-Reply" in your EmailJS Gmail Service settings.
  return { id: "auto-handled-by-emailjs" };
};

