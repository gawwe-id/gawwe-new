"use client";

import { useRouter } from "next/navigation";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  Typography,
} from "@mui/joy";
import { SchoolRounded as SchoolIcon } from "@mui/icons-material";

interface ClassCardProps {
  classItem: {
    id: string;
    name: string;
    batch: number;
    schedule: string;
  };
}

export default function ClassCard({ classItem }: ClassCardProps) {
  const router = useRouter();

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "md",
          borderColor: "primary.300",
        },
        overflow: "hidden",
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="16/9">
          <Box
            sx={{
              backgroundColor: "primary.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, color: "primary.600" }} />
          </Box>
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Typography level="title-md">{classItem.name}</Typography>
        <Box sx={{ display: "flex", gap: 1, my: 1 }}>
          <Chip size="sm" variant="soft" color="secondary">
            Batch {classItem.batch}
          </Chip>
        </Box>
        <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
          {classItem.schedule}
        </Typography>
      </CardContent>

      <CardOverflow variant="soft">
        <CardActions>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => router.push(`/class-setting/edit/${classItem.id}`)}
            sx={{ flex: 1 }}
          >
            Edit
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant="plain"
            color="primary"
            onClick={() => router.push(`/class-setting/${classItem.id}`)}
            sx={{ flex: 1 }}
          >
            Detail
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
