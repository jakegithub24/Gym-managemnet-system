import { useState } from 'react';
import { Check, X, CreditCard, Plus, TrendingUp, Users, DollarSign } from 'lucide-react';
import { membershipPlans, recentPayments } from '../../data/sampleData';

function StatusBadge({ status }) {
  const map = {
    Paid: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status] || ''}`}>{status}</span>;
}

const colorMap = {
  gray: { border: 'border-gray-700', accent: '#6B7280', btn: 'bg-gray-700 hover:bg-gray-600 text-white', badge: 'bg-gray-700 text-gray-300' },
  blue: { border: 'border-[#00D4FF]/40', accent: '#00D4FF', btn: 'bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-gray-950', badge: 'bg-[#00D4FF]/20 text-[#00D4FF]' },
  green: { border: 'border-[#39FF14]/40', accent: '#39FF14', btn: 'bg-[#39FF14] hover:bg-[#39FF14]/90 text-gray-950', badge: 'bg-[#39FF14]/20 text-[#39FF14]' },
  orange: { border: 'border-[#FF6B00]/40', accent: '#FF6B00', btn: 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white', badge: 'bg-[#FF6B00]/20 text-[#FF6B00]' },
};

export default function MembershipPlans() {
  const [activeTab, setActiveTab] = useState('plans');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;
  const totalPages = Math.ceil(recentPayments.length / PER_PAGE);
  const paginated = recentPayments.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const planStats = [
    { label: 'Basic Members', value: '449', color: '#6B7280', pct: '35%' },
    { label: 'Standard Members', value: '514', color: '#00D4FF', pct: '40%' },
    { label: 'Premium Members', value: '257', color: '#39FF14', pct: '20%' },
    { label: 'VIP Members', value: '64', color: '#FF6B00', pct: '5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Membership Plans & Billing</h1>
          <p className="text-gray-500 text-sm">Manage plans, pricing, and payment records</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all">
          <Plus size={16} /> Create Plan
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {planStats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{s.label}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: s.color, background: `${s.color}18` }}>{s.pct}</span>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: s.pct, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl w-fit">
        {['plans', 'billing'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-[#39FF14] text-gray-950' : 'text-gray-400 hover:text-white'}`}
          >
            {tab === 'plans' ? 'Membership Plans' : 'Billing History'}
          </button>
        ))}
      </div>

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {membershipPlans.map(plan => {
            const c = colorMap[plan.color];
            return (
              <div key={plan.id} className={`relative bg-gray-900 border-2 ${c.border} rounded-2xl p-5 flex flex-col ${plan.popular ? 'ring-2 ring-[#00D4FF]/30' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-[#00D4FF] text-gray-950">
                    POPULAR
                  </div>
                )}
                <div className={`text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 ${c.badge}`}>{plan.name}</div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">${plan.price}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check size={12} style={{ color: c.accent }} className="mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${c.btn}`}>Assign</button>
                  <button className="px-3 py-2 text-xs text-gray-400 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all">Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h3 className="font-bold text-white">Payment History</h3>
            <button className="text-xs text-[#39FF14] hover:underline flex items-center gap-1">
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/30">
                <tr>
                  {['ID', 'Member', 'Plan', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(p => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-500 font-mono">{p.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">{p.avatar}</div>
                        <span className="text-sm text-white">{p.member}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{p.plan}</td>
                    <td className="px-5 py-3 text-sm font-bold text-white">{p.amount}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{p.date}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, recentPayments.length)} of {recentPayments.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 text-xs rounded-lg ${page === n ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
