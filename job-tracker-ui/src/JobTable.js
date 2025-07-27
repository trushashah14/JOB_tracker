import { useEffect, useState } from "react";
import axios from "axios";

export default function JobTable({ refresh }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/applications").then(res => setJobs(res.data));
  }, [refresh]);

  return (
    <table className="w-full mt-4 table-auto border">
      <thead>
        <tr>
          <th className="border p-2">Company</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Applied</th>
          <th className="border p-2">Status</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}