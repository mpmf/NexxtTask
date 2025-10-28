import { supabase } from './supabase';

export interface TeamMember {
  id: string;
  email: string;
  full_name: string;
}

/**
 * Get all team members (users) from the system
 * 
 * Note: This is a simplified implementation that returns the current user only.
 * For production use with multiple team members, you should:
 * 1. Create a public.profiles table that mirrors user info from auth.users
 * 2. Use a database trigger to auto-populate profiles when users sign up
 * 3. Or create an RPC function with SECURITY DEFINER to query auth.users
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // For now, return only the current user
    // This allows task assignment to self, which is useful for personal task management
    return [{
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    }];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

