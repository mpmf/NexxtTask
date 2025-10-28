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

5. **Run database migrations:**
   ```bash
   npx supabase migration up
   ```
   This creates all necessary tables for task management, including tasks, checklists, assignments, and tags.

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Access the services:**
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

3. **Link your local project to Supabase (optional but recommended):**
   ```bash
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Component Structure (Atomic Design)
- **Atoms**: Basic building blocks (Button, Input, TagBadge, UserAvatar, etc.)
- **Molecules**: Simple combinations of atoms (TaskCard, FormField, Pagination, etc.)
- **Organisms**: Complex UI components (Header, Sidebar, DashboardTaskList, etc.)
- **Templates**: Page-level layouts

### Project Structure
```
src/
├── components/          # Atomic design components
│   ├── atoms/          # Basic components (Button, Input, Logo, TagBadge, UserAvatar)
│   ├── molecules/      # Component combinations (FeatureCard, TaskCard, DashboardTaskCard, Pagination)
│   ├── organisms/      # Complex components (Header, Sidebar, TaskList, DashboardTaskList)
│   └── templates/      # Page layouts
├── pages/              # Page components (Home, Dashboard, SignIn, SignUp, CreateTask)
├── services/           # API services
│   ├── authService.ts  # Authentication service
│   ├── taskService.ts  # Task management service (25+ functions)
│   ├── userService.ts  # User profile lookup service
│   └── supabase.ts     # Supabase client configuration
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   └── task.ts         # Task, checklist, tag types
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
└── utils/              # Utility functions

supabase/
└── migrations/         # Database migrations
    └── 20251028093317_create_tasks_system.sql

tests/
├── e2e/               # End-to-end tests (Playwright)
└── helpers/           # Test utilities
```

## ✨ Features

### Task Management
- **Comprehensive Task System** with title, description, and status tracking
- **Nested Checklists** - Organize tasks with named checklists, each containing multiple checkable items
- **Progress Tracking** - Automatic calculation of task progress based on completed checklist items
- **User Assignments** - Assign tasks to team members with role-based access control
- **Tagging System** - Reusable, color-coded tags for task categorization
- **Access Control** - Owner-based permissions with granular access for assigned users
- **Task States** - Active, Completed, or Canceled status management

### Dashboard Features
- **Task Listing** - View all tasks you own or are assigned to
- **Active/Archived Sections** - Tasks automatically organized by status
- **Tag Filtering** - Filter tasks by tag name in real-time
- **Pagination** - Navigate through tasks with 10 items per page (separate pagination for active and archived)
- **Progress Visualization** - Color-coded progress bars (teal for active, green for completed, gray for canceled)
- **User Badges** - Visual representation of assigned users with initials and consistent colors
- **Task Status Indicators** - Clear badges for DONE and CANCELED tasks

### Authentication
- Email/Password authentication via Supabase Auth
- Session management
- Password reset functionality

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with modern CSS features
- **Vite** - Fast build tool and dev server
- **Supabase** - Backend as a Service (Authentication, Database, Row Level Security)
- **React Router** - Client-side routing
- **Playwright** - End-to-end testing
- **ESLint** - Code linting

## 📁 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run e2e tests with Playwright UI
- `npm run test:e2e:debug` - Debug e2e tests

### Supabase Local Development
- `npm run supabase:start` - Start local Supabase (requires Docker)
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:status` - Check Supabase status
- `npm run supabase:reset` - Reset local database
- `npm run supabase:migrate` - Push database migrations

## 🔧 Development

### Architectural Decisions

The project follows these architectural principles:

**Component Organization:**
- **Atomic Design System** for component organization
- Components are broken down into reusable, single-purpose units
- Pages are composed from smaller components for better maintainability

**Backend Architecture:**
- **Layered Architecture** with clear separation between UI, services, and data
- **Service Layer** (`src/services/`) handles all backend communication and business logic
- **Type Safety** with TypeScript interfaces for all data structures
- **User Service** - Provides user profile lookup by IDs for displaying assigned users

