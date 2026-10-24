import { Link } from "react-router-dom";

export function NotFound({ what = "Sayfa" }: { what?: string }) {
  return (
    <div className="empty">
      {what} bulunamadı. <Link to="/">Ana sayfaya dön</Link>
    </div>
  );
}
