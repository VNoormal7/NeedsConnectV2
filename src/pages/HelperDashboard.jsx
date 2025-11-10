import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Home, TrendingUp, Users, LogOut, ShoppingCart, HeartHandshake, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [basketCount, setBasketCount] = useState(0);

  const navItems = [
    {
      to: '/helper',
      label: 'Browse',
      description: 'Discover live needs',
      icon: Home,
      exact: true,
    },
    {
      to: '/helper/impact',
      label: 'Impact',
      description: 'Visualize funding',
      icon: TrendingUp,
    },
    {
      to: '/volunteers',
      label: 'Volunteers',
      description: 'Coordinate people power',
      icon: Users,
    },
  ];

  useEffect(() => {
    const basket = storage.get('basket', []);
    setBasketCount(basket.length);
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedBasket = storage.get('basket', []);
      setBasketCount(updatedBasket.length);
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    storage.remove('currentUser');
    navigate('/login');
  };

  const user = storage.get('currentUser');

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-hero-gradient opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.15),transparent_50%)]" />

      <div className="relative z-10">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between h-20">
              <Link to="/helper" className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shadow-glow transition group-hover:bg-primary/25">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Needs Connect</p>
                  <h1 className="text-xl font-semibold text-white">Helper Workspace</h1>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-6">
                {navItems.map(({ to, label, description, icon: Icon, exact }) => {
                  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`relative group px-4 py-3 rounded-2xl border transition backdrop-blur-md ${
                        isActive
                          ? 'border-primary/60 bg-primary/15 shadow-glow'
                          : 'border-white/5 bg-white/5 hover:border-primary/40 hover:bg-primary/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-300 group-hover:text-primary'}`} />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold leading-none">{label}</span>
                          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 mt-1">{description}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/helper/basket"
                  className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 bg-white/5 hover:border-primary/40 hover:bg-primary/10 transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Basket</span>
                  {basketCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-[11px] font-semibold text-accent-foreground flex items-center justify-center">
                      {basketCount}
                    </span>
                  )}
                </Link>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Helper</span>
                  <span className="text-sm font-semibold">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-danger/40 hover:bg-danger/20 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
              <span className="h-px flex-1 bg-white/5" />
              Live helper cockpit • Empower impact • Act with speed
              <span className="h-px flex-1 bg-white/5" />
            </div>
            <div className="mt-6 glass-panel p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">Champion the initiatives that matter most today.</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Needs Connect continuously ranks urgent needs, tracks progress, and spotlights volunteer opportunities so you can create momentum where it counts.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/10 px-4 py-3 text-sm text-slate-300">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Real-time priority recalculation
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/10 px-4 py-3 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-primary" />
                    Volunteer coordination hub
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelperDashboard;

