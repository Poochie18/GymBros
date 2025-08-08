import React, {useMemo} from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import { getUsers, getCurrentUser } from '../utils/localStorage'
import { isoDate } from '../utils/dateUtils'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip)

export default function Charts(){
  const users = getUsers()
  const current = getCurrentUser()
  const today = new Date()
  const labels = []
  const counts = []
  for(let i=6;i>=0;i--){
    const d = new Date(today)
    d.setDate(today.getDate()-i)
    const iso = isoDate(d)
    labels.push(iso)
    const me = users.find(u=>u.username=== (current && current.username))
    const cnt = (me && me.workouts && me.workouts[iso] && me.workouts[iso].length) || 0
    counts.push(cnt)
  }

  const data = { labels, datasets: [{ label: 'Exercises per day', data: counts }] }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Charts — last 7 days</h3>
      <Bar data={data} />
    </div>
  )
}
