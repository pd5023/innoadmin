import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Modal from "../components/Modal";
import ClientFormFields from "../components/ClientFormFields";

const empty = {
  clt_name: "", clt_phone: "", clt_800: "", clt_busHrs: "Mon-Sun 6:00-23:00", clt_siteurl: "",
  clt_address: { Street: "", City: "", State: "", Zip: "", Country: "" },
  clt_zone: 1, clt_subId: 1, pref_hrtick: 15,
  pref_allowSRbill: false, pref_flexSRtime: false, pref_reqGeoLoc: false, pref_reqSign: true,
};

export default function Clients() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [zones, setZones] = useState([]);
  const [subOffices, setSubOffices] = useState([]);
  const [form, setForm] = useState(null);

  const load = () => api.clients().then(setRows);
  useEffect(() => { load(); }, []);
  useEffect(() => { api.zones().then(setZones); api.subOffices().then(setSubOffices); }, []);

  const save = async () => {
    await api.createClient(form);
    setForm(null); load();
  };

  const openNew = (subId, zoneId) => setForm({
    ...empty, clt_address: { ...empty.clt_address },
    clt_subId: subId ?? empty.clt_subId, clt_zone: zoneId ?? empty.clt_zone,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
        <button onClick={() => openNew()} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New client</button>
      </div>

      {zones.map(z => (
        <div key={z.zone_id} className="mb-4 border rounded overflow-hidden">
          <div className="bg-gray-300 font-bold px-3 py-2">{z.zone_name}</div>
          {subOffices.filter(s => s.sub_zone === z.zone_id).map(s => (
            <div key={s.sub_id}>
              <div className="bg-gray-100 font-semibold px-4 py-1.5 text-sm border-t">{s.sub_name}</div>
              {rows.filter(c => c.clt_subId === s.sub_id).map(c => (
                <button
                  key={c.clt_id}
                  onClick={() => navigate(`/clients/${c.clt_id}`)}
                  className="w-full text-left border-t px-6 py-2 text-sm hover:bg-blue-50 transition-colors"
                >
                  {c.clt_name}
                </button>
              ))}
              {rows.filter(c => c.clt_subId === s.sub_id).length === 0 && (
                <p className="border-t px-6 py-2 text-sm text-gray-400 italic">No clients yet.</p>
              )}
              <button
                onClick={() => openNew(s.sub_id, z.zone_id)}
                className="w-full text-left border-t px-6 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
              >
                + Add client to {s.sub_name}
              </button>
            </div>
          ))}
          {subOffices.filter(s => s.sub_zone === z.zone_id).length === 0 && (
            <p className="border-t px-4 py-2 text-sm text-gray-400 italic">No sub-offices in this zone.</p>
          )}
        </div>
      ))}
      {zones.length === 0 && <p className="text-sm text-gray-400">No zones yet — add one on the Offices screen first.</p>}

      {form && (
        <Modal title="New Client" onClose={() => setForm(null)}>
          <ClientFormFields form={form} setForm={setForm} zones={zones} subOffices={subOffices} />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={save} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
