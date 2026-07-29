import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";

const empty = {
  clt_name: "", clt_phone: "", clt_800: "", clt_busHrs: "", clt_siteurl: "",
  clt_address: { Street: "", City: "", State: "", Zip: "", Country: "" },
  clt_zone: 1, clt_subId: 1, pref_hrtick: 15,
  pref_allowSRbill: false, pref_flexSRtime: false, pref_reqGeoLoc: false, pref_reqSign: true,
};

export default function Clients() {
  const [rows, setRows] = useState([]);
  const [zones, setZones] = useState([]);
  const [subOffices, setSubOffices] = useState([]);
  const [form, setForm] = useState(null); // null=closed, {}=new, {clt_id}=edit

  const load = () => api.clients().then(setRows);
  useEffect(() => { load(); }, []);
  useEffect(() => { api.zones().then(setZones); api.subOffices().then(setSubOffices); }, []);

  const save = async () => {
    if (form.clt_id) await api.updateClient(form.clt_id, form);
    else             await api.createClient(form);
    setForm(null); load();
  };

  const openNew = () => setForm({ ...empty, clt_address: { ...empty.clt_address } });
  const openEdit = (r) => setForm({ ...empty, ...r, clt_address: { ...empty.clt_address, ...(r.clt_address || {}) } });

  const cols = [
    { key:"clt_id",    label:"ID" },
    { key:"clt_name",  label:"Name" },
    { key:"clt_phone", label:"Phone" },
    { key:"zone_name", label:"Zone" },
    { key:"sub_name",  label:"Sub-Office" },
    { key:"clt_siteurl", label:"Site URL" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
        <button onClick={openNew} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New client</button>
      </div>
      <Table cols={cols} rows={rows} onRow={openEdit} />
      {form && (
        <Modal title={form.clt_id ? "Edit Client" : "New Client"} onClose={() => setForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={form.clt_name} onChange={e => setForm({...form, clt_name:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={form.clt_phone||""} onChange={e => setForm({...form, clt_phone:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">800 Number</label>
              <input value={form.clt_800||""} onChange={e => setForm({...form, clt_800:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Business Hours</label>
              <input value={form.clt_busHrs||""} onChange={e => setForm({...form, clt_busHrs:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Site URL</label>
              <input value={form.clt_siteurl||""} onChange={e => setForm({...form, clt_siteurl:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
              <select value={form.clt_zone} onChange={e => setForm({...form, clt_zone:Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sub-Office</label>
              <select value={form.clt_subId} onChange={e => setForm({...form, clt_subId:Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                {subOffices.map(s => <option key={s.sub_id} value={s.sub_id}>{s.sub_name}</option>)}
              </select>
            </div>
          </div>

          <p className="text-xs font-medium text-gray-500 mt-4 mb-2">Address</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["Street","Street"],["City","City"],["State","State"],["Zip","Zip"],["Country","Country"]].map(([k,l]) => (
              <div key={k} className={k==="Street" ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={form.clt_address?.[k]||""} onChange={e => setForm({...form, clt_address:{...form.clt_address, [k]:e.target.value}})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
          </div>

          <p className="text-xs font-medium text-gray-500 mt-4 mb-2">Preferences</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Time rounding (minutes)</label>
              <input type="number" value={form.pref_hrtick||15} onChange={e => setForm({...form, pref_hrtick:Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["pref_allowSRbill","Allow SR billing"],["pref_flexSRtime","Flex SR time"],["pref_reqGeoLoc","Require geoloc"],["pref_reqSign","Require signature"]].map(([k,l]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={!!form[k]} onChange={e => setForm({...form,[k]:e.target.checked})} />
                {l}
              </label>
            ))}
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
