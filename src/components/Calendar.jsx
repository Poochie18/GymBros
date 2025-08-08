import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '../utils/localStorage'
import { isoDate, todayIso } from '../utils/dateUtils'

function generateMonth(year, month){
  const first = new Date(year, month, 1)
  const startDay = first.getDay() // 0..6 (Sun..Sat)
  const days = new Date(year, month+1, 0).getDate()
  const weeks = []
  let week = new Array(startDay).fill(null)
  for(let d=1; d<=days; d++){
    week.push(new Date(year, month, d))
    if(week.length===7){ weeks.push(week); week = [] }
  }
  while(week.length<7) week.push(null)
  weeks.push(week)
  return weeks
}

export default function Calendar({user}){
  const [view, setView] = useState(()=>{ const d=new Date(); return {year:d.getFullYear(), month:d.getMonth()} })
  const users = getUsers()
  const weeks = generateMonth(view.year, view.month)
  const workoutDays = new Set()
  users.forEach(u=>{
    if(!u.workouts) return
    Object.keys(u.workouts).forEach(date=>{ workoutDays.add(date) })
  })
  const today = todayIso()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={()=>setView(v=>({year:v.month===0? v.year-1:v.year, month: v.month===0?11:v.month-1}))} className="px-3 py-1 border rounded mr-2">Previous</button>
          <button onClick={()=>setView(v=>({year:v.month===11? v.year+1:v.year, month: v.month===11?0:v.month+1}))} className="px-3 py-1 border rounded">Next</button>
        </div>
        <h3 className="text-lg font-semibold">{new Date(view.year, view.month).toLocaleString(undefined,{month:'long', year:'numeric'})}</h3>
        <div></div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(<div key={d} className="font-medium">{d}</div>))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {weeks.flat().map((day, i)=> {
          if(!day) return <div key={i} className="h-20 bg-white rounded border"></div>
          const iso = isoDate(day)
          const has = workoutDays.has(iso)
          return (
            <Link to={'/day/'+iso} key={i} className={`h-20 p-2 rounded border bg-white flex flex-col justify-between ${has ? 'bg-green-100' : ''}`}>
              <div className="flex justify-between text-sm">
                <span>{day.getDate()}</span>
                {iso===today && <span className="text-yellow-500">★</span>}
              </div>
              <div className="text-xs text-gray-600">{has ? 'Workout' : ''}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
