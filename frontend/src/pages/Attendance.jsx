import { seconds_to_hms as fmt } from '../utils/format'

function Attendance({ sessions }) {
  return (
    <div className="p-8">
      <div className="text-xs font-mono text-neon/70 mb-2">// LOGS</div>
      <h2 className="text-2xl font-bold mb-6">Attendance</h2>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No attendance records yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs font-mono border-b border-white/10">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Check-in</th>
                <th className="py-3 px-6">Check-out</th>
                <th className="py-3 px-6">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-6">{s.member_name}</td>
                  <td className="py-3 px-6 text-gray-400 font-mono text-sm">
                    {new Date(s.start_time).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-gray-400 font-mono text-sm">
                    {s.end_time ? new Date(s.end_time).toLocaleString() : (
                      <span className="text-neon">active</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-gray-400 font-mono text-sm">{fmt(s.duration_seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Attendance
