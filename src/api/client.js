// Dev: Vite proxy handles /admin/api → localhost:3000
// Prod: set VITE_API_URL=https://your-innowebsrv.onrender.com in Render env vars
const BASE = (import.meta.env.VITE_API_URL ?? "") + "/admin/api";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Dashboard
  dashboard: ()                          => req("GET",    "/dashboard"),
  // Clients
  clients:   ()                          => req("GET",    "/clients"),
  createClient: (d)                      => req("POST",   "/clients", d),
  updateClient: (id, d)                  => req("PUT",    `/clients/${id}`, d),
  deleteClient: (id)                     => req("DELETE", `/clients/${id}`),
  // Contacts
  contacts:  (clt_id)                    => req("GET",    `/contacts${clt_id ? `?clt_id=${clt_id}` : ""}`),
  createContact: (d)                     => req("POST",   "/contacts", d),
  updateContact: (id, d)                 => req("PUT",    `/contacts/${id}`, d),
  resetPassword: (id, password)          => req("POST",   `/contacts/${id}/reset-password`, { password }),
  // Tickets
  tickets:   (q)                         => req("GET",    `/tickets?${new URLSearchParams(q || {})}`),
  assignTicket: (id, cnt_id)             => req("PUT",    `/tickets/${id}/assign`, { cnt_id }),
  voidTicket:   (id, reason)             => req("PUT",    `/tickets/${id}/void`,   { reason }),
  notifyTicket: (id, cnt_id, message)    => req("POST",   `/tickets/${id}/notify`, { cnt_id, message }),
  // Equipment
  equipment:   (clt_id)                  => req("GET",    `/equipment${clt_id ? `?clt_id=${clt_id}` : ""}`),
  createEquip: (d)                       => req("POST",   "/equipment", d),
  updateEquip: (id, d)                   => req("PUT",    `/equipment/${id}`, d),
  departments: (clt_id)                  => req("GET",    `/departments${clt_id ? `?clt_id=${clt_id}` : ""}`),
  modalities:  (clt_id)                  => req("GET",    `/modalities${clt_id ? `?clt_id=${clt_id}` : ""}`),
  makes:       (clt_id)                  => req("GET",    `/makes${clt_id ? `?clt_id=${clt_id}` : ""}`),
  // Reports
  reports:   (q)                         => req("GET",    `/reports?${new URLSearchParams(q || {})}`),
  report:    (id)                        => req("GET",    `/reports/${id}`),
  // Parts
  parts:     (q)                         => req("GET",    `/parts?${new URLSearchParams(q || {})}`),
  updatePartStatus: (id, d)              => req("PUT",    `/parts/${id}/status`, d),
};
