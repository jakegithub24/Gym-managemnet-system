import { useState } from 'react';
import {
  Search, UserPlus, ChevronUp, ChevronDown,
  X, Mail, Phone, Calendar, User, Edit2, Trash2, Eye, Activity
} from 'lucide-react';
import { members } from '../../data/sampleData';

const PER_PAGE = 6;

function StatusBadge({ status }) {
  const map = {
    Active: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    Inactive: 'bg-gray-700/50 text-gray-400 border-gray-700',
    Expiring: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status] || ''}`}>{status}</span>;
}

function PlanBadge({ plan }) {
  const map = {
    Basic: 'text-gray-400',
    Standard: 'text-[#00D4FF]',
    Premium: 'text-[#39FF14]',
    VIP: 'text-[#FF6B00]',
  };
  return <span className={`text-xs font-bold ${map[plan] || 'text-gray-400'}`}>{plan}</span>;
}

// Member Detail Modal
function MemberModal({ member, onClose }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white text-lg">Member Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 border border-[#39FF14]/30 flex items-center justify-center text-xl font-black text-[#39FF14]">
              {member.avatar}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{member.name}</h3>
              <p className="text-gray-400 text-sm">{member.id}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={member.status} />
                <PlanBadge plan={member.plan} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Email', value: member.email, icon: Mail },
              { label: 'Phone', value: member.phone, icon: Phone },
              { label: 'Join Date', value: member.joinDate, icon: Calendar },
              { label: 'Expiry', value: member.expiry, icon: Calendar },
              { label: 'Trainer', value: member.trainer, icon: User },
              { label: 'Sessions', value: `${member.attendance} this month`, icon: Activity },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Icon size={12} />{label}</p>
                <p className="text-sm text-white font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-5">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#39FF14]/20 transition-all">
              <Edit2 size={14} /> Edit Member
            </button>
            <button className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Member Drawer
function AddMemberDrawer({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: 'Standard', trainer: 'Unassigned' });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border-l border-gray-700 w-full max-w-md h-full overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white text-lg">Add New Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Smith' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'john@example.com' },
            { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+1 555-0000' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Membership Plan</label>
            <select
              value={form.plan}
              onChange={e => update('plan', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors"
            >
              {['Basic', 'Standard', 'Premium', 'VIP'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Assign Trainer</label>
            <select
              value={form.trainer}
              onChange={e => update('trainer', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors"
            >
              {['Unassigned', 'Mike Stone', 'Sarah Fit', 'Tom Flex', 'Lisa Power'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#39FF14] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#39FF14]/90 transition-all mt-4"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Members() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchPlan = planFilter === 'All' || m.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  }).sort((a, b) => {
    const va = a[sortKey] ?? '';
    const vb = b[sortKey] ?? '';
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => sortKey === col
    ? (sortDir === 'asc' ? <ChevronUp size={12} className="text-[#39FF14]" /> : <ChevronDown size={12} className="text-[#39FF14]" />)
    : <ChevronDown size={12} className="text-gray-600" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Member Management</h1>
          <p className="text-gray-500 text-sm">{members.length} total members</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow"
        >
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/40 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none"
          >
            <option value="All">All Status</option>
            {['Active', 'Inactive', 'Expiring'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={planFilter}
            onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none"
          >
            <option value="All">All Plans</option>
            {['Basic', 'Standard', 'Premium', 'VIP'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                {[
                  { key: 'name', label: 'Member' },
                  { key: 'plan', label: 'Plan' },
                  { key: 'status', label: 'Status' },
                  { key: 'attendance', label: 'Sessions' },
                  { key: 'expiry', label: 'Expiry' },
                ].map(col => (
                  <th
                    key={col.key}
                    className="text-left px-5 py-3 text-xs text-gray-500 font-semibold cursor-pointer hover:text-gray-300 transition-colors select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold hidden md:table-cell">Trainer</th>
                <th className="px-5 py-3 text-xs text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-500">
                    <User size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No members found</p>
                  </td>
                </tr>
              ) : paginated.map(m => (
                <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                        {m.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><PlanBadge plan={m.plan} /></td>
                  <td className="px-5 py-4"><StatusBadge status={m.status} /></td>
                  <td className="px-5 py-4 text-sm text-gray-300">{m.attendance}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{m.expiry}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">{m.trainer}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelected(m)}
                        className="p-1.5 text-gray-500 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-500">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors">
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === n ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <MemberModal member={selected} onClose={() => setSelected(null)} />
      <AddMemberDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
