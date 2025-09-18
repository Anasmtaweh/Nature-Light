"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading user data...</div>;
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">User Profile</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-lg mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-lg"><strong>Role:</strong> {role || 'N/A'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
