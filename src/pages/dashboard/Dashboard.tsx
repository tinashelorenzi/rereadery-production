import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Avatar, Button, List, ListItem, ListItemText, Switch, Divider } from '@mui/material';
import { User, UserAddress, NotificationPreferences } from '../../types/auth';
import { authService } from '../../services/auth';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true
  });

  const handleNotificationChange = async (setting: keyof NotificationPreferences) => {
    if (!user) return;
    
    const newPreferences = {
      ...notifications,
      [setting]: !notifications[setting]
    };

    try {
      await authService.updateNotificationPreferences(user.id, newPreferences);
      setNotifications(newPreferences);
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;

    try {
      await authService.deleteAddress(user.id, addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'var(--white)' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={user?.profilePicture}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {user?.name} {user?.surname}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {user?.email}
              </Typography>
              {user?.shopName && (
                <Typography variant="subtitle1" color="primary">
                  {user.shopName}
                </Typography>
              )}
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {/* Implement edit profile */}}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Addresses Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'var(--white)' }}>
            <Typography variant="h6" gutterBottom>
              Shipping & Billing Addresses
            </Typography>
            <List>
              {addresses.map((address) => (
                <React.Fragment key={address.id}>
                  <ListItem
                    secondaryAction={
                      <Button
                        color="error"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        Delete
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`${address.type.toUpperCase()} Address`}
                      secondary={
                        `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: 'var(--dark-green)',
                '&:hover': {
                  backgroundColor: 'var(--dark-olive-green)'
                }
              }}
              onClick={() => {/* Implement add address */}}
            >
              Add New Address
            </Button>
          </Paper>
        </Grid>

        {/* Notification Preferences Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'var(--white)' }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email Notifications" />
                <Switch
                  edge="end"
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="SMS Notifications" />
                <Switch
                  edge="end"
                  checked={notifications.smsNotifications}
                  onChange={() => handleNotificationChange('smsNotifications')}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Marketing Emails" />
                <Switch
                  edge="end"
                  checked={notifications.marketingEmails}
                  onChange={() => handleNotificationChange('marketingEmails')}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Order Updates" />
                <Switch
                  edge="end"
                  checked={notifications.orderUpdates}
                  onChange={() => handleNotificationChange('orderUpdates')}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
