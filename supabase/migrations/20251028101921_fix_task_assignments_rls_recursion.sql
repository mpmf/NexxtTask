-- Fix infinite recursion in task_assignments RLS policy
-- The SELECT policy was recursively checking task_assignments within itself

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can read assignments of accessible tasks" ON task_assignments;

-- Recreate with a simpler policy that doesn't recurse
-- Users can read assignments if they own the task OR if they're the assigned user
CREATE POLICY "Users can read assignments of accessible tasks"
  ON task_assignments FOR SELECT
  USING (
    -- User is the assigned user
    user_id = auth.uid()
    OR
    -- User owns the task
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_assignments.task_id 
      AND tasks.owner_id = auth.uid()
    )
  );


