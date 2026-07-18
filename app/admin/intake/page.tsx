import Link from "next/link";
import { cookies } from "next/headers";
import { adminSessionCookieName, isAdminEnabled, isValidAdminSession } from "@/lib/admin-auth";
import {
  countIntakeRequests,
  isIntakePostgresConfigured,
  isValidIntakeStatus,
  isValidIntakeSortField,
  isValidIntakeSortOrder,
  listRecentIntakeRequests,
  type IntakeListFilters,
  type IntakeSortField,
  type IntakeSortOrder
} from "@/lib/intake-delivery";

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

function shortenValue(value: string | null, maxLength = 18) {
  if (!value) {
    return "-";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

export default async function AdminIntakePage({
  searchParams
}: {
  searchParams: Promise<{
    error?: string;
    updated?: string;
    status?: string;
    q?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const statusFilter: IntakeListFilters["status"] =
    typeof resolvedSearchParams.status === "string" &&
    (resolvedSearchParams.status === "all" || isValidIntakeStatus(resolvedSearchParams.status))
      ? resolvedSearchParams.status
      : "all";
  const queryFilter = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const sortField: IntakeSortField =
    typeof resolvedSearchParams.sort === "string" && isValidIntakeSortField(resolvedSearchParams.sort)
      ? resolvedSearchParams.sort
      : "submittedAt";
  const sortOrder: IntakeSortOrder =
    typeof resolvedSearchParams.order === "string" && isValidIntakeSortOrder(resolvedSearchParams.order)
      ? resolvedSearchParams.order
      : "desc";
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = 25;
  const cookieStore = await cookies();
  const isAuthenticated = isValidAdminSession(cookieStore.get(adminSessionCookieName)?.value);
  const adminEnabled = isAdminEnabled();
  const postgresConfigured = isIntakePostgresConfigured();
  const activeFilters = {
    status: statusFilter,
    query: queryFilter,
    sort: sortField,
    order: sortOrder
  };
  const totalRows =
    isAuthenticated && postgresConfigured
      ? await countIntakeRequests(activeFilters)
      : 0;
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);
  const safePage = Math.min(currentPage, totalPages);
  const pageOffset = (safePage - 1) * pageSize;
  const requests =
    isAuthenticated && postgresConfigured
      ? await listRecentIntakeRequests(pageSize, activeFilters, pageOffset)
      : [];

  return (
    <main>
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Admin</p>
            <h2>Intake requests</h2>
          </div>
        </div>
        <div className="card-grid card-grid--2 admin-grid">
          <article className="card">
            <p className="eyebrow">Access</p>
            {!adminEnabled ? (
              <>
                <h2>Admin access is not configured.</h2>
                <p>Set <strong>ADMIN_ACCESS_TOKEN</strong> in the server environment before using this page.</p>
              </>
            ) : isAuthenticated ? (
              <>
                <h2>Authenticated</h2>
                <p>This page reads the latest consultation requests directly from Supabase Postgres.</p>
                {resolvedSearchParams.updated === "1" ? (
                  <p className="form-status form-status--success">Request status updated.</p>
                ) : null}
                {resolvedSearchParams.error === "update-failed" ? (
                  <p className="form-status form-status--error">Could not update request status.</p>
                ) : null}
                {resolvedSearchParams.error === "invalid-status" ? (
                  <p className="form-status form-status--error">Invalid status payload.</p>
                ) : null}
                {resolvedSearchParams.error === "unauthorized" ? (
                  <p className="form-status form-status--error">Your admin session is not valid anymore.</p>
                ) : null}
                <form action="/admin/logout" method="post" className="admin-stack">
                  <button className="button button--secondary" type="submit">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Sign in</h2>
                <p>Use the server-side admin token to open the internal intake viewer.</p>
                {resolvedSearchParams.error === "invalid-token" ? (
                  <p className="form-status form-status--error">The provided admin token was not accepted.</p>
                ) : null}
                <form action="/admin/login" method="post" className="contact-form admin-stack">
                  <label className="field">
                    <span>Admin token</span>
                    <input name="token" type="password" autoComplete="current-password" required />
                  </label>
                  <button className="button button--primary" type="submit">
                    Open admin view
                  </button>
                </form>
              </>
            )}
          </article>
          <article className="card">
            <p className="eyebrow">Status</p>
            <h2>Backend readiness</h2>
            <div className="admin-summary">
              <span className="metric">
                <strong>{adminEnabled ? "On" : "Off"}</strong>
                <span>Admin token</span>
              </span>
              <span className="metric">
                <strong>{postgresConfigured ? "On" : "Off"}</strong>
                <span>Postgres storage</span>
              </span>
              <span className="metric">
                <strong>{totalRows}</strong>
                <span>Loaded rows</span>
              </span>
            </div>
            <p>
              <Link className="text-link" href="/clinic">
                Open public clinic page
              </Link>
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <article className="card admin-table-wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Recent</p>
              <h2>Latest submissions</h2>
            </div>
          </div>
          {!adminEnabled ? (
            <p>Admin token is missing, so the internal viewer stays locked.</p>
          ) : !isAuthenticated ? (
            <p>Sign in above to read the latest consultation requests.</p>
          ) : !postgresConfigured ? (
            <p>Supabase Postgres is not configured, so there are no database rows to show yet.</p>
          ) : (
            <>
              <form method="get" className="admin-filter-bar">
                <label className="field">
                  <span>Status</span>
                  <select name="status" defaultValue={statusFilter}>
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <label className="field">
                  <span>Search</span>
                  <input name="q" type="search" defaultValue={queryFilter} placeholder="Name, contact, summary" />
                </label>
                <label className="field">
                  <span>Sort</span>
                  <select name="sort" defaultValue={sortField}>
                    <option value="submittedAt">Submitted date</option>
                    <option value="status">Status</option>
                    <option value="locale">Locale</option>
                    <option value="fullName">Name</option>
                  </select>
                </label>
                <label className="field">
                  <span>Order</span>
                  <select name="order" defaultValue={sortOrder}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </label>
                <input name="page" type="hidden" value="1" />
                <button className="button button--primary" type="submit">
                  Apply
                </button>
              </form>
              <div className="admin-action-row">
                <a
                  className="button button--secondary"
                  href={`/admin/intake/export?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(queryFilter)}&sort=${encodeURIComponent(sortField)}&order=${encodeURIComponent(sortOrder)}`}
                >
                  Export CSV
                </a>
                <p>
                  Page {safePage} of {totalPages} · {totalRows} total
                </p>
              </div>
              {requests.length === 0 ? (
                <p>No requests match the selected filters.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Submitted</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Summary</th>
                      <th>Locale</th>
                      <th>Status</th>
                      <th>Consent</th>
                      <th>Fingerprint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.requestId}>
                        <td>{formatDate(request.submittedAt)}</td>
                        <td>
                          <Link
                            className="text-link"
                            href={`/admin/intake/${encodeURIComponent(request.requestId)}?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(queryFilter)}&page=${safePage}&sort=${encodeURIComponent(sortField)}&order=${encodeURIComponent(sortOrder)}`}
                          >
                            <strong>{request.fullName}</strong>
                          </Link>
                          <div>{request.contactMethod}</div>
                        </td>
                        <td>{request.contactValue}</td>
                        <td title={request.summary}>{shortenValue(request.summary, 72)}</td>
                        <td>{request.locale.toUpperCase()}</td>
                        <td>
                          <form action="/admin/intake/status" method="post" className="admin-status-form">
                            <input name="requestId" type="hidden" value={request.requestId} />
                            <input name="filterStatus" type="hidden" value={statusFilter} />
                            <input name="filterQuery" type="hidden" value={queryFilter} />
                            <input name="filterPage" type="hidden" value={safePage} />
                            <input name="filterSort" type="hidden" value={sortField} />
                            <input name="filterOrder" type="hidden" value={sortOrder} />
                            <select name="status" defaultValue={request.status}>
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="closed">Closed</option>
                            </select>
                            <button className="button button--secondary" type="submit">
                              Save
                            </button>
                          </form>
                        </td>
                        <td>
                          <div>{formatDate(request.consentAt)}</div>
                          <div>{request.policyVersion ?? "-"}</div>
                        </td>
                        <td title={request.requestFingerprint ?? undefined}>{shortenValue(request.requestFingerprint, 14)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {totalPages > 1 ? (
                <div className="admin-pagination">
                  {safePage > 1 ? (
                    <a
                      className="button button--secondary"
                      href={`/admin/intake?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(queryFilter)}&sort=${encodeURIComponent(sortField)}&order=${encodeURIComponent(sortOrder)}&page=${safePage - 1}`}
                    >
                      Previous
                    </a>
                  ) : (
                    <span className="button button--secondary admin-button-disabled">Previous</span>
                  )}
                  {safePage < totalPages ? (
                    <a
                      className="button button--secondary"
                      href={`/admin/intake?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(queryFilter)}&sort=${encodeURIComponent(sortField)}&order=${encodeURIComponent(sortOrder)}&page=${safePage + 1}`}
                    >
                      Next
                    </a>
                  ) : (
                    <span className="button button--secondary admin-button-disabled">Next</span>
                  )}
                </div>
              ) : null}
            </>
          )}
        </article>
      </section>
    </main>
  );
}