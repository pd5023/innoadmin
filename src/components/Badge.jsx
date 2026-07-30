const map = {
  1: "bg-gray-100   text-gray-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-blue-100   text-blue-800",
  4: "bg-green-100  text-green-800",
  5: "bg-red-100    text-red-800",
};
const labels = { 1: "Received", 2: "Assigned", 3: "In-process", 4: "Completed", 5: "Cancelled" };
export default function StatusBadge({ status }) {
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-600"}`}>{labels[status] ?? status}</span>;
}
