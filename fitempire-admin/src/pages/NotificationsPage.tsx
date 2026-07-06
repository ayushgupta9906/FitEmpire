import { Box, Typography, Card, CardContent } from '@mui/material';
import { Notifications } from '@mui/icons-material';

export function NotificationsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Notifications</Typography>
      <Card><CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Notifications sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">Push Notification Center</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Send targeted push notifications to users and gym partners</Typography>
      </CardContent></Card>
    </Box>
  );
}
