import { Navigate, Outlet } from 'react-router-dom';

import { useUser } from '@clerk/clerk-react';

export default function ProtectedAdminRoute() {
  const { isLoaded, isSignedIn, user } = useUser()

  // Still loading auth state
  if (!isLoaded) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>
  }

  // Not signed in -> redirect to sign-in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  // ── Temporary dev check: your email(s) ──
  const adminEmails = [
    'l00189876@atu.ie',
    // 'other emails',
  ];

  const userEmail = user?.primaryEmailAddress?.emailAddress

  const isAdmin = adminEmails.includes(userEmail)

  // Show who is signed in when denied (helps debugging)
  if (!isAdmin) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>This area is only for administrators.</p>
        <p style={{ margin: '20px 0' }}>
          You are signed in as: <strong>{userEmail || 'unknown'}</strong>
        </p>
        <a href="/" style={{ color: '#007bff' }}>Go to home</a>
      </div>
    );
  }

  // OK -> show the page
  return <Outlet />
}