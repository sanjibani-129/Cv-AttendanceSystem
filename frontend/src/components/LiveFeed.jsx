function LiveFeed({ sessions }) {
  const active = sessions.filter((s) => !s.end_time)

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Currently in the space</h2>
      {active.length === 0 ? (
        <p className="text-gray-400">No one checked in right now.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2">Name</th>
              <th className="py-2">Since</th>
            </tr>
          </thead>
          <tbody>
            {active.map((s) => (
              <tr key={s.id} className="border-b border-gray-800">
                <td className="py-2">{s.member_name}</td>
                <td className="py-2">{new Date(s.start_time).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default LiveFeed
