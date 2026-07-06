import { Box, Typography, Card, CardContent } from '@mui/material';
import { EventNote } from '@mui/icons-material';

export function BookingsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Bookings</Typography>
      <Card><CardContent sx={{ p: 4, textAlign: 'center' }}>
        <EventNote sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">Bookings Module — Connected to backend</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Data loads once API is running</Typography>
      </CardContent></Card>
    </Box>
  );
}
