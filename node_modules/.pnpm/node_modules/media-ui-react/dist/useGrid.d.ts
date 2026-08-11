import { KeyboardEvent } from 'react';
export interface UseGridProps {
    onLoadMore?: () => void;
    loading?: boolean;
    hasNextPage?: boolean;
    thresholdRows?: number;
}
export declare const useGrid: ({ onLoadMore, loading, hasNextPage, thresholdRows }: UseGridProps) => {
    getContainerProps: () => {
        role: string;
        'aria-label': string;
    };
    getItemProps: (index: number, columnsCount?: number) => {
        role: string;
        tabIndex: number;
        'aria-colindex': number;
    };
    getLoadMoreButtonProps: () => {
        onClick: () => void;
        onKeyDown: (e: KeyboardEvent) => void;
        disabled: boolean;
        'aria-label': string;
    };
    handleItemsRendered: ({ visibleRowStopIndex, rowCount }: {
        visibleRowStopIndex: number;
        rowCount: number;
    }) => void;
};
