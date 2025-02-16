"use client"

// joy ui
import { Tab, TabList, Tabs, tabClasses } from '@mui/joy'

const TabsAccount = () => {
  return (
    <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
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
                bgcolor: 'primary.500',
              },
            },
          },
        }}
      >
        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>
          Settings
        </Tab>
        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>
          Team
        </Tab>
        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>
          Plan
        </Tab>
        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={3}>
          Billing
        </Tab>
      </TabList>
    </Tabs>
  )
}

export default TabsAccount