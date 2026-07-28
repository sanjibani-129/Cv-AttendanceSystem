import Leaderboard from '../components/Leaderboard'
import Trends from '../components/Trends'

function AnalyticsPage({ sessions, summary }) {
  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="text-xs font-mono text-neon/70 mb-2">// ANALYTICS</div>
        <h2 className="text-2xl font-bold">Analytics</h2>
      </div>
      <Leaderboard leaderboard={summary.leaderboard} />
      <Trends sessions={sessions} />
    </div>
  )
}

export default AnalyticsPage
