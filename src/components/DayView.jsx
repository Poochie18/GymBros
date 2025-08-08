import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { findUser, getUsers, updateUser } from '../utils/localStorage'

export default function DayView({user}){
  const { date } = useParams()
  const [me, setMe] = useState(user)
  const [exList, setExList] = useState([])
  const [name, setName] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)

  useEffect(()=>{
    if(!me) return
    const u = findUser(me.username)
    setMe(u)
    const list = (u.workouts && u.workouts[date]) || []
    setExList(list)
  },[user, date])

  function saveList(newList){
    const u = findUser(me.username)
    u.workouts = {...u.workouts, [date]: newList}
    updateUser(u)
    setExList(newList)
  }

  function addExercise(){
    if(!name) return alert('Enter name')
    if(exList.some(e=> e.exercise.toLowerCase()===name.toLowerCase())) return alert('Exercise exists')
    const newList = [...exList, {exercise:name, sets: Number(sets), reps: Number(reps), weight: Number(weight)}]
    saveList(newList)
    setName(''); setSets(3); setReps(10); setWeight(0)
  }
  function remove(i){
    if(!confirm('Delete exercise?')) return
    const nl = exList.filter((_,idx)=>idx!==i)
    saveList(nl)
  }
  function updateField(i, field, value){
    const nl = exList.map((ex, idx)=> idx===i ? {...ex, [field]: value} : ex)
    saveList(nl)
  }

  const users = getUsers()
  const friends = (me && me.friends) || []

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Exercises — {date}</h3>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th><th></th></tr></thead>
          <tbody>
            {exList.map((ex, i)=>(
              <tr key={i} className="border-t">
                <td>{ex.exercise}</td>
                <td><input value={ex.sets} onChange={e=>updateField(i,'sets',Number(e.target.value)||0)} className="w-16 border px-1 rounded" /></td>
                <td><input value={ex.reps} onChange={e=>updateField(i,'reps',Number(e.target.value)||0)} className="w-16 border px-1 rounded" /></td>
                <td><input value={ex.weight} onChange={e=>updateField(i,'weight',Number(e.target.value)||0)} className="w-20 border px-1 rounded" /></td>
                <td><button onClick={()=>remove(i)} className="text-red-600">Delete</button></td>
              </tr>
            ))}
            {exList.length===0 && <tr><td colSpan="5" className="py-4 text-center text-gray-500">No exercises</td></tr>}
          </tbody>
        </table>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Add Exercise</h4>
          <input placeholder="Exercise name" value={name} onChange={e=>setName(e.target.value)} className="w-full border px-2 py-1 rounded" />
          <div className="flex gap-2">
            <input type="number" value={sets} onChange={e=>setSets(e.target.value)} className="w-24 border px-2 py-1 rounded" />
            <input type="number" value={reps} onChange={e=>setReps(e.target.value)} className="w-24 border px-2 py-1 rounded" />
            <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="w-28 border px-2 py-1 rounded" />
            <button onClick={addExercise} className="bg-green-600 text-white px-3 rounded">Add</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-3">Friends (read-only)</h4>
        {friends.length===0 && <div className="text-sm text-gray-500">No friends added</div>}
        {friends.map((fn)=> {
          const fu = users.find(u=>u.username===fn)
          const list = fu && fu.workouts && fu.workouts[date] ? fu.workouts[date] : []
          return (
            <div key={fn} className="mb-3">
              <div className="font-medium">{fn}</div>
              {list.length===0 ? <div className="text-sm text-gray-500">No data</div> : (
                <ul className="text-sm">
                  {list.map((e,i)=>(<li key={i}>{e.exercise}: {e.sets}x{e.reps} {e.weight?e.weight+'kg':''}</li>))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
