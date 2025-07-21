import { useState, useEffect } from 'react';
import type { TimelineData, ViewMode } from '../types/timeline';

interface AppState {
  timelineData: TimelineData;
  viewMode: ViewMode;
}

const defaultState: AppState = {
  timelineData: {
    name: 'My Timeline',
    entries: []
  },
  viewMode: 'calendar'
};

export const useUrlState = () => {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    const loadFromUrl = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedState = urlParams.get('state');
        
        if (encodedState) {
          const decodedState = JSON.parse(atob(encodedState));
          // Parse dates back from JSON
          if (decodedState.timelineData?.entries) {
            decodedState.timelineData.entries = decodedState.timelineData.entries.map((entry: any) => ({
              ...entry,
              startDate: new Date(entry.startDate),
              endDate: entry.endDate ? new Date(entry.endDate) : null
            }));
          }
          setState({ ...defaultState, ...decodedState });
        }
      } catch (error) {
        console.error('Failed to load state from URL:', error);
      }
    };

    loadFromUrl();
  }, []);

  const updateState = (newState: Partial<AppState>) => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);
    
    // Save to URL
    try {
      const stateToEncode = {
        ...updatedState,
        timelineData: {
          ...updatedState.timelineData,
          entries: updatedState.timelineData.entries.map(entry => ({
            ...entry,
            startDate: entry.startDate.toISOString(),
            endDate: entry.endDate ? entry.endDate.toISOString() : null
          }))
        }
      };
      
      const encodedState = btoa(JSON.stringify(stateToEncode));
      const url = new URL(window.location.href);
      url.searchParams.set('state', encodedState);
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Failed to save state to URL:', error);
    }
  };

  return { state, updateState };
};