export default function Card({ title, value, sub, color = "blue" }) {
  const colors = {
    blue:  "bg-blue-50  border-blue-200  text-blue-700",
    teal:  "bg-teal-50  border-teal-200  text-teal-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red:   "bg-red-50   border-red-200   text-red-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wider opacity-70">{title}</p>
      <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
}
