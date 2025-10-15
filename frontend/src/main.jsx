import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckAuth from "./components/check-auth.jsx"
import Tasks from "./pages/tasks.jsx"
import LoginPage from "./pages/login.jsx"
import SignupPage from "./pages/signup.jsx"
import TaskDetailsPage from "./pages/task.jsx"
import AdminDashboard from './pages/admin-dashboard.jsx'
import UserDashboard from './pages/user-dashboard.jsx'
import LandingPage from './pages/landing.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <Routes>
    <Route
       path = '/'
       element = {
         <LandingPage />
       }
     />
    <Route
       path = '/dashboard'
       element = {
         <CheckAuth protectedRoute={true}>
           <UserDashboard />
         </CheckAuth>
       }
     />
    <Route
       path = '/admin'
       element = {
         <CheckAuth protectedRoute={true}>
           <AdminDashboard />
         </CheckAuth>
       }
     />
    <Route
       path = '/tasks'
       element = {
         <CheckAuth protectedRoute={true}>
           <UserDashboard />
         </CheckAuth>
       }
     />
    <Route
       path = '/welcome'
       element = {
         <CheckAuth protectedRoute={false}>
           <SignupPage />
         </CheckAuth>
       }
     />
     <Route
       path = '/login'
       element = {
         <CheckAuth protectedRoute={false}>
           <LoginPage/>
         </CheckAuth>
       }
     />
     <Route
       path = '/signup'
       element = {
         <CheckAuth protectedRoute={false}>
           <SignupPage/>
         </CheckAuth>
       }
     />
     <Route
       path = '/tasks/:id'
       element = {
         <CheckAuth protectedRoute={true}>
           <TaskDetailsPage/>
         </CheckAuth>
       }
     />
   </Routes>
   </BrowserRouter>
  </StrictMode>,
)

