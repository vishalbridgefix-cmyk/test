import { useState, useCallback, useEffect, useRef } from 'react';
export const useReelSwiper = (props) => {
    const { items = [], totalItems: inputTotal, autoPlay = true, onIndexChange, ariaLabel = 'Video Reel', onLoadMore, loading, hasNextPage, } = props;
    const totalItems = inputTotal ?? items.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef(null);
    const activeItem = items[activeIndex] || null;
    const handleIndexChange = useCallback((newIndex) => {
        setActiveIndex(newIndex);
        if (onIndexChange && items[newIndex]) {
            onIndexChange(newIndex, items[newIndex]);
        }
    }, [items, onIndexChange]);
    const handleScroll = useCallback(() => {
        if (!containerRef.current)
            return;
        const { scrollTop, clientHeight } = containerRef.current;
        if (clientHeight === 0)
            return;
        const index = Math.round(scrollTop / clientHeight);
        if (index !== activeIndex && index >= 0 && index < totalItems) {
            handleIndexChange(index);
        }
        if (hasNextPage && !loading && onLoadMore && index >= totalItems - 2) {
            onLoadMore();
        }
    }, [activeIndex, totalItems, hasNextPage, loading, onLoadMore, handleIndexChange]);
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);
    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);
    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);
    const goToPrevious = useCallback(() => {
        if (activeIndex > 0) {
            const prevIndex = activeIndex - 1;
            handleIndexChange(prevIndex);
            if (containerRef.current) {
                containerRef.current.scrollTo({
                    top: prevIndex * containerRef.current.clientHeight,
                    behavior: 'smooth',
                });
            }
        }
    }, [activeIndex, handleIndexChange]);
    const goToNext = useCallback(() => {
        if (activeIndex < totalItems - 1) {
            const nextIndex = activeIndex + 1;
            handleIndexChange(nextIndex);
            if (containerRef.current) {
                containerRef.current.scrollTo({
                    top: nextIndex * containerRef.current.clientHeight,
                    behavior: 'smooth',
                });
            }
        }
    }, [activeIndex, totalItems, handleIndexChange]);
    const getContainerProps = useCallback((userProps) => ({
        ref: containerRef,
        style: userProps?.style || {},
        tabIndex: userProps?.tabIndex ?? 0,
        'aria-label': userProps?.['aria-label'] ?? ariaLabel,
        className: `no-scrollbar ${userProps?.className || ''}`.trim(),
        onClick: userProps?.onClick,
    }), [ariaLabel]);
    const getItemProps = useCallback((index, userProps) => ({
        style: userProps?.style || {},
        'aria-hidden': index !== activeIndex,
        className: userProps?.className,
    }), [activeIndex]);
    const getPlayPauseProps = useCallback((userProps) => ({
        type: 'button',
        onClick: (e) => {
            e.stopPropagation();
            togglePlay();
            userProps?.onClick?.(e);
        },
        'aria-label': isPlaying ? 'Pause video' : 'Play video',
        className: userProps?.className,
    }), [isPlaying, togglePlay]);
    const getMuteProps = useCallback((userProps) => ({
        type: 'button',
        onClick: (e) => {
            e.stopPropagation();
            toggleMute();
            userProps?.onClick?.(e);
        },
        'aria-label': isMuted ? 'Unmute video' : 'Mute video',
        className: userProps?.className,
    }), [isMuted, toggleMute]);
    const getPreviousProps = useCallback((userProps) => ({
        type: 'button',
        disabled: activeIndex === 0,
        onClick: (e) => {
            e.stopPropagation();
            goToPrevious();
            userProps?.onClick?.(e);
        },
        'aria-label': 'Previous Reel',
        className: userProps?.className,
    }), [activeIndex, goToPrevious]);
    const getNextProps = useCallback((userProps) => ({
        type: 'button',
        disabled: activeIndex >= totalItems - 1,
        onClick: (e) => {
            e.stopPropagation();
            goToNext();
            userProps?.onClick?.(e);
        },
        'aria-label': 'Next Reel',
        className: userProps?.className,
    }), [activeIndex, totalItems, goToNext]);
    return {
        activeIndex,
        currentIndex: activeIndex,
        activeItem,
        isPlaying,
        isMuted,
        togglePlay,
        toggleMute,
        goToPrevious,
        goToNext,
        getContainerProps,
        getItemProps,
        getPlayPauseProps,
        getMuteProps,
        getPreviousProps,
        getNextProps,
    };
};
