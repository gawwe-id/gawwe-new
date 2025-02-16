// joy
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/joy';

import Link from 'next/link';

// import project
import ColorSchemeToggle from '@/components/ColorSchemeToggle';

// assets
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import logo from '@/assets/gawwe.svg';
import Image from 'next/image';

export default function Header() {
  return (
    <Box
      component="header"
      className="Header"
      sx={[
        {
          p: 2,
          gap: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.surface'
          // borderBottom: "1px solid",
        }
      ]}
    >
      <Container>
        <Box
          sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between' }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Link href="/">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Image src={logo} alt="Logo" width={25} height={25} />
                <Typography
                  variant="plain"
                  level="title-sm"
                  color="neutral"
                  sx={{ fontWeight: 'bold' }}
                >
                  Gawwe
                </Typography>
              </Stack>
            </Link>
            <Button
              variant="plain"
              color="neutral"
              component={Link}
              href="/programs"
              size="sm"
              sx={{ alignSelf: 'center' }}
            >
              Programs
            </Button>
            <Button
              variant="plain"
              color="neutral"
              component={Link}
              href="/about"
              size="sm"
              sx={{ alignSelf: 'center' }}
            >
              About
            </Button>
            <Button
              variant="plain"
              color="neutral"
              component={Link}
              href="/contact"
              size="sm"
              sx={{ alignSelf: 'center' }}
            >
              Contact
            </Button>
          </Stack>
          <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
            <IconButton variant="plain" color="neutral">
              <MenuRoundedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1.5,
              alignItems: 'center'
            }}
          >
            <ColorSchemeToggle />
            <Divider orientation="vertical" />
            <Button
              variant="plain"
              color="primary"
              component={Link}
              href="/auth/signin"
              size="sm"
              sx={{ alignSelf: 'center' }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
