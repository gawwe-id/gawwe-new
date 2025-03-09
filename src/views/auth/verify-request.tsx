"use client";

import { MailOutlineRounded } from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const VerifyRequestPage = () => {
  const { t } = useTranslation("auth");

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.level1",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 400,
          width: "90%",
          boxShadow: "sm",
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <MailOutlineRounded
              sx={{
                fontSize: "4rem",
                color: "primary.500",
              }}
            />

            <Typography level="h3" textAlign="center">
              {t("verification.title")}
            </Typography>

            <Divider />

            <Stack spacing={2}>
              <Typography textAlign="center" level="title-md">
                {t("verification.subtitle")}
              </Typography>

              <Typography textAlign="center" level="body-md">
                {t("verification.instruction")}
              </Typography>

              <Typography
                textAlign="center"
                level="body-sm"
                sx={{ color: "warning.500" }}
              >
                {t("verification.checkSpam")}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyRequestPage;
