
import { useState, useEffect } from 'react';
import { Avatar, Box, Chip, Container, InputAdornment, Stack, Tab, Tabs, TextField, Typography, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UserForm from './userform';
import UsersTable from './userstable';
import { userAPI } from './services/api';
import './App.css';

const emptyForm = {
  name: '',
  email: '',
  role: 'User',
  phone: '',
  notes: '',
};

function App() {
  const [formValues, setFormValues] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await userAPI.getUsers();
      setUsers(response.data.response || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setApiError('Failed to load users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
      form: '',
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      if (editingId) {
        // Update existing user
        await userAPI.updateUser(editingId, formValues);
        setUsers((currentUsers) =>
          currentUsers.map((user) => (user.id === editingId ? { ...user, ...formValues } : user))
        );
        setEditingId(null);
      } else {
        // Create new user
        const response = await userAPI.createUser(formValues);
        const newUser = response.data.response || { id: Date.now(), ...formValues };
        setUsers((currentUsers) => [newUser, ...currentUsers]);
      }

      setFormValues(emptyForm);
      setErrors({});
      setCurrentTab(1);
      setApiError(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ form: 'Failed to save user. Please try again.' });
      setApiError('Failed to save user. Please check your connection.');
    }
  };

  const handleEditUser = (user) => {
    setFormValues(user);
    setEditingId(user.id);
    setCurrentTab(0);
    window.scrollTo(0, 0);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(userId);
        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
        setApiError(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        setApiError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setFormValues(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 1) {
      handleCancel();
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [user.name, user.email, user.role, user.phone, user.notes]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div className="app-shell">
      <Container maxWidth="lg" className="app-container">
        <Stack spacing={4}>
          {apiError && (
            <Alert severity="error" onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}

          <header className="hero">
            <div>
              <Chip label="User management" className="hero-chip" />
              <Typography variant="h2" component="h1" className="hero-title">
                Create user profiles with confidence.
              </Typography>
              <Typography variant="h6" component="p" className="hero-copy">
                A clean controlled form with validation and a live list of submitted users.
              </Typography>
            </div>

            <div className="hero-stats">
              <Avatar className="hero-avatar">{users.length}</Avatar>
              <Typography variant="body1" className="hero-stat-text">
                {users.length === 1 ? '1 saved user' : `${users.length} saved users`}
              </Typography>
            </div>
          </header>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="user management tabs">
              <Tab label="Create User" id="tab-0" />
              <Tab label="View Users" id="tab-1" />
            </Tabs>
          </Box>

          {currentTab === 0 ? (
            <UserForm
              values={formValues}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel={editingId ? 'Update user' : 'Create user'}
              isEditing={editingId !== null}
            />
          ) : (
            <section className="users-panel">
              <Stack spacing={2}>
                <Typography variant="h5" component="h2" className="users-title">
                  Submitted users ({filteredUsers.length}/{users.length})
                </Typography>

                <TextField
                  fullWidth
                  label="Search users"
                  placeholder="Search by name, email, role, phone, or notes"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {loading ? (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                    Loading users...
                  </Typography>
                ) : (
                  <UsersTable
                    users={filteredUsers}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    emptyMessage={searchTerm ? 'No users match your search.' : undefined}
                  />
                )}
              </Stack>
            </section>
          )}
        </Stack>
      </Container>
    </div>
  );
}

export default App;
