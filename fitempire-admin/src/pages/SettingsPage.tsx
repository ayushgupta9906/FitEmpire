import { Box, Typography, Card, CardContent } from '@mui/material';
import { Settings } from '@mui/icons-material';

export function SettingsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Settings</Typography>
      <Card><CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Settings sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">Platform Settings</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Configure GST rates, reward points, notification templates, and more</Typography>
      </CardContent></Card>
    </Box>
  );
}
