import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, User, Mail, Lock, Building2, ArrowRight, Check } from 'lucide-react';

const roles = ['Admin / Owner', 'Manager/Staff', 'Trainer', 'Member'];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', gym: '', password: '', role: 'Admin / Owner' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 1400);
  };

  const perks = ['14-day free trial', 'No credit card required', 'Cancel anytime', 'Full feature access'];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-gray-950/70 to-gray-950/40" />

        <div className="relative z-10 flex flex-col p-12 h-full justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Zap size={18} className="text-gray-950" />
            </div>
            <span className="text-2xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Start Managing<br />
              <span className="gradient-text">Smarter Today.</span>
            </h2>
            <p className="text-gray-400 mb-8">Join 500+ gym owners who've streamlined their operations with GymForce.</p>

            <ul className="space-y-3">
              {perks.map(p => (
                <li key={p} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-[#39FF14]" />
                  </div>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Zap size={16} className="text-gray-950" />
            </div>
            <span className="text-xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
          <p className="text-gray-400 mb-8">Get started with a 14-day free trial</p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update('role', r)}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    form.role === r
                      ? 'border-[#39FF14]/60 bg-[#39FF14]/10 text-[#39FF14]'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@gymforce.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                  required
                />
              </div>
            </div>

            {(form.role === 'Admin / Owner' || form.role === 'Manager/Staff') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Gym Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={form.gym}
                    onChange={e => update('gym', e.target.value)}
                    placeholder="Iron Paradise Gym"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= i * 2 ? (form.password.length >= 8 ? 'bg-[#39FF14]' : 'bg-yellow-500') : 'bg-gray-700'}`} />
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-gray-600 bg-gray-900 text-[#39FF14] focus:ring-[#39FF14]/20"
              />
              <span className="text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-[#39FF14] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#39FF14] hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-950/40 border-t-gray-950 rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#39FF14] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
