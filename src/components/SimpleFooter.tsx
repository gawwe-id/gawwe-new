import Image from "next/image"
import Link from "next/link"

// joy-ui
import { Divider, Stack, Typography } from "@mui/joy"

// assets
import logo from "@/assets/gawwe.svg"

const SimpleFooter = () => {
  return (
    <Stack width="100%">
      <Divider>
        <Image src={logo} alt="Logo" width={25} height={25} />
      </Divider>

      <Link href={"/"}>
        <Typography
          mt={0.5}
          level="body-xs"
          color="primary"
          textAlign="center"
          sx={{ opacity: 0.5 }}
        >
          http://gawwe.id
        </Typography>
      </Link>
    </Stack>
  )
}

export default SimpleFooter
