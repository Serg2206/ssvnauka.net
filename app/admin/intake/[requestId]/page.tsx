import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminSessionCookieName, isAdminEnabled, isValidAdminSession } from "@/lib/admin-auth";
import { getIntakeRequestById, isIntakePostgresConfigured } from "@/lib/intake-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function buildBackHref(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  for (const key of ["status", "q", "page", "sort", "order"]) {
    const value = searchParams[key];

    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query.length > 0 ? `/admin/intake?${query}` : "/admin/intake";
}

export default async function AdminIntakeDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = isValidAdminSession(cookieStore.get(adminSessionCookieName)?.value);
  const adminEnabled = isAdminEnabled();
  const postgresConfigured = isIntakePostgresConfigured();

  if (!adminEnabled || !isAuthenticated || !postgresConfigured) {
    notFound();
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const request = await getIntakeRequestById(resolvedParams.requestId);

  if (!request) {
    notFound();
  }

  const backHref = buildBackHref(resolvedSearchParams);

  return (
    <main>
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Admin</p>
            <h2>Consultation request</h2>
          </div>
          <Link className="button button--secondary" href={backHref}>
            Back to list
          </Link>
        </div>
        <div className="card-grid card-grid--2 admin-grid">
          <article className="card">
            <p className="eyebrow">Patient</p>
            <h2>{request.fullName}</h2>
            <div className="admin-detail-list">
              <p><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
              <p><strong>Contact:</strong> {request.contactValue}</p>
              <p><strong>Preferred contact:</strong> {request.contactMethod}</p>
              <p><strong>Locale:</strong> {request.locale.toUpperCase()}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>
          </article>
          <article className="card">
            <p className="eyebrow">Compliance</p>
            <h2>Audit data</h2>
            <div className="admin-detail-list">
              <p><strong>Consent time:</strong> {formatDate(request.consentAt)}</p>
              <p><strong>Policy version:</strong> {request.policyVersion ?? "-"}</p>
              <p><strong>Fingerprint:</strong> {request.requestFingerprint ?? "-"}</p>
              <p><strong>User agent:</strong> {request.userAgent ?? "-"}</p>
              <p><strong>Request ID:</strong> {request.requestId}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <article className="card">
          <p className="section-kicker">Summary</p>
          <h2>Full request text</h2>
          <div className="admin-summary-block">
            {request.summary}
          </div>
        </article>
      </section>
    </main>
  );
}