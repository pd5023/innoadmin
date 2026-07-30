import { useEffect, useState } from "react";
import { api } from "../api/client";
import Modal from "../components/Modal";

const emptyZone = { zone_name: "", zone_country: "", zone_time: "", zone_lang: "en" };
const emptySubOffice = {
  sub_name: "", sub_zone: "", sub_phone: "", sub_800: "",
  sub_busHrs: "Mon-Fri 8:00-17:00", sub_siteurl: "",
  sub_address: { Street: "", City: "", State: "", Zip: "", Country: "" },
};

export default function Offices() {
  const [mainOffice, setMainOffice] = useState(null);
  const [zones, setZones] = useState([]);
  const [subOffices, setSubOffices] = useState([]);
  const [mainForm, setMainForm] = useState(null);
  const [zoneForm, setZoneForm] = useState(null);       // null=closed, {}=new, {zone_id}=edit
  const [subForm, setSubForm] = useState(null);          // null=closed, {}=new, {sub_id}=edit

  const load = () => {
    api.mainOffice().then(setMainOffice);
    api.zones().then(setZones);
    api.subOffices().then(setSubOffices);
  };
  useEffect(() => { load(); }, []);

  const saveMain = async () => {
    await api.updateMainOffice(mainForm.id, mainForm);
    setMainForm(null); load();
  };
  const saveZone = async () => {
    if (zoneForm.zone_id) await api.updateZone(zoneForm.zone_id, zoneForm);
    else                  await api.createZone(zoneForm);
    setZoneForm(null); load();
  };
  const saveSubOffice = async () => {
    if (subForm.sub_id) await api.updateSubOffice(subForm.sub_id, subForm);
    else                await api.createSubOffice(subForm);
    setSubForm(null); load();
  };

  return (
    <div>
      <div className="flex items-stretch gap-3 mb-6">
        <button
          onClick={() => setMainForm({ ...mainOffice, address: mainOffice?.address || {} })}
          className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-white flex items-center justify-center text-2xl font-semibold py-8"
        >
          {mainOffice?.name || "Main Office"}
        </button>
        <div className="flex flex-col gap-2 justify-center">
          <button onClick={() => setZoneForm({ ...emptyZone })} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New Zone</button>
          <button onClick={() => setSubForm({ ...emptySubOffice, sub_address: { ...emptySubOffice.sub_address } })} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New Office</button>
        </div>
      </div>

      {zones.map(z => (
        <div key={z.zone_id} className="mb-4 border rounded overflow-hidden">
          <button
            onClick={() => setZoneForm({ ...z })}
            className="w-full text-left bg-gray-200 hover:bg-gray-300 transition-colors font-bold px-3 py-2"
          >
            {z.zone_name}
          </button>
          {subOffices.filter(s => s.sub_zone === z.zone_id).map(s => (
            <button
              key={s.sub_id}
              onClick={() => setSubForm({ ...emptySubOffice, ...s, sub_address: { ...emptySubOffice.sub_address, ...(s.sub_address || {}) } })}
              className="w-full text-left border-t px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
            >
              {s.sub_name}
            </button>
          ))}
          {subOffices.filter(s => s.sub_zone === z.zone_id).length === 0 && (
            <p className="border-t px-3 py-2 text-sm text-gray-400 italic">No sub-offices in this zone yet.</p>
          )}
          <button
            onClick={() => setSubForm({ ...emptySubOffice, sub_address: { ...emptySubOffice.sub_address }, sub_zone: z.zone_id })}
            className="w-full text-left border-t px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
          >
            + Add office to {z.zone_name}
          </button>
        </div>
      ))}
      {zones.length === 0 && <p className="text-sm text-gray-400">No zones yet — add one to get started.</p>}

      {mainForm && (
        <Modal title="Edit Main Office" onClose={() => setMainForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={mainForm.name || ""} onChange={e => setMainForm({...mainForm, name:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={mainForm.main_phone || ""} onChange={e => setMainForm({...mainForm, main_phone:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">800 Number</label>
              <input value={mainForm.main_800 || ""} onChange={e => setMainForm({...mainForm, main_800:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Business Hours</label>
              <input value={mainForm.busHrs || ""} onChange={e => setMainForm({...mainForm, busHrs:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Site URL</label>
              <input value={mainForm.siteurl || ""} onChange={e => setMainForm({...mainForm, siteurl:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
              <select value={mainForm.zone || ""} onChange={e => setMainForm({...mainForm, zone:Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500 mt-2 mb-2">Address</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["Street","Street"],["City","City"],["State","State"],["Zip","Zip"],["Country","Country"]].map(([k,l]) => (
              <div key={k} className={k==="Street" ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={mainForm.address?.[k]||""} onChange={e => setMainForm({...mainForm, address:{...mainForm.address, [k]:e.target.value}})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setMainForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={saveMain} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {zoneForm && (
        <Modal title={zoneForm.zone_id ? "Edit Zone" : "New Zone"} onClose={() => setZoneForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={zoneForm.zone_name || ""} onChange={e => setZoneForm({...zoneForm, zone_name:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
              <input value={zoneForm.zone_country || ""} onChange={e => setZoneForm({...zoneForm, zone_country:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
              <input value={zoneForm.zone_time || ""} onChange={e => setZoneForm({...zoneForm, zone_time:e.target.value})} placeholder="America/Los_Angeles" className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
              <input value={zoneForm.zone_lang || "en"} onChange={e => setZoneForm({...zoneForm, zone_lang:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            {zoneForm.zone_id && (
              <button onClick={async () => { await api.deleteZone(zoneForm.zone_id); setZoneForm(null); load(); }} className="text-xs text-red-600 hover:underline">Delete zone</button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setZoneForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={saveZone} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {subForm && (() => {
        const sameAsMainTakenByOther = subOffices.some(s => s.sub_pref_sameAsMain && s.sub_id !== subForm.sub_id);
        const toggleSameAsMain = (checked) => {
          if (checked && mainOffice) {
            setSubForm({
              ...subForm,
              sub_pref_sameAsMain: true,
              sub_address: { ...(mainOffice.address || {}) },
              sub_phone: mainOffice.main_phone,
              sub_800: mainOffice.main_800,
              sub_busHrs: mainOffice.busHrs,
              sub_siteurl: mainOffice.siteurl,
              sub_zone: mainOffice.zone,
            });
          } else {
            setSubForm({ ...subForm, sub_pref_sameAsMain: false });
          }
        };
        return (
        <Modal title={subForm.sub_id ? "Edit Office" : "New Office"} onClose={() => setSubForm(null)}>
          <label className={`flex items-center gap-2 text-sm mb-3 px-3 py-2 rounded border ${sameAsMainTakenByOther ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-blue-50 text-blue-800 border-blue-200"}`}>
            <input
              type="checkbox"
              checked={!!subForm.sub_pref_sameAsMain}
              disabled={sameAsMainTakenByOther}
              onChange={e => toggleSameAsMain(e.target.checked)}
            />
            Same as Main Office (fills address, phone, hours, and zone from Main Office)
          </label>
          {sameAsMainTakenByOther && (
            <p className="text-xs text-gray-400 -mt-2 mb-3">Already used by another sub-office — only one can share Main Office's values.</p>
          )}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={subForm.sub_name || ""} onChange={e => setSubForm({...subForm, sub_name:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
              <select value={subForm.sub_zone || ""} onChange={e => setSubForm({...subForm, sub_zone:Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select zone —</option>
                {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={subForm.sub_phone || ""} onChange={e => setSubForm({...subForm, sub_phone:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">800 Number</label>
              <input value={subForm.sub_800 || ""} onChange={e => setSubForm({...subForm, sub_800:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Business Hours</label>
              <input value={subForm.sub_busHrs || ""} onChange={e => setSubForm({...subForm, sub_busHrs:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Site URL</label>
              <input value={subForm.sub_siteurl || ""} onChange={e => setSubForm({...subForm, sub_siteurl:e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500 mt-2 mb-2">Address</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["Street","Street"],["City","City"],["State","State"],["Zip","Zip"],["Country","Country"]].map(([k,l]) => (
              <div key={k} className={k==="Street" ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={subForm.sub_address?.[k]||""} onChange={e => setSubForm({...subForm, sub_address:{...subForm.sub_address, [k]:e.target.value}})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            {subForm.sub_id && (
              <button onClick={async () => { await api.deleteSubOffice(subForm.sub_id); setSubForm(null); load(); }} className="text-xs text-red-600 hover:underline">Delete office</button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setSubForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={saveSubOffice} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
        );
      })()}
    </div>
  );
}
