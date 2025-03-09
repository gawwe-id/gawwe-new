"use client";

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

import { ProfileAgencies } from "@/server/db/schema/profileAgencies";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { useDialogEditAddressStore } from "@/store/useDialogEditAddressStore";
import { useTranslation } from "react-i18next";

interface AddressInfoProps {
  profile: ProfileParticipant | ProfileAgencies | undefined | null;
}

const AddressInfo = ({ profile }: AddressInfoProps) => {
  const { openDialog } = useDialogEditAddressStore();
  const { t } = useTranslation("account");

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
        <Typography level="title-md">{t("addressInfo.title")}</Typography>
        <Typography level="body-sm">{t("addressInfo.subtitle")}</Typography>
      </Box>
      <Divider />
      <Stack>
        <Typography level="title-sm">{t("addressInfo.address")}</Typography>
        <Typography level="body-xs">{profile?.address}</Typography>
      </Stack>
      <Grid container spacing={3} sx={{ my: 1 }}>
        <Grid xs={12} sm={4}>
          <AdressItem
            title={t("addressInfo.province")}
            value={profile?.province}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem
            title={t("addressInfo.regency")}
            value={profile?.regency}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem
            title={t("addressInfo.district")}
            value={profile?.district}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem
            title={t("addressInfo.village")}
            value={profile?.village}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <AdressItem
            title={t("addressInfo.postalCode")}
            value={profile?.postalCode}
          />
        </Grid>
      </Grid>

      <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
          <Button size="sm" variant="soft" onClick={handleOpenDialog}>
            {t("addressInfo.edit")}
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default AddressInfo;
