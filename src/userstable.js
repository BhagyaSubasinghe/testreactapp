import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Avatar,
	Stack,
	IconButton,
	Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UsersTable = ({ users, onEdit, onDelete }) => {
	if (users.length === 0) {
		return (
			<Typography variant="body1" className="empty-state">
				No users have been added yet. Submit the form to see them here.
			</Typography>
		);
	}

	return (
		<TableContainer component={Paper} elevation={2}>
			<Table>
				<TableHead>
					<TableRow sx={{ backgroundColor: '#f5f5f5' }}>
						<TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id} hover>
							<TableCell>
								<Stack direction="row" spacing={2} alignItems="center">
									<Avatar sx={{ width: 32, height: 32 }}>
										{user.name.charAt(0).toUpperCase()}
									</Avatar>
									<Typography variant="body2">{user.name}</Typography>
								</Stack>
							</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>{user.phone || '-'}</TableCell>
							<TableCell>{user.notes || '-'}</TableCell>
							<TableCell sx={{ textAlign: 'center' }}>
								<Tooltip title="Edit user">
									<IconButton size="small" color="primary" onClick={() => onEdit(user)}>
										<EditIcon fontSize="small" />
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete user">
									<IconButton size="small" color="error" onClick={() => onDelete(user.id)}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UsersTable;
