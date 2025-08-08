import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, addUser, findUser, setCurrentUser } from '../utils/localStorage'

export default function AuthForm({onLogin}){
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  function notify(msg){
    alert(msg)
  }

  function handleRegister(e){
    e.preventDefault()
    if(!username || !password){ notify('Заполните поля'); return }
    if(findUser(username)){ notify('Имя занято'); return }
    const u = { username, password, workouts: {}, friends: [], settings: {showFriendWorkouts:{}} }
    addUser(u)
    setCurrentUser(u)
    onLogin(u)
    nav('/')
  }

  function handleLogin(e){
    e.preventDefault()
    const u = findUser(username)
    if(!u){ notify('Пользователь не найден'); return }
    if(u.password !== password){ notify('Неверный пароль'); return }
    setCurrentUser(u)
    onLogin(u)
    nav('/')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={mode==='login' ? handleLogin : handleRegister} className="space-y-3">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full border px-3 py-2 rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border px-3 py-2 rounded" />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{mode==='login' ? 'Login' : 'Register'}</button>
          <button type="button" onClick={()=>setMode(mode==='login' ? 'register' : 'login')} className="px-4 py-2 border rounded">
            {mode==='login' ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </form>
    </div>
  )
}
