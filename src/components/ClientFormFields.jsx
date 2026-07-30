export default function ClientFormFields({ form, setForm, zones, subOffices }) {
  return (
    <>
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
          <select value={form.pref_hrtick ?? 15} onChange={e => setForm({...form, pref_hrtick:Number(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm">
            <option value={0}>00</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
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
    </>
  );
}
