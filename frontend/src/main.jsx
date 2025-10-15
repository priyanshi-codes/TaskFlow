import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckAuth from "./components/check-auth.jsx"
import Tasks from "./pages/tasks.jsx"
import LoginPage from "./pages/login.jsx"
import SignupPage from "./pages/signup.jsx"
import TaskDetailsPage from "./pages/task.jsx"
import AdminPanel from './pages/admin.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <Routes>
    <Route
       path = '/'
       element = {
         <CheckAuth protectedRoute={true}>
           <Tasks/>
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
     <Route
       path = '/admin'
       element = {
         <CheckAuth protectedRoute={true}>
           <AdminPanel/>
         </CheckAuth>
       }
     />
     
   </Routes>
   </BrowserRouter>
  </StrictMode>,
)