**Task Service Layer:**

The task management system is implemented through a comprehensive service layer (`src/services/taskService.ts`) that provides:

- **25+ Service Functions** covering all CRUD operations for tasks, checklists, items, assignments, and tags
- **Automatic Authentication** - All service functions validate user authentication
- **Permission Validation** - Access control enforced at the service layer before database operations
- **Type-Safe APIs** - Full TypeScript typing for inputs and outputs
- **Descriptive Error Handling** - Clear error messages distinguishing between permission, not-found, and validation errors
- **Progress Calculation** - Dynamic progress calculation based on completed checklist items

**Key Design Decisions:**

1. **Progress is Calculated, Not Stored** - Task progress is computed on-demand from checklist item states rather than stored in the database, ensuring accuracy
2. **Cascade Deletes** - Deleting a task automatically removes all related checklists, items, assignments, and tag associations
3. **Position-Based Ordering** - Checklists and items use integer position fields for custom user-defined ordering
4. **Owner vs. Assigned Access** - Task owners have full control including deletion and assignment management, while assigned users can view and edit
5. **Reusable Tags** - Tags are shared across all users and tasks for consistency
6. **Row Level Security** - Database-level security policies ensure data access rules are enforced even if bypassing the service layer

**Dashboard Implementation:**
- **Separation of Concerns** - Dashboard uses dedicated components (DashboardTaskCard, DashboardTaskList) separate from marketing components
- **Client-Side Pagination** - 10 tasks per page with independent pagination for active and archived sections
- **Real-Time Filtering** - Tag filtering resets pagination and updates instantly
- **Efficient Data Fetching** - Bulk user profile lookup for all assigned users in a single request

**Styling:**
- **Tailwind CSS v4** for modern styling (no PostCSS required)
- Consistent design system with gradient backgrounds and modern UI patterns
- **Glassmorphism Design** - Frosted glass effect with backdrop blur on cards and UI elements

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

The application uses a comprehensive task management schema with migrations stored in `supabase/migrations/`.

#### Running Migrations

Apply all migrations to your local database:

```bash
npx supabase migration up
```

Or migrate specific files:

```bash
npx supabase db push
```

#### Database Tables

The schema includes the following tables:

**Core Task Tables:**
- `tasks` - Main task table with title, description, owner, status (active/completed/canceled), and timestamps
- `task_checklists` - Named checklists within tasks with positioning for custom ordering
- `task_checklist_items` - Individual checkable items within checklists with checked state and positioning
- `task_assignments` - Many-to-many relationship linking tasks to assigned users
- `tags` - Reusable tags with name and optional color
- `task_tags` - Many-to-many relationship linking tasks to tags

**Authentication:**
- `auth.users` - Automatically created by Supabase for user authentication

#### Row Level Security (RLS)

All tables have Row Level Security enabled with comprehensive policies:

**Tasks:**
- Users can read tasks they own or are assigned to
- Users can update tasks they own or are assigned to
- Only task owners can delete tasks

**Checklists & Items:**
- Access permissions inherited from parent task
- Users with task access can create, read, update, and delete checklists and items

**Assignments:**
- Readable by users with task access
- Only task owners can create or remove assignments

**Tags:**
- All authenticated users can read tags
- Authenticated users can create and manage tags

**Task-Tags:**
- Users with task access can add or remove tags

#### Creating New Migrations

To create a new migration:

```bash
npx supabase migration new your_migration_name
```

Or generate a migration from schema changes:

```bash
npx supabase db diff -f your_migration_name
```

### Authentication Setup

The app uses Supabase Auth with:
- Email/Password authentication
- Session management
- Password reset functionality

See `src/services/authService.ts` for available auth methods.

### Using the Task Service

The task management system is accessed through `src/services/taskService.ts`. Here are some examples:

