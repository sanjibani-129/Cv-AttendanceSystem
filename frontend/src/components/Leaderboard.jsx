import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Leaderboard({ leaderboard }) {
  const data = leaderboard.map((l) => ({
    name: l.name,
    hours: Math.round((l.total_seconds / 3600) * 10) / 10,
  }))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Most active members</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #22ff8840' }} />
            <Bar dataKey="hours" fill="#22ff88" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default Leaderboard
