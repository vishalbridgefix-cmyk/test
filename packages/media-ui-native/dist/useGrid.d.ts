import { KeyboardEvent } from 'react';
export interface UseGridProps {
    onLoadMore?: () => void;
    loading?: boolean;
    hasNextPage?: boolean;
}
export declare const useGrid: ({ onLoadMore, loading, hasNextPage }: UseGridProps) => {
    getContainerProps: () => {
        role: string;
        'aria-label': string;
    };
    getItemProps: (index: number) => {
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
};
