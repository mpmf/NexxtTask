import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DecorativeBlobs } from '../components/atoms/DecorativeBlobs';
import { Sidebar } from '../components/organisms/Sidebar';
import { CreateTaskHeader } from '../components/organisms/CreateTaskHeader';
import { CreateTaskForm } from '../components/organisms/CreateTaskForm';
import { TaskMetadataPanel } from '../components/organisms/TaskMetadataPanel';
import { createTask, getOrCreateTag } from '../services/taskService';
import { getTeamMembers } from '../services/userService';
import type { TeamMember } from '../services/userService';

interface ChecklistItem {
  tempId: string;
  content: string;
}

interface Checklist {
  tempId: string;
  title: string;
  items: ChecklistItem[];
}

export default function CreateTask() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const bodyStyle = {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #e0f2f7 0%, #d4edee 50%, #fef3e2 100%)',
    minHeight: '100vh'
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Load team members
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const teamMembers = await getTeamMembers();
        setUsers(teamMembers);
      } catch (err) {
        console.error('Error loading team members:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddChecklist = () => {
    setChecklists([
      ...checklists,
      {
        tempId: generateTempId(),
        title: '',
        items: []
      }
    ]);
  };

  const handleRemoveChecklist = (checklistId: string) => {
    setChecklists(checklists.filter(c => c.tempId !== checklistId));
  };

  const handleChecklistTitleChange = (checklistId: string, title: string) => {
    setChecklists(checklists.map(c =>
      c.tempId === checklistId ? { ...c, title } : c
    ));
  };

  const handleAddChecklistItem = (checklistId: string) => {
    setChecklists(checklists.map(c =>
      c.tempId === checklistId
        ? {
            ...c,
            items: [...c.items, { tempId: generateTempId(), content: '' }]
          }
        : c
    ));
  };

  const handleRemoveChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(c =>
      c.tempId === checklistId
        ? { ...c, items: c.items.filter(i => i.tempId !== itemId) }
        : c
    ));
  };

  const handleChecklistItemChange = (checklistId: string, itemId: string, content: string) => {
    setChecklists(checklists.map(c =>
      c.tempId === checklistId
        ? {
            ...c,
            items: c.items.map(i =>
              i.tempId === itemId ? { ...i, content } : i
            )
          }
        : c
    ));
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    // Filter out empty checklists and items
    const validChecklists = checklists
      .filter(c => c.title.trim() && c.items.some(i => i.content.trim()))
      .map(c => ({
        title: c.title.trim(),
        items: c.items
          .filter(i => i.content.trim())
          .map(i => ({ content: i.content.trim() }))
      }));

    setIsSaving(true);

    try {
      // Convert tag names to tag IDs
      let tagIds: string[] | undefined;
      if (tags.length > 0) {
        const tagPromises = tags.map(tagName => getOrCreateTag(tagName));
        const tagObjects = await Promise.all(tagPromises);
        tagIds = tagObjects.map(tag => tag.id);
      }

      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        checklists: validChecklists.length > 0 ? validChecklists : undefined,
        assignedUserIds: selectedUserIds.length > 0 ? selectedUserIds : undefined,
        tagIds
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative text-gray-300" style={bodyStyle}>
      <DecorativeBlobs />
      
      <div className="flex h-screen">
        <Sidebar userName={displayName} userEmail={user?.email || ''} onSignOut={handleLogout} />
        
        <div className="flex-1 h-screen overflow-y-auto" style={{ marginLeft: '16rem' }}>
          <CreateTaskHeader
            onCancel={handleCancel}
            onSave={handleSave}
            isSaving={isSaving}
          />

          {error && (
            <div className="mx-8 mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <main className="p-8 mx-8 mb-8 rounded-2xl mt-6" style={{ backgroundColor: 'rgba(17, 24, 39, 0.1)', backdropFilter: 'blur(2px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CreateTaskForm
                  title={title}
                  description={description}
                  checklists={checklists}
                  onTitleChange={setTitle}
                  onDescriptionChange={setDescription}
                  onChecklistTitleChange={handleChecklistTitleChange}
                  onChecklistItemChange={handleChecklistItemChange}
                  onChecklistItemRemove={handleRemoveChecklistItem}
                  onChecklistItemAdd={handleAddChecklistItem}
                  onChecklistRemove={handleRemoveChecklist}
                  onChecklistAdd={handleAddChecklist}
                />
              </div>

              <div className="lg:col-span-1">
                <TaskMetadataPanel
                  users={users}
                  selectedUserIds={selectedUserIds}
                  tags={tags}
                  onUserToggle={handleUserToggle}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  loadingUsers={loadingUsers}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

