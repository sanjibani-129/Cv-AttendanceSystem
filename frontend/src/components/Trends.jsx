import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Trends({ sessions }) {
  const hourCounts = Array(24).fill(0)
  sessions.forEach((s) => {
    const hour = new Date(s.start_time).getHours()
    hourCounts[hour] += 1
  })
  const data = hourCounts.map((count, hour) => ({ hour: `${hour}:00`, count }))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Check-ins by hour of day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="hour" stroke="#6b7280" interval={2} />
          <YAxis stroke="#6b7280" allowDecimals={false} />
          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #22ff8840' }} />
          <Bar dataKey="count" fill="#22ff88" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Trends
