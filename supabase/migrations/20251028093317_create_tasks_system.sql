-- Create custom types
CREATE TYPE task_status AS ENUM ('active', 'completed', 'canceled');

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status task_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Task checklists
CREATE TABLE task_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_checklists_task_id ON task_checklists(task_id);
CREATE INDEX idx_task_checklists_position ON task_checklists(task_id, position);

-- Task checklist items
CREATE TABLE task_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES task_checklists(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_checklist_items_checklist_id ON task_checklist_items(checklist_id);
CREATE INDEX idx_task_checklist_items_position ON task_checklist_items(checklist_id, position);

-- Task assignments (many-to-many: tasks to users)
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user_id ON task_assignments(user_id);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);

-- Task tags (many-to-many: tasks to tags)
CREATE TABLE task_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(task_id, tag_id)
);

CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on tasks
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
-- Users can read tasks they own or are assigned to
CREATE POLICY "Users can read their own tasks or tasks assigned to them"
  ON tasks FOR SELECT
  USING (
    auth.uid() = owner_id 
    OR EXISTS (
      SELECT 1 FROM task_assignments 
      WHERE task_assignments.task_id = tasks.id 
      AND task_assignments.user_id = auth.uid()
    )
  );

-- Users can insert their own tasks
CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update tasks they own or are assigned to
CREATE POLICY "Users can update their own tasks or tasks assigned to them"
  ON tasks FOR UPDATE
  USING (
    auth.uid() = owner_id 
    OR EXISTS (
      SELECT 1 FROM task_assignments 
      WHERE task_assignments.task_id = tasks.id 
      AND task_assignments.user_id = auth.uid()
    )
  );

-- Only owners can delete tasks
CREATE POLICY "Only owners can delete tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for task_checklists
-- Access follows parent task permissions
CREATE POLICY "Users can read checklists of accessible tasks"
  ON task_checklists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_checklists.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert checklists for accessible tasks"
  ON task_checklists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_checklists.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update checklists of accessible tasks"
  ON task_checklists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_checklists.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can delete checklists of accessible tasks"
  ON task_checklists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_checklists.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policies for task_checklist_items
-- Access follows parent checklist (and task) permissions
CREATE POLICY "Users can read items of accessible checklists"
  ON task_checklist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM task_checklists
      JOIN tasks ON tasks.id = task_checklists.task_id
      WHERE task_checklists.id = task_checklist_items.checklist_id
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert items for accessible checklists"
  ON task_checklist_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM task_checklists
      JOIN tasks ON tasks.id = task_checklists.task_id
      WHERE task_checklists.id = task_checklist_items.checklist_id
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update items of accessible checklists"
  ON task_checklist_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM task_checklists
      JOIN tasks ON tasks.id = task_checklists.task_id
      WHERE task_checklists.id = task_checklist_items.checklist_id
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can delete items of accessible checklists"
  ON task_checklist_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM task_checklists
      JOIN tasks ON tasks.id = task_checklists.task_id
      WHERE task_checklists.id = task_checklist_items.checklist_id
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policies for task_assignments
-- Users can read assignments for tasks they have access to
CREATE POLICY "Users can read assignments of accessible tasks"
  ON task_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_assignments.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments ta
          WHERE ta.task_id = tasks.id 
          AND ta.user_id = auth.uid()
        )
      )
    )
  );

-- Only task owners can create assignments
CREATE POLICY "Only task owners can create assignments"
  ON task_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_assignments.task_id 
      AND tasks.owner_id = auth.uid()
    )
  );

-- Only task owners can delete assignments
CREATE POLICY "Only task owners can delete assignments"
  ON task_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_assignments.task_id 
      AND tasks.owner_id = auth.uid()
    )
  );

-- RLS Policies for tags
-- All authenticated users can read tags
CREATE POLICY "Authenticated users can read tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create tags
CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update tags (for now, any authenticated user can update any tag)
CREATE POLICY "Authenticated users can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (true);

-- Users can delete tags (for now, any authenticated user can delete any tag)
CREATE POLICY "Authenticated users can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for task_tags
-- Users can read task tags for accessible tasks
CREATE POLICY "Users can read task tags of accessible tasks"
  ON task_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_tags.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

-- Users can add tags to accessible tasks
CREATE POLICY "Users can add tags to accessible tasks"
  ON task_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_tags.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

-- Users can remove tags from accessible tasks
CREATE POLICY "Users can remove tags from accessible tasks"
  ON task_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_tags.task_id 
      AND (
        tasks.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_assignments 
          WHERE task_assignments.task_id = tasks.id 
          AND task_assignments.user_id = auth.uid()
        )
      )
    )
  );

