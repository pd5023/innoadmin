import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";

const empty = { clt_name:"", clt_main_nb:"", clt_siteurl:"", clt_lang:"en", clt_zone:1, pref_allowSRbill:false, pref_flexSRtime:false, pref_reqGeoLoc:false, clt_tc_lunch:60 };

export default function Clients() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null); // null=closed, {}=new, {clt_id}=edit
  const load = () => api.clients().then(setRows);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (form.clt_id) await api.updateClient(form.clt_id, form);
    else             await api.createClient(form);
    setForm(null); load();
  };

  const cols = [
    { key:"clt_id",   label:"ID" },
    { key:"clt_name", label:"Name" },
    { key:"clt_main_nb", label:"Phone" },
    { key:"clt_siteurl", label:"Site URL" },
    { key:"clt_lang",  label:"Lang" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
        <button onClick={() => setForm({...empty})} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New client</button>
      </div>
      <Table cols={cols} rows={rows} onRow={r => setForm({...r})} />
      {form && (
        <Modal title={form.clt_id ? "Edit Client" : "New Client"} onClose={() => setForm(null)}>
          {[["clt_name","Name"],["clt_main_nb","Phone"],["clt_siteurl","Site URL"]].map(([k,l]) => (
            <div key={k} className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
              <input value={form[k]||""} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["pref_allowSRbill","Allow SR billing"],["pref_flexSRtime","Flex SR time"],["pref_reqGeoLoc","Require geoloc"]].map(([k,l]) => (
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
