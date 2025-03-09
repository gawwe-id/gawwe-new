"use client";

import { useState, useEffect } from "react";

// Joy UI dan React
import { Link, Typography, Stack } from "@mui/joy";

// import
import { useTranslation } from "react-i18next";

const AuthFooter: React.FC = () => {
  const { t } = useTranslation("auth");

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Setup listener for detect change screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)"); // Breakpoint sm
    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) =>
      setIsSmallScreen(event.matches);

    // Set initial value
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup function listener
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <Stack
      direction={isSmallScreen ? "column" : "row"}
      justifyContent={isSmallScreen ? "center" : "space-between"}
      spacing={2}
      textAlign={isSmallScreen ? "center" : "inherit"}
    >
      <Typography level="body-xs" color="neutral" component="span">
        {t("footer.copyright")}
      </Typography>

      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={isSmallScreen ? 1 : 3}
        textAlign={isSmallScreen ? "center" : "inherit"}
      >
        <Typography
          level="body-xs"
          color="neutral"
          component={Link}
          href="/"
          target="_blank"
          underline="hover"
        >
          {t("footer.terms")}
        </Typography>
        <Typography
          level="body-xs"
          color="neutral"
          component={Link}
          href="/"
          target="_blank"
          underline="hover"
        >
          {t("footer.privacy")}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AuthFooter;
