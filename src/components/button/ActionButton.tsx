"use client";

import { Button, ButtonProps } from "@mui/joy";
import { useFormStatus } from "react-dom";

interface ActionButtonProps extends ButtonProps {
  loadingText?: string;
}

export default function ActionButton({
  children,
  loadingText = "Loading...",
  disabled,
  ...props
}: ActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      disabled={pending || disabled}
      loading={pending}
      loadingPosition="start"
    >
      {pending ? loadingText : children}
    </Button>
  );
}
