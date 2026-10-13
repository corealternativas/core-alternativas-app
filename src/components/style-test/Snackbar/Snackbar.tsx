import React, { useEffect, useRef, useState } from "react";
import { StyledSnackbar } from "./Snackbar.style.ts";

interface SnackbarProps {
  message: string;
  variant?: "success" | "error";
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  variant = "success",
  open,
  onClose,
  autoHideDuration = 5000,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(onClose, 300);
    }, autoHideDuration);

    return () => {
      clearTimeout(timer);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <StyledSnackbar variant={variant} $isClosing={isClosing} role="status">
      {message}
    </StyledSnackbar>
  );
};
