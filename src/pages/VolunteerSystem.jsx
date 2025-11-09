import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Plus, UserPlus, Calendar, MapPin, Users, ArrowLeft, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link
                to={isHelper ? '/helper' : '/admin'}
                className="flex items-center text-gray-700 hover:text-indigo-600 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-indigo-600">Volunteer System</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Volunteer Management</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Post Task
            </button>
            <button
              onClick={() => setShowVolunteerModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Register Volunteer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Volunteer Tasks</h3>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks posted yet</p>
                </div>
              ) : (
                tasks.map(task => {
                  const registeredCount = (task.registeredVolunteers || []).length;
                  const isRegistered = (task.registeredVolunteers || []).some(
                    v => v.username === user?.username
                  );
                  
                  return (
                    <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h4>
                      <p className="text-gray-600 mb-4">{task.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {task.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(task.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {registeredCount} / {task.requiredVolunteers} volunteers
                        </div>
                      </div>

                      {isHelper && !isRegistered && registeredCount < task.requiredVolunteers && (
                        <button
                          onClick={() => handleRegisterForTask(task.id)}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                          Register for Task
                        </button>
                      )}
                      
                      {isHelper && isRegistered && (
                        <div className="w-full bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                          Registered
                        </div>
                      )}

                      {registeredCount >= task.requiredVolunteers && (
                        <div className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-center font-medium">
                          Full
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Registered Volunteers</h3>
            <div className="space-y-4">
              {volunteers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No volunteers registered yet</p>
                </div>
              ) : (
                volunteers.map(volunteer => (
                  <div key={volunteer.id} className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{volunteer.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Email:</strong> {volunteer.email}</p>
                      {volunteer.phone && <p><strong>Phone:</strong> {volunteer.phone}</p>}
                      {volunteer.skills && <p><strong>Skills:</strong> {volunteer.skills}</p>}
                      <p className="text-xs text-gray-400 mt-2">
                        Registered: {new Date(volunteer.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Post Volunteer Task</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={taskForm.location}
                    onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={taskForm.date}
                    onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Volunteers</label>
                  <input
                    type="number"
                    min="1"
                    value={taskForm.requiredVolunteers}
                    onChange={(e) => setTaskForm({ ...taskForm, requiredVolunteers: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Post Task
                </button>
              </div>
            </div>
          </div>
        )}

        {showVolunteerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Register Volunteer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={volunteerForm.phone}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <input
                    type="text"
                    value={volunteerForm.skills}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                    placeholder="e.g., Teaching, Medical, Construction"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowVolunteerModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterVolunteer}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VolunteerSystem;

