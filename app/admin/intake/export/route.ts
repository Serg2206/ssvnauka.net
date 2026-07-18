import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminSessionCookieName, isValidAdminSession } from "@/lib/admin-auth";
import {
  isValidIntakeStatus,
  isValidIntakeSortField,
  isValidIntakeSortOrder,
  listRecentIntakeRequests,
  type IntakeAdminRecord,
  type IntakeSortField,
  type IntakeSortOrder
} from "@/lib/intake-delivery";

export const runtime = "nodejs";

function toCsvRow(values: Array<string | null>) {
  return values
    .map((value) => {
      const raw = value ?? "";
      const escaped = raw.split('"').join('""');
      return `"${escaped}"`;
    })
    .join(",");
}

function toCsv(records: IntakeAdminRecord[]) {
  const header = toCsvRow([
    "requestId",
    "submittedAt",
    "fullName",
    "contactValue",
    "contactMethod",
    "summary",
    "locale",
    "status",
    "userAgent",
    "requestFingerprint",
    "consentAt",
    "policyVersion"
  ]);

  const rows = records.map((record) =>
    toCsvRow([
      record.requestId,
      record.submittedAt,
      record.fullName,
      record.contactValue,
      record.contactMethod,
      record.summary,
      record.locale,
      record.status,
      record.userAgent,
      record.requestFingerprint,
      record.consentAt,
      record.policyVersion
    ])
  );

  return [header, ...rows].join("\n");
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(adminSessionCookieName)?.value;

  if (!isValidAdminSession(sessionValue)) {
    return NextResponse.redirect(new URL("/admin/intake?error=unauthorized", request.url), { status: 303 });
  }

  const requestUrl = new URL(request.url);
  const statusParam = requestUrl.searchParams.get("status");
  const queryParam = requestUrl.searchParams.get("q") ?? "";
  const sortParam = requestUrl.searchParams.get("sort");
  const orderParam = requestUrl.searchParams.get("order");
  const statusFilter =
    statusParam === "all" || (typeof statusParam === "string" && isValidIntakeStatus(statusParam))
      ? statusParam
      : "all";
  const sortField: IntakeSortField =
    typeof sortParam === "string" && isValidIntakeSortField(sortParam) ? sortParam : "submittedAt";
  const sortOrder: IntakeSortOrder =
    typeof orderParam === "string" && isValidIntakeSortOrder(orderParam) ? orderParam : "desc";

  const allRows: IntakeAdminRecord[] = [];
  const batchSize = 200;
  const maxRows = 2000;

  for (let offset = 0; offset < maxRows; offset += batchSize) {
    const batch = await listRecentIntakeRequests(
      batchSize,
      {
        status: statusFilter,
        query: queryParam,
        sort: sortField,
        order: sortOrder
      },
      offset
    );

    allRows.push(...batch);

    if (batch.length < batchSize) {
      break;
    }
  }

  const csvContent = toCsv(allRows);
  const nowStamp = new Date().toISOString().split(":").join("-");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="intake-export-${nowStamp}.csv"`,
      "Cache-Control": "no-store"
    }
  });
}