import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";
import StatusBadge from "../components/Badge";

const STATUSES = [
  { value: "", label: "All" },
  { value: 0,  label: "Open" },
  { value: 1,  label: "Closed" },
  { value: 9,  label: "Voided" },
];

export default function Tickets() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({ status: "" });
  const [selected, setSelected] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(null); // "assign" | "void" | "notify"
  const [input, setInput] = useState("");

  const load = () => {
    const q = {};
    if (filter.status !== "") q.status = filter.status;
    api.tickets(q).then(setRows).catch(console.error);
  };

  useEffect(() => { load(); }, [filter]);
  useEffect(() => { api.contacts().then(setContacts).catch(console.error); }, []);

  const cols = [
    { key: "tkt_id",       label: "ID"        },
    { key: "clt_name",     label: "Client"    },
    { key: "eqp_alias",    label: "Equipment" },
    { key: "tkt_shrt_desc",label: "Issue"     },
    { key: "assigned_name",label: "Assigned"  },
    { key: "tkt_date",     label: "Date",     render: r => r.tkt_date?.slice(0,10) },
    { key: "tkt_status",   label: "Status",   render: r => <StatusBadge status={r.tkt_status} /> },
  ];

  const doAction = async () => {
    if (modal === "assign")  { await api.assignTicket(selected.tkt_id, input); }
    if (modal === "void")    { await api.voidTicket(selected.tkt_id, input); }
    if (modal === "notify")  { await api.notifyTicket(selected.tkt_id, input, ""); }
    setModal(null); setInput(""); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Tickets</h2>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s.value} onClick={() => setFilter({ status: s.value })}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${filter.status === s.value ? "bg-blue-700 text-white border-blue-700" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Table cols={cols} rows={rows} onRow={r => setSelected(r)} />

      {selected && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-blue-800">#{selected.tkt_id} — {selected.clt_name}</span>
          <button onClick={() => setModal("assign")} className="px-3 py-1 text-xs bg-blue-700 text-white rounded hover:bg-blue-800">Assign</button>
          <button onClick={() => setModal("notify")} className="px-3 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700">Notify engineer</button>
          {selected.tkt_status === 0 && <button onClick={() => setModal("void")} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Void</button>}
          <button onClick={() => setSelected(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-sm">✕</button>
        </div>
      )}

      {modal && (
        <Modal title={modal === "assign" ? "Assign Ticket" : modal === "void" ? "Void Ticket" : "Send Notification"} onClose={() => setModal(null)}>
          {modal === "assign" || modal === "notify" ? (
            <select value={input} onChange={e => setInput(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
              <option value="">— select engineer —</option>
              {contacts.map(c => <option key={c.cnt_id} value={c.cnt_id}>{c.name}</option>)}
            </select>
          ) : (
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Reason for voiding..."
              className="w-full border rounded px-3 py-2 text-sm" />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setModal(null)} className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={doAction} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
