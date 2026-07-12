import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";

export default function Contacts() {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState(null);
  const [pwForm, setPwForm] = useState(null);
  const [newPw, setNewPw] = useState("");

  const load = () => api.contacts(filter || undefined).then(setRows);
  useEffect(() => { load(); }, [filter]);
  useEffect(() => { api.clients().then(setClients); }, []);

  const save = async () => {
    if (form.cnt_id) await api.updateContact(form.cnt_id, form);
    else             await api.createContact(form);
    setForm(null); load();
  };

  const ROLES = ['admin', 'staff', 'client'];

  const cols = [
    { key:"cnt_id",    label:"ID" },
    { key:"name",      label:"Name" },
    { key:"username",  label:"Username" },
    { key:"clt_name",  label:"Client" },
    { key:"zone_name", label:"Zone" },
    { key:"cnt_role",  label:"Role" },
    { key:"email",     label:"Email" },
    { key:"is_active", label:"Active", render: r => r.is_active ? "✓" : "—" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Engineers</h2>
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-1 text-sm text-gray-600">
            <option value="">All clients</option>
            {clients.map(c => <option key={c.clt_id} value={c.clt_id}>{c.clt_name}</option>)}
          </select>
          <button onClick={() => setForm({ name:"", username:"", email:"", phone:"", mobile:"", clt_id:"", cat_id:1, zone_id:1, cnt_role:"staff", password:"Password1" })}
            className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New engineer</button>
        </div>
      </div>
      <Table cols={cols} rows={rows} onRow={r => setForm({...r})} />

      {form && (
        <Modal title={form.cnt_id ? "Edit Engineer" : "New Engineer"} onClose={() => setForm(null)}>
          <div className="grid grid-cols-2 gap-3">
            {[["name","Name"],["username","Username"],["email","Email"],["phone","Phone"],["mobile","Mobile"]].map(([k,l]) => (
              <div key={k} className={k==="name"||k==="email" ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={form[k]||""} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Role(s) — comma-separated (admin, staff, client)</label>
              <div className="flex gap-3">
                {ROLES.map(role => (
                  <label key={role} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox"
                      checked={(form.cnt_role||'').split(',').map(s=>s.trim()).includes(role)}
                      onChange={e => {
                        const current = (form.cnt_role||'').split(',').map(s=>s.trim()).filter(Boolean);
                        const updated = e.target.checked ? [...new Set([...current, role])] : current.filter(r=>r!==role);
                        setForm({...form, cnt_role: updated.join(',')});
                      }}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
            {!form.cnt_id && (
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Initial password</label>
                <input type="password" value={form.password||""} onChange={e => setForm({...form,password:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            {form.cnt_id && <button onClick={() => { setPwForm(form); setForm(null); }} className="text-xs text-blue-600 hover:underline">Reset password</button>}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={save} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {pwForm && (
        <Modal title={`Reset password — ${pwForm.name}`} onClose={() => setPwForm(null)}>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password" className="w-full border rounded px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setPwForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={async () => { await api.resetPassword(pwForm.cnt_id, newPw); setPwForm(null); setNewPw(""); }} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Reset</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
