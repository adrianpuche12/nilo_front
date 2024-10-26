import React from 'react';
import { useParams } from 'react-router-dom';
import users from '../../jsons/users';

const UserDetail = () => {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Roles:</strong> {user.roles.length > 0 ? user.roles.join(', ') : 'No roles'}</p>
    </div>
  );
};

export default UserDetail;
