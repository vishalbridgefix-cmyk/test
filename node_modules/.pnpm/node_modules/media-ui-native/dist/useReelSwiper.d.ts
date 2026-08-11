export interface UseReelSwiperProps {
    totalItems: number;
    onLoadMore?: () => void;
    loading?: boolean;
    hasNextPage?: boolean;
}
export declare const useReelSwiper: <T extends HTMLElement = HTMLDivElement>({ totalItems, onLoadMore, loading, hasNextPage }: UseReelSwiperProps) => {
    activeIndex: number;
    getContainerProps: () => {
        ref: import("react").MutableRefObject<T | null>;
        style: {};
        tabIndex: number;
        'aria-label': string;
    };
    getItemProps: (index: number) => {
        style: {};
        'aria-hidden': boolean;
    };
};
