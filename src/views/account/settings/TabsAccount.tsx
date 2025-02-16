'use client';

// joy ui
import { ListItemDecorator, Tab, TabList, tabClasses } from '@mui/joy';

// assets
import {
  DescriptionRounded,
  PersonPinRounded,
  SettingsRounded
} from '@mui/icons-material';

const TabsAccount = () => {
  return (
    <TabList
      tabFlex={1}
      size="sm"
      sx={{
        pl: { xs: 0, md: 4 },
        justifyContent: 'left',
        [`&& .${tabClasses.root}`]: {
          fontWeight: '600',
          flex: 'initial',
          color: 'text.tertiary',
          [`&.${tabClasses.selected}`]: {
            bgcolor: 'transparent',
            color: 'text.primary',
            '&::after': {
              height: '2px',
              bgcolor: 'primary.500'
            }
          }
        }
      }}
    >
      {[
        { value: '0', label: 'Profile', icon: <PersonPinRounded /> },
        { value: '1', label: 'Document', icon: <DescriptionRounded /> },
        { value: '2', label: 'Settings', icon: <SettingsRounded /> }
      ].map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          sx={{ borderRadius: '6px 6px 0 0' }}
          indicatorInset
        >
          <ListItemDecorator>{tab.icon}</ListItemDecorator>
          {tab.label}
        </Tab>
      ))}
    </TabList>
  );
};

export default TabsAccount;
