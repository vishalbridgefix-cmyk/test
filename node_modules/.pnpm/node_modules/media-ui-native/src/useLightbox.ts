import { useState, useCallback, useEffect, KeyboardEvent } from 'react';

export interface UseLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  totalItems: number;
  initialIndex?: number;
}

export const useLightbox = ({ isOpen, onClose, totalItems, initialIndex = 0 }: UseLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, next, prev]);

  const getBackdropProps = useCallback(
    () => ({
      onClick: onClose,
      role: 'dialog',
      'aria-modal': true,
      'aria-label': 'Image Lightbox',
    }),
    [onClose]
  );

  const getContainerProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
      tabIndex: -1,
    }),
    []
  );

  const getNextButtonProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        next();
      },
      'aria-label': 'Next media',
    }),
    [next]
  );

  const getPrevButtonProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        prev();
      },
      'aria-label': 'Previous media',
    }),
    [prev]
  );

  const getCloseButtonProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
      },
      'aria-label': 'Close lightbox',
    }),
    [onClose]
  );

  return {
    currentIndex,
    next,
    prev,
    getBackdropProps,
    getContainerProps,
    getNextButtonProps,
    getPrevButtonProps,
    getCloseButtonProps,
  };
};
