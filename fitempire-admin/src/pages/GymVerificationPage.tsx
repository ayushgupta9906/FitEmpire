import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
} from '@mui/material';
import { CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';
import { gymsApi } from '../api';
import type { Gym } from '../api';

export function GymVerificationPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingGyms();
  }, []);

  const fetchPendingGyms = async () => {
    setLoading(true);
    try {
      const res = await gymsApi.getAll(0, 50, 'PENDING_REVIEW');
      setGyms(res.data.data?.content || []);
    } catch (e) {
      console.warn("Failed to fetch gym verification queue:", e);
      setGyms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await gymsApi.approve(id);
      fetchPendingGyms();
    } catch (e) {
      console.warn(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;
    setActionLoading(true);
    try {
      await gymsApi.reject(rejectDialog, rejectReason);
      setRejectDialog(null);
      setRejectReason('');
      fetchPendingGyms();
    } catch (e) {
      console.warn(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>Gym Verification Queue</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Review and approve submitted gym partner applications.
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <TableCell><strong>Gym Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Owner</strong></TableCell>
              <TableCell><strong>Submitted On</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gyms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#43D787', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6">All caught up!</Typography>
                  <Typography variant="body2">No pending applications requiring verification.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              gyms.map((gym) => (
                <TableRow key={gym.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{gym.name}</TableCell>
                  <TableCell><Chip label={gym.category} size="small" variant="outlined" /></TableCell>
                  <TableCell>{gym.ownerName || 'Gym Owner'}</TableCell>
                  <TableCell>{new Date(gym.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label="Pending Review" color="warning" size="small" icon={<HourglassEmpty />} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApprove(gym.id)}
                      disabled={actionLoading}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => setRejectDialog(gym.id)}
                      disabled={actionLoading}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject Reason Dialog */}
      <Dialog open={Boolean(rejectDialog)} onClose={() => setRejectDialog(null)}>
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent sx={{ minWidth: 360, pt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Specify missing documents or guidelines violation..."
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleReject} disabled={actionLoading}>
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
