# NEXXT Task - Team Task Management

A modern team task management application built with React, TypeScript, Tailwind CSS v4, and Supabase.

## 🚀 Quick Start

### Option 1: Local Development (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Supabase locally:**
   ```bash
   npx supabase init
   ```

3. **Start local Supabase:**
   ```bash
   npm run supabase:start
   ```
   This will start a local Supabase instance with Docker. Note the API URL and anon key in the output.

4. **Configure environment variables:**
   Update `.env.local` with local Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the services:**
   - App: `http://localhost:5173`
   - Supabase Studio: `http://127.0.0.1:54323`
   - API: `http://127.0.0.1:54321`

### Option 2: Cloud Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase Cloud:**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from Settings > API
   - Update `.env.local`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Component Structure (Atomic Design)
- **Atoms**: Basic building blocks (Button, Input, etc.)
- **Molecules**: Simple combinations of atoms (Card, FormField, etc.)
- **Organisms**: Complex UI components (Header, Sidebar, etc.)
- **Templates**: Page-level layouts

### Project Structure
```
src/
├── components/          # Atomic design components
│   ├── atoms/          # Basic components
│   ├── molecules/      # Component combinations
│   ├── organisms/      # Complex components
│   └── templates/      # Page layouts
├── pages/              # Page components
├── services/           # API calls and external services
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool and dev server
- **Supabase** - Backend as a Service (Authentication, Database, Storage)
- **React Router** - Client-side routing
- **ESLint** - Code linting

## 📁 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Supabase Local Development
- `npm run supabase:start` - Start local Supabase (requires Docker)
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:status` - Check Supabase status
- `npm run supabase:reset` - Reset local database
- `npm run supabase:migrate` - Push database migrations

## 🔧 Development

The project follows these architectural decisions:
- **Atomic Design System** for component organization
- **Layered Architecture** with services handling API calls
- **TypeScript** for type safety throughout the application
- **Tailwind CSS v4** for modern styling (no PostCSS required)

## 🗄️ Supabase Setup

### Local Development with Supabase CLI

The project supports local Supabase development using Docker:

1. **Prerequisites:**
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Ensure Docker is running

2. **Initialize Supabase (first time only):**
   ```bash
   npx supabase init
   ```

3. **Start local Supabase:**
   ```bash
   npm run supabase:start
   ```
   
   This starts:
   - PostgreSQL database
   - Auth server
   - Storage server
   - Realtime server
   - Studio (web UI)

4. **Access Supabase Studio:**
   - Open `http://127.0.0.1:54323` in your browser
   - Create tables, set up auth, and manage your local database

5. **Stop local Supabase:**
   ```bash
   npm run supabase:stop
   ```

### Database Schema

Create the following tables in Supabase Studio or via migrations:

#### Users Table (Automatic)
Supabase automatically creates an `auth.users` table. Extend user profiles with:

```sql
-- Create a public profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Creating Migrations

To save your schema changes as migrations:

```bash
npx supabase db diff -f create_profiles_table
```

### Authentication Setup

The app uses Supabase Auth with:
- Email/Password authentication
- Session management
- Password reset functionality

See `src/services/authService.ts` for available auth methods.

### Switching Between Local and Production

Simply change the environment variables in `.env.local`:

**Local:**
```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**Production:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 🔐 Environment Variables

Create a `.env.local` file with:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.