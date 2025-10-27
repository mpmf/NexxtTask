# Local Supabase Development Guide

This guide will help you set up and use Supabase locally for development.

## Prerequisites

- **Docker Desktop** installed and running
  - Download: https://www.docker.com/products/docker-desktop/
- Node.js and npm installed

## Quick Start

### 1. Initialize Supabase (First Time Only)

```bash
npx supabase init
```

This creates a `supabase` folder with configuration files.

### 2. Start Local Supabase

```bash
npm run supabase:start
```

**First run**: This will download Docker images (~1-2 GB). This may take a few minutes.

**Output**: You'll see URLs and keys for:
- API URL: `http://127.0.0.1:54321`
- Studio URL: `http://127.0.0.1:54323`
- anon key: (used for client-side requests)
- service_role key: (used for admin operations)

### 3. Configure Your App

Update `.env.local`:

```bash
# Comment out or remove production credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-production-key

# Use local Supabase
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### 4. Start Your App

```bash
npm run dev
```

## Useful Commands

```bash
# Check status of local Supabase
npm run supabase:status

# Stop Supabase (keeps data)
npm run supabase:stop

# Reset database (WARNING: deletes all data)
npm run supabase:reset

# Push schema changes
npm run supabase:migrate
```

## Using Supabase Studio

1. Open `http://127.0.0.1:54323` in your browser
2. Default credentials: (no login required for local)

### What you can do in Studio:

- **Table Editor**: Create and modify tables
- **SQL Editor**: Run SQL queries
- **Authentication**: Manage users and auth settings
- **Storage**: Upload and manage files
- **Database**: View and edit data

## Creating Database Tables

### Option 1: Using Supabase Studio
1. Go to `http://127.0.0.1:54323`
2. Navigate to "Table Editor"
3. Click "New Table"
4. Define your schema visually

### Option 2: Using SQL Editor
1. Go to Studio > SQL Editor
2. Paste your SQL and run:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (id)
);
```

### Option 3: Using Migrations
```bash
# Create a new migration file
npx supabase migration new create_profiles_table

# Edit the file in supabase/migrations/
# Then apply it:
npx supabase db reset
```

## Creating Migrations from Schema Changes

If you made changes in Studio and want to save them as migrations:

```bash
npx supabase db diff -f my_changes
```

This creates a migration file with your changes.

## Testing Authentication

### Create a Test User

**Via Studio:**
1. Go to Authentication > Users
2. Click "Add User"
3. Enter email and password

**Via Your App:**
Use the signup form at `/signup`

### Test Email Configuration

By default, local Supabase uses **Inbucket** for email testing:
- Email inbox: `http://127.0.0.1:54324`
- All emails are caught here (signup confirmations, password resets, etc.)

## Switching Between Local and Production

Simply update your `.env.local` file:

**For Local Development:**
```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**For Production:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

Restart your dev server after changing `.env.local`.

## Syncing with Production

### Push Local Schema to Production
```bash
# Link to your production project
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push
```

### Pull Production Schema to Local
```bash
npx supabase db pull
```

## Troubleshooting

### Docker Issues
- **"Cannot connect to Docker"**: Ensure Docker Desktop is running
- **Port conflicts**: Stop other services using ports 54321-54324

### Reset Everything
```bash
# Stop Supabase
npm run supabase:stop

# Remove volumes (deletes all data)
docker volume ls | grep supabase | awk '{print $2}' | xargs docker volume rm

# Start fresh
npm run supabase:start
```

### Check Logs
```bash
# View logs for all services
npx supabase logs

# View logs for specific service
npx supabase logs db
npx supabase logs auth
```

## Local Supabase URLs Reference

| Service | URL |
|---------|-----|
| API | http://127.0.0.1:54321 |
| Studio (Dashboard) | http://127.0.0.1:54323 |
| Inbucket (Email Testing) | http://127.0.0.1:54324 |
| PostgreSQL | postgresql://postgres:postgres@127.0.0.1:54322/postgres |

## Benefits of Local Development

✅ **No internet required** (after initial setup)  
✅ **Free** (no API limits)  
✅ **Fast** (no network latency)  
✅ **Safe** (experiment without affecting production)  
✅ **Offline work** (develop anywhere)  
✅ **Multiple projects** (isolated environments)

## Next Steps

- Create your database schema in Studio
- Set up Row Level Security (RLS) policies
- Test authentication flows
- Build your app features
- When ready, deploy to production Supabase

