import { Search, Bell, Moon, Bot } from 'lucide-react'

function Topbar({ breadcrumb }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-neon/10 bg-black/60 backdrop-blur sticky top-0 z-10">
      <div className="font-mono text-sm text-gray-400">
        <span className="text-neon">&gt;_</span>{' '}
        <span className="text-neon/70">$</span> {breadcrumb}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search members, IDs, timestamps"
            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-14 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-neon/40 w-72"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 border border-gray-700 rounded px-1">
            ⌘K
          </span>
        </div>
        <button className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-300 hover:border-neon/40">
          <Bell className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-300 hover:border-neon/40">
          <Moon className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 rounded-full bg-neon flex items-center justify-center text-black">
          <Bot className="w-4 h-4" />
        </div>
      </div>
    </header>
  )
}

export default Topbar
