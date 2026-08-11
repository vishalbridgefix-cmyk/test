import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { MediaClient } from 'media-core';
export const MediaContext = createContext(null);
export const MediaProvider = ({ config, children }) => {
    const [client, setClient] = useState(null);
    useEffect(() => {
        try {
            const mediaClient = new MediaClient(config);
            setClient(mediaClient);
        }
        catch (error) {
            console.error('Failed to initialize Media SDK:', error);
        }
    }, [config.apiKey]); // Re-initialize if API key changes
    if (!client) {
        return null; // Or a loading spinner if preferred, but usually we just want to wait for init
    }
    return _jsx(MediaContext.Provider, { value: client, children: children });
};
export const useMediaClient = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMediaClient must be used within a MediaProvider');
    }
    return context;
};
