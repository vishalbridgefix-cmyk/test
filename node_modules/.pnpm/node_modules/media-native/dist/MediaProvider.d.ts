import React, { ReactNode } from 'react';
import { MediaClient, MediaConfig } from 'media-core';
export declare const MediaContext: React.Context<MediaClient | null>;
interface MediaProviderProps {
    config: MediaConfig;
    children: ReactNode;
}
export declare const MediaProvider: React.FC<MediaProviderProps>;
export declare const useMediaClient: () => MediaClient;
export {};
