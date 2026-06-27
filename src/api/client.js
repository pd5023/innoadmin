const BASE = (import.meta.env.VITE_API_URL ?? "") + "/admin/api";

function token() { return localStorage.getItem("admin_token") ?? ""; }

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  dashboard: ()                       => req("GET",    "/dashboard"),
  clients:   ()                       => req("GET",    "/clients"),
  createClient: (d)                   => req("POST",   "/clients", d),
  updateClient: (id, d)               => req("PUT",    `/clients/${id}`, d),
  deleteClient: (id)                  => req("DELETE", `/clients/${id}`),
  contacts:  (clt_id)                 => req("GET",    `/contacts${clt_id ? `?clt_id=${clt_id}` : ""}`),
  createContact: (d)                  => req("POST",   "/contacts", d),
  updateContact: (id, d)              => req("PUT",    `/contacts/${id}`, d),
  resetPassword: (id, password)       => req("POST",   `/contacts/${id}/reset-password`, { password }),
  tickets:   (q)                      => req("GET",    `/tickets?${new URLSearchParams(q || {})}`),
  assignTicket: (id, cnt_id)          => req("PUT",    `/tickets/${id}/assign`, { cnt_id }),
  voidTicket:   (id, reason)          => req("PUT",    `/tickets/${id}/void`,   { reason }),
  notifyTicket: (id, cnt_id, message) => req("POST",   `/tickets/${id}/notify`, { cnt_id, message }),
  equipment:   (clt_id)               => req("GET",    `/equipment${clt_id ? `?clt_id=${clt_id}` : ""}`),
  createEquip: (d)                    => req("POST",   "/equipment", d),
  updateEquip: (id, d)                => req("PUT",    `/equipment/${id}`, d),
  departments: (clt_id)               => req("GET",    `/departments${clt_id ? `?clt_id=${clt_id}` : ""}`),
  modalities:  (clt_id)               => req("GET",    `/modalities${clt_id ? `?clt_id=${clt_id}` : ""}`),
  makes:       (clt_id)               => req("GET",    `/makes${clt_id ? `?clt_id=${clt_id}` : ""}`),
  reports:   (q)                      => req("GET",    `/reports?${new URLSearchParams(q || {})}`),
  report:    (id)                     => req("GET",    `/reports/${id}`),
  parts:     (q)                      => req("GET",    `/parts?${new URLSearchParams(q || {})}`),
  updatePartStatus: (id, d)           => req("PUT",    `/parts/${id}/status`, d),
};