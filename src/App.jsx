import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthForm from './components/AuthForm'
import Calendar from './components/Calendar'
import DayView from './components/DayView'
import Charts from './components/Charts'
import Settings from './components/Settings'
import { getCurrentUser, getUsers } from './utils/localStorage'

export default function App(){
  const [user, setUser] = useState(getCurrentUser())
  const navigate = useNavigate()

  useEffect(() => {
    if(!user) navigate('/auth')
  }, [user])

  function onLogin(u){
    setUser(u)
    navigate('/')
  }

  function onLogout(){
    setUser(null)
    navigate('/auth')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <main className="container mx-auto px-4 py-6 flex-1">
        <Routes>
          <Route path="/auth" element={<AuthForm onLogin={onLogin} />} />
          <Route path="/" element={<Calendar user={user} />} />
          <Route path="/day/:date" element={<DayView user={user} />} />
          <Route path="/charts" element={<Charts user={user} />} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
        </Routes>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">Workout Tracker — demo (localStorage)</footer>
    </div>
  )
}
