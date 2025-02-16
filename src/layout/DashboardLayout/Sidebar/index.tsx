'use client';

import { memo } from 'react';
import {
  Box,
  Divider,
  GlobalStyles,
  Input,
  List,
  Sheet,
  listItemButtonClasses
} from '@mui/joy';
import { useSession } from 'next-auth/react';
import { KeyboardCommandKeyRounded, SearchRounded } from '@mui/icons-material';

// Project imports
import TitleLogo from './TitleLogo';
import UserDisplay from './UserDisplay';
import ListMenuItem from './ListMenuItem';
import { closeSidebar } from '../utils';
import {
  Menu,
  participant,
  participant_bottom,
  agency,
  agency_bottom
} from '../menu-items';

// Types
interface SidebarProps {
  className?: string;
}

// Constants
const SIDEBAR_WIDTH = {
  default: '220px',
  lg: '240px'
};

const TRANSITION_DURATION = '0.4s';

// Styled components
const SidebarOverlay = memo(({ onClick }: { onClick: () => void }) => (
  <Box
    className="Sidebar-overlay"
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      opacity: 'var(--SideNavigation-slideIn)',
      backgroundColor: 'var(--joy-palette-background-backdrop)',
      transition: `opacity ${TRANSITION_DURATION}`,
      transform: {
        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
        lg: 'translateX(-100%)'
      }
    }}
    onClick={onClick}
  />
));
SidebarOverlay.displayName = 'SidebarOverlay';

const MenuList = memo(({ items }: { items: Menu[] }) => (
  <List
    size="sm"
    sx={{
      gap: 1,
      '--List-nestedInsetStart': '30px',
      '--ListItem-radius': (theme) => theme.vars.radius.sm
    }}
  >
    {items.map((menu) => (
      <ListMenuItem key={menu.id} menu={menu} />
    ))}
  </List>
));
MenuList.displayName = 'MenuList';

const BottomMenuList = memo(({ items }: { items: Menu[] }) => (
  <List
    size="sm"
    sx={{
      mt: 'auto',
      flexGrow: 0,
      '--ListItem-radius': (theme) => theme.vars.radius.sm,
      '--List-gap': '8px'
    }}
  >
    {items.map((menu) => (
      <ListMenuItem key={menu.id} menu={menu} />
    ))}
  </List>
));
BottomMenuList.displayName = 'BottomMenuList';

const SearchInput = memo(() => (
  <Input
    size="sm"
    startDecorator={<SearchRounded />}
    endDecorator={<KeyboardCommandKeyRounded />}
    placeholder="Cari..."
  />
));
SearchInput.displayName = 'SearchInput';

// Main component
const Sidebar = ({ className }: SidebarProps) => {
  const { data: session } = useSession();
  const role = session?.user.role;

  const menuItems = role === 'participant' ? participant : agency;
  const bottomMenuItems =
    role === 'participant' ? participant_bottom : agency_bottom;

  if (!role) return null;

  return (
    <Sheet
      className={`Sidebar ${className || ''}`}
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none'
        },
        transition: `transform ${TRANSITION_DURATION}, width ${TRANSITION_DURATION}`,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider'
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': SIDEBAR_WIDTH.default,
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': SIDEBAR_WIDTH.lg
            }
          }
        })}
      />
      <SidebarOverlay onClick={closeSidebar} />
      <TitleLogo />
      <SearchInput />

      <Box
        mt={1}
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses?.root}`]: {
            gap: 1.5
          }
        }}
      >
        <MenuList items={menuItems} />
        <BottomMenuList items={bottomMenuItems} />
      </Box>

      <Divider />
      <UserDisplay />
    </Sheet>
  );
};

export default memo(Sidebar);
