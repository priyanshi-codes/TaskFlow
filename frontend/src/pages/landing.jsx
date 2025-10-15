import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskFlow AI
            </h1>
            <p className="text-2xl mb-8 opacity-90">
              Intelligent Task Management with AI-Powered Insights
            </p>
            <p className="mb-8 text-lg opacity-75">
              Streamline your workflow with AI assistance that analyzes tasks,
              suggests priorities, and identifies required skills automatically.
            </p>
            {!isLoggedIn ? (
              <div className="flex gap-4 justify-center">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-secondary">
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                to={user?.role === 'user' ? '/dashboard' : '/admin'}
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI-Powered Analysis
              </h3>
              <p>Automatically analyze tasks to identify priorities and required skills</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Real-time Updates
              </h3>
              <p>Stay informed with instant task status updates and notifications</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Team Collaboration
              </h3>
              <p>Seamlessly assign and track tasks across your entire team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div>
          <p className="font-bold">
            TaskFlow AI <br />
            Intelligent Task Management Since 2025
          </p>
          <p>Copyright © 2025 - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}