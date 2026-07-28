import { FileText, Download } from 'lucide-react'

function Reports({ sessions }) {
  const downloadCsv = () => {
    const header = 'Name,Check-in,Check-out,Duration (seconds)\n'
    const rows = sessions
      .map((s) => `${s.member_name},${s.start_time},${s.end_time || ''},${s.duration_seconds || ''}`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="text-xs font-mono text-neon/70 mb-2">// EXPORT</div>
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center gap-4 max-w-md">
        <FileText className="w-10 h-10 text-neon/60" />
        <p className="text-gray-400 text-sm">
          Export all attendance sessions as a CSV file for judges or your own records.
        </p>
        <button
          onClick={downloadCsv}
          disabled={sessions.length === 0}
          className="flex items-center gap-2 bg-neon text-black font-semibold px-5 py-2.5 rounded-xl hover:shadow-glow transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>
    </div>
  )
}

export default Reports
