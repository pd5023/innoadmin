import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Layout      from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Login       from "./pages/Login";
import Dashboard   from "./pages/Dashboard";
import Tickets     from "./pages/Tickets";
import Equipment   from "./pages/Equipment";
import Clients     from "./pages/Clients";
import Employees   from "./pages/Employees";
import Parts       from "./pages/Parts";
import Reports     from "./pages/Reports";

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index          element={<Dashboard />} />
        <Route path="tickets"   element={<Tickets />}   />
        <Route path="equipment" element={<Equipment />} />
        <Route path="clients"   element={<Clients />}   />
        <Route path="employees" element={<Employees />} />
        <Route path="parts"     element={<Parts />}     />
        <Route path="reports"   element={<Reports />}   />
      </Route>
    </Routes>
  );
}