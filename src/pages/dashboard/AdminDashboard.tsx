import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  People as UsersIcon,
  Warning as AlertIcon,
  TrendingUp as AnalyticsIcon,
  Speed as PerformanceIcon
} from '@mui/icons-material';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSales: number;
  pendingOrders: number;
  serverHealth: {
    cpu: number;
    memory: number;
    disk: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard/stats');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* User Statistics */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <UsersIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                User Statistics
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalUsers}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Total Users
            </Typography>
            <Typography variant="h6">
              {stats.activeUsers} Active Now
            </Typography>
          </Paper>
        </Grid>

        {/* Sales Analytics */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                Sales Analytics
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              ${stats.totalSales.toFixed(2)}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Total Sales
            </Typography>
            <Typography variant="h6">
              {stats.pendingOrders} Pending Orders
            </Typography>
          </Paper>
        </Grid>

        {/* System Performance */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PerformanceIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                System Performance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                CPU Usage
              </Typography>
              <Typography variant="body2">
                {stats.serverHealth.cpu}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                Memory Usage
              </Typography>
              <Typography variant="body2">
                {stats.serverHealth.memory}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                Disk Usage
              </Typography>
              <Typography variant="body2">
                {stats.serverHealth.disk}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              overflow: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AlertIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                Recent Activity
              </Typography>
            </Box>
            <Timeline>
              {stats.recentActivities.map((activity) => (
                <TimelineItem key={activity.id}>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;