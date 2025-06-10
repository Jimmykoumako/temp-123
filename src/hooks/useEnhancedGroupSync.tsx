
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedGroupSyncState {
  sessionId: string | null;
  isLeader: boolean;
  isCoLeader: boolean;
  selectedHymn: string | null;
  currentVerse: number;
  isPlaying: boolean;
  participants: any[];
  sessionDetails: any | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  isFollowingLeader: boolean;
}

interface EnhancedGroupSyncActions {
  createSession: (sessionData: any) => Promise<string>;
  joinSession: (sessionCode: string, password?: string) => Promise<void>;
  leaveSession: () => Promise<void>;
  updateSessionSettings: (settings: any) => Promise<void>;
  broadcastHymnChange: (hymnId: string) => Promise<void>;
  broadcastVerseChange: (verse: number) => Promise<void>;
  broadcastPlayState: (isPlaying: boolean) => Promise<void>;
  promoteToCoLeader: (participantId: string) => Promise<void>;
  removeParticipant: (participantId: string) => Promise<void>;
  toggleFollowLeader: () => Promise<void>;
  updateParticipantPresence: () => Promise<void>;
}

export const useEnhancedGroupSync = (userId: string): [EnhancedGroupSyncState, EnhancedGroupSyncActions] => {
  const [state, setState] = useState<EnhancedGroupSyncState>({
    sessionId: null,
    isLeader: false,
    isCoLeader: false,
    selectedHymn: null,
    currentVerse: 0,
    isPlaying: false,
    participants: [],
    sessionDetails: null,
    connectionStatus: 'disconnected',
    isFollowingLeader: true
  });
  
  const { toast } = useToast();

  // Subscribe to session updates via Supabase realtime
  useEffect(() => {
    if (!state.sessionId) return;

    console.log('Setting up realtime subscription for session:', state.sessionId);

    const channel = supabase
      .channel(`session_${state.sessionId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'group_sessions',
          filter: `id=eq.${state.sessionId}`
        }, 
        (payload) => {
          console.log('Session update received:', payload);
          const updatedSession = payload.new;
          setState(prev => ({
            ...prev,
            selectedHymn: updatedSession.current_hymn_id,
            currentVerse: updatedSession.current_verse || 0,
            isPlaying: updatedSession.is_playing || false,
            sessionDetails: updatedSession
          }));

          // Only dispatch events if user is following leader
          if (state.isFollowingLeader && !state.isLeader && !state.isCoLeader) {
            if (updatedSession.current_hymn_id !== state.selectedHymn) {
              window.dispatchEvent(new CustomEvent('group-hymn-change', { 
                detail: { hymnId: updatedSession.current_hymn_id }
              }));
            }
            if (updatedSession.current_verse !== state.currentVerse) {
              window.dispatchEvent(new CustomEvent('group-verse-change', { 
                detail: { verse: updatedSession.current_verse }
              }));
            }
            if (updatedSession.is_playing !== state.isPlaying) {
              window.dispatchEvent(new CustomEvent('group-play-change', { 
                detail: { isPlaying: updatedSession.is_playing }
              }));
            }
          }
        }
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${state.sessionId}`
        },
        (payload) => {
          console.log('Participants update received:', payload);
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      channel.unsubscribe();
    };
  }, [state.sessionId, state.isFollowingLeader, state.isLeader, state.isCoLeader]);

  // Fetch current session participants
  const fetchParticipants = useCallback(async () => {
    if (!state.sessionId) return;

    console.log('Fetching participants for session:', state.sessionId);
    const { data, error } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', state.sessionId);

    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    console.log('Fetched participants:', data);
    setState(prev => ({ ...prev, participants: data || [] }));

    // Check if current user is co-leader
    const currentUser = data?.find(p => p.user_id === userId);
    if (currentUser) {
      setState(prev => ({ 
        ...prev, 
        isCoLeader: currentUser.is_co_leader || false,
        isFollowingLeader: currentUser.is_following_leader ?? true
      }));
    }
  }, [state.sessionId, userId]);

  // Update participant presence (heartbeat)
  const updateParticipantPresence = useCallback(async () => {
    if (!state.sessionId || !userId) return;

    const { error } = await supabase
      .from('session_participants')
      .update({ 
        last_seen: new Date().toISOString(),
        connection_status: 'connected'
      })
      .eq('session_id', state.sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating presence:', error);
    }
  }, [state.sessionId, userId]);

  // Set up presence heartbeat
  useEffect(() => {
    if (!state.sessionId) return;

    // Initial presence update
    updateParticipantPresence();

    const interval = setInterval(updateParticipantPresence, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [state.sessionId, updateParticipantPresence]);

  // Log session activity
  const logActivity = useCallback(async (actionType: string, actionData?: any) => {
    if (!state.sessionId) return;

    await supabase
      .from('session_activity_logs')
      .insert({
        session_id: state.sessionId,
        user_id: userId,
        action_type: actionType,
        action_data: actionData
      });
  }, [state.sessionId, userId]);

  const actions: EnhancedGroupSyncActions = {
    createSession: async (sessionData) => {
      console.log('Creating session with data:', sessionData);
      const sessionCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      const { data, error } = await supabase
        .from('group_sessions')
        .insert({
          session_code: sessionCode,
          leader_id: userId,
          title: sessionData.title,
          description: sessionData.description,
          password_hash: sessionData.password ? btoa(sessionData.password) : null,
          scheduled_start: sessionData.scheduledStart,
          scheduled_end: sessionData.scheduledEnd
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      console.log('Session created:', data);

      // Add leader as participant
      const { error: participantError } = await supabase
        .from('session_participants')
        .insert({
          session_id: data.id,
          user_id: userId,
          device_name: navigator.userAgent.split(' ')[0] + ' Browser',
          device_type: 'web',
          is_co_leader: false
        });

      if (participantError) {
        console.error('Error adding leader as participant:', participantError);
      }

      setState(prev => ({
        ...prev,
        sessionId: data.id,
        isLeader: true,
        sessionDetails: data,
        connectionStatus: 'connected'
      }));

      await logActivity('session_created', { sessionCode });

      toast({
        title: "Session Created",
        description: `Session code: ${sessionCode}`,
      });

      return sessionCode;
    },

    joinSession: async (sessionCode, password) => {
      console.log('Joining session with code:', sessionCode);
      
      // Find session by code
      const { data: sessionData, error: sessionError } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('session_code', sessionCode)
        .eq('is_active', true)
        .single();

      if (sessionError || !sessionData) {
        console.error('Session not found:', sessionError);
        throw new Error('Session not found or inactive');
      }

      console.log('Found session:', sessionData);

      // Check password if required
      if (sessionData.password_hash && sessionData.password_hash !== btoa(password || '')) {
        throw new Error('Invalid password');
      }

      // Add as participant
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionData.id,
          user_id: userId,
          device_name: navigator.userAgent.split(' ')[0] + ' Browser',
          device_type: 'web'
        });

      if (error) {
        console.error('Error joining session:', error);
        throw error;
      }

      setState(prev => ({
        ...prev,
        sessionId: sessionData.id,
        isLeader: false,
        sessionDetails: sessionData,
        connectionStatus: 'connected',
        selectedHymn: sessionData.current_hymn_id,
        currentVerse: sessionData.current_verse || 0,
        isPlaying: sessionData.is_playing || false
      }));

      await logActivity('participant_joined', { sessionCode });

      toast({
        title: "Joined Session",
        description: `Connected to session ${sessionCode}`,
      });
    },

    leaveSession: async () => {
      if (!state.sessionId) return;

      console.log('Leaving session:', state.sessionId);

      await supabase
        .from('session_participants')
        .delete()
        .eq('session_id', state.sessionId)
        .eq('user_id', userId);

      await logActivity('participant_left');

      setState({
        sessionId: null,
        isLeader: false,
        isCoLeader: false,
        selectedHymn: null,
        currentVerse: 0,
        isPlaying: false,
        participants: [],
        sessionDetails: null,
        connectionStatus: 'disconnected',
        isFollowingLeader: true
      });

      toast({
        title: "Left Session",
        description: "You have left the group session",
      });
    },

    updateSessionSettings: async (settings) => {
      if (!state.isLeader && !state.isCoLeader) return;

      console.log('Updating session settings:', settings);

      const { error } = await supabase
        .from('group_sessions')
        .update(settings)
        .eq('id', state.sessionId);

      if (error) {
        console.error('Error updating session:', error);
        throw error;
      }

      await logActivity('session_updated', settings);
    },

    broadcastHymnChange: async (hymnId) => {
      if (!state.isLeader && !state.isCoLeader) return;

      console.log('Broadcasting hymn change:', hymnId);

      const { error } = await supabase
        .from('group_sessions')
        .update({ current_hymn_id: hymnId, current_verse: 0 })
        .eq('id', state.sessionId);

      if (error) {
        console.error('Error broadcasting hymn change:', error);
        return;
      }

      setState(prev => ({ 
        ...prev, 
        selectedHymn: hymnId, 
        currentVerse: 0 
      }));

      await logActivity('hymn_changed', { hymnId });
    },

    broadcastVerseChange: async (verse) => {
      if (!state.isLeader && !state.isCoLeader) return;

      console.log('Broadcasting verse change:', verse);

      const { error } = await supabase
        .from('group_sessions')
        .update({ current_verse: verse })
        .eq('id', state.sessionId);

      if (error) {
        console.error('Error broadcasting verse change:', error);
        return;
      }

      setState(prev => ({ ...prev, currentVerse: verse }));

      await logActivity('verse_changed', { verse });
    },

    broadcastPlayState: async (isPlaying) => {
      if (!state.isLeader && !state.isCoLeader) return;

      console.log('Broadcasting play state:', isPlaying);

      const { error } = await supabase
        .from('group_sessions')
        .update({ is_playing: isPlaying })
        .eq('id', state.sessionId);

      if (error) {
        console.error('Error broadcasting play state:', error);
        return;
      }

      setState(prev => ({ ...prev, isPlaying }));

      await logActivity('play_state_changed', { isPlaying });
    },

    promoteToCoLeader: async (participantId) => {
      if (!state.isLeader) return;

      console.log('Promoting participant to co-leader:', participantId);

      const { error } = await supabase
        .from('session_participants')
        .update({ is_co_leader: true })
        .eq('id', participantId)
        .eq('session_id', state.sessionId);

      if (error) {
        console.error('Error promoting to co-leader:', error);
        throw error;
      }

      await logActivity('participant_promoted', { participantId });

      toast({
        title: "Co-leader Promoted",
        description: "Participant has been promoted to co-leader",
      });
    },

    removeParticipant: async (participantId) => {
      if (!state.isLeader) return;

      console.log('Removing participant:', participantId);

      const { error } = await supabase
        .from('session_participants')
        .delete()
        .eq('id', participantId)
        .eq('session_id', state.sessionId);

      if (error) {
        console.error('Error removing participant:', error);
        throw error;
      }

      await logActivity('participant_removed', { participantId });

      toast({
        title: "Participant Removed",
        description: "Participant has been removed from the session",
      });
    },

    toggleFollowLeader: async () => {
      const newFollowState = !state.isFollowingLeader;
      
      console.log('Toggling follow leader:', newFollowState);

      const { error } = await supabase
        .from('session_participants')
        .update({ is_following_leader: newFollowState })
        .eq('session_id', state.sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error toggling follow leader:', error);
        return;
      }

      setState(prev => ({ ...prev, isFollowingLeader: newFollowState }));

      await logActivity('follow_leader_toggled', { isFollowing: newFollowState });

      toast({
        title: newFollowState ? "Following Leader" : "Independent Mode",
        description: newFollowState 
          ? "You are now following the leader's navigation" 
          : "You can now navigate independently",
      });
    },

    updateParticipantPresence
  };

  // Initialize participants when session starts
  useEffect(() => {
    if (state.sessionId) {
      fetchParticipants();
    }
  }, [state.sessionId, fetchParticipants]);

  return [state, actions];
};
