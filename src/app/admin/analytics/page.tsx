import AdminShell from "@/components/admin/AdminShell";
import { getAdminContext } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type PageViewRow = Database["public"]["Tables"]["analytics_page_views"]["Row"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function locationLabel(view: PageViewRow) {
  return [view.city, view.region, view.country].filter(Boolean).join(", ") || "-";
}

function referrerLabel(view: PageViewRow) {
  if (!view.referrer) return "Directa";
  return view.referrer_host ?? view.referrer;
}

export default async function AdminAnalyticsPage() {
  const { supabase, user } = await getAdminContext();
  const [countResult, recentResult] = await Promise.all([
    supabase
      .from("analytics_page_views")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("analytics_page_views")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(100)
      .returns<PageViewRow[]>(),
  ]);

  const views = recentResult.data ?? [];

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analiticas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visitas registradas por el tracker propio de la web.
        </p>
      </div>

      <section className="mb-6 rounded-md border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Visitas totales</p>
        <p className="mt-2 text-5xl font-bold">{countResult.count ?? 0}</p>
      </section>

      <section className="overflow-hidden rounded-md border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="font-semibold">Ultimas visitas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Cuando</th>
                <th className="px-4 py-3 font-medium">Pagina</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Dispositivo</th>
                <th className="px-4 py-3 font-medium">Navegador</th>
                <th className="px-4 py-3 font-medium">Web previa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {views.map((view) => (
                <tr key={view.id}>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(view.visited_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">{view.path}</td>
                  <td className="px-4 py-3">{locationLabel(view)}</td>
                  <td className="px-4 py-3 capitalize">
                    {view.device_type} · {view.os}
                  </td>
                  <td className="px-4 py-3">{view.browser}</td>
                  <td className="max-w-xs truncate px-4 py-3">
                    {referrerLabel(view)}
                  </td>
                </tr>
              ))}
              {views.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={6}>
                    Aun no hay visitas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
