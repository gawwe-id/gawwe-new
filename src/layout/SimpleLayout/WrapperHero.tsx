import * as React from "react"
import Box from "@mui/joy/Box"
import Container from "@mui/joy/Container"
import { typographyClasses } from "@mui/joy/Typography"
import Image from "next/image"

// assets
import hero from "@/assets/images/hero.png"

export default function WrapperHero({
  children,
  reversed,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
  return (
    <Container
      sx={[
        (theme) => ({
          position: "relative",
          display: "flex",
          alignItems: "center",
          py: 10,
          gap: 4,
          [theme.breakpoints.up(834)]: {
            flexDirection: "row",
            gap: 6,
          },
          [theme.breakpoints.up(1199)]: {
            gap: 12,
          },
        }),
        reversed
          ? { flexDirection: "column-reverse" }
          : { flexDirection: "column" },
      ]}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "50ch",
          textAlign: "center",
          flexShrink: 999,
          [theme.breakpoints.up(834)]: {
            minWidth: 420,
            alignItems: "flex-start",
            textAlign: "initial",
          },
          [`& .${typographyClasses.root}`]: {
            textWrap: "balance",
          },
        })}
      >
        {children}
      </Box>
      <Image src={hero} width={500} height={500} alt="Hero Image" />
    </Container>
  )
}
