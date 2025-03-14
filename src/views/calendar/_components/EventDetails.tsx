import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Chip,
  Link,
  Button,
  Sheet,
  IconButton,
} from "@mui/joy";
import {
  CalendarMonthRounded,
  AccessTimeRounded,
  DescriptionRounded,
  LocationOnRounded,
  VideocamRounded,
  CloseRounded,
  EditRounded,
} from "@mui/icons-material";
import { useEventStore } from "@/store/calendarStore";
import { useTranslation } from "react-i18next";

const getEventColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "schedule":
      return "secondary";
    case "event":
      return "success";
    default:
      return "secondary";
  }
};

const EventDetails = () => {
  const { t } = useTranslation("schedules");
  const { selectedEvent, closeEventSummary } = useEventStore();

  if (!selectedEvent) {
    return (
      <Card>
        <CardContent>
          <Stack
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              py: 4,
            }}
          >
            <CalendarMonthRounded sx={{ fontSize: 64, color: "neutral.400" }} />
            <Typography level="body-lg" sx={{ color: "neutral.500" }}>
              {t("events.noSelection")}
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.400" }}>
              {t("events.selectionHint")}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const { title, date, description, type, isOnline, link } = selectedEvent;
  const eventColor = getEventColor(type);

  return (
    <Card sx={{ position: "relative", overflow: "visible" }}>
      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          zIndex: 2,
        }}
      >
        <IconButton
          variant="soft"
          color="neutral"
          size="sm"
          onClick={closeEventSummary}
          sx={{ borderRadius: "50%" }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>

      <Sheet
        variant="soft"
        color={eventColor}
        sx={{
          p: 2,
          borderTopLeftRadius: "var(--joy-radius-md)",
          borderTopRightRadius: "var(--joy-radius-md)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography level="title-lg" color={eventColor}>
            {t("events.details")}
          </Typography>
          <Chip size="sm" variant="solid" color={eventColor}>
            {t(`calendar.events.types.${type.toLowerCase()}`)}
          </Chip>
        </Stack>
      </Sheet>

      <CardContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Typography level="title-lg">{title}</Typography>

          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRounded fontSize="small" color="primary" />
              <Typography level="body-sm">
                {date.format("dddd, MMMM D, YYYY")}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeRounded fontSize="small" color="primary" />
              <Typography level="body-sm">{date.format("h:mm A")}</Typography>
            </Stack>

            {isOnline !== undefined && (
              <Stack direction="row" spacing={1} alignItems="center">
                {isOnline ? (
                  <VideocamRounded fontSize="small" color="primary" />
                ) : (
                  <LocationOnRounded fontSize="small" color="primary" />
                )}
                <Typography>
                  {isOnline
                    ? t("events.location.online")
                    : t("events.location.inPerson")}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <DescriptionRounded fontSize="small" color="primary" />
              <Typography level="title-md">
                {t("events.description")}
              </Typography>
            </Stack>
            <Typography level="body-xs" sx={{ pl: 3 }}>
              {description || t("events.noDescription")}
            </Typography>
          </Stack>

          {isOnline && link && (
            <>
              <Divider />
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Button
                  fullWidth
                  variant="soft"
                  color="primary"
                  startDecorator={<VideocamRounded />}
                >
                  {t("events.joinMeeting")}
                </Button>
              </Link>
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              startDecorator={<EditRounded />}
            >
              {t("events.edit")}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
