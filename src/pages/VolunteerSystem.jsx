import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import {
  Plus,
  UserPlus,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  LogOut,
  Sparkles,
  HandHeart,
  ClipboardCheck,
  Award
} from 'lucide-react';

const VolunteerSystem = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    requiredVolunteers: 1
  });
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    skills: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks = storage.get('tasks', []);
    const allVolunteers = storage.get('volunteers', []);
    setTasks(allTasks);
    setVolunteers(allVolunteers);
  };

  const handleLogout = () => {
    storage.remove('currentUser');
    navigate('/login');
  };

  const handleCreateTask = () => {
    if (!taskForm.title || !taskForm.description || !taskForm.location || !taskForm.date) {
      alert('Please fill in all required fields');
      return;
    }

    const allTasks = storage.get('tasks', []);
    const newTask = {
      id: Math.max(...allTasks.map(t => t.id || 0), 0) + 1,
      ...taskForm,
      registeredVolunteers: [],
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...allTasks, newTask];
    storage.set('tasks', updatedTasks);
    setTasks(updatedTasks);
    setShowTaskModal(false);
    setTaskForm({
      title: '',
      description: '',
      location: '',
      date: '',
      requiredVolunteers: 1
    });
  };

  const handleRegisterVolunteer = () => {
    if (!volunteerForm.name || !volunteerForm.email) {
      alert('Please fill in name and email');
      return;
    }

    const allVolunteers = storage.get('volunteers', []);
    const newVolunteer = {
      id: Math.max(...allVolunteers.map(v => v.id || 0), 0) + 1,
      ...volunteerForm,
      registeredAt: new Date().toISOString()
    };
    
    const updatedVolunteers = [...allVolunteers, newVolunteer];
    storage.set('volunteers', updatedVolunteers);
    setVolunteers(updatedVolunteers);
    setShowVolunteerModal(false);
    setVolunteerForm({
      name: '',
      email: '',
      phone: '',
      skills: ''
    });
  };

  const handleRegisterForTask = (taskId) => {
    const user = storage.get('currentUser');
    if (!user) return;

    const allTasks = storage.get('tasks', []);
    const updatedTasks = allTasks.map(task => {
      if (task.id === taskId) {
        const registered = task.registeredVolunteers || [];
        if (!registered.find(v => v.username === user.username)) {
          return {
            ...task,
            registeredVolunteers: [...registered, { username: user.username, registeredAt: new Date().toISOString() }]
          };
        }
      }
      return task;
    });
    
    storage.set('tasks', updatedTasks);
    setTasks(updatedTasks);
  };

  const user = storage.get('currentUser');
  const isHelper = user?.role === 'helper';

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-hero-gradient opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.2),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_5%,rgba(79,70,229,0.25),transparent_60%)]" />

      <div className="relative z-10">
        <nav className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <Link
                  to={isHelper ? '/helper' : '/admin'}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-primary/50 hover:bg-primary/20 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to dashboard
                </Link>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center shadow-glow">
                    <HandHeart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Needs Connect</p>
                    <h1 className="text-xl font-semibold text-white">Volunteer Orchestration</h1>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-danger/40 hover:bg-danger/25 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
          <section className="glass-panel border border-white/5 p-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.35em] text-slate-300">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Volunteer Pulse
                </span>
                <h2 className="text-3xl font-semibold text-white leading-tight">
                  Mobilize community power with clear roles, coordinated scheduling, and rapid sign-ups.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Needs Connect synchronizes every task, volunteer skillset, and capacity limit so teams arrive prepared and impact accelerates.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/60 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary shadow-glow hover:bg-primary/30 transition"
                >
                  <Plus className="w-5 h-5" />
                  Post new task
                </button>
                <button
                  onClick={() => setShowVolunteerModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/60 bg-emerald-400/15 px-6 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/25 transition"
                >
                  <UserPlus className="w-5 h-5" />
                  Register volunteer
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Open Tasks
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{tasks.length}</p>
              <p className="text-sm text-slate-400 mt-2">Active missions requesting volunteers.</p>
            </div>
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Registered Volunteers
                <Users className="w-5 h-5 text-emerald-300" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{volunteers.length}</p>
              <p className="text-sm text-slate-400 mt-2">People ready to contribute skills.</p>
            </div>
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Fill Rate
                <Award className="w-5 h-5 text-accent" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">
                {tasks.length
                  ? Math.round(
                      (tasks.reduce((sum, t) => sum + (t.registeredVolunteers?.length || 0), 0) /
                        tasks.reduce((sum, t) => sum + t.requiredVolunteers, 0)) *
                        100,
                    )
                  : 0}%
              </p>
              <p className="text-sm text-slate-400 mt-2">Average capacity secured per task.</p>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white">Volunteer Tasks</h3>
              <div className="space-y-5">
                {tasks.length === 0 ? (
                  <div className="glass-panel border border-white/5 p-12 text-center">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">No tasks posted yet. Launch one to mobilize your community.</p>
                  </div>
                ) : (
                  tasks.map(task => {
                    const registeredCount = (task.registeredVolunteers || []).length;
                    const isRegistered = (task.registeredVolunteers || []).some(
                      v => v.username === user?.username
                    );

                    return (
                      <article key={task.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70 backdrop-blur-xl shadow-card">
                        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
                        <div className="relative p-6 space-y-5">
                          <header className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.35em] text-slate-300">
                              <Sparkles className="w-3 h-3 text-accent" />
                              {task.location}
                            </div>
                            <h4 className="text-2xl font-semibold text-white">{task.title}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
                          </header>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/10 px-4 py-3">
                              <Calendar className="w-4 h-4 text-primary" />
                              {new Date(task.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/10 px-4 py-3">
                              <Users className="w-4 h-4 text-emerald-300" />
                              {registeredCount} / {task.requiredVolunteers} volunteers
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            {isHelper && !isRegistered && registeredCount < task.requiredVolunteers && (
                              <button
                                onClick={() => handleRegisterForTask(task.id)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold shadow-glow hover:bg-primary/90 transition"
                              >
                                Join this mission
                              </button>
                            )}
                            {isHelper && isRegistered && (
                              <div className="flex-1 rounded-xl border border-emerald-400/60 bg-emerald-400/15 px-4 py-3 text-center text-sm font-semibold text-emerald-200">
                                You're confirmed for this task
                              </div>
                            )}
                            {registeredCount >= task.requiredVolunteers && !isRegistered && (
                              <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-slate-300">
                                Capacity reached
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white">Registered Volunteers</h3>
              <div className="space-y-5">
                {volunteers.length === 0 ? (
                  <div className="glass-panel border border-white/5 p-12 text-center">
                    <UserPlus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">No volunteers registered yet. Invite your first wave of helpers.</p>
                  </div>
                ) : (
                  volunteers.map(volunteer => (
                    <article key={volunteer.id} className="rounded-2xl border border-white/5 bg-slate-900/70 backdrop-blur-xl p-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-semibold text-white">{volunteer.name}</h4>
                        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                          Joined {new Date(volunteer.registeredAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                        <p className="rounded-xl border border-white/5 bg-white/5 px-4 py-3"><strong className="text-slate-200">Email:</strong> {volunteer.email}</p>
                        {volunteer.phone && (
                          <p className="rounded-xl border border-white/5 bg-white/5 px-4 py-3"><strong className="text-slate-200">Phone:</strong> {volunteer.phone}</p>
                        )}
                        {volunteer.skills && (
                          <p className="sm:col-span-2 rounded-xl border border-white/5 bg-white/5 px-4 py-3"><strong className="text-slate-200">Skills:</strong> {volunteer.skills}</p>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          {showTaskModal && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setShowTaskModal(false)} />
              <div className="relative gradient-border max-w-lg w-full mx-4">
                <div className="glass-panel rounded-[1.4rem] p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Post Volunteer Task</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                      <textarea
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        rows="3"
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Location</label>
                        <input
                          type="text"
                          value={taskForm.location}
                          onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Date</label>
                        <input
                          type="date"
                          value={taskForm.date}
                          onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Required Volunteers</label>
                      <input
                        type="number"
                        min="1"
                        value={taskForm.requiredVolunteers}
                        onChange={(e) => setTaskForm({ ...taskForm, requiredVolunteers: parseInt(e.target.value, 10) })}
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowTaskModal(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:border-danger/40 hover:bg-danger/20 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTask}
                      className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold shadow-glow hover:bg-primary/90 transition"
                    >
                      Post task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showVolunteerModal && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setShowVolunteerModal(false)} />
              <div className="relative gradient-border max-w-lg w-full mx-4">
                <div className="glass-panel rounded-[1.4rem] p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Register Volunteer</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Name</label>
                      <input
                        type="text"
                        value={volunteerForm.name}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Email</label>
                      <input
                        type="email"
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Phone</label>
                        <input
                          type="tel"
                          value={volunteerForm.phone}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Skills</label>
                        <input
                          type="text"
                          value={volunteerForm.skills}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                          placeholder="Teaching, Medical, Logistics..."
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowVolunteerModal(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:border-danger/40 hover:bg-danger/20 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRegisterVolunteer}
                      className="flex-1 rounded-xl bg-emerald-400/90 text-slate-950 px-4 py-3 text-sm font-semibold hover:bg-emerald-300 transition"
                    >
                      Register volunteer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VolunteerSystem;

