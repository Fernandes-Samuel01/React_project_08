import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import { Header, Footer } from './components'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  const [loading, setLoading] = useState(true);  //loading state to track auth status, this is alos done for, when we run the application then useEffect hook calls getCurrentUser to check if user is logged in or not, during this time we don't want to render the application until we get the response from getCurrentUser method.(Here loading true means we are still checking the auth status and loading false means we have got the response)
  const dispatch = useDispatch();

  // App.jsx (Your file, minor update for clarity)
  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        // User is not logged in (still a guest), so mark as logged out in Redux
        dispatch(logout());
      })
      .finally(() => setLoading(false)); //finally executes at the end of promise whether it is resolved or rejected
  }, []);



  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-500'>
      <div className='w-full block'>
        <Header />
        <main>
          TODO: <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null

}

export default App