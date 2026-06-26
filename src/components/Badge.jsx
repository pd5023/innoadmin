const map = {
  0: "bg-yellow-100 text-yellow-800",
  1: "bg-green-100  text-green-800",
  9: "bg-red-100    text-red-800",
};
const labels = { 0: "Open", 1: "Closed", 9: "Voided" };
export default function StatusBadge({ status }) {
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-600"}`}>{labels[status] ?? status}</span>;
}
