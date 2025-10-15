import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTask(data.task);
        } else {
          alert(data.message || "Failed to fetch task");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading task details...</div>;
  if (!task) return <div className="text-center mt-10">Task not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Task Details</h2>

      <div className="card bg-gray-800 shadow p-4 space-y-4">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <p>{task.description}</p>
        
        {task.priority && (
          <div className="badge badge-accent">{task.priority}</div>
        )}
        
        {task.status && (
          <div className="badge badge-primary">{task.status}</div>
        )}

        {task.helpfulNotes && (
          <div className="mt-4">
            <h4 className="font-semibold">Helpful Notes:</h4>
            <p className="text-gray-300">{task.helpfulNotes}</p>
          </div>
        )}

        {task.relatedSkills && task.relatedSkills.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Related Skills:</h4>
            <div className="flex gap-2 flex-wrap">
              {task.relatedSkills.map((skill, index) => (
                <div key={index} className="badge badge-secondary">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditionally render extended details */}
        {task.status && (
          <>
            <div className="divider">Metadata</div>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            {task.priority && (
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
            )}

            {task.relatedSkills?.length > 0 && (
              <p>
                <strong>Related Skills:</strong>{" "}
                {task.relatedSkills.join(", ")}
              </p>
            )}

            {task.helpfulNotes && (
              <div>
                <strong>Helpful Notes:</strong>
                <div className="prose max-w-none rounded mt-2">
                  <ReactMarkdown>{task.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}

            {task.assignedTo && (
              <p>
                <strong>Assigned To:</strong> {task.assignedTo?.email}
              </p>
            )}

            {task.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Created At: {new Date(task.createdAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}