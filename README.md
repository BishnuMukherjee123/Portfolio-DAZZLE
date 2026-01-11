# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. This project showcases my skills, projects, and provides a way for potential clients or employers to contact me.

![Portfolio Screenshot](public/vite.svg)

## 🚀 Features

-   **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations and a premium feel.
-   **Responsive Design**: Fully responsive layout that works perfectly on mobile, tablet, and desktop.
-   **Project Showcase**: Dedicated section to display projects with descriptions, tags, and links.
-   **Contact Form**: integrated with **EmailJS** for direct email notifications and **Supabase** for storing message history.
-   **Dark/Light Mode**: (Optional) Support for theme switching.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, Shadcn UI, Lucide React (Icons)
-   **Animations**: Framer Motion
-   **Backend/Services**:
    -   **EmailJS**: For sending emails directly from the frontend.
    -   **Supabase**: For database storage of contact form submissions.

## 📦 Installation & Setup

1.  **Clone the repository** (if using Git):
    ```bash
    git clone <your-repo-url>
    cd my-portfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory based on `.env.example`. You will need credentials for EmailJS and Supabase.

    ```env
    VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

    VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🗄️ Database Setup (Supabase)

This project uses a `contact_messages` table in Supabase. You can set it up using the SQL script provided in `supabase-setup.sql`.

1.  Go to the **SQL Editor** in your Supabase dashboard.
2.  Copy the contents of `supabase-setup.sql`.
3.  Run the query to create the table and security policies.

## 📧 Email Service (EmailJS)

1.  Create an account on [EmailJS](https://www.emailjs.com/).
2.  Connect your Gmail account as a service.
3.  Create an email template.
4.  Copy your Service ID, Template ID, and Public Key to the `.env` file.

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add your Environment Variables in the Vercel Project Settings.
4.  Deploy!

## 📄 License

This project is licensed under the MIT License.
