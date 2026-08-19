import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Activity,
  AlertTriangle, UserPlus, CreditCard, CalendarCheck, Dumbbell,
  ArrowUpRight, Shield, Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  kpiData, revenueData, attendanceData, membershipDistribution,
  recentPayments, members
} from '../../data/sampleData';

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ title, value, change, positive, icon: Icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-white mb-2">{value}</p>
      <div className={`flex items-center gap-1 text-sm font-medium ${positive ? 'text-[#39FF14]' : 'text-red-400'}`}>
        {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{change}</span>
        <span className="text-gray-600 font-normal ml-1">vs last month</span>
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark border border-gray-700 rounded-xl p-3 text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Paid: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status] || ''}`}>
      {status}
    </span>
  );
}

// ── Quick Actions ─────────────────────────────────────────────────────────────
function QuickActions() {
  const actions = [
    { label: 'Add Member', icon: UserPlus, color: '#39FF14', to: '/dashboard/members' },
    { label: 'Record Payment', icon: CreditCard, color: '#00D4FF', to: '/dashboard/plans' },
    { label: 'Mark Attendance', icon: CalendarCheck, color: '#FF6B00', to: '/dashboard/attendance' },
    { label: 'Add Trainer', icon: Dumbbell, color: '#A855F7', to: '/dashboard/trainers' },
  ];
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ label, icon: Icon, color, to }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors text-center">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { currentUser, ROLE_CONFIG } = useAuth();
  const role = currentUser?.role || 'staff';
  const roleConfig = ROLE_CONFIG[role];

  const [payPage, setPayPage] = useState(1);
  const PER_PAGE = 5;
  const totalPages = Math.ceil(recentPayments.length / PER_PAGE);
  const paginated = recentPayments.slice((payPage - 1) * PER_PAGE, payPage * PER_PAGE);

  const kpis = [
    { title: kpiData.revenue.label, value: kpiData.revenue.value, change: kpiData.revenue.change, positive: kpiData.revenue.positive, icon: DollarSign, color: '#39FF14' },
    { title: kpiData.members.label, value: kpiData.members.value, change: kpiData.members.change, positive: kpiData.members.positive, icon: Users, color: '#00D4FF' },
    { title: kpiData.attendance.label, value: kpiData.attendance.value, change: kpiData.attendance.change, positive: kpiData.attendance.positive, icon: Activity, color: '#FF6B00' },
    { title: kpiData.expiring.label, value: kpiData.expiring.value, change: kpiData.expiring.change, positive: kpiData.expiring.positive, icon: AlertTriangle, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">
              Welcome back, {currentUser?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Thursday, August 20, 2026</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ background: `${roleConfig?.color}12`, borderColor: `${roleConfig?.color}30`, color: roleConfig?.color }}>
              {roleConfig?.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#39FF14]/90 transition-all">
            <ArrowUpRight size={15} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => <KpiCard key={k.title} {...k} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white">Revenue & Member Growth</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly trend 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#39FF14] inline-block rounded" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#00D4FF] inline-block rounded" />Members</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#39FF14" strokeWidth={2} fill="url(#revGrad)" name="revenue" />
              <Area type="monotone" dataKey="members" stroke="#00D4FF" strokeWidth={2} fill="url(#memGrad)" name="members" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Distribution Pie */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-bold text-white">Plan Distribution</h3>
            <p className="text-xs text-gray-500 mt-0.5">Active memberships by plan</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={membershipDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {membershipDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {membershipDistribution.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
                <span className="text-gray-300 font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-white">Weekly Attendance</h3>
            <p className="text-xs text-gray-500 mt-0.5">Morning vs Evening check-ins</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="morning" name="Morning" fill="#00D4FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="evening" name="Evening" fill="#FF6B00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Payments table + Quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Payments table */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Recent Payments</h3>
              <p className="text-xs text-gray-500 mt-0.5">{recentPayments.length} transactions</p>
            </div>
            <Link to="/dashboard/plans" className="text-xs text-[#39FF14] hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-3 font-medium">Member</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell">Plan</th>
                  <th className="text-left pb-3 font-medium">Amount</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {paginated.map(p => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                          {p.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{p.member}</p>
                          <p className="text-xs text-gray-500">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-300">{p.plan}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-sm font-semibold text-white">{p.amount}</span>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className="text-sm text-gray-400">{p.date}</span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Showing {(payPage - 1) * PER_PAGE + 1}–{Math.min(payPage * PER_PAGE, recentPayments.length)} of {recentPayments.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPayPage(p => Math.max(1, p - 1))}
                disabled={payPage === 1}
                className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPayPage(n)}
                  className={`w-7 h-7 text-xs rounded-lg transition-colors ${payPage === n ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPayPage(p => Math.min(totalPages, p + 1))}
                disabled={payPage === totalPages}
                className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions + top members */}
        <div className="space-y-4">
          <QuickActions />

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Top Active Members</h3>
              <Link to="/dashboard/members" className="text-xs text-[#39FF14] hover:underline">All members</Link>
            </div>
            <div className="space-y-3">
              {members.filter(m => m.status === 'Active').slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                      {m.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.plan}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#39FF14] font-semibold">{m.attendance} sessions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
