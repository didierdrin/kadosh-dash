'use client';
import Home from './dash';
import { ProtectedRoute } from '@/components/protectedroute';

function Dashboard() {
  return <div>Welcome to your dashboard!</div>;
}

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}