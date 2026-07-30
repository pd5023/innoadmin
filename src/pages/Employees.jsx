import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";
import PasswordField from "../components/PasswordField";

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [titles, setTitles] = useState([]);
  const [form, setForm] = useState(null);
  const [pwForm, setPwForm] = useState(null);
  const [newPw, setNewPw] = useState("");

  const load = () => api.employees().then(setRows);
  useEffect(() => { load(); }, []);
  useEffect(() => { api.modalities().then(setModalities); }, []);
  useEffect(() => { api.emplRoles().then(setTitles); }, []);

  const selectedModals = (form?.empl_modals || "").split(",").filter(Boolean).map(Number);
  const toggleModal = (modId) => {
    const updated = selectedModals.includes(modId)
      ? selectedModals.filter(id => id !== modId)
      : [...selectedModals, modId];
    setForm({ ...form, empl_modals: updated.join(",") });
  };

  const save = async () => {
    if (form.empl_id) await api.updateEmployee(form.empl_id, form);
    else               await api.createEmployee(form);
    setForm(null); load();
  };

  const cols = [
    { key: "empl_id",       label: "ID" },
    { key: "empl_name",     label: "Name" },
    { key: "empl_username", label: "Username" },
    { key: "title_name",    label: "Title" },
    { key: "tier_name",     label: "Tier", render: r => r.tier_name || "—" },
    { key: "empl_email",    label: "Email" },
    { key: "empl_phone",    label: "Phone" },
    { key: "empl_isActive", label: "Active", render: r => r.empl_isActive ? "✓" : "—" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
        <button onClick={() => setForm({ empl_name: "", empl_username: "", empl_email: "", empl_phone: "", empl_titleId: "", empl_isActive: true, password: "Password1" })}
          className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New employee</button>
      </div>
      <Table cols={cols} rows={rows} onRow={r => setForm({ ...r })} />

      {form && (
        <Modal title={form.empl_id ? "Edit Employee" : "New Employee"} onClose={() => setForm(null)}>
          <div className="grid grid-cols-2 gap-3">
            {[["empl_name", "Name"], ["empl_username", "Username"], ["empl_email", "Email"], ["empl_phone", "Phone"]].map(([k, l]) => (
              <div key={k} className={k === "empl_name" || k === "empl_email" ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <select value={form.empl_titleId || ""} onChange={e => setForm({ ...form, empl_titleId: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm">
                <option value="" disabled>— select title —</option>
                {titles.map(t => <option key={t.role_id} value={t.role_id}>{t.role_name}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">The permission tier for each title is set on the Auth Grid screen.</p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Modalities</label>
              <div className="flex flex-wrap gap-3 border rounded px-3 py-2">
                {modalities.map(m => (
                  <label key={m.mod_id} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" checked={selectedModals.includes(m.mod_id)} onChange={() => toggleModal(m.mod_id)} />
                    {m.mod_name}
                  </label>
                ))}
                {modalities.length === 0 && <span className="text-sm text-gray-400">No modalities defined yet.</span>}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="empl_isActive" checked={form.empl_isActive !== false} onChange={e => setForm({ ...form, empl_isActive: e.target.checked })} />
              <label htmlFor="empl_isActive" className="text-sm text-gray-600">Active</label>
            </div>
            {!form.empl_id && (
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Initial password</label>
                <PasswordField value={form.password || ""} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            {form.empl_id && <button onClick={() => { setPwForm(form); setForm(null); }} className="text-xs text-blue-600 hover:underline">Reset password</button>}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={save} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {pwForm && (
        <Modal title={`Reset password — ${pwForm.empl_name}`} onClose={() => setPwForm(null)}>
          <PasswordField value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password" className="w-full border rounded px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setPwForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={async () => { await api.resetPassword(pwForm.empl_id, newPw); setPwForm(null); setNewPw(""); }} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Reset</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
