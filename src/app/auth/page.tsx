'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/authprovider';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { setCookie } from 'cookies-next';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        setCookie('auth_token', token, { maxAge: 60 * 60 * 24 * 7 }); // 1 week
        login(email, password); // This will handle the redirection
      } catch (err) {
        setError('Failed to log in. Please check your email/password.');
        console.error(err);
      }
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // After successful signup, you might want to log the user in automatically
        login(email, password);
      } catch (err) {
        setError('Failed to create an account. Please try again.');
        console.error(err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
  {/* Welcome section */}
  <div className='w-1/2 bg-blue-600 text-white p-12 flex flex-col justify-between'>
    <div>
      <h1 className="text-4xl font-bold mb-4">Kadosh</h1>
      <p className="text-xl mb-8">Welcome to stores dashboard</p>
    </div>
    <div className="space-y-4">
      <p className="text-lg">Manage your stock, track your deliveries, and achieve your sales goals with Kadosh.</p>
      <p className="text-sm opacity-75">Join thousands of users who have already improved their revenue.</p>
    </div>
  </div>

  {/* Login/Sign up section */}
  <div className='w-1/2 bg-white p-12 flex flex-col justify-center'>
    <h2 className="text-3xl font-semibold mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
    </form>
    <p className="mt-4 text-center text-sm text-gray-600">
      {isLogin ? "Don't have an account? " : "Already have an account? "}
      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="text-blue-600 hover:underline font-medium"
      >
        {isLogin ? 'Sign Up' : 'Log In'}
      </button>
    </p>
  </div>
</div>
  );
}