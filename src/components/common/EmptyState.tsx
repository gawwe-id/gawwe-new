// File: /components/common/EmptyState.tsx
import { ReactNode } from "react";
import { Box, Typography } from "@mui/joy";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        pt: 8,
        textAlign: "center",
        maxWidth: 600,
        mx: "auto",
        mb: 3,
      }}
    >
      {icon && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            color: "neutral.400",
          }}
        >
          {icon}
        </Box>
      )}

      <Typography level="title-md" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <Typography
        level="body-sm"
        sx={{ color: "text.secondary", mb: action ? 3 : 0 }}
      >
        {description}
      </Typography>

      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}
