import { Box, Card, Divider, Typography } from '@mui/joy'

const ProfileInfo = () => {
  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Profile</Typography>
        <Typography level="body-sm">
          Write a short introduction to be displayed on your profile
        </Typography>
      </Box>
      <Divider />
    </Card>
  )
}

export default ProfileInfo