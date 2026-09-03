import { useState } from 'react';
import { Download, TrendingUp, Users, DollarSign, Activity, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { revenueData, attendanceData, membershipDistribution } from '../../data/sampleData';

const tabs = ['Revenue', 'Membership', 'Attendance', 'Trainers'];

const trainerPerf = [
  { name: 'Mike Stone', clients: 24, sessions: 96, rating: 4.9, revenue: 8400 },
  { name: 'Sarah Fit', clients: 18, sessions: 72, rating: 4.8, revenue: 6300 },
  { name: 'Tom Flex', clients: 20, sessions: 80, rating: 4.7, revenue: 7000 },
  { name: 'Lisa Power', clients: 30, sessions: 120, rating: 5.0, revenue: 10500 },
  { name: 'Chris Bulk', clients: 15, sessions: 60, rating: 4.6, revenue: 5250 },
];

export default function Reports() {
  const [tab, setTab] = useState('Revenue');
  const [period, setPeriod] = useState('monthly');
  const [slideIdx, setSlideIdx] = useState(0);

  // Mobile chart slider
  const chartSections = [
    { label: 'Revenue Trend' },
    { label: 'Attendance' },
    { label: 'Plan Mix' },
  ];

  const summaryCards = [
    { label: 'Total Revenue', value: '$328K', change: '+18.2%', icon: DollarSign, color: '#39FF14', positive: true },
    { label: 'New Members', value: '304', change: '+8.4%', icon: Users, color: '#00D4FF', positive: true },
    { label: 'Avg Attendance', value: '73%', change: '-2.1%', icon: Activity, color: '#FF6B00', positive: false },
    { label: 'Trainer Revenue', value: '$37.4K', change: '+21.3%', icon: TrendingUp, color: '#A855F7', positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Year-to-date performance insights</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 font-medium text-sm px-4 py-2 rounded-xl hover:bg-gray-700 transition-all border border-gray-700">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className={`text-xs font-semibold ${s.positive ? 'text-[#39FF14]' : 'text-red-400'}`}>{s.change}</span>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${tab === t ? 'bg-[#39FF14] text-gray-950' : 'text-gray-400 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Revenue' && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-white">Revenue Trend</h3>
                <p className="text-xs text-gray-500">Jan–Aug 2026</p>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#39FF14] inline-block" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#00D4FF] inline-block" />Members</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#39FF14" strokeWidth={2} fill="url(#r1)" name="Revenue ($)" />
                <Area type="monotone" dataKey="members" stroke="#00D4FF" strokeWidth={2} fill="url(#r2)" name="Members" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue breakdown table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Monthly Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['Month', 'Revenue', 'Members', 'Avg/Member', 'Growth'].map(h => (
                      <th key={h} className="text-left pb-3 text-xs text-gray-500 font-semibold px-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((r, i) => {
                    const prev = revenueData[i - 1];
                    const growth = prev ? (((r.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : '—';
                    return (
                      <tr key={r.month} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-2 text-sm font-medium text-white">{r.month}</td>
                        <td className="py-3 px-2 text-sm font-bold text-white">${r.revenue.toLocaleString()}</td>
                        <td className="py-3 px-2 text-sm text-gray-300">{r.members.toLocaleString()}</td>
                        <td className="py-3 px-2 text-sm text-gray-400">${Math.round(r.revenue / r.members)}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold ${growth === '—' ? 'text-gray-600' : parseFloat(growth) >= 0 ? 'text-[#39FF14]' : 'text-red-400'}`}>
                            {growth === '—' ? '—' : `${parseFloat(growth) >= 0 ? '+' : ''}${growth}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Attendance' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-5">Weekly Attendance Analysis</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
              <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>} />
              <Bar dataKey="morning" name="Morning" fill="#00D4FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="evening" name="Evening" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" name="Total" fill="#39FF14" radius={[4, 4, 0, 0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'Membership' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Plan Distribution</h3>
            <div className="space-y-4">
              {membershipDistribution.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                      <span className="text-sm text-gray-300">{d.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: d.color }}>{d.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Retention Rate</h3>
            <div className="flex flex-col items-center justify-center h-48">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#39FF14" strokeWidth="3"
                    strokeDasharray={`${87 * 100 / 100} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">87%</span>
                  <span className="text-xs text-gray-500">Retention</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center">Monthly member retention rate — above industry average of 72%</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'Trainers' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="font-bold text-white">Trainer Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/30">
                <tr>
                  {['Trainer', 'Clients', 'Sessions', 'Rating', 'Revenue'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainerPerf.map((t, i) => (
                  <tr key={t.name} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 font-mono w-4">#{i + 1}</span>
                        <span className="text-sm font-semibold text-white">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">{t.clients}</td>
                    <td className="px-5 py-4 text-sm text-gray-300">{t.sessions}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold text-white">{t.rating}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[#39FF14]">${t.revenue.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
