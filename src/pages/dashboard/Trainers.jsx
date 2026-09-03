import { useState } from 'react';
import { Dumbbell, Star, Users, Plus, X, Award, Mail, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { trainers } from '../../data/sampleData';

function StatusBadge({ status }) {
  const map = {
    Active: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    'On Leave': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status] || ''}`}>{status}</span>;
}

function TrainerModal({ trainer, onClose }) {
  if (!trainer) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white text-lg">Trainer Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FFB347]/20 border border-[#FF6B00]/30 flex items-center justify-center text-xl font-black text-[#FF6B00]">
              {trainer.avatar}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{trainer.name}</h3>
              <p className="text-[#00D4FF] text-sm font-medium">{trainer.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={trainer.status} />
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star size={11} className="fill-yellow-400" /> {trainer.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Experience', value: trainer.experience, icon: Award },
              { label: 'Active Clients', value: trainer.clients, icon: Users },
              { label: 'Email', value: trainer.email, icon: Mail },
              { label: 'Schedule', value: trainer.schedule, icon: Calendar },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Icon size={11} />{label}</p>
                <p className="text-sm text-white font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5"><Award size={11} />Certifications</p>
            <div className="flex flex-wrap gap-2">
              {trainer.certifications.map(c => (
                <span key={c} className="text-xs bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 px-2.5 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Trainers() {
  const [selected, setSelected] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const VISIBLE = 3;
  const canPrev = slideIdx > 0;
  const canNext = slideIdx + VISIBLE < trainers.length;

  const visible = trainers.slice(slideIdx, slideIdx + VISIBLE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Trainer Management</h1>
          <p className="text-gray-500 text-sm">{trainers.length} trainers on roster</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all">
          <Plus size={16} /> Add Trainer
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trainers', value: trainers.length, color: '#39FF14' },
          { label: 'Active Trainers', value: trainers.filter(t => t.status === 'Active').length, color: '#00D4FF' },
          { label: 'Total Clients', value: trainers.reduce((s, t) => s + t.clients, 0), color: '#FF6B00' },
          { label: 'Avg Rating', value: (trainers.reduce((s, t) => s + t.rating, 0) / trainers.length).toFixed(1), color: '#A855F7' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trainer Cards - mobile slider on small screens */}
      <div>
        {/* Slider controls for mobile */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h3 className="font-bold text-white text-sm">All Trainers</h3>
          <div className="flex gap-2">
            <button onClick={() => setSlideIdx(i => Math.max(0, i - 1))} disabled={!canPrev}
              className="p-2 glass rounded-full border border-gray-700 disabled:opacity-30 hover:border-gray-500 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setSlideIdx(i => canNext ? i + 1 : i)} disabled={!canNext}
              className="p-2 glass rounded-full border border-gray-700 disabled:opacity-30 hover:border-gray-500 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Desktop: all trainers grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainers.map(trainer => (
            <TrainerCard key={trainer.id} trainer={trainer} onView={() => setSelected(trainer)} />
          ))}
        </div>

        {/* Mobile: slider */}
        <div className="md:hidden">
          {visible.map(trainer => (
            <TrainerCard key={trainer.id} trainer={trainer} onView={() => setSelected(trainer)} />
          ))}
          <div className="flex justify-center gap-2 mt-4">
            {trainers.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === slideIdx ? 'bg-[#39FF14] w-4' : 'bg-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Trainer schedule mini table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Trainer Schedule Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {['Trainer', 'Specialty', 'Schedule', 'Clients', 'Status'].map(h => (
                  <th key={h} className="text-left pb-3 text-xs text-gray-500 font-semibold px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainers.map(t => (
                <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => setSelected(t)}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-[#FFB347]/20 flex items-center justify-center text-xs font-bold text-[#FF6B00]">
                        {t.avatar}
                      </div>
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-[#00D4FF]">{t.specialty}</td>
                  <td className="py-3 px-3 text-xs text-gray-400">{t.schedule}</td>
                  <td className="py-3 px-3 text-sm font-bold text-white">{t.clients}</td>
                  <td className="py-3 px-3"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TrainerModal trainer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function TrainerCard({ trainer, onView }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 card-hover mb-4 md:mb-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FFB347]/20 border border-[#FF6B00]/30 flex items-center justify-center text-base font-black text-[#FF6B00]">
            {trainer.avatar}
          </div>
          <div>
            <h3 className="font-bold text-white">{trainer.name}</h3>
            <p className="text-xs text-[#00D4FF]">{trainer.specialty}</p>
          </div>
        </div>
        <StatusBadge status={trainer.status} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(trainer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">{trainer.rating}</span>
        </div>
        <span className="text-xs text-gray-500">{trainer.experience}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-center">
        <div className="bg-gray-800/50 rounded-xl p-2">
          <p className="text-lg font-black text-white">{trainer.clients}</p>
          <p className="text-xs text-gray-500">Clients</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-2">
          <p className="text-xs text-gray-300 font-medium leading-tight">{trainer.schedule.split(' ')[0]}</p>
          <p className="text-xs text-gray-500">Schedule</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {trainer.certifications.slice(0, 2).map(c => (
          <span key={c} className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{c}</span>
        ))}
        {trainer.certifications.length > 2 && (
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">+{trainer.certifications.length - 2}</span>
        )}
      </div>

      <button
        onClick={onView}
        className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all"
      >
        View Profile
      </button>
    </div>
  );
}
