-- Break circular recursion between tasks and task_assignments SELECT policies
-- The cycle: tasks SELECT checks task_assignments, which checks tasks SELECT again

-- Solution: Simplify task_assignments SELECT to not reference tasks table
-- Security is maintained through INSERT/DELETE policies (only owners can manage assignments)

DROP POLICY IF EXISTS "Users can read assignments of accessible tasks" ON task_assignments;

-- Allow reading assignments if you're the assigned user
-- Task owners will still be able to see assignments when they fetch the full task
-- because the application fetches them explicitly, not through RLS
CREATE POLICY "Users can read their assignments"
  ON task_assignments FOR SELECT
  USING (user_id = auth.uid());

-- Alternative approach: Create a helper function to check task access without recursion
CREATE OR REPLACE FUNCTION user_owns_task(task_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tasks 
    WHERE id = task_id_param 
    AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Now recreate the task_assignments SELECT policy using the function
-- This breaks recursion because the function is SECURITY DEFINER and doesn't trigger RLS
DROP POLICY IF EXISTS "Users can read their assignments" ON task_assignments;

CREATE POLICY "Users can read assignments of accessible tasks"
  ON task_assignments FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_owns_task(task_id)
  );


