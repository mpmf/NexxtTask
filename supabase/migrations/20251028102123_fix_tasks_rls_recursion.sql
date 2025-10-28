-- Fix infinite recursion in RLS policies by simplifying INSERT policies for child tables
-- During task creation, child table INSERTs should only verify ownership, not assignments
-- This prevents circular dependencies between tasks and task_assignments

-- ===== Fix task_checklists INSERT policy =====
DROP POLICY IF EXISTS "Users can insert checklists for accessible tasks" ON task_checklists;

CREATE POLICY "Users can insert checklists for accessible tasks"
  ON task_checklists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_checklists.task_id 
      AND tasks.owner_id = auth.uid()
    )
  );

-- ===== Fix task_checklist_items INSERT policy =====
DROP POLICY IF EXISTS "Users can insert items for accessible checklists" ON task_checklist_items;

CREATE POLICY "Users can insert items for accessible checklists"
  ON task_checklist_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM task_checklists
      JOIN tasks ON tasks.id = task_checklists.task_id
      WHERE task_checklists.id = task_checklist_items.checklist_id
      AND tasks.owner_id = auth.uid()
    )
  );

-- ===== Fix task_tags INSERT policy =====
DROP POLICY IF EXISTS "Users can add tags to accessible tasks" ON task_tags;

CREATE POLICY "Users can add tags to accessible tasks"
  ON task_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_tags.task_id 
      AND tasks.owner_id = auth.uid()
    )
  );


