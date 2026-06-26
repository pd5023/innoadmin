import { Routes, Route } from "react-router-dom";
import Layout    from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tickets   from "./pages/Tickets";
import Equipment from "./pages/Equipment";
import Clients   from "./pages/Clients";
import Contacts  from "./pages/Contacts";
import Parts     from "./pages/Parts";
import Reports   from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index          element={<Dashboard />} />
        <Route path="tickets" element={<Tickets />}   />
        <Route path="equipment" element={<Equipment />} />
        <Route path="clients"   element={<Clients />}   />
        <Route path="contacts"  element={<Contacts />}  />
        <Route path="parts"     element={<Parts />}     />
        <Route path="reports"   element={<Reports />}   />
      </Route>
    </Routes>
  );
}
