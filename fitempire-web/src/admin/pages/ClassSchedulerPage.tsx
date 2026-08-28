import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress,
} from '@mui/material';
import { CalendarMonth, Person, Schedule, Add } from '../icons';
import api from '../api/axios';

export function ClassSchedulerPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get(`/v1/classes/schedules?date=${today}`);
      setSchedules(res.data?.data || []);
    } catch (e) {
      console.warn("Failed to fetch class schedules:", e);
      setSchedules([]);
    } finally {
      setLoading(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Class Scheduler</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your fitness classes and trainer allocations.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }}>
          Schedule New Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Today's Class Schedule</Typography>
                <Chip icon={<CalendarMonth />} label={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} size="small" variant="outlined" />
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Time Slot</strong></TableCell>
                      <TableCell><strong>Class Name</strong></TableCell>
                      <TableCell><strong>Trainer</strong></TableCell>
                      <TableCell align="right"><strong>Booked Slots</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          <Schedule sx={{ fontSize: 40, opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                          No classes scheduled for today.
                        </TableCell>
                      </TableRow>
                    ) : (
                      schedules.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {cls.startTime?.substring(0, 5)} - {cls.endTime?.substring(0, 5)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{cls.fitnessClass?.name || 'Class'}</TableCell>
                          <TableCell>{cls.trainer?.user?.firstName || 'Trainer'}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${cls.bookedCapacity || 0}/${cls.totalCapacity || 30}`}
                              size="small"
                              color={cls.bookedCapacity >= cls.totalCapacity ? 'error' : 'success'}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Active Trainers</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Certified trainers available for assignment.
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                All trainers active & verified.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
