import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tasks() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      console.log("Fetched tasks:", data);
      if (Array.isArray(data)) {
        // Handle the case where backend returns array directly
        setTasks(data);
      } else {
        // Handle the case where backend returns {tasks: [...]}
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      alert("Failed to load tasks. Please try refreshing the page.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting task:", form);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTasks(); // Refresh list
      } else {
        alert(data.message || "Tasks creation failed");
      }
    } catch (err) {
      alert("Error creating tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Header with user info and logout */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Create Task</h2>
          {user && (
            <p className="text-sm opacity-75">
              Logged in as: {user.email}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-error btn-sm"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Task"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link
            key={task._id}
            className="card shadow-md p-4 bg-gray-800"
            to={`/tasks/${task._id}`}
          >
            <h3 className="font-bold text-lg">{task.title}</h3>
            <p className="text-sm">{task.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {new Date(task.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
        {tasks.length === 0 && <p>No tasks submitted yet.</p>}
      </div>
    </div>
  );
}