import { useState } from "react";
import AuthForm from "./AuthForm";
import JobForm from "./JobForm";
import JobTable from "./JobTable";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (id, userEmail, name) => {
    setUserId(id);
    setEmail(userEmail);
    setUsername(name);
  };

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <AuthForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            setUserId(null);
            setEmail("");
            setUsername("");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        Welcome, {username} to your Job Tracker👋
      </h1>
      <JobForm onAdd={triggerRefresh} userId={userId} />
      <JobTable refresh={refreshKey} userId={userId} />
    </div>
  );
}
