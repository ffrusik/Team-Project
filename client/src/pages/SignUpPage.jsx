import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f8f9fa',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Sign Up</h1>
        <SignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in" />
      </div>
    </div>
  );
}