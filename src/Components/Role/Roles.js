// src/Components/Roles.js
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const Roles = () => {
  const [roleId, setRoleId] = useState('');
  const [role, setRole] = useState(null);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Administrator role' },
    { id: 2, name: 'User', description: 'Regular user role' },
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [error, setError] = useState(null);

  // Simulación de búsqueda de rol
  const fetchRole = () => {
    const foundRole = roles.find((r) => r.id === Number(roleId));
    if (foundRole) {
      setRole(foundRole);
      setError(null);
    } else {
      setError('Role not found');
      setRole(null);
    }
  };

  // Simulación de agregar rol
  const addRole = () => {
    const newRole = {
      id: roles.length + 1,
      name: newRoleName,
      description: newRoleDescription,
    };
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  // Simulación de eliminar rol
  const deleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  // Iniciar la edición del rol
  const startEditRole = (role) => {
    setEditRole(role);
  };

  // Guardar cambios del rol
  const saveEditRole = () => {
    setRoles(roles.map((r) => (r.id === editRole.id ? editRole : r)));
    setEditRole(null);
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Role Management
        </Typography>
        
        {/* Sección para obtener rol por ID */}
        <Typography variant="h6" component="div" gutterBottom>
          Get Role by ID
        </Typography>
        <TextField
          label="Role ID"
          variant="outlined"
          type="number"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={fetchRole} fullWidth>
          Fetch Role
        </Button>
        {error && <Typography color="error" marginTop="10px">{error}</Typography>}

        {/* Tabla para mostrar el rol específico si se encuentra */}
        {role && (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Sección para agregar un nuevo rol */}
        <Typography variant="h6" component="div" gutterBottom style={{ marginTop: '20px' }}>
          Add New Role
        </Typography>
        <TextField
          label="Role Name"
          variant="outlined"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Role Description"
          variant="outlined"
          value={newRoleDescription}
          onChange={(e) => setNewRoleDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addRole} fullWidth>
          Add Role
        </Button>

        {/* Tabla de roles existentes */}
        <Typography variant="h6" component="div" gutterBottom style={{ marginTop: '20px' }}>
          Existing Roles
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Role ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => startEditRole(role)}
                      sx={{ marginRight: '8px', minWidth: '80px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteRole(role.id)}
                      sx={{ minWidth: '80px' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo de edición de rol */}
        <Dialog open={!!editRole} onClose={() => setEditRole(null)}>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogContent>
            <TextField
              label="Role Name"
              variant="outlined"
              value={editRole?.name || ''}
              onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role Description"
              variant="outlined"
              value={editRole?.description || ''}
              onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditRole(null)} color="secondary">Cancel</Button>
            <Button onClick={saveEditRole} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Roles;
