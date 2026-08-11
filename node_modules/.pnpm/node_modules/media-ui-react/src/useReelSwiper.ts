import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseReelSwiperProps {
  totalItems: number;
  onLoadMore?: () => void;
  loading?: boolean;
  hasNextPage?: boolean;
}

export const useReelSwiper = <T extends HTMLElement = HTMLDivElement>({ 
  totalItems, 
  onLoadMore, 
  loading, 
  hasNextPage 
}: UseReelSwiperProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<T | null>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeIndex && index >= 0 && index < totalItems) {
      setActiveIndex(index);
    }
    
    // Trigger load more when near the end (e.g. 2 items away)
    if (hasNextPage && !loading && onLoadMore && index >= totalItems - 2) {
      onLoadMore();
    }
  }, [activeIndex, totalItems, hasNextPage, loading, onLoadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const getContainerProps = useCallback(
    () => ({
      ref: containerRef,
      style: {
        overflowY: 'scroll' as const,
        scrollSnapType: 'y mandatory',
        height: '100%', // Consumer usually overwrites or defines via CSS, but we provide inline base
      },
      tabIndex: 0,
      'aria-label': 'Video Reel',
    }),
    []
  );

  const getItemProps = useCallback(
    (index: number) => ({
      style: {
        scrollSnapAlign: 'start',
        height: '100%', // Each item takes full height of container
      },
      'aria-hidden': index !== activeIndex,
    }),
    [activeIndex]
  );

  return {
    activeIndex,
    getContainerProps,
    getItemProps,
  };
};
