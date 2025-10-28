import { supabase } from './supabase';
import type {
  Task,
  TaskChecklist,
  TaskChecklistItem,
  Tag,
  TaskAssignment,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
  CreateTagInput
} from '../types/task';

// Helper function to get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

// Helper function to check if user has access to a task
const checkTaskAccess = async (taskId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('owner_id, task_assignments!inner(user_id)')
    .eq('id', taskId)
    .single();

  if (error || !data) return false;

  return data.owner_id === userId || 
    data.task_assignments?.some((a: any) => a.user_id === userId);
};

// Helper function to check if user is task owner
const checkTaskOwnership = async (taskId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('owner_id')
    .eq('id', taskId)
    .single();

  if (error || !data) return false;
  return data.owner_id === userId;
};

// ==================== TASK OPERATIONS ====================

/**
 * Create a new task with checklists, assignments, and tags
 */
export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const userId = await getCurrentUserId();

  // Create the task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      title: input.title,
      description: input.description,
      owner_id: userId,
      status: 'active'
    })
    .select()
    .single();

  if (taskError || !task) {
    throw new Error(`Failed to create task: ${taskError?.message}`);
  }

  // Create checklists if provided
  if (input.checklists && input.checklists.length > 0) {
    for (let i = 0; i < input.checklists.length; i++) {
      const checklistInput = input.checklists[i];
      const { data: checklist, error: checklistError } = await supabase
        .from('task_checklists')
        .insert({
          task_id: task.id,
          title: checklistInput.title,
          position: i
        })
        .select()
        .single();

      if (checklistError || !checklist) {
        throw new Error(`Failed to create checklist: ${checklistError?.message}`);
      }

      // Create checklist items if provided
      if (checklistInput.items && checklistInput.items.length > 0) {
        const items = checklistInput.items.map((item, index) => ({
          checklist_id: checklist.id,
          content: item.content,
          position: index,
          is_checked: false
        }));

        const { error: itemsError } = await supabase
          .from('task_checklist_items')
          .insert(items);

        if (itemsError) {
          throw new Error(`Failed to create checklist items: ${itemsError.message}`);
        }
      }
    }
  }

  // Create assignments if provided
  if (input.assignedUserIds && input.assignedUserIds.length > 0) {
    const assignments = input.assignedUserIds.map(userId => ({
      task_id: task.id,
      user_id: userId
    }));

    const { error: assignmentError } = await supabase
      .from('task_assignments')
      .insert(assignments);

    if (assignmentError) {
      throw new Error(`Failed to create assignments: ${assignmentError.message}`);
    }
  }

  // Add tags if provided
  if (input.tagIds && input.tagIds.length > 0) {
    const taskTags = input.tagIds.map(tagId => ({
      task_id: task.id,
      tag_id: tagId
    }));

    const { error: tagError } = await supabase
      .from('task_tags')
      .insert(taskTags);

    if (tagError) {
      throw new Error(`Failed to add tags: ${tagError.message}`);
    }
  }

  // Fetch and return the complete task
  return getTask(task.id);
};

/**
 * Get a single task with all related data
 */
export const getTask = async (id: string): Promise<Task> => {
  await getCurrentUserId();

  // Fetch task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (taskError || !task) {
    throw new Error(`Task not found: ${taskError?.message}`);
  }

  // Fetch checklists
  const { data: checklists, error: checklistsError } = await supabase
    .from('task_checklists')
    .select('*')
    .eq('task_id', id)
    .order('position', { ascending: true });

  if (checklistsError) {
    throw new Error(`Failed to fetch checklists: ${checklistsError.message}`);
  }

  // Fetch checklist items for all checklists
  const checklistIds = checklists?.map(c => c.id) || [];
  let items: TaskChecklistItem[] = [];
  
  if (checklistIds.length > 0) {
    const { data: itemsData, error: itemsError } = await supabase
      .from('task_checklist_items')
      .select('*')
      .in('checklist_id', checklistIds)
      .order('position', { ascending: true });

    if (itemsError) {
      throw new Error(`Failed to fetch checklist items: ${itemsError.message}`);
    }
    items = itemsData || [];
  }

  // Group items by checklist
  const checklistsWithItems: TaskChecklist[] = (checklists || []).map(checklist => ({
    ...checklist,
    items: items.filter(item => item.checklist_id === checklist.id)
  }));

  // Fetch assignments
  const { data: assignments, error: assignmentsError } = await supabase
    .from('task_assignments')
    .select('*')
    .eq('task_id', id);

  if (assignmentsError) {
    throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
  }

  // Fetch tags
  const { data: taskTags, error: taskTagsError } = await supabase
    .from('task_tags')
    .select('tag_id, tags(*)')
    .eq('task_id', id);

  if (taskTagsError) {
    throw new Error(`Failed to fetch tags: ${taskTagsError.message}`);
  }

  const tags: Tag[] = taskTags?.map((tt: any) => tt.tags as Tag).filter(Boolean) || [];

  // Calculate progress
  const progress = calculateProgress(items);

  return {
    ...task,
    checklists: checklistsWithItems,
    assignments: assignments || [],
    tags,
    progress
  };
};

