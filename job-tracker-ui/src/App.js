import JobForm from "./JobForm";
import JobTable from "./JobTable";
import { useState } from "react";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📝 My Job Tracker</h1>
      <JobForm onAdd={() => setRefresh(!refresh)} />
      <JobTable refresh={refresh} />
    </div>
  );
}

export default App;