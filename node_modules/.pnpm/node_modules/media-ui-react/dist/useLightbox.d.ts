export interface UseLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    totalItems: number;
    initialIndex?: number;
}
export declare const useLightbox: ({ isOpen, onClose, totalItems, initialIndex }: UseLightboxProps) => {
    currentIndex: number;
    next: () => void;
    prev: () => void;
    getBackdropProps: () => {
        onClick: () => void;
        role: string;
        'aria-modal': boolean;
        'aria-label': string;
    };
    getContainerProps: () => {
        onClick: (e: React.MouseEvent) => void;
        tabIndex: number;
    };
    getNextButtonProps: () => {
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
    };
    getPrevButtonProps: () => {
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
    };
    getCloseButtonProps: () => {
        onClick: (e: React.MouseEvent) => void;
        'aria-label': string;
    };
};
