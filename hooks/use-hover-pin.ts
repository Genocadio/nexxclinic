import { useState, useRef, useCallback } from "react";

export interface HoverPinOptions {
  graceMs?: number;
  onOpenChange?: (open: boolean) => void;
}

export function useHoverPin({ graceMs = 180, onOpenChange }: HoverPinOptions = {}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const onMouseEnter = useCallback(() => {
    clearTimer();
    setHovered(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const onMouseLeave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setHovered(false);
      setPinned((curPinned) => {
        if (!curPinned) {
          onOpenChange?.(false);
        }
        return curPinned;
      });
    }, graceMs);
  }, [graceMs, onOpenChange]);

  const togglePin = useCallback(() => {
    clearTimer();
    setPinned((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  const setPinnedExplicit = useCallback(
    (pin: boolean) => {
      clearTimer();
      setPinned(pin);
      if (!pin) setHovered(false);
      onOpenChange?.(pin);
    },
    [onOpenChange]
  );

  const close = useCallback(() => {
    clearTimer();
    setPinned(false);
    setHovered(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const isOpen = pinned || hovered;

  return {
    isOpen,
    isPinned: pinned,
    isHovered: hovered,
    onMouseEnter,
    onMouseLeave,
    togglePin,
    setPinned: setPinnedExplicit,
    close,
  };
}