**Creating a Task:**
```typescript
import { createTask } from './services/taskService';

const newTask = await createTask({
  title: 'Implement Dashboard',
  description: 'Build the main dashboard UI',
  checklists: [
    {
      title: 'Design Phase',
      items: [
        { content: 'Create wireframes' },
        { content: 'Design mockups' }
      ]
    },
    {
      title: 'Development Phase',
      items: [
        { content: 'Setup components' },
        { content: 'Implement features' },
        { content: 'Add tests' }
      ]
    }
  ],
  assignedUserIds: ['user-id-1', 'user-id-2'],
  tagIds: ['tag-id-1']
});
```

**Fetching Tasks:**
```typescript
import { getTasks, getTask } from './services/taskService';

// Get all tasks accessible to current user
const allTasks = await getTasks();

// Get a specific task with full details
const task = await getTask('task-id');
console.log(`Progress: ${task.progress}%`);
```

**Managing Checklists:**
```typescript
import { 
  addChecklist, 
  addChecklistItem, 
  toggleChecklistItem 
} from './services/taskService';

// Add a new checklist to a task
const checklist = await addChecklist('task-id', 'Testing Phase', [
  { content: 'Write unit tests' },
  { content: 'Write e2e tests' }
]);

// Add an item to a checklist
const item = await addChecklistItem('checklist-id', 'Code review');

// Toggle an item as complete/incomplete
await toggleChecklistItem('item-id');
```

**Managing Tags:**
```typescript
import { 
  createTag, 
  getTags, 
  addTagToTask,
  getOrCreateTag 
} from './services/taskService';

// Create a new tag
const tag = await createTag({ name: 'urgent', color: '#ff0000' });

// Get all available tags
const allTags = await getTags();

// Add a tag to a task
await addTagToTask('task-id', 'tag-id');

// Get existing tag or create if it doesn't exist
const tag = await getOrCreateTag('frontend', '#3b82f6');
```

**Managing Task Status:**
```typescript
import { updateTask, updateTaskStatus } from './services/taskService';
import { TaskStatus } from './types/task';

// Update task properties
await updateTask('task-id', {
  title: 'Updated Title',
  description: 'Updated description'
});

// Mark task as completed
await updateTaskStatus('task-id', TaskStatus.COMPLETED);
```

All service functions automatically handle authentication and permission checks, throwing descriptive errors when operations fail.

### Using the User Service

The user service provides functions for fetching user profiles. Located in `src/services/userService.ts`:

**Getting User Profiles:**
```typescript
import { getUsersByIds } from './services/userService';

// Get profiles for multiple users (returns a Map)
const userIds = ['user-id-1', 'user-id-2', 'user-id-3'];
const userProfiles = await getUsersByIds(userIds);

// Lookup a specific user
const user = userProfiles.get('user-id-1');
console.log(user?.full_name, user?.email);
```

**Note:** The current implementation returns profile data for the authenticated user and creates placeholders for other users. For production use with multiple team members, you should create a `public.profiles` table that mirrors user info from `auth.users`.

### Dashboard Components

The dashboard uses a modular component architecture:

**Key Components:**
- `DashboardTaskList` - Main container for displaying tasks with active/archived sections
- `DashboardTaskCard` - Individual task card with tags, progress, and user badges
- `TagBadge` - Colored badge for displaying task tags
- `UserAvatar` - Circular avatar with user initials
- `Pagination` - Navigation controls for paginated task lists

**Component Hierarchy:**
```
Dashboard (page)
├── DashboardHeader (tag filter, create button)
└── DashboardTaskList (receives tasks, userProfiles, tagFilter)
    ├── Active Tasks Section
    │   ├── DashboardTaskCard (multiple)
    │   │   ├── TagBadge (multiple)
    │   │   └── UserAvatar (multiple)
    │   └── Pagination
    └── Archived Tasks Section
        ├── DashboardTaskCard (multiple)
        └── Pagination
```

The dashboard fetches tasks on mount and manages state for filtering and pagination.

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