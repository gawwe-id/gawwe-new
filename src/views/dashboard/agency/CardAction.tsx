import {
  AddRounded,
  CalendarMonthRounded,
  LinkRounded,
  TaskRounded,
} from "@mui/icons-material";
import { Button, Card, CardContent, Typography } from "@mui/joy";
import React from "react";

const CardAction = () => {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography level="title-md">Aksi</Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          Buat langsung program kelas, jadwal, tugas, dan lainnya
        </Typography>

        <Button
          fullWidth
          variant="soft"
          sx={{ mb: 1 }}
          startDecorator={<AddRounded />}
        >
          Buat Kelas Baru
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          startDecorator={<TaskRounded />}
        >
          Buat Tugas
        </Button>
        <Button fullWidth variant="outlined" startDecorator={<LinkRounded />}>
          Buat Meeting
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardAction;
