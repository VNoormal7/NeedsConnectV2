import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Heart, Sparkles, Users, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const role = username.toLowerCase() === 'admin' ? 'admin' : 'helper';
      storage.set('currentUser', { username, role });
      navigate(role === 'admin' ? '/admin' : '/helper');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-90 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(15,118,110,0.12),transparent_55%)]" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <section className="flex-1 px-6 sm:px-10 lg:px-16 py-12 lg:py-16 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary shadow-glow">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Needs Connect</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white">Charity Intelligence Platform</h1>
            </div>
          </div>

          <div className="mt-16 max-w-2xl space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-xs uppercase tracking-[0.25em] text-slate-300">
                <Sparkles className="w-4 h-4 text-accent" />
                Empower Communities
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-white leading-tight">
                Connect urgent needs with people ready to help, in moments.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Needs Connect orchestrates funding, volunteering, and impact tracking in one elegant workspace. Managers act with clarity, helpers contribute with confidence, and communities thrive faster.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-100">
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Active Needs</span>
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-semibold">10</p>
                <p className="text-xs text-slate-400 mt-1">Pre-loaded sample causes</p>
              </div>
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Transparency</span>
                  <ShieldCheck className="w-4 h-4 text-success" />
                </div>
                <p className="text-2xl font-semibold">Real-time</p>
                <p className="text-xs text-slate-400 mt-1">Impact dashboards & analytics</p>
              </div>
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Volunteers</span>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <p className="text-2xl font-semibold">Co-ordinated</p>
                <p className="text-xs text-slate-400 mt-1">Tasks & registrations unified</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-400 text-sm mt-16">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-10 w-10 rounded-full border border-white/10 bg-white/10 backdrop-blur flex items-center justify-center text-xs font-semibold text-white">
                  {['A', 'K', 'M', 'S'][idx]}
                </div>
              ))}
            </div>
            Trusted by communities, schools, and relief teams.
          </div>
        </section>

        <section className="relative flex-1 max-w-xl w-full mx-auto lg:mx-0 px-6 sm:px-12 lg:px-0 py-16 flex items-center">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-primary to-indigo-900" />
          <div className="relative w-full">
            <div className="gradient-border shadow-glow">
              <div className="glass-panel rounded-[1.4rem] p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-glow">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome</p>
                    <h3 className="text-2xl font-semibold text-white">Sign in to Needs Connect</h3>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-slate-300">
                      Username
                    </label>
                    <div className="relative group">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin for manager, anything else for helper"
                        className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent transition"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5 group-hover:border-primary/40 transition" />
                    </div>
                    <p className="text-xs text-slate-400">
                      Needs Connect tailors your experience instantly based on your role.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-3 rounded-xl shadow-glow hover:bg-primary/90 transition duration-200"
                  >
                    Enter Workspace
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span className="h-px flex-1 bg-white/5" />
                    Why teams switch to Needs Connect
                    <span className="h-px flex-1 bg-white/5" />
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      Granular control for managers & helpers
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      Real-time impact dashboards & funding insights
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Unified volunteer coordination workflow
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;

