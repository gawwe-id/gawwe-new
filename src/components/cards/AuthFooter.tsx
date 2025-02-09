"use client"

// Joy UI dan React
import { useState, useEffect } from "react"
import { Link, Typography, Stack } from "@mui/joy"

const AuthFooter: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  // Setup listener for detect change screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)") // Breakpoint sm
    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) =>
      setIsSmallScreen(event.matches)

    // Set initial value
    handleMediaChange(mediaQuery)
    mediaQuery.addEventListener("change", handleMediaChange)

    // Cleanup function listener
    return () => mediaQuery.removeEventListener("change", handleMediaChange)
  }, [])

  return (
    <Stack
      direction={isSmallScreen ? "column" : "row"}
      justifyContent={isSmallScreen ? "center" : "space-between"}
      spacing={2}
      textAlign={isSmallScreen ? "center" : "inherit"}
    >
      <Typography level="body-xs" color="neutral" component="span">
        This site is protected by{" "}
        <Typography
          component={Link}
          level="body-xs"
          href="#mantis-privacy"
          target="_blank"
          underline="hover"
        >
          Privacy Policy
        </Typography>
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
          Terms and Conditions
        </Typography>
        <Typography
          level="body-xs"
          color="neutral"
          component={Link}
          href="/"
          target="_blank"
          underline="hover"
        >
          Privacy Policy
        </Typography>
        <Typography
          level="body-xs"
          color="neutral"
          component={Link}
          href="/"
          target="_blank"
          underline="hover"
        >
          CA Privacy Notice
        </Typography>
      </Stack>
    </Stack>
  )
}

export default AuthFooter
