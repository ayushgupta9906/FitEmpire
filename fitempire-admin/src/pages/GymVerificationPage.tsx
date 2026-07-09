import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { CheckCircle, PendingActions, Cancel } from '@mui/icons-material';
import api from '../api';

export function GymVerificationPage() {
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    // In a real scenario, this fetches from GET /api/v1/gyms/onboarding/queue
    // For now we simulate an empty queue
    setDrafts([]);
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>Gym Verification Queue</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Review and approve submitted gym partner applications.
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell><strong>Application ID</strong></TableCell>
              <TableCell><strong>Owner ID</strong></TableCell>
              <TableCell><strong>Submission Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#64748b' }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2, opacity: 0.5 }} />
                  <Typography>All caught up! No pending applications.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              drafts.map(draft => (
                <TableRow key={draft.id}>
                  <TableCell>{draft.id}</TableCell>
                  <TableCell>{draft.ownerId}</TableCell>
                  <TableCell>Today</TableCell>
                  <TableCell><Chip label="Pending Review" color="warning" size="small" /></TableCell>
                  <TableCell>Review</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
