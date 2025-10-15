import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({children, protectedRoute}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const hasVisited = localStorage.getItem('hasVisited')

    if(protectedRoute){
      if(!token){
        // If it's their first visit, send them to signup, otherwise to login
        if(!hasVisited){
          localStorage.setItem('hasVisited', 'true')
          navigate('/welcome')
        } else {
          navigate('/login')
        }
      }else{
        setLoading(false)
      }
    }else{
      if(token){
        navigate('/')
      }else{
        setLoading(false)
      }
    }
  },[navigate, protectedRoute])
 
  if(loading){
    return <div>Loading...</div>
  }
  return children
}

export default CheckAuth