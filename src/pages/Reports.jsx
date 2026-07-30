import { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Modal from "../components/Modal";

export default function Reports() {
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = () => api.reports(from || to ? { from: from || undefined, to: to || undefined } : {}).then(setRows);
  useEffect(() => { load(); }, []);

  const open = async (r) => {
    setLoading(true);
    const d = await api.report(r.sr_id);
    setDetail({ ...r, ...d });
    setLoading(false);
  };

  const cols = [
    { key:"sr_id",        label:"ID"        },
    { key:"clt_name",     label:"Client"    },
    { key:"eqp_alias",    label:"Equipment" },
    { key:"tkt_shrtDesc", label:"Issue"     },
    { key:"sr_date",      label:"Date",      render: r => r.sr_date?.slice(0,10) },
    { key:"status_name",  label:"Status"    },
    { key:"sr_signName",  label:"Signed by" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h2 className="text-xl font-semibold text-gray-800 mr-auto">Service Reports</h2>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-3 py-1 text-sm" />
        <input type="date" value={to}   onChange={e => setTo(e.target.value)}   className="border rounded px-3 py-1 text-sm" />
        <button onClick={load} className="px-4 py-1 text-sm bg-blue-700 text-white rounded">Filter</button>
      </div>
      <Table cols={cols} rows={rows} onRow={open} />

      {(loading || detail) && (
        <Modal title={`Report #${detail?.sr_id ?? "..."}`} onClose={() => setDetail(null)}>
          {loading ? <p className="text-sm text-gray-400 animate-pulse">Loading...</p> : (
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Date:</span> {detail.sr_date?.slice(0,10)}</p>
              <p><span className="font-medium">Status:</span> {detail.status_name || detail.sr_status}</p>
              <p><span className="font-medium">Signed by:</span> {detail.sr_signName || "—"}</p>
              <div className="bg-gray-50 rounded p-3 mt-2 whitespace-pre-wrap text-gray-700 text-xs">{detail.sr_desc || "No repair notes"}</div>
              {detail.sr_hrs && <p className="font-medium mt-2">Hours: Start {detail.sr_hrs.Start} · Out {detail.sr_hrs.Out} · In {detail.sr_hrs.In} · End {detail.sr_hrs.End}</p>}
              {detail.parts?.length > 0 && <p className="font-medium">Parts: {detail.parts.length} item{detail.parts.length===1?"":"s"}</p>}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
