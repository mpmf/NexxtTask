// Task status type
export const TaskStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// Tag interface
export interface Tag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
}

// Task checklist item interface
export interface TaskChecklistItem {
  id: string;
  checklist_id: string;
  content: string;
  is_checked: boolean;
  position: number;
  created_at: string;
}

// Task checklist interface
export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  position: number;
  created_at: string;
  items?: TaskChecklistItem[];
}

// Task assignment interface
export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  assigned_at: string;
}

// Main task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  owner_id: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  checklists?: TaskChecklist[];
  assignments?: TaskAssignment[];
  tags?: Tag[];
  progress?: number; // Computed progress percentage (0-100)
}

// Input DTO for creating a task
export interface CreateTaskInput {
  title: string;
  description?: string;
  checklists?: {
    title: string;
    items?: {
      content: string;
    }[];
  }[];
  assignedUserIds?: string[];
  tagIds?: string[];
}

// Input DTO for updating a task
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

// Input DTO for creating a checklist
export interface CreateChecklistInput {
  title: string;
  items?: {
    content: string;
  }[];
}

// Input DTO for creating a checklist item
export interface CreateChecklistItemInput {
  content: string;
}

// Input DTO for updating a checklist item
export interface UpdateChecklistItemInput {
  content?: string;
  is_checked?: boolean;
}

// Input DTO for creating a tag
export interface CreateTagInput {
  name: string;
  color?: string;
}

