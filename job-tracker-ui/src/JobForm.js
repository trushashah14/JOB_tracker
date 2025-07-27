import { useState } from "react";
import axios from "axios";

export default function JobForm({ onAdd }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");   // ⬅️ New state for error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/applications`, { company, role });
      onAdd(); // refresh list
      setCompany("");
      setRole("");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.detail); // ⬅️ Show duplicate error
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded shadow">
      <input
        className="border p-2 w-full"
        placeholder="Company"
        value={company}
        onChange={e => setCompany(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Role"
        value={role}
        onChange={e => setRole(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Job</button>

      {error && (
        <div className="text-red-600 font-semibold mt-2">
          🚫 {error}
        </div>
      )}
    </form>
  );
}