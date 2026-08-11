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
        style: {
            overflowY: "scroll";
            scrollSnapType: string;
            height: string;
        };
        tabIndex: number;
        'aria-label': string;
    };
    getItemProps: (index: number) => {
        style: {
            scrollSnapAlign: string;
            height: string;
        };
        'aria-hidden': boolean;
    };
};
