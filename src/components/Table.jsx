export default function Table({ cols, rows, onRow }) {
  if (!rows?.length) return <p className="text-gray-400 text-sm py-4">No records found.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>{cols.map(c => <th key={c.key} className="px-4 py-3 text-left font-medium">{c.label}</th>)}</tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRow?.(r)} className={onRow ? "cursor-pointer hover:bg-blue-50 transition-colors" : ""}>
              {cols.map(c => (
                <td key={c.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {c.render ? c.render(r) : r[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
