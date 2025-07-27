import { useEffect, useState } from "react";
import axios from "axios";

export default function JobTable({ refresh, userId  }) {
  const [jobs, setJobs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
  
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/applications`, {
      params: { user_id: userId }
    }).then(res => setJobs(res.data));
  }, [refresh, userId]);

  const handleDelete = async (jobId) => {
    setLoadingId(jobId);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/applications/${jobId}`);
      setJobs(prev => prev.filter(job => job.id !== jobId)); // 💥 local update
    } catch (err) {
      console.error("Failed to delete job", err);
      // optionally show an error message here
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <table className="w-full mt-4 table-auto border">
      <thead>
        <tr>
          <th className="border p-2">Company</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Applied</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, i) => (
          <tr key={i}>
            <td className="border p-2">{job.company}</td>
            <td className="border p-2">{job.role}</td>
            <td className="border p-2">{job.date_applied}</td>
            <td className="border p-2">
              <span className={`px-2 py-1 rounded ${job.status === "Waiting" ? "bg-yellow-200" : "bg-green-200"}`}>
                {job.status}
              </span>
            </td>
            <td className="border p-2 text-center">
              <button
                onClick={() => handleDelete(job.id)}
                className="text-red-600 hover:text-red-800"
                disabled={loadingId === job.id}
              >
                {loadingId === job.id ? "Deleting..." : "🗑️"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}