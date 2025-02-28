"use client";

import {
  Box,
  Chip,
  IconButton,
  Sheet,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import {
  EditRounded as EditIcon,
  VisibilityRounded as VisibilityIcon,
} from "@mui/icons-material";

interface ClassesTableProps {
  classes: Array<{
    id: string;
    name: string;
    batch: number;
    schedule: string;
  }>;
}

export default function ClassesTable({ classes }: ClassesTableProps) {
  const router = useRouter();

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Nama Kelas</th>
            <th style={{ width: "15%" }}>Batch</th>
            <th style={{ width: "30%" }}>Jadwal</th>
            <th style={{ width: "15%", textAlign: "center" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>
                <Typography
                  component="span"
                  fontWeight="medium"
                  level="body-xs"
                >
                  {classItem.name}
                </Typography>
              </td>
              <td>
                <Chip size="sm" variant="soft" color="secondary">
                  Batch {classItem.batch}
                </Chip>
              </td>
              <td>
                <Typography
                  component="span"
                  fontWeight="medium"
                  level="body-xs"
                >
                  {classItem.schedule}
                </Typography>
              </td>
              <td>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title="Edit Kelas">
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() =>
                        router.push(`/class-setting/edit/${classItem.id}`)
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Detail Kelas">
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() =>
                        router.push(`/class-setting/detail/${classItem.id}`)
                      }
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
