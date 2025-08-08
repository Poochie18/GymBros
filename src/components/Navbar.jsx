import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({user, onLogout}){
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">Workout Tracker</Link>
          <Link to="/charts" className="text-sm text-gray-600 hover:underline">Charts</Link>
          <Link to="/settings" className="text-sm text-gray-600 hover:underline">Settings</Link>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Hi, {user.username}</span>
              <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </div>
          ): (
            <Link to="/auth" className="bg-blue-500 text-white px-3 py-1 rounded">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
