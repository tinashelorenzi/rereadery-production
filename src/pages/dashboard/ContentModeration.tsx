import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Tooltip,
  Box,
  Chip
} from '@mui/material';
import {
  Check as ApproveIcon,
  Block as RejectIcon,
  Flag as FlagIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface ContentItem {
  id: string;
  type: 'book' | 'review' | 'comment';
  content: string;
  userId: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  flags: number;
  createdAt: string;
  reportReason?: string;
}

const ContentModeration: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  useEffect(() => {
    fetchContent();
  }, [page, rowsPerPage, filterStatus]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/content', {
        params: {
          page,
          limit: rowsPerPage,
          status: filterStatus
        }
      });
      setContent(response.data.content);
      setError('');
    } catch (err) {
      setError('Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewContent = (item: ContentItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleModerateContent = async (itemId: string, action: 'approve' | 'reject') => {
    try {
      await axios.patch(`/api/admin/content/${itemId}`, { status: action });
      fetchContent();
      if (selectedItem?.id === itemId) {
        setDialogOpen(false);
      }
    } catch (err) {
      setError(`Failed to ${action} content`);
      console.error('Error moderating content:', err);
    }
  };

  const getStatusChip = (status: string) => {
    const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    };
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={statusColors[status as keyof typeof statusColors]}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Moderation
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchContent}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Content Preview</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Flags</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: 200 }}>
                      {item.content}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  <TableCell>
                    {item.flags > 0 && (
                      <Chip
                        icon={<FlagIcon />}
                        label={item.flags}
                        color="error"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="View Content">
                      <IconButton onClick={() => handleViewContent(item)}>
                        <FlagIcon />
                      </IconButton>
                    </Tooltip>
                    {item.status === 'pending' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            onClick={() => handleModerateContent(item.id, 'approve')}
                            color="success"
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            onClick={() => handleModerateContent(item.id, 'reject')}
                            color="error"
                          >
                            <RejectIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Content Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Type: {selectedItem.type}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                User: {selectedItem.username}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Created: {new Date(selectedItem.createdAt).toLocaleString()}
              </Typography>
              {selectedItem.reportReason && (
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Report Reason: {selectedItem.reportReason}
                </Typography>
              )}
              <Typography variant="subtitle2" gutterBottom>
                Status: {getStatusChip(selectedItem.status)}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Content:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography>{selectedItem.content}</Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {selectedItem?.status === 'pending' && (
            <>
              <Button
                onClick={() => handleModerateContent(selectedItem.id, 'approve')}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleModerateContent(selectedItem.id, 'reject')}
                color="error"
                variant="contained"
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContentModeration;