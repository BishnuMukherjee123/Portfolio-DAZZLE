# Supabase Integration Setup

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Setup Steps

### 1. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-setup.sql` to create the `contact_messages` table

### 2. Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to Settings > API
2. Copy the Project URL and paste it as `VITE_SUPABASE_URL`
3. Copy the anon/public key and paste it as `VITE_SUPABASE_ANON_KEY`

### 4. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out and submit the form
4. Check your Supabase dashboard > Table Editor > contact_messages to see the submitted data

## Features Added

- ✅ Form submission to Supabase database
- ✅ Loading state during submission
- ✅ Error handling with user-friendly messages
- ✅ Success confirmation
- ✅ Form validation
- ✅ Responsive design maintained

## Database Schema

The `contact_messages` table includes:

- `id`: Auto-incrementing primary key
- `name`: User's name
- `email`: User's email address
- `message`: User's message content
- `created_at`: Timestamp of submission

## Security

- Row Level Security (RLS) is enabled
- Public insert policy allows form submissions
- Sensitive operations are protected
