import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const initialUsers = [];

export default initialUsers;

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = () => {
            axios.get('http://localhost:3001/api/users')
                .then(response => {
                    setUsers(response.data?.response || []); // Safely access response data
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        };
    
        const addUesr = (data) => {
            setSubmitted(true);

            const payload = {
                id = data.id,
                name = data.name,
            }

            axios.post('http://localhost:3001/api/createuser', payload)
                .then(response => {
                    // Handle successful user creation
                })
                .catch(error => {
                    console.error('Error creating user:', error);
                });
        };

        getUsers();
    }, []);

    return (
        <Box 
        sx={{
            width: 'calc(100% - 100px)',
            margin: 'auto',
            marginTop: '100px',
        }}
        >
        <UserForm
          addUsers = {addUesr}
        />
        <UsersTable rows={users} />
        </Box>
    );
}   

export default Users;