import { Box, Typography, Card } from '@mui/material';
import { CardMembership } from '@mui/icons-material';

export function MembershipsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Memberships</Typography>
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <CardMembership sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Memberships Module</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Connected to backend — data loads once API is running
        </Typography>
      </Card>
    </Box>
  );
}
