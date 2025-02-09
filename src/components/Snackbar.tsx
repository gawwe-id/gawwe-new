import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Button, Snackbar as JoySnackbar } from "@mui/joy";
import { useSnackbarStore } from "@/hooks/useSnackbar";
import { keyframes } from "@emotion/react";

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

interface AnimatedSnackbarProps {
  isExiting?: boolean;
}

const AnimatedSnackbar = styled(JoySnackbar)<AnimatedSnackbarProps>`
  animation: ${(props) => (props.isExiting ? outAnimation : inAnimation)} 0.3s
    ease-in-out forwards;
  transform-origin: bottom right;
`;

export const Snackbar: React.FC = () => {
  const { open, message, color, hideSnackbar } = useSnackbarStore();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      hideSnackbar();
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, hideSnackbar]);

  if (!open && !isExiting) return null;

  return (
    <AnimatedSnackbar
      open={open}
      onClose={handleClose}
      color={color}
      variant="soft"
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      endDecorator={
        <Button
          onClick={() => handleClose()}
          size="sm"
          variant="soft"
          color={color}
        >
          Tutup
        </Button>
      }
      sx={{
        position: "fixed",
        maxWidth: 400,
        bottom: "1rem",
        right: "1rem",
      }}
    >
      {message}
    </AnimatedSnackbar>
  );
};
