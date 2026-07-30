import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import Modal from "../components/Modal";

const emptySubEquip = { subeqp_model: "", subeqp_serial: "", subeqp_barcode: "", subeqp_makeId: "", subeqp_isActive: true, subeqp_isContract: false };

export default function EquipmentDetail() {
  const { id, eqpId } = useParams();

  const [equip, setEquip] = useState(null);
  const [depts, setDepts] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [makes, setMakes] = useState([]);
  const [subEquip, setSubEquip] = useState([]);

  const [mainForm, setMainForm] = useState(null);
  const [subForm, setSubForm] = useState(null);

  const load = () => {
    api.getEquipment(eqpId).then(setEquip);
    api.subEquipment(eqpId).then(setSubEquip);
  };
  useEffect(() => { load(); }, [eqpId]);
  useEffect(() => {
    api.clientDepts(id).then(setDepts);
    api.modalities().then(setModalities);
    api.makes().then(setMakes);
  }, [id]);

  const saveMain = async () => { await api.updateEquip(equip.eqp_id, mainForm); setMainForm(null); load(); };
  const saveSub = async () => {
    if (subForm.subeqp_id) await api.updateSubEquipment(subForm.subeqp_id, subForm);
    else                   await api.createSubEquipment({ ...subForm, subeqp_eqpId: eqpId });
    setSubForm(null); load();
  };

  if (!equip) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div>
      <Link to={`/clients/${id}`} className="text-sm text-blue-600 hover:underline">‹ Back to {equip.clt_name}</Link>

      <div className="flex items-stretch gap-3 my-4">
        <button
          onClick={() => setMainForm({ ...equip })}
          className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-white flex items-center justify-center text-2xl font-semibold py-8"
        >
          {equip.eqp_alias}
        </button>
        <div className="flex flex-col gap-2 justify-center">
          <button onClick={() => setSubForm({ ...emptySubEquip })} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New Sub-Equipment</button>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="bg-gray-200 font-bold px-3 py-2">Sub-Equipment</div>
        {subEquip.map(s => (
          <button key={s.subeqp_id} onClick={() => setSubForm({ ...s })} className="w-full text-left border-t px-4 py-2 text-sm hover:bg-blue-50 transition-colors">
            {s.subeqp_model} {s.subeqp_serial && <span className="text-gray-400">— {s.subeqp_serial}</span>}
          </button>
        ))}
        {subEquip.length === 0 && <p className="border-t px-4 py-2 text-sm text-gray-400 italic">No sub-equipment yet.</p>}
      </div>

      {mainForm && (
        <Modal title="Edit Equipment" onClose={() => setMainForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["eqp_alias","Alias"],["eqp_roomAlias","Room / Location"],["eqp_model","Model"],["eqp_serial","Serial"],["eqp_barcode","Barcode"]].map(([k,l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={mainForm[k] || ""} onChange={e => setMainForm({...mainForm, [k]: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select value={mainForm.eqp_deptId || ""} onChange={e => setMainForm({...mainForm, eqp_deptId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— unassigned —</option>
                {depts.map(d => <option key={d.cltDept_id} value={d.cltDept_id}>{d.cltDept_alias}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Modality</label>
              <select value={mainForm.eqp_modalId || ""} onChange={e => setMainForm({...mainForm, eqp_modalId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select —</option>
                {modalities.map(m => <option key={m.mod_id} value={m.mod_id}>{m.mod_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Make</label>
              <select value={mainForm.eqp_makeId || ""} onChange={e => setMainForm({...mainForm, eqp_makeId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select —</option>
                {makes.map(m => <option key={m.make_id} value={m.make_id}>{m.make_name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={mainForm.eqp_isActive !== false} onChange={e => setMainForm({...mainForm, eqp_isActive: e.target.checked})} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!mainForm.eqp_isContract} onChange={e => setMainForm({...mainForm, eqp_isContract: e.target.checked})} />
              Under contract
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setMainForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={saveMain} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {subForm && (
        <Modal title={subForm.subeqp_id ? "Edit Sub-Equipment" : "New Sub-Equipment"} onClose={() => setSubForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["subeqp_model","Model"],["subeqp_serial","Serial"],["subeqp_barcode","Barcode"]].map(([k,l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={subForm[k] || ""} onChange={e => setSubForm({...subForm, [k]: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Make</label>
              <select value={subForm.subeqp_makeId || ""} onChange={e => setSubForm({...subForm, subeqp_makeId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select —</option>
                {makes.map(m => <option key={m.make_id} value={m.make_id}>{m.make_name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={subForm.subeqp_isActive !== false} onChange={e => setSubForm({...subForm, subeqp_isActive: e.target.checked})} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!subForm.subeqp_isContract} onChange={e => setSubForm({...subForm, subeqp_isContract: e.target.checked})} />
              Under contract
            </label>
          </div>
          <div className="flex justify-between items-center mt-4">
            {subForm.subeqp_id && (
              <button onClick={async () => { await api.deleteSubEquipment(subForm.subeqp_id); setSubForm(null); load(); }} className="text-xs text-red-600 hover:underline">Delete sub-equipment</button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setSubForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={saveSub} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
