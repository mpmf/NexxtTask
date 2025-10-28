import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { UserAssignmentItem } from '../molecules/UserAssignmentItem';
import { TagInput } from '../molecules/TagInput';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface TaskMetadataPanelProps {
  users: User[];
  selectedUserIds: string[];
  tags: string[];
  onUserToggle: (userId: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  loadingUsers: boolean;
}

export const TaskMetadataPanel = ({
  users,
  selectedUserIds,
  tags,
  onUserToggle,
  onAddTag,
  onRemoveTag,
  loadingUsers
}: TaskMetadataPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Assign to</h3>
        <Input
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {loadingUsers ? (
            <p className="text-gray-400 text-sm">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-400 text-sm">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <UserAssignmentItem
                key={user.id}
                userId={user.id}
                userName={user.full_name}
                userEmail={user.email}
                isSelected={selectedUserIds.includes(user.id)}
                onToggle={onUserToggle}
              />
            ))
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Tags</h3>
        <TagInput
          tags={tags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      </div>
    </div>
  );
};


