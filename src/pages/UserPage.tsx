
import React from 'react';
import UserProfile from '@/components/user/UserProfile';

const UserPage = () => {
  return (
    <div className="taskly-container page-transition">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </header>
      
      <UserProfile />
    </div>
  );
};

export default UserPage;
