"use client";

import { ProfileAgencies } from "@/server/db/schema/profileAgencies";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { useDialogEditAddressStore } from "@/store/useDialogEditAddressStore";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";

interface AddressInfoProps {
  profile: ProfileParticipant | ProfileAgencies | undefined | null;
}

const AddressInfo = ({ profile }: AddressInfoProps) => {
  const { openDialog } = useDialogEditAddressStore();

  const AdressItem = ({
    title,
    value,
  }: {
    title: string;
    value: string | undefined;
  }) => (
    <Stack>
      <Typography level="title-sm">{title}</Typography>
      <Typography level="body-xs">{value}</Typography>
    </Stack>
  );

  const handleOpenDialog = () => {
    openDialog({ profile });
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Address</Typography>
        <Typography level="body-sm">
          Alamat sesuai dengan domisili saat ini Kamu tinggal
        </Typography>
      </Box>
      <Divider />
      <Stack>
        <Typography level="title-sm">Alamat</Typography>
        <Typography level="body-xs">{profile?.address}</Typography>
      </Stack>
      <Grid container spacing={3} sx={{ my: 1 }}>
        <Grid xs={12} sm={4}>
          <AdressItem title="Provinsi" value={profile?.province} />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem title="Kota/Kabupaten" value={profile?.regency} />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem title="Kecamatan" value={profile?.district} />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem title="Desa" value={profile?.village} />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem title="Kode POS" value={profile?.postalCode} />
        </Grid>
      </Grid>

      <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
          <Button size="sm" variant="soft" onClick={handleOpenDialog}>
            Ubah
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default AddressInfo;
