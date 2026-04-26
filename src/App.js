
import { useState } from 'react';
import { Avatar, Chip, Container, Stack, Typography } from '@mui/material';
import UserForm from './userform';
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

    setUsers((currentUsers) => [
      {
        id: crypto.randomUUID(),
        ...formValues,
      },
      ...currentUsers,
    ]);

    setFormValues(emptyForm);
    setErrors({});
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

          <UserForm values={formValues} errors={errors} onChange={handleChange} onSubmit={handleSubmit} />

          <section className="users-panel">
            <Typography variant="h5" component="h2" className="users-title">
              Submitted users
            </Typography>

            {users.length === 0 ? (
              <Typography variant="body1" className="empty-state">
                No users have been added yet. Submit the form to see them here.
              </Typography>
            ) : (
              <div className="users-grid">
                {users.map((user) => (
                  <article key={user.id} className="user-card">
                    <Avatar className="user-avatar">{user.name.charAt(0).toUpperCase()}</Avatar>
                    <div>
                      <Typography variant="h6" component="h3">
                        {user.name}
                      </Typography>
                      <Typography variant="body2" className="user-meta">
                        {user.role} • {user.email}
                      </Typography>
                      {user.phone ? (
                        <Typography variant="body2" className="user-meta">
                          {user.phone}
                        </Typography>
                      ) : null}
                      {user.notes ? (
                        <Typography variant="body2" className="user-notes">
                          {user.notes}
                        </Typography>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Stack>
      </Container>
    </div>
  );
}

export default App;
