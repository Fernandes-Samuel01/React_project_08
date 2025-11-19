import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Header, Footer } from './components';
import AddPost from './pages/AddPost';
import AllPosts from './pages/AllPosts';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import Login from './pages/Login';
import Post from './pages/Post';
import Signup from './pages/Signup';
import './App.css';

// Protect private routes
function ProtectedRoute() {
  const auth = useSelector(state => state.auth);
  return auth.user ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    authService.getCurrentUser()
      .then(userData => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return null; // wait for authentication check

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-500'>
      {/* Always show header.
          Pass logged-in state so header can conditionally render Auth buttons. */}
      <Header isAuthenticated={!!auth.user} />

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/all-posts" element={<AllPosts />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/post/:id" element={<Post />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {/* Always show footer */}
      <Footer />
    </div>
  );
}

export default App;
