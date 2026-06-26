import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

const nav = [
  { to: "/",           icon: "⊞",  label: "Dashboard"  },
  { to: "/tickets",    icon: "🎫", label: "Tickets"     },
  { to: "/equipment",  icon: "🔧", label: "Equipment"   },
  { to: "/clients",    icon: "🏥", label: "Clients"     },
  { to: "/contacts",   icon: "👤", label: "Engineers"   },
  { to: "/parts",      icon: "📦", label: "Parts"       },
  { to: "/reports",    icon: "📄", label: "Reports"     },
];

export default function Layout() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className={`${open ? "w-52" : "w-14"} bg-blue-700 text-white flex flex-col transition-all duration-200`}>
        <div className="flex items-center justify-between px-3 py-4 bg-blue-800">
          {open && <span className="font-bold text-lg tracking-wide">InnoAdmin</span>}
          <button onClick={() => setOpen(!open)} className="text-white/70 hover:text-white text-xl leading-none">
            {open ? "‹" : "›"}
          </button>
        </div>
        <nav className="flex-1 py-2">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-blue-900 text-white font-medium" : "text-blue-100 hover:bg-blue-600"
                }`
              }
            >
              <span className="text-base w-5 text-center shrink-0">{n.icon}</span>
              {open && <span>{n.label}</span>}
            </NavLink>
          ))}
        </nav>
        {open && (
          <div className="px-3 py-3 text-blue-300 text-xs border-t border-blue-600">
            InnoWebSrv @ localhost:3000
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
          <h1 className="text-gray-700 font-medium text-sm">InnoSpecs Admin</h1>
          <span className="text-xs text-gray-400">v1.0.0</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
