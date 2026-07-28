import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { getMembers } from '../api/client'

function Members() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    getMembers().then(setMembers).catch((err) => console.error('Failed to load members:', err))
  }, [])

  return (
    <div className="p-8">
      <div className="text-xs font-mono text-neon/70 mb-2">// REGISTERED</div>
      <h2 className="text-2xl font-bold mb-6">Members</h2>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {members.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-neon/40" />
            No members registered yet. Run the enrollment script to add one.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs font-mono border-b border-white/10">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Registered</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-6">{m.name}</td>
                  <td className="py-3 px-6 text-gray-400 font-mono text-sm">
                    {new Date(m.registered_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Members
