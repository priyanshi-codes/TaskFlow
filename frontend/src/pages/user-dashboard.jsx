import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const tasks = data.tasks || [];
      setTasks(tasks);

      // Calculate stats
      setStats({
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        inProgress: tasks.filter(t => t.status === 'IN-PROGRESS').length,
        todo: tasks.filter(t => t.status === 'TODO').length
      });
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: '', description: '' });
        fetchTasks();
      } else {
        alert(data.message || 'Failed to create task');
      }
    } catch (err) {
      alert('Error creating task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getStatusColor = (status) => {
    const colors = {
      'TODO': 'badge-warning',
      'IN-PROGRESS': 'badge-info',
      'COMPLETED': 'badge-success'
    };
    return colors[status] || 'badge-ghost';
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">TaskFlow</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat bg-success/10 shadow rounded-lg">
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{stats.completed}</div>
          </div>
          <div className="stat bg-info/10 shadow rounded-lg">
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-info">{stats.inProgress}</div>
          </div>
          <div className="stat bg-warning/10 shadow rounded-lg">
            <div className="stat-title">Todo</div>
            <div className="stat-value text-warning">{stats.todo}</div>
          </div>
        </div>

        {/* Create Task Card */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={form.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={form.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-24"
                required
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h3 className="card-title">{task.title}</h3>
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                
                <p className="mt-2 line-clamp-2">{task.description}</p>

                {task.helpfulNotes && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-1">AI Notes:</p>
                    <p className="text-sm bg-base-200 p-2 rounded line-clamp-2">{task.helpfulNotes}</p>
                  </div>
                )}

                {task.relatedSkills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-1">Skills:</p>
                    <div className="flex gap-1 flex-wrap">
                      {task.relatedSkills.map((skill, index) => (
                        <span key={index} className="badge badge-secondary badge-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
                  <Link to={`/tasks/${task._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}