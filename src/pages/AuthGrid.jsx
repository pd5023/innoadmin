import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AuthGrid() {
  const [rows, setRows] = useState([]);
  const [tiers, setTiers] = useState([]);

  const load = () => api.emplRoleAuthMap().then(setRows);
  useEffect(() => { load(); }, []);
  useEffect(() => { api.roleAuthTiers().then(setTiers); }, []);

  const setTier = async (roleId, authId) => {
    setRows(rows.map(r => r.role_id === roleId ? { ...r, auth_id: authId } : r));
    await api.setEmplRoleAuth(roleId, authId);
    load();
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Auth Grid</h2>
        <p className="text-sm text-gray-500 mt-1">
          Each job title maps to a permission tier. Changing a title's tier here updates access
          for every employee holding that title — no need to edit individual employees.
        </p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Permission Tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.role_id} className="border-b last:border-0">
                <td className="px-4 py-2">{r.role_name}</td>
                <td className="px-4 py-2">
                  <select
                    value={r.auth_id ?? ""}
                    onChange={e => setTier(r.role_id, Number(e.target.value))}
                    className="border rounded px-3 py-1.5 text-sm"
                  >
                    <option value="" disabled>— unassigned —</option>
                    {tiers.map(t => <option key={t.auth_id} value={t.auth_id}>{t.auth_name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-6 text-center text-gray-400">No titles defined yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
