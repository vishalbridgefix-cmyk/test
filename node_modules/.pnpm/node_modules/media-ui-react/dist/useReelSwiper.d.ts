export interface UseReelSwiperProps<T = any> {
    items?: T[];
    totalItems?: number;
    autoPlay?: boolean;
    onIndexChange?: (index: number, item: T) => void;
    ariaLabel?: string;
    onLoadMore?: () => void;
    loading?: boolean;
    hasNextPage?: boolean;
}
export declare const useReelSwiper: <ItemType = any, ContainerElem extends HTMLElement = HTMLDivElement>(props: UseReelSwiperProps<ItemType>) => {
    activeIndex: number;
    currentIndex: number;
    activeItem: NonNullable<ItemType> | null;
    isPlaying: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
    goToPrevious: () => void;
    goToNext: () => void;
    getContainerProps: (userProps?: Record<string, any>) => {
        ref: import("react").MutableRefObject<ContainerElem | null>;
        style: any;
        tabIndex: any;
        'aria-label': any;
        className: string;
        onClick: any;
    };
    getItemProps: (index: number, userProps?: Record<string, any>) => {
        style: any;
        'aria-hidden': boolean;
        className: any;
    };
    getPlayPauseProps: (userProps?: Record<string, any>) => {
        type: "button";
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
        className: any;
    };
    getMuteProps: (userProps?: Record<string, any>) => {
        type: "button";
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
        className: any;
    };
    getPreviousProps: (userProps?: Record<string, any>) => {
        type: "button";
        disabled: boolean;
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
        className: any;
    };
    getNextProps: (userProps?: Record<string, any>) => {
        type: "button";
        disabled: boolean;
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
        className: any;
    };
};
