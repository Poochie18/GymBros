import React, {useState, useEffect} from 'react'
import { getUsers, findUser, updateUser, getCurrentUser, setCurrentUser } from '../utils/localStorage'

export default function Settings({setUser}){
  const cur = getCurrentUser()
  const [username, setUsername] = useState(cur?.username || '')
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [friend, setFriend] = useState('')
  const [me, setMe] = useState(cur)

  useEffect(()=> setMe(getCurrentUser()), [])

  function changeName(){
    if(!username) return alert('Empty')
    if(username !== me.username && findUser(username)) return alert('Name taken')
    const u = {...me, username}
    updateUser(u)
    setCurrentUser(u)
    setMe(u)
    setUser(u)
    alert('Name changed')
  }
  function changePassword(){
    if(oldPass !== me.password) return alert('Wrong current password')
    const u = {...me, password:newPass}
    updateUser(u); setCurrentUser(u); setMe(u); setUser(u)
    alert('Password changed')
  }
  function addFriend(){
    if(friend === me.username) return alert('Cannot add yourself')
    const f = findUser(friend)
    if(!f) return alert('User not found')
    if((me.friends||[]).includes(friend)) return alert('Already a friend')
    const u = {...me, friends: [...(me.friends||[]), friend]}
    updateUser(u); setCurrentUser(u); setMe(u); setUser(u)
    alert('Friend added')
    setFriend('')
  }
  function removeFriend(n){
    if(!confirm('Remove friend?')) return
    const u = {...me, friends: (me.friends||[]).filter(x=>x!==n)}
    updateUser(u); setCurrentUser(u); setMe(u); setUser(u)
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl">
      <h3 className="font-semibold mb-3">User Settings</h3>
      <div className="space-y-2">
        <label className="block text-sm">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="border px-2 py-1 rounded w-full" />
        <button onClick={changeName} className="px-3 py-1 bg-blue-600 text-white rounded mt-2">Change name</button>
      </div>

      <div className="mt-4">
        <label className="block text-sm">Current password</label>
        <input type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)} className="border px-2 py-1 rounded w-full" />
        <label className="block text-sm mt-2">New password</label>
        <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} className="border px-2 py-1 rounded w-full" />
        <button onClick={changePassword} className="px-3 py-1 bg-blue-600 text-white rounded mt-2">Change password</button>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold">Friends</h4>
        <div className="flex gap-2 mt-2">
          <input placeholder="friend username" value={friend} onChange={e=>setFriend(e.target.value)} className="border px-2 py-1 rounded" />
          <button onClick={addFriend} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
        </div>
        <div className="mt-3">
          {(me.friends||[]).map(f=>(
            <div key={f} className="flex items-center justify-between border-b py-2">
              <div>{f}</div>
              <div className="flex gap-2">
                <button onClick={()=>removeFriend(f)} className="text-red-600">Remove</button>
              </div>
            </div>
          ))}
          {(me.friends||[]).length===0 && <div className="text-sm text-gray-500">No friends</div>}
        </div>
      </div>
    </div>
  )
}
