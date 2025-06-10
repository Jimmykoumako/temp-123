
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface GroupSyncState {
  sessionId: string | null;
  isLeader: boolean;
  selectedHymn: string | null;
  currentVerse: number;
  isPlaying: boolean;
  participants: string[];
}

interface GroupSyncActions {
  createSession: (deviceId: string) => string;
  joinSession: (sessionId: string, deviceId: string) => void;
  leaveSession: () => void;
  broadcastHymnChange: (hymnId: string) => void;
  broadcastVerseChange: (verse: number) => void;
  broadcastPlayState: (isPlaying: boolean) => void;
}

export const useGroupSync = (): [GroupSyncState, GroupSyncActions] => {
  const [state, setState] = useState<GroupSyncState>({
    sessionId: null,
    isLeader: false,
    selectedHymn: null,
    currentVerse: 0,
    isPlaying: false,
    participants: []
  });
  
  const { toast } = useToast();

  // Store session data in localStorage for persistence
  const saveSession = useCallback((sessionData: Partial<GroupSyncState>) => {
    const currentSession = localStorage.getItem('groupSyncSession');
    const updatedSession = currentSession ? 
      { ...JSON.parse(currentSession), ...sessionData } : 
      sessionData;
    localStorage.setItem('groupSyncSession', JSON.stringify(updatedSession));
  }, []);

  // Load session from localStorage
  const loadSession = useCallback(() => {
    const savedSession = localStorage.getItem('groupSyncSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setState(prev => ({ ...prev, ...session }));
    }
  }, []);

  // Broadcast message to all participants in the session
  const broadcastToSession = useCallback((type: string, data: any) => {
    if (!state.sessionId) return;

    const message = {
      type,
      sessionId: state.sessionId,
      data,
      timestamp: Date.now()
    };

    // Use custom events to communicate between windows/tabs
    window.dispatchEvent(new CustomEvent(`group-sync-${state.sessionId}`, {
      detail: message
    }));

    // Also store in localStorage for cross-tab communication
    localStorage.setItem(`group-sync-message-${state.sessionId}`, JSON.stringify(message));
  }, [state.sessionId]);

  // Listen for group sync messages
  useEffect(() => {
    if (!state.sessionId) return;

    const handleGroupMessage = (event: CustomEvent) => {
      const { type, data, sessionId } = event.detail;
      
      if (sessionId !== state.sessionId) return;

      // Only non-leaders should respond to broadcasts
      if (state.isLeader) return;

      switch (type) {
        case 'HYMN_CHANGED':
          setState(prev => ({ ...prev, selectedHymn: data.hymnId }));
          window.dispatchEvent(new CustomEvent('group-hymn-change', { detail: data }));
          break;
        case 'VERSE_CHANGED':
          setState(prev => ({ ...prev, currentVerse: data.verse }));
          window.dispatchEvent(new CustomEvent('group-verse-change', { detail: data }));
          break;
        case 'PLAY_STATE_CHANGED':
          setState(prev => ({ ...prev, isPlaying: data.isPlaying }));
          window.dispatchEvent(new CustomEvent('group-play-change', { detail: data }));
          break;
      }
    };

    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `group-sync-message-${state.sessionId}` && event.newValue) {
        const message = JSON.parse(event.newValue);
        handleGroupMessage({ detail: message } as CustomEvent);
      }
    };

    window.addEventListener(`group-sync-${state.sessionId}` as any, handleGroupMessage);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(`group-sync-${state.sessionId}` as any, handleGroupMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [state.sessionId, state.isLeader]);

  // Actions
  const actions: GroupSyncActions = {
    createSession: (deviceId: string) => {
      const sessionId = Math.floor(1000 + Math.random() * 9000).toString();
      const newState = {
        sessionId,
        isLeader: true,
        selectedHymn: null,
        currentVerse: 0,
        isPlaying: false,
        participants: [deviceId]
      };
      
      setState(newState);
      saveSession(newState);
      
      toast({
        title: "Session Created",
        description: `Session code: ${sessionId}`,
      });
      
      return sessionId;
    },

    joinSession: (sessionId: string, deviceId: string) => {
      const newState = {
        sessionId,
        isLeader: false,
        selectedHymn: null,
        currentVerse: 0,
        isPlaying: false,
        participants: [deviceId]
      };
      
      setState(newState);
      saveSession(newState);
      
      toast({
        title: "Joined Session",
        description: `Connected to session ${sessionId}`,
      });
    },

    leaveSession: () => {
      setState({
        sessionId: null,
        isLeader: false,
        selectedHymn: null,
        currentVerse: 0,
        isPlaying: false,
        participants: []
      });
      localStorage.removeItem('groupSyncSession');
      
      toast({
        title: "Left Session",
        description: "You have left the group session",
      });
    },

    broadcastHymnChange: (hymnId: string) => {
      if (state.isLeader) {
        setState(prev => ({ ...prev, selectedHymn: hymnId }));
        broadcastToSession('HYMN_CHANGED', { hymnId });
      }
    },

    broadcastVerseChange: (verse: number) => {
      if (state.isLeader) {
        setState(prev => ({ ...prev, currentVerse: verse }));
        broadcastToSession('VERSE_CHANGED', { verse });
      }
    },

    broadcastPlayState: (isPlaying: boolean) => {
      if (state.isLeader) {
        setState(prev => ({ ...prev, isPlaying }));
        broadcastToSession('PLAY_STATE_CHANGED', { isPlaying });
      }
    }
  };

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return [state, actions];
};
