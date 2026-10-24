import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const err = useRouteError() as Error | undefined;
  return (
    <main className="wrap page">
      <div className="empty" role="alert" style={{ display: "grid", gap: 10 }}>
        <b>Bu sayfa açılırken bir hata oluştu.</b>
        <code className="small">{err?.message ?? String(err)}</code>
        <span>
          <Link to="/">Ana sayfaya dön</Link> veya sayfayı yenile.
        </span>
      </div>
    </main>
  );
}
