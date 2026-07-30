import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import Modal from "../components/Modal";
import ClientFormFields from "../components/ClientFormFields";

const emptyClientAddr = { Street: "", City: "", State: "", Zip: "", Country: "" };
const emptyDept = { cltDept_dept: "", cltDept_alias: "" };
const emptyContact = { cnt_name: "", cnt_email: "", cnt_phone: "", cnt_role: "", cnt_deptId: "", cnt_isActive: true };
const emptyEquip = {
  eqp_alias: "", eqp_model: "", eqp_serial: "", eqp_barcode: "", eqp_roomAlias: "",
  eqp_deptId: "", eqp_modalId: "", eqp_makeId: "", eqp_isActive: true, eqp_isContract: false,
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [zones, setZones] = useState([]);
  const [subOffices, setSubOffices] = useState([]);
  const [depts, setDepts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [cntRoles, setCntRoles] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [makes, setMakes] = useState([]);

  const [mainForm, setMainForm] = useState(null);
  const [deptForm, setDeptForm] = useState(null);
  const [contactForm, setContactForm] = useState(null);
  const [equipForm, setEquipForm] = useState(null);

  const load = () => {
    api.getClient(id).then(setClient);
    api.clientDepts(id).then(setDepts);
    api.contacts(id).then(setContacts);
    api.equipment(id).then(setEquipment);
  };
  useEffect(() => { load(); }, [id]);
  useEffect(() => {
    api.zones().then(setZones);
    api.subOffices().then(setSubOffices);
    api.departments().then(setDepartments);
    api.cntRoles().then(setCntRoles);
    api.modalities().then(setModalities);
    api.makes().then(setMakes);
  }, []);

  const saveMain = async () => { await api.updateClient(client.clt_id, mainForm); setMainForm(null); load(); };
  const saveDept = async () => {
    if (deptForm.cltDept_id) await api.updateClientDept(deptForm.cltDept_id, deptForm);
    else                     await api.createClientDept({ ...deptForm, cltDept_cltId: id });
    setDeptForm(null); load();
  };
  const saveContact = async () => {
    if (contactForm.cnt_id) await api.updateContact(contactForm.cnt_id, contactForm);
    else                    await api.createContact({ ...contactForm, cnt_cltId: id });
    setContactForm(null); load();
  };
  const saveEquip = async () => {
    await api.createEquip({ ...equipForm, eqp_cltId: id });
    setEquipForm(null); load();
  };

  if (!client) return <p className="text-sm text-gray-400">Loading...</p>;

  const contactsFor = (deptId) => contacts.filter(c => c.cnt_deptId === deptId);
  const equipFor    = (deptId) => equipment.filter(e => e.eqp_deptId === deptId);
  const unassignedContacts = contacts.filter(c => !depts.some(d => d.cltDept_id === c.cnt_deptId));
  const unassignedEquip    = equipment.filter(e => !depts.some(d => d.cltDept_id === e.eqp_deptId));

  return (
    <div>
      <Link to="/clients" className="text-sm text-blue-600 hover:underline">‹ Back to Clients</Link>

      <div className="flex items-stretch gap-3 my-4">
        <button
          onClick={() => setMainForm({ ...client, clt_address: client.clt_address || {} })}
          className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-white flex items-center justify-center text-2xl font-semibold py-8"
        >
          {client.clt_name}
        </button>
        <div className="flex flex-col gap-2 justify-center">
          <button onClick={() => setDeptForm({ ...emptyDept })} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New Department</button>
          <button onClick={() => setContactForm({ ...emptyContact })} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New Contact</button>
          <button onClick={() => setEquipForm({ ...emptyEquip })} className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">+ New Equipment</button>
        </div>
      </div>

      {depts.map(d => (
        <div key={d.cltDept_id} className="mb-4 border rounded overflow-hidden">
          <button
            onClick={() => setDeptForm({ ...d })}
            className="w-full text-left bg-gray-200 hover:bg-gray-300 transition-colors font-bold px-3 py-2"
          >
            {d.cltDept_alias} <span className="font-normal text-gray-500 text-xs">({d.dept_name})</span>
          </button>
          {contactsFor(d.cltDept_id).map(c => (
            <button key={`c${c.cnt_id}`} onClick={() => setContactForm({ ...c })} className="w-full text-left border-t px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
              <span className="text-xs text-gray-400 w-16 shrink-0">Contact</span>{c.cnt_name}
            </button>
          ))}
          {equipFor(d.cltDept_id).map(e => (
            <button key={`e${e.eqp_id}`} onClick={() => navigate(`/clients/${id}/equipment/${e.eqp_id}`)} className="w-full text-left border-t px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
              <span className="text-xs text-gray-400 w-16 shrink-0">Equipment</span>{e.eqp_alias}
            </button>
          ))}
          {contactsFor(d.cltDept_id).length === 0 && equipFor(d.cltDept_id).length === 0 && (
            <p className="border-t px-4 py-2 text-sm text-gray-400 italic">Nothing here yet.</p>
          )}
          <div className="border-t flex">
            <button onClick={() => setContactForm({ ...emptyContact, cnt_deptId: d.cltDept_id })} className="flex-1 text-left px-4 py-1.5 text-xs text-blue-700 hover:bg-blue-50 transition-colors">+ Add contact</button>
            <button onClick={() => setEquipForm({ ...emptyEquip, eqp_deptId: d.cltDept_id })} className="flex-1 text-left px-4 py-1.5 text-xs text-blue-700 hover:bg-blue-50 transition-colors border-l">+ Add equipment</button>
          </div>
        </div>
      ))}
      {depts.length === 0 && <p className="text-sm text-gray-400 mb-4">No departments yet — add one to start assigning contacts and equipment.</p>}

      {(unassignedContacts.length > 0 || unassignedEquip.length > 0) && (
        <div className="mb-4 border rounded overflow-hidden">
          <div className="bg-gray-200 font-bold px-3 py-2">Unassigned</div>
          {unassignedContacts.map(c => (
            <button key={`c${c.cnt_id}`} onClick={() => setContactForm({ ...c })} className="w-full text-left border-t px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
              <span className="text-xs text-gray-400 w-16 shrink-0">Contact</span>{c.cnt_name}
            </button>
          ))}
          {unassignedEquip.map(e => (
            <button key={`e${e.eqp_id}`} onClick={() => navigate(`/clients/${id}/equipment/${e.eqp_id}`)} className="w-full text-left border-t px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
              <span className="text-xs text-gray-400 w-16 shrink-0">Equipment</span>{e.eqp_alias}
            </button>
          ))}
        </div>
      )}

      {mainForm && (
        <Modal title="Edit Client" onClose={() => setMainForm(null)}>
          <ClientFormFields form={mainForm} setForm={setMainForm} zones={zones} subOffices={subOffices} />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setMainForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={saveMain} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {deptForm && (
        <Modal title={deptForm.cltDept_id ? "Edit Department" : "New Department"} onClose={() => setDeptForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department Type</label>
              <select value={deptForm.cltDept_dept || ""} onChange={e => setDeptForm({...deptForm, cltDept_dept: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="" disabled>— select —</option>
                {departments.map(d => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Alias (as known at this client)</label>
              <input value={deptForm.cltDept_alias || ""} onChange={e => setDeptForm({...deptForm, cltDept_alias: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            {deptForm.cltDept_id && (
              <button onClick={async () => { await api.deleteClientDept(deptForm.cltDept_id); setDeptForm(null); load(); }} className="text-xs text-red-600 hover:underline">Delete department</button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setDeptForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={saveDept} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {contactForm && (
        <Modal title={contactForm.cnt_id ? "Edit Contact" : "New Contact"} onClose={() => setContactForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={contactForm.cnt_name || ""} onChange={e => setContactForm({...contactForm, cnt_name: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input value={contactForm.cnt_email || ""} onChange={e => setContactForm({...contactForm, cnt_email: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={contactForm.cnt_phone || ""} onChange={e => setContactForm({...contactForm, cnt_phone: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <select value={contactForm.cnt_role || ""} onChange={e => setContactForm({...contactForm, cnt_role: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select —</option>
                {cntRoles.map(r => <option key={r.role_id} value={r.role_name}>{r.role_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select value={contactForm.cnt_deptId || ""} onChange={e => setContactForm({...contactForm, cnt_deptId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— unassigned —</option>
                {depts.map(d => <option key={d.cltDept_id} value={d.cltDept_id}>{d.cltDept_alias}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
              <input type="checkbox" checked={contactForm.cnt_isActive !== false} onChange={e => setContactForm({...contactForm, cnt_isActive: e.target.checked})} />
              Active
            </label>
          </div>
          <div className="flex justify-between items-center mt-4">
            {contactForm.cnt_id && (
              <button onClick={async () => { await api.deleteContact(contactForm.cnt_id); setContactForm(null); load(); }} className="text-xs text-red-600 hover:underline">Delete contact</button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setContactForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
              <button onClick={saveContact} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {equipForm && (
        <Modal title="New Equipment" onClose={() => setEquipForm(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[["eqp_alias","Alias"],["eqp_roomAlias","Room / Location"],["eqp_model","Model"],["eqp_serial","Serial"],["eqp_barcode","Barcode"]].map(([k,l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={equipForm[k] || ""} onChange={e => setEquipForm({...equipForm, [k]: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select value={equipForm.eqp_deptId || ""} onChange={e => setEquipForm({...equipForm, eqp_deptId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— unassigned —</option>
                {depts.map(d => <option key={d.cltDept_id} value={d.cltDept_id}>{d.cltDept_alias}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Modality</label>
              <select value={equipForm.eqp_modalId || ""} onChange={e => setEquipForm({...equipForm, eqp_modalId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select —</option>
                {modalities.map(m => <option key={m.mod_id} value={m.mod_id}>{m.mod_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Make</label>
              <select value={equipForm.eqp_makeId || ""} onChange={e => setEquipForm({...equipForm, eqp_makeId: Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">— select —</option>
                {makes.map(m => <option key={m.make_id} value={m.make_id}>{m.make_name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={equipForm.eqp_isActive !== false} onChange={e => setEquipForm({...equipForm, eqp_isActive: e.target.checked})} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!equipForm.eqp_isContract} onChange={e => setEquipForm({...equipForm, eqp_isContract: e.target.checked})} />
              Under contract
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEquipForm(null)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button onClick={saveEquip} className="px-4 py-2 text-sm bg-blue-700 text-white rounded">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
