import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { MediaClient, MediaConfig } from 'media-core';

export const MediaContext = createContext<MediaClient | null>(null);

interface MediaProviderProps {
  config: MediaConfig;
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ config, children }) => {
  const [client, setClient] = useState<MediaClient | null>(null);

  useEffect(() => {
    try {
      const mediaClient = new MediaClient(config);
      setClient(mediaClient);
    } catch (error) {
      console.error('Failed to initialize Media SDK:', error);
    }
  }, [config.apiKey]); // Re-initialize if API key changes

  if (!client) {
    return null; // Or a loading spinner if preferred, but usually we just want to wait for init
  }

  return <MediaContext.Provider value={client}>{children}</MediaContext.Provider>;
};

export const useMediaClient = (): MediaClient => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaClient must be used within a MediaProvider');
  }
  return context;
};
