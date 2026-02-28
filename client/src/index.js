import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Clerk Publishable Key.\n' +
    'Add REACT_APP_CLERK_PUBLISHABLE_KEY to client/.env file\n' +
    'and restart the development server (npm start).'
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ClerkProvider  publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
