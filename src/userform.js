import {
    Alert,
    Button,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

const roles = ['User', 'Admin', 'Manager'];

const UserForm = ({ values, errors, onChange, onSubmit, submitLabel = 'Create user' }) => {
    return (
        <Paper elevation={0} className="form-card">
            <Stack spacing={3}>
                <div>
                    <Typography variant="h4" component="h1" className="form-title">
                        User Details
                    </Typography>
                    <Typography variant="body1" className="form-subtitle">
                        Create a profile with the fields below. All required fields are validated before submit.
                    </Typography>
                </div>

                <form onSubmit={onSubmit} noValidate>
                    <div className="form-grid">
                        <div>
                            <TextField
                                fullWidth
                                label="Full name"
                                name="name"
                                value={values.name}
                                onChange={onChange}
                                error={Boolean(errors.name)}
                                helperText={errors.name || 'Enter the user name'}
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </div>

                        <div>
                            <TextField
                                fullWidth
                                label="Email address"
                                name="email"
                                type="email"
                                value={values.email}
                                onChange={onChange}
                                error={Boolean(errors.email)}
                                helperText={errors.email || 'We will use this for contact'}
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </div>

                        <div>
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                name="role"
                                value={values.role}
                                onChange={onChange}
                                helperText="Choose the account role"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <div>
                            <TextField
                                fullWidth
                                label="Phone number"
                                name="phone"
                                value={values.phone}
                                onChange={onChange}
                                helperText="Optional"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </div>

                        <div className="form-full">
                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                label="Notes"
                                name="notes"
                                value={values.notes}
                                onChange={onChange}
                                helperText="Optional notes about the user"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </div>

                        {errors.form ? (
                            <div className="form-full">
                                <Alert severity="error">{errors.form}</Alert>
                            </div>
                        ) : null}

                        <div className="form-full">
                            <Button type="submit" variant="contained" size="large" className="submit-button">
                                {submitLabel}
                            </Button>
                        </div>
                    </div>
                </form>
            </Stack>
        </Paper>
    );
};

export default UserForm;