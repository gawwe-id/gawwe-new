// File: /components/common/EmptyState.tsx
import { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/joy";

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
    <Card
      variant="outlined"
      sx={{
        p: 4,
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

      <Typography level="title-lg" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <Typography
        level="body-md"
        sx={{ color: "text.secondary", mb: action ? 3 : 0 }}
      >
        {description}
      </Typography>

      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Card>
  );
}
