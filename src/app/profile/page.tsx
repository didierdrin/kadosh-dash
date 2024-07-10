'use client';

import { ProtectedRoute } from '@/components/protectedroute';

function Profile() {
  return <div>This is your profile page.</div>;
}

export default function ProtectedProfile() {
  return (
    <ProtectedRoute>
       {/* <ProfileComponent /> */}
       <div>
        <p>This page underconstruction</p>
       </div>
     </ProtectedRoute>
  );
}