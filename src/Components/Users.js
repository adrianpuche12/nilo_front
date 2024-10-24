import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://143.198.119.84:8080/api/users', {
          headers: {
            'Authorization': `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBYWo4alVraWVRWEF0UnY0aDV1RTRma1hUNGJSUjNIMDZVdHZTQkktd2Q4In0.eyJleHAiOjE3Mjk3ODY4NzAsImlhdCI6MTcyOTc4MzMzMCwianRpIjoiYzU4ZTljZjctZGMxMC00N2M5LWJkNTUtZDdhMTkwMDUwYWQyIiwiaXNzIjoiaHR0cDovLzE0My4xOTguMTE5Ljg0OjgwODAvcmVhbG1zL05pbG8iLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZjE1MjJmNzQtMTAzNC00ZGIzLTgxOWEtODY3MWJiNmM2NjdhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibmlsby1jbGllbnQiLCJzaWQiOiJiZTc4MDcxYS0xMzYyLTRlYTktYmY5OC1lYzMwZTljYTUzYjgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW5pbG8iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiQ2xpZW50Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkRldiBOaWxvIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidXNlcmRldiIsImdpdmVuX25hbWUiOiJEZXYiLCJmYW1pbHlfbmFtZSI6Ik5pbG8iLCJlbWFpbCI6InVzZXJkZXZAYWRtaW4uY29tIn0.RehRcaoZZKgv6KZy2aIXxMGvHpg9EnEdIkjp-OWQiNKpSmd8jybpwVXCQjiFbNTyyUH_-Y2yema71HKCPPAyP0GdjXVHoKd3gbu1GdthGapO4u5PxGhwR7r0ifcWQU9NRBky8uPvTCZ3zJJy55ANpJvdfzSF3sMA1qGVr42ceEAGlJyti94fWNF071mXrGCNj3Bu3I-BZm-DN_poWTa8tQYwZwAht9W1L2xi7I_tYcsfIUhdAre7mSQ8KHO6BjUobMYcVbetriH0r-Xy_l8E-Hj5CS0RkY_g47NupFuhK13EisVmJj3EB_rVEzWWrH9wIKQ1uMLKqW1EMxrx9VxtRQ`, 
            'Cookie': 'JSESSIONID=C5568EB46E57A3357EF1AB7010A6A4F0', 
          },
          withCredentials: false, 
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>
        Lista de Usuarios
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default Users;
