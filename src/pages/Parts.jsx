import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";

const STATUSES = ["","Ordered","Received","Returned","Cancelled"];

export default function Parts() {
  const [rows, setRows]   = useState([]);
  const [filter, setFlt]  = useState("");
  const [form, setForm]   = useState(null);
  const load = () => api.parts(filter ? { status: filter } : {}).then(setRows);
  useEffect(() => { load(); }, [filter]);

  const save = async () => {
    await api.updatePartStatus(form.part_id, form.order_status, form.o_desc, form.o_number, form.o_qty);
    setForm(null); load();
  };

  const cols = [
    { key:"part_id",      label:"ID"        },
    { key:"clt_name",     label:"Client"    },
    { key:"eqp_alias",    label:"Equipment" },
    { key:"part_desc",    label:"Description"},
    { key:"part_numb",    label:"Part #"    },
    { key:"part_qty",     label:"Qty"       },
    { key:"order_status", label:"Status",   render: r => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.order_status==="Received"?"bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800"}`}>{r.order_status}</span> },
    { key:"date_req",     label:"Requested", render: r => r.date_req?.slice(0,10) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Part Orders</h2>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFlt(s)}
              className={`px-3 py-1 text-sm rounded-full border ${filter===s?"bg-blue-700 text-white border-blue-700":"border-gray-300 text-gray-600 hover:border-blue-400"}`}>
              {s||"All"}
            </button>
          ))}
        </div>
      </div>
      <Table cols={cols} rows={rows} onRow={r => setForm({...r})} />
      {form && (
        <Modal title="Update Part Order" onClose={() => setForm(null)}>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select value={form.order_status||""} onChange={e => setForm({...form,order_status:e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
              {["Ordered","Received","Returned","Cancelled"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {[["o_desc","Ordered description"],["o_number","Ordered part #"],["o_qty","Ordered qty"]].map(([k,l]) => (
            <div key={k} className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
              <input value={form[k]||""} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={save} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
