import { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";

import { Box, Container, Grid } from "@mui/joy";
import AuthFooter from "@/components/cards/AuthFooter";

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({
  children,
  image,
}: {
  children: ReactNode;
  image: StaticImageData;
}) => (
  <Container sx={{ minHeight: "100vh" }}>
    <Grid
      container
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid xs={12} sm={6}>
        <Grid
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: {
              xs: "calc(100vh - 210px)",
              sm: "calc(100vh - 134px)",
              md: "calc(100vh - 112px)",
            },
            display: { xs: "none", md: "flex" },
          }}
        >
          <Box p={2}>
            <Image
              src={image}
              width={500}
              height={500}
              alt="Hero Image"
              priority
            />
          </Box>
        </Grid>
      </Grid>
      <Grid
        xs={12}
        md={6}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: {
            xs: "calc(100vh - 210px)",
            sm: "calc(100vh - 134px)",
            md: "calc(100vh - 112px)",
          },
        }}
      >
        <Box
          component="main"
          sx={{
            my: "auto",
            py: 2,
            pb: 5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            maxWidth: "100%",
            mx: "auto",
            borderRadius: "sm",
            "& form": {
              display: "flex",
              flexDirection: "column",
              gap: 2,
            },
            [`& .MuiFormLabel-asterisk`]: {
              visibility: "hidden",
            },
          }}
        >
          {children}
        </Box>
      </Grid>

      <Grid xs={12}>
        <AuthFooter />
      </Grid>
    </Grid>
  </Container>
);

export default AuthWrapper;
