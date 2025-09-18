"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Header = () => {
  const { user, loading, role } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Nature's Light</Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link href="/calendar" className="hover:text-gray-400">Calendar</Link></li>
            {loading ? (
              <li>Loading...</li>
            ) : user ? (
              <>
                <li><Link href="/profile" className="hover:text-gray-400">Profile</Link></li>
                <li><Link href="/favorites" className="hover:text-gray-400">Favorites</Link></li> {/* Favorites link */}
                {role === 'admin' && (
                  <li><Link href="/admin" className="hover:text-gray-400">Admin</Link></li>
                )}
                <li><span className="text-gray-300">{user.email}</span></li>
                <li>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link href="/login" className="hover:text-gray-400">Login</Link></li>
                <li><Link href="/signup" className="hover:text-gray-400">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;