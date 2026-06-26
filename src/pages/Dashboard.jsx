import { useEffect, useState } from "react";
import { api } from "../api/client";
import Card from "../components/Card";

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.dashboard().then(setData).catch(console.error); }, []);
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Dashboard</h2>
      {!data ? (
        <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card title="Open Tickets"     value={data.openTickets}      color="blue"  />
          <Card title="Unassigned"       value={data.unassigned}       color="amber" sub="need assignment" />
          <Card title="Notifications"    value={data.notifications}    color="red"   sub="pending replies" />
          <Card title="Active Engineers" value={data.activeEngineers}  color="teal"  />
          <Card title="Reports (30d)"    value={data.reportsThisMonth} color="green" />
        </div>
      )}
    </div>
  );
}
