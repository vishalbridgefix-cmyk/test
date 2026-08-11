---
name: media-react Integration
description: Instructions for correctly using the media-react SDK adapter package.
---

# media-react Guidelines

This package provides React hooks and a provider for the headless Media SDK (`media-core`).

## Provider Setup

Always wrap your application root or feature module in the `MediaProvider`. The provider initializes the SDK precisely once with your API key configuration.

**Correct Pattern:**
```tsx
import { MediaProvider } from 'media-react';

const AppRoot = () => (
  <MediaProvider config={{ apiKey: 'YOUR_API_KEY' }}>
    <App />
  </MediaProvider>
);
```

**Incorrect Pattern:**
Do not manually instantiate `MediaClient` from `media-core` in your React components. Do not pass the API key to every hook.

## Available Hooks

- `useSearch()`: Returns `search`, `loading`, `error`, `photosResult`, `videosResult`.
- `usePhotos()`: Returns `getPhotos`, `loading`, `error`.
- `useVideos()`: Returns `getVideos`, `loading`, `error`.
- `useEvents()`: Returns `trackView`, `trackDownload`, `events`.

## Event System

Use `useEvents` to interact with the underlying SDK's EventEmitter.

```tsx
import { useEvents } from 'media-react';

const PhotoItem = ({ photo }) => {
  const { trackView } = useEvents();

  return (
    <img 
      src={photo.url} 
      onClick={() => trackView('image', photo.id)} 
    />
  );
};
```

## Common Mistakes
1. **Importing from media-core directly**: Your UI components should never import `MediaClient` or `Cache` directly from `media-core`. Only import models/types if strictly necessary, but prefer the hooks from `media-react`.
2. **Missing Provider**: Calling hooks without `MediaProvider` in the tree will throw an error.
