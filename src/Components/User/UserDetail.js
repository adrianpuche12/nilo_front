import React from 'react';
import { useParams } from 'react-router-dom';
import users from '../../jsons/users';
import Title from '../Utiles/Title';

function UserDetail() {
  const { id } = useParams();
  const user = users.find((user) => user.id === parseInt(id, 10));

  if (!user) {
    return <h3>Usuario no encontrado</h3>;
  }

  return (
    <div>
      <Title text="Usuarios" />
      <p>ID: {user.id}</p>
      <p>Nombre: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Teléfono: {user.phone}</p>
      <p>Roles: {user.roles.join(', ') || 'Sin roles'}</p>
    </div>
  );
}

export default UserDetail;
