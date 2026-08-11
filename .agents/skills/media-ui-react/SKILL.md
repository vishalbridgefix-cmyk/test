---
name: media-ui-react Usage
description: Instructions for correctly using the media-ui-react headless UI hooks.
---

# media-ui-react Guidelines

`media-ui-react` is a purely Headless UI library. It provides no CSS, no DOM layout wrappers, and has absolutely no knowledge of the Pexels SDK or `media-core`.

## Headless Philosophy (Prop Getters)

Hooks in this library return "prop getters" (e.g., `getContainerProps`, `getItemProps`). You spread these onto your own DOM elements. This allows the hook to manage accessibility (ARIA attributes), focus management, and event listeners while you maintain total control over rendering.

## Available Hooks

- `useGrid({ loading, hasNextPage, onLoadMore })`
- `useLightbox({ isOpen, onClose, totalItems, initialIndex })`
- `useReelSwiper({ totalItems })`

## Correct Usage Example

```tsx
import { useGrid } from 'media-ui-react';

const MyGrid = ({ items, isLoading }) => {
  const { getContainerProps, getItemProps } = useGrid({ loading: isLoading });

  return (
    <div className="my-custom-grid" {...getContainerProps()}>
      {items.map((item, index) => (
        <div key={item.id} className="grid-cell" {...getItemProps(index)}>
          {/* Your content */}
        </div>
      ))}
    </div>
  );
};
```

## Styling Contract
Consumers must provide all CSS. For example, `useReelSwiper` will apply inline styles like `overflow-y: scroll` and `scroll-snap-type: y mandatory` through the prop getters to function properly, but you must define height, layout, background, etc.

## Incorrect Usage
1. **Expecting UI components**: Do not look for `<Grid />` or `<Lightbox />` exports. You must build these yourself using the provided hooks.
2. **Passing API Models**: The hooks do not care if you pass a Pexels `Photo` or a custom object. They only care about lengths, indices, and booleans.
3. **Hardcoding ARIA**: Do not manually add `role="grid"` or `tabIndex`. Let the prop getters manage accessibility completely.
