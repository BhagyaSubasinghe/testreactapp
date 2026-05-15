import { Box } from "@mui/material"; 
import axios from "axios";
import { useEffect, useState } from "react";
import UserForm from './userform';
import UsersTable from './userstable';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        role: 'User',
        phone: '',
        notes: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then(response => {
                setUsers(response.data?.response || []);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!formValues.name.trim()) errors.name = 'Name is required';
        if (!formValues.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) errors.email = 'Invalid email format';
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        if (editingUser) {
            // Update user
            axios.post(`http://localhost:3000/api/updateusers/${editingUser._id}`, {
                ...formValues,
                id: editingUser._id
            })
                .then(response => {
                    console.log('User updated successfully:', response.data);
                    setEditingUser(null);
                    resetForm();
                    getUsers();
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    setFormErrors({ form: 'Error updating user: ' + error.message });
                });
        } else {
            // Create new user
            axios.post('http://localhost:3000/api/createusers', formValues)
                .then(response => {
                    console.log('User created successfully:', response.data);
                    resetForm();
                    getUsers();
                })
                .catch(error => {
                    console.error('Error creating user:', error);
                    setFormErrors({ form: 'Error creating user: ' + error.message });
                });
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:3000/api/deleteusers/${userId}`, {
                data: { id: userId }
            })
                .then(response => {
                    console.log('User deleted successfully:', response.data);
                    getUsers();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormValues({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            notes: user.notes || ''
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
        resetForm();
    };

    const resetForm = () => {
        setFormValues({
            name: '',
            email: '',
            role: 'User',
            phone: '',
            notes: ''
        });
        setFormErrors({});
    };

    return (
        <Box 
        sx={{
            width: 'calc(100% - 100px)',
            margin: 'auto',
            marginTop: '100px',
        }}
        >
        <UserForm
          values={formValues}
          errors={formErrors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={editingUser ? 'Update user' : 'Create user'}
          isEditing={!!editingUser}
        />
        <UsersTable rows={users} onEdit={handleEdit} onDelete={handleDelete} />
        </Box>
    );
}   

export default Users;