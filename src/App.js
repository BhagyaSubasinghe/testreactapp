
import { useState } from 'react';
import { Avatar, Box, Chip, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import UserForm from './userform';
import UsersTable from './userstable';
import initialUsers from './users';
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
  const [users, setUsers] = useState(initialUsers);
  const [errors, setErrors] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (editingId) {
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === editingId ? { ...user, ...formValues } : user))
      );
      setEditingId(null);
    } else {
      setUsers((currentUsers) => [
        {
          id: crypto.randomUUID(),
          ...formValues,
        },
        ...currentUsers,
      ]);
    }

    setFormValues(emptyForm);
    setErrors({});
    setCurrentTab(1);
  };

  const handleEditUser = (user) => {
    setFormValues(user);
    setEditingId(user.id);
    setCurrentTab(0);
    window.scrollTo(0, 0);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
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

  return (
    <div className="app-shell">
      <Container maxWidth="lg" className="app-container">
        <Stack spacing={4}>
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
              <Typography variant="h5" component="h2" className="users-title">
                Submitted users ({users.length})
              </Typography>
              <UsersTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
            </section>
          )}
        </Stack>
      </Container>
    </div>
  );
}

export default App;