/**
 * Get all tasks accessible to the current user
 */
export const getTasks = async (): Promise<Task[]> => {
  await getCurrentUserId();

  // Fetch tasks where user is owner or assigned
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (tasksError) {
    throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
  }

  // Fetch full details for each task
  const fullTasks = await Promise.all(
    (tasks || []).map(task => getTask(task.id))
  );

  return fullTasks;
};

/**
 * Update a task
 */
export const updateTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
  const userId = await getCurrentUserId();

  // Check access
  const hasAccess = await checkTaskAccess(id, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  return getTask(id);
};

/**
 * Update task status
 */
export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  return updateTask(id, { status });
};

/**
 * Delete a task (owner only)
 */
export const deleteTask = async (id: string): Promise<void> => {
  const userId = await getCurrentUserId();

  // Check ownership
  const isOwner = await checkTaskOwnership(id, userId);
  if (!isOwner) {
    throw new Error('Permission denied: Only the task owner can delete this task');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

// ==================== CHECKLIST OPERATIONS ====================

/**
 * Add a checklist to a task
 */
export const addChecklist = async (taskId: string, title: string, items?: CreateChecklistItemInput[]): Promise<TaskChecklist> => {
  const userId = await getCurrentUserId();

  // Check access
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  // Get current max position
  const { data: existingChecklists } = await supabase
    .from('task_checklists')
    .select('position')
    .eq('task_id', taskId)
    .order('position', { ascending: false })
    .limit(1);

  const position = existingChecklists && existingChecklists.length > 0 
    ? existingChecklists[0].position + 1 
    : 0;

  // Create checklist
  const { data: checklist, error } = await supabase
    .from('task_checklists')
    .insert({
      task_id: taskId,
      title,
      position
    })
    .select()
    .single();

  if (error || !checklist) {
    throw new Error(`Failed to create checklist: ${error?.message}`);
  }

  // Add items if provided
  if (items && items.length > 0) {
    const itemsToInsert = items.map((item, index) => ({
      checklist_id: checklist.id,
      content: item.content,
      position: index,
      is_checked: false
    }));

    const { error: itemsError } = await supabase
      .from('task_checklist_items')
      .insert(itemsToInsert);

    if (itemsError) {
      throw new Error(`Failed to create checklist items: ${itemsError.message}`);
    }
  }

  // Fetch and return checklist with items
  const { data: checklistWithItems, error: fetchError } = await supabase
    .from('task_checklists')
    .select('*, task_checklist_items(*)')
    .eq('id', checklist.id)
    .single();

  if (fetchError || !checklistWithItems) {
    throw new Error(`Failed to fetch checklist: ${fetchError?.message}`);
  }

  return {
    ...checklistWithItems,
    items: checklistWithItems.task_checklist_items || []
  };
};

/**
 * Update a checklist
 */
export const updateChecklist = async (id: string, title: string): Promise<TaskChecklist> => {
  const userId = await getCurrentUserId();

  // Get the task_id from the checklist
  const { data: checklist, error: fetchError } = await supabase
    .from('task_checklists')
    .select('task_id')
    .eq('id', id)
    .single();

  if (fetchError || !checklist) {
    throw new Error('Checklist not found');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(checklist.task_id, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('task_checklists')
    .update({ title })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update checklist: ${error.message}`);
  }

  // Fetch and return updated checklist
  const { data: updated, error: fetchUpdatedError } = await supabase
    .from('task_checklists')
    .select('*, task_checklist_items(*)')
    .eq('id', id)
    .single();

  if (fetchUpdatedError || !updated) {
    throw new Error(`Failed to fetch updated checklist: ${fetchUpdatedError?.message}`);
  }

  return {
    ...updated,
    items: updated.task_checklist_items || []
  };
};

/**
 * Delete a checklist
 */
export const deleteChecklist = async (id: string): Promise<void> => {
  const userId = await getCurrentUserId();

  // Get the task_id from the checklist
  const { data: checklist, error: fetchError } = await supabase
    .from('task_checklists')
    .select('task_id')
    .eq('id', id)
    .single();

  if (fetchError || !checklist) {
    throw new Error('Checklist not found');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(checklist.task_id, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('task_checklists')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete checklist: ${error.message}`);
  }
};

/**
 * Reorder checklists within a task
 */
export const reorderChecklists = async (taskId: string, checklistIds: string[]): Promise<void> => {
  const userId = await getCurrentUserId();

  // Check access
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  // Update positions
  for (let i = 0; i < checklistIds.length; i++) {
    const { error } = await supabase
      .from('task_checklists')
      .update({ position: i })
      .eq('id', checklistIds[i])
      .eq('task_id', taskId);

    if (error) {
      throw new Error(`Failed to reorder checklists: ${error.message}`);
    }
  }
};

// ==================== CHECKLIST ITEM OPERATIONS ====================

/**
 * Add a checklist item
 */
export const addChecklistItem = async (checklistId: string, content: string): Promise<TaskChecklistItem> => {
  const userId = await getCurrentUserId();

  // Get the task_id through the checklist
  const { data: checklist, error: fetchError } = await supabase
    .from('task_checklists')
    .select('task_id')
    .eq('id', checklistId)
    .single();

  if (fetchError || !checklist) {
    throw new Error('Checklist not found');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(checklist.task_id, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  // Get current max position
  const { data: existingItems } = await supabase
    .from('task_checklist_items')
    .select('position')
    .eq('checklist_id', checklistId)
    .order('position', { ascending: false })
    .limit(1);

  const position = existingItems && existingItems.length > 0 
    ? existingItems[0].position + 1 
    : 0;

  // Create item
  const { data: item, error } = await supabase
    .from('task_checklist_items')
    .insert({
      checklist_id: checklistId,
      content,
      position,
      is_checked: false
    })
    .select()
    .single();

  if (error || !item) {
    throw new Error(`Failed to create checklist item: ${error?.message}`);
  }

  return item;
};

/**
 * Update a checklist item
 */
export const updateChecklistItem = async (
  id: string, 
  input: UpdateChecklistItemInput
): Promise<TaskChecklistItem> => {
  const userId = await getCurrentUserId();

  // Get the task_id through the checklist
  const { data: item, error: fetchItemError } = await supabase
    .from('task_checklist_items')
    .select('checklist_id, task_checklists(task_id)')
    .eq('id', id)
    .single();

  if (fetchItemError || !item) {
    throw new Error('Checklist item not found');
  }

  const taskId = (item.task_checklists as any)?.task_id;
  if (!taskId) {
    throw new Error('Could not find parent task');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('task_checklist_items')
    .update(input)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update checklist item: ${error.message}`);
  }

  // Fetch and return updated item
  const { data: updated, error: fetchUpdatedError } = await supabase
    .from('task_checklist_items')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchUpdatedError || !updated) {
    throw new Error(`Failed to fetch updated item: ${fetchUpdatedError?.message}`);
  }

  return updated;
};

/**
 * Delete a checklist item
 */
export const deleteChecklistItem = async (id: string): Promise<void> => {
  const userId = await getCurrentUserId();

  // Get the task_id through the checklist
  const { data: item, error: fetchItemError } = await supabase
    .from('task_checklist_items')
    .select('checklist_id, task_checklists(task_id)')
    .eq('id', id)
    .single();

  if (fetchItemError || !item) {
    throw new Error('Checklist item not found');
  }

  const taskId = (item.task_checklists as any)?.task_id;
  if (!taskId) {
    throw new Error('Could not find parent task');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('task_checklist_items')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete checklist item: ${error.message}`);
  }
};

/**
 * Toggle a checklist item's checked state
 */
export const toggleChecklistItem = async (id: string): Promise<TaskChecklistItem> => {
  const userId = await getCurrentUserId();

  // Get current state
  const { data: item, error: fetchError } = await supabase
    .from('task_checklist_items')
    .select('is_checked, checklist_id, task_checklists(task_id)')
    .eq('id', id)
    .single();

  if (fetchError || !item) {
    throw new Error('Checklist item not found');
  }

  const taskId = (item.task_checklists as any)?.task_id;
  if (!taskId) {
    throw new Error('Could not find parent task');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  return updateChecklistItem(id, { is_checked: !item.is_checked });
};

/**
 * Reorder checklist items within a checklist
 */
export const reorderChecklistItems = async (checklistId: string, itemIds: string[]): Promise<void> => {
  const userId = await getCurrentUserId();

  // Get the task_id through the checklist
  const { data: checklist, error: fetchError } = await supabase
    .from('task_checklists')
    .select('task_id')
    .eq('id', checklistId)
    .single();

  if (fetchError || !checklist) {
    throw new Error('Checklist not found');
  }

  // Check access to the parent task
  const hasAccess = await checkTaskAccess(checklist.task_id, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  // Update positions
  for (let i = 0; i < itemIds.length; i++) {
    const { error } = await supabase
      .from('task_checklist_items')
      .update({ position: i })
      .eq('id', itemIds[i])
      .eq('checklist_id', checklistId);

    if (error) {
      throw new Error(`Failed to reorder items: ${error.message}`);
    }
  }
};

// ==================== ASSIGNMENT OPERATIONS ====================

/**
 * Assign a user to a task
 */
export const assignUser = async (taskId: string, userIdToAssign: string): Promise<TaskAssignment> => {
  const userId = await getCurrentUserId();

  // Check ownership
  const isOwner = await checkTaskOwnership(taskId, userId);
  if (!isOwner) {
    throw new Error('Permission denied: Only the task owner can assign users');
  }

  const { data: assignment, error } = await supabase
    .from('task_assignments')
    .insert({
      task_id: taskId,
      user_id: userIdToAssign
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('User is already assigned to this task');
    }
    throw new Error(`Failed to assign user: ${error.message}`);
  }

  return assignment;
};

/**
 * Unassign a user from a task
 */
export const unassignUser = async (taskId: string, userIdToUnassign: string): Promise<void> => {
  const userId = await getCurrentUserId();

  // Check ownership
  const isOwner = await checkTaskOwnership(taskId, userId);
  if (!isOwner) {
    throw new Error('Permission denied: Only the task owner can unassign users');
  }

  const { error } = await supabase
    .from('task_assignments')
    .delete()
    .eq('task_id', taskId)
    .eq('user_id', userIdToUnassign);

  if (error) {
    throw new Error(`Failed to unassign user: ${error.message}`);
  }
};

// ==================== TAG OPERATIONS ====================

/**
 * Create a new tag
 */
export const createTag = async (input: CreateTagInput): Promise<Tag> => {
  await getCurrentUserId(); // Ensure user is authenticated

  const { data: tag, error } = await supabase
    .from('tags')
    .insert({
      name: input.name,
      color: input.color
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('A tag with this name already exists');
    }
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return tag;
};

/**
 * Get all tags
 */
export const getTags = async (): Promise<Tag[]> => {
  await getCurrentUserId(); // Ensure user is authenticated

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return tags || [];
};

/**
 * Add an existing tag to a task
 */
export const addTagToTask = async (taskId: string, tagId: string): Promise<void> => {
  const userId = await getCurrentUserId();

  // Check access
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('task_tags')
    .insert({
      task_id: taskId,
      tag_id: tagId
    });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('This tag is already added to the task');
    }
    throw new Error(`Failed to add tag to task: ${error.message}`);
  }
};

/**
 * Remove a tag from a task
 */
export const removeTagFromTask = async (taskId: string, tagId: string): Promise<void> => {
  const userId = await getCurrentUserId();

  // Check access
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  const { error } = await supabase
    .from('task_tags')
    .delete()
    .eq('task_id', taskId)
    .eq('tag_id', tagId);

  if (error) {
    throw new Error(`Failed to remove tag from task: ${error.message}`);
  }
};

/**
 * Get existing tag by name or create a new one
 */
export const getOrCreateTag = async (name: string, color?: string): Promise<Tag> => {
  await getCurrentUserId(); // Ensure user is authenticated

  // Try to find existing tag
  const { data: existingTag } = await supabase
    .from('tags')
    .select('*')
    .eq('name', name)
    .single();

  if (existingTag) {
    return existingTag;
  }

  // If not found, create new tag
  return createTag({ name, color });
};

// ==================== PROGRESS CALCULATION ====================

/**
 * Calculate task progress based on checked items
 */
export const calculateTaskProgress = async (taskId: string): Promise<number> => {
  const userId = await getCurrentUserId();

  // Check access
  const hasAccess = await checkTaskAccess(taskId, userId);
  if (!hasAccess) {
    throw new Error('Permission denied: You do not have access to this task');
  }

  // Get all checklists for the task
  const { data: checklists, error: checklistsError } = await supabase
    .from('task_checklists')
    .select('id')
    .eq('task_id', taskId);

  if (checklistsError || !checklists || checklists.length === 0) {
    return 0;
  }

  const checklistIds = checklists.map(c => c.id);

  // Get all items for these checklists
  const { data: items, error: itemsError } = await supabase
    .from('task_checklist_items')
    .select('is_checked')
    .in('checklist_id', checklistIds);

  if (itemsError || !items || items.length === 0) {
    return 0;
  }

  return calculateProgress(items);
};

/**
 * Helper function to calculate progress from items
 */
const calculateProgress = (items: Array<{ is_checked: boolean }>): number => {
  if (!items || items.length === 0) return 0;
  
  const checkedCount = items.filter(item => item.is_checked).length;
  return Math.round((checkedCount / items.length) * 100);
};

