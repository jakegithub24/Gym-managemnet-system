import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight } from 'lucide-react';

const roles = ['Admin', 'Manager/Staff', 'Trainer', 'Member'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('Admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Zap size={18} className="text-gray-950" />
            </div>
            <span className="text-2xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              <span className="text-sm text-[#39FF14]">Trusted by 500+ gyms</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Your Gym,<br />
              <span className="gradient-text">Fully Automated.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Sign in to access your complete gym management dashboard — members, billing, attendance, and more.
            </p>

            <div className="flex gap-6 mt-8 pt-8 border-t border-gray-800">
              {[['1,284', 'Active Members'], ['$48K+', 'Monthly Revenue'], ['73%', 'Avg Attendance']].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-white">{v}</p>
                  <p className="text-xs text-gray-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Zap size={16} className="text-gray-950" />
            </div>
            <span className="text-xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">Sign in to your GymForce account</p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-xl border border-gray-800">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${role === r ? 'bg-[#39FF14] text-gray-950' : 'text-gray-400 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@gymforce.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-600 bg-gray-900 text-[#39FF14] focus:ring-[#39FF14]/20" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#39FF14] hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-950/40 border-t-gray-950 rounded-full animate-spin" />
              ) : (
                <>Sign In as {role} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium hover:border-gray-500 hover:text-white transition-all">
            <span className="text-base">G</span>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to GymForce?{' '}
            <Link to="/register" className="text-[#39FF14] font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
