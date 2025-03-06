import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { GroupRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import { useClassParticipants } from "@/hooks/useClass";

interface ClassParticipantsProps {
  classId: string;
}

const ClassParticipants: React.FC<ClassParticipantsProps> = ({ classId }) => {
  const { data, isLoading, error } = useClassParticipants(classId);
  const meta = data?.meta;
  const participants = data?.data;

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("D MMM YYYY");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size="sm" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography level="body-sm" color="danger">
        Failed to load participants
      </Typography>
    );
  }

  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <GroupRounded sx={{ mr: 1, fontSize: 24 }} />
        <Typography level="title-md">Enrolled Students</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {participants?.length === 0 ? (
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            No students enrolled yet
          </Typography>
        </Box>
      ) : (
        <div>
          <List sx={{ "--ListItem-paddingY": "0.5rem" }}>
            {participants?.map((participant, index) => (
              <ListItem key={index}>
                <ListItemDecorator>
                  <Avatar
                    size="sm"
                    src={participant.image || undefined}
                    alt={participant.name || "User"}
                  >
                    {participant.name?.charAt(0) || "U"}
                  </Avatar>
                </ListItemDecorator>
                <ListItemContent>
                  <Typography level="body-sm">
                    {participant.name || "Anonymous User"}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    {participant.email}
                  </Typography>
                </ListItemContent>
                <Typography level="body-xs" textColor="neutral.500">
                  Joined: {formatDate(participant.enrolledAt)}
                </Typography>
              </ListItem>
            ))}
          </List>

          {meta && meta?.total > (data?.data?.length || 0) && (
            <Box sx={{ mt: "auto", pt: 1, textAlign: "center" }}>
              <Button
                size="sm"
                variant="plain"
                sx={{ width: "100%" }}
                component="a"
                href={`/students?classId=${classId}`}
              >
                View all ({data?.meta?.total})
              </Button>
            </Box>
          )}
        </div>
      )}
    </Card>
  );
};

export default ClassParticipants;
