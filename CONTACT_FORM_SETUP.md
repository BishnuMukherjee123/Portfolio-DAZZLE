# Contact Form Setup Guide

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a Resend account at [resend.com](https://resend.com)
3. Create a new project in your Supabase dashboard

## Setup Steps

### 1. Database Setup (Supabase)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-setup.sql` to create the `contact_messages` table

### 2. Email Service Setup (Resend)

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to [API Keys](https://resend.com/api-keys) and create a new API key
3. Go to [Domains](https://resend.com/domains) and add/verify your domain
4. Update the email service in `src/lib/email.ts` with your verified domain

### 3. Environment Variables

1. Create a `.env.local` file in your project root
2. Copy the template from `env.example` and add your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Resend Configuration
VITE_RESEND_API_KEY=your-resend-api-key
```

### 4. Get Your Credentials

#### Supabase Credentials:

1. In your Supabase project dashboard, go to Settings > API
2. Copy the Project URL and paste it as `VITE_SUPABASE_URL`
3. Copy the anon/public key and paste it as `VITE_SUPABASE_ANON_KEY`

#### Resend Credentials:

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key and copy it as `VITE_RESEND_API_KEY`
3. Go to [resend.com/domains](https://resend.com/domains) and verify your domain
4. Update the `from` field in `src/lib/email.ts` with your verified domain

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out and submit the form
4. Check your email for the notification
5. Check your Supabase dashboard > Table Editor > contact_messages to see the submitted data

## Features Added

- ✅ **Dual Storage**: Form submissions saved to Supabase database
- ✅ **Email Notifications**: You receive an email when someone submits the form
- ✅ **Confirmation Emails**: Users receive a confirmation email
- ✅ **Loading States**: Animated spinner during submission
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Graceful Fallbacks**: Works even if one service fails
- ✅ **Professional Email Templates**: Beautiful HTML email templates

## Email Templates

The system sends two types of emails:

1. **Notification Email** (to you): Contains the full contact form submission
2. **Confirmation Email** (to user): Thanks them and confirms receipt

## Database Schema

The `contact_messages` table includes:

- `id`: Auto-incrementing primary key
- `name`: User's name
- `email`: User's email address
- `message`: User's message content
- `created_at`: Timestamp of submission

## Security

- Row Level Security (RLS) is enabled on Supabase
- Public insert policy allows form submissions
- Email sending requires verified domain
- Sensitive operations are protected
