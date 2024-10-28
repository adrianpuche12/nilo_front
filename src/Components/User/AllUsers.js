import React from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../../jsons/users';
import Title from '../Utiles/Title';

function AllUsers() {
  const navigate = useNavigate();

  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div>
      <Title text="Usuarios"/>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => handleUserClick(user.id)}
          style={{ cursor: 'pointer', margin: '10px', padding: '10px', border: '1px solid #ccc' }}
        >
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>telefono: {user.phone}</p>
          <p>role: {user.roles}</p>
        </div>
      ))}
    </div>
  );
}

export default AllUsers;
