import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";

export default function Equipment() {
  const [rows, setRows]       = useState([]);
  const [clients, setClients] = useState([]);
  const [depts, setDepts]     = useState([]);
  const [mods, setMods]       = useState([]);
  const [makes, setMakes]     = useState([]);
  const [cltFilter, setClt]   = useState("");
  const [form, setForm]       = useState(null);

  const load = () => api.equipment(cltFilter || undefined).then(setRows);
  useEffect(() => { load(); }, [cltFilter]);
  useEffect(() => {
    api.clients().then(setClients);
    api.departments().then(setDepts);
    api.modalities().then(setMods);
    api.makes().then(setMakes);
  }, []);

  const save = async () => {
    if (form.eqp_id) await api.updateEquip(form.eqp_id, form);
    else             await api.createEquip(form);
    setForm(null); load();
  };

  const cols = [
    { key:"eqp_alias",  label:"Alias"      },
    { key:"eqp_model",  label:"Model"      },
    { key:"eqp_serial", label:"Serial"     },
    { key:"eqp_barcode",label:"Barcode"    },
    { key:"clt_name",   label:"Client"     },
    { key:"dept_name",  label:"Department" },
    { key:"modal_name", label:"Modality"   },
    { key:"make_name",  label:"Make"       },
    { key:"is_active",  label:"Active", render: r => r.is_active ? "✓" : "—" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Equipment</h2>
        <div className="flex gap-2">
          <select value={cltFilter} onChange={e => setClt(e.target.value)} className="border rounded px-3 py-1 text-sm text-gray-600">
            <option value="">All clients</option>
            {clients.map(c => <option key={c.clt_id} value={c.clt_id}>{c.clt_name}</option>)}
          </select>
          <button onClick={() => setForm({ eqp_alias:"", eqp_model:"", eqp_serial:"", eqp_barcode:"", clt_id:"", dept_id:"", modal_id:"", make_id:"", is_active:true })}
            className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New equipment</button>
        </div>
      </div>
      <Table cols={cols} rows={rows} onRow={r => setForm({...r})} />

      {form && (
        <Modal title={form.eqp_id ? "Edit Equipment" : "New Equipment"} onClose={() => setForm(null)}>
          <div className="grid grid-cols-2 gap-3">
            {[["eqp_alias","Alias"],["eqp_model","Model"],["eqp_serial","Serial"],["eqp_barcode","Barcode"]].map(([k,l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={form[k]||""} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
            {[["dept_id","Department",depts,"dept_id","dept_name"],["modal_id","Modality",mods,"modal_id","modal_name"],["make_id","Make",makes,"make_id","make_name"]].map(([k,l,opts,vk,lk]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <select value={form[k]||""} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">— select —</option>
                  {opts.map(o => <option key={o[vk]} value={o[vk]}>{o[lk]}</option>)}
                </select>
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm col-span-2">
              <input type="checkbox" checked={!!form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
              Active
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={save} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
