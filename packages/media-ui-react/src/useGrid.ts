import { useCallback, KeyboardEvent } from 'react';

export interface UseGridProps {
  onLoadMore?: () => void;
  loading?: boolean;
  hasNextPage?: boolean;
  thresholdRows?: number;
}

export const useGrid = ({ onLoadMore, loading, hasNextPage, thresholdRows = 2 }: UseGridProps) => {
  const getContainerProps = useCallback(
    () => ({
      role: 'grid',
      'aria-label': 'Media Grid',
    }),
    []
  );

  const getItemProps = useCallback(
    (index: number, columnsCount = 3) => ({
      role: 'gridcell',
      tabIndex: 0,
      'aria-colindex': (index % columnsCount) + 1,
    }),
    []
  );

  const getLoadMoreButtonProps = useCallback(
    () => ({
      onClick: () => {
        if (!loading && hasNextPage && onLoadMore) {
          onLoadMore();
        }
      },
      onKeyDown: (e: KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !loading && hasNextPage && onLoadMore) {
          e.preventDefault();
          onLoadMore();
        }
      },
      disabled: loading || !hasNextPage,
      'aria-label': 'Load more items',
    }),
    [loading, hasNextPage, onLoadMore]
  );

  const handleItemsRendered = useCallback(
    ({ visibleRowStopIndex, rowCount }: { visibleRowStopIndex: number; rowCount: number }) => {
      if (!loading && hasNextPage && onLoadMore && visibleRowStopIndex >= rowCount - 1 - thresholdRows) {
        onLoadMore();
      }
    },
    [loading, hasNextPage, onLoadMore, thresholdRows]
  );

  return {
    getContainerProps,
    getItemProps,
    getLoadMoreButtonProps,
    handleItemsRendered,
  };
};
