import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalUsers: 0,
    pendingTasks: 0
  });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data.tasks || []);
      
      // Calculate stats
      const completed = data.tasks.filter(task => task.status === 'COMPLETED').length;
      const pending = data.tasks.filter(task => task.status !== 'COMPLETED').length;
      setStats(prev => ({
        ...prev,
        totalTasks: data.tasks.length,
        completedTasks: completed,
        pendingTasks: pending
      }));
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data || []);
      setStats(prev => ({ ...prev, totalUsers: data.length }));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">TaskFlow Admin</a>
        </div>
        <div className="flex-none">
          <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
        </div>
      </div>

      <div className="drawer lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="stat bg-primary text-primary-content rounded-box">
                    <div className="stat-title text-primary-content opacity-80">Total Tasks</div>
                    <div className="stat-value">{stats.totalTasks}</div>
                  </div>
                  <div className="stat bg-success text-success-content rounded-box">
                    <div className="stat-title text-success-content opacity-80">Completed Tasks</div>
                    <div className="stat-value">{stats.completedTasks}</div>
                  </div>
                  <div className="stat bg-warning text-warning-content rounded-box">
                    <div className="stat-title text-warning-content opacity-80">Pending Tasks</div>
                    <div className="stat-value">{stats.pendingTasks}</div>
                  </div>
                  <div className="stat bg-secondary text-secondary-content rounded-box">
                    <div className="stat-title text-secondary-content opacity-80">Total Users</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-base-100 rounded-box p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4">Recent Tasks</h2>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Created By</th>
                          <th>Assigned To</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.slice(0, 5).map(task => (
                          <tr key={task._id}>
                            <td>{task.title}</td>
                            <td>
                              <span className={`badge ${
                                task.status === 'COMPLETED' ? 'badge-success' :
                                task.status === 'IN-PROGRESS' ? 'badge-warning' :
                                'badge-ghost'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td>{task.createdBy?.email || 'N/A'}</td>
                            <td>{task.assignedTo?.email || 'Unassigned'}</td>
                            <td>
                              <Link 
                                to={`/tasks/${task._id}`}
                                className="btn btn-xs btn-primary"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* User Stats */}
                <div className="bg-base-100 rounded-box p-6">
                  <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 5).map(user => (
                          <tr key={user._id}>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${
                                user.role === 'admin' ? 'badge-primary' :
                                user.role === 'moderator' ? 'badge-secondary' :
                                'badge-ghost'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-xs btn-ghost">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 h-full bg-base-100 text-base-content">
            <li className="mb-2">
              <a 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Overview
              </a>
            </li>
            <li className="mb-2">
              <Link to="/admin/tasks">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Manage Tasks
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/users">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Manage Users
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}