import { useCallback } from 'react';
export const useGrid = ({ onLoadMore, loading, hasNextPage }) => {
    const getContainerProps = useCallback(() => ({
        role: 'grid',
        'aria-label': 'Media Grid',
    }), []);
    const getItemProps = useCallback((index) => ({
        role: 'gridcell',
        tabIndex: 0,
        'aria-colindex': (index % 3) + 1, // Example: assuming 3 columns for aria logic, though actual layout is up to consumer
    }), []);
    const getLoadMoreButtonProps = useCallback(() => ({
        onClick: () => {
            if (!loading && hasNextPage && onLoadMore) {
                onLoadMore();
            }
        },
        onKeyDown: (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !loading && hasNextPage && onLoadMore) {
                e.preventDefault();
                onLoadMore();
            }
        },
        disabled: loading || !hasNextPage,
        'aria-label': 'Load more items',
    }), [loading, hasNextPage, onLoadMore]);
    return {
        getContainerProps,
        getItemProps,
        getLoadMoreButtonProps,
    };
};
