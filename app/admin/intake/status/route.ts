import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminSessionCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { isValidIntakeStatus, updateIntakeRequestStatus } from "@/lib/intake-delivery";

export const runtime = "nodejs";

function redirectToAdmin(request: Request, query = "") {
  return NextResponse.redirect(new URL(`/admin/intake${query}`, request.url), { status: 303 });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(adminSessionCookieName)?.value;

  if (!isValidAdminSession(sessionValue)) {
    return redirectToAdmin(request, "?error=unauthorized");
  }

  const formData = await request.formData();
  const requestId = formData.get("requestId");
  const status = formData.get("status");
  const filterStatus = formData.get("filterStatus");
  const filterQuery = formData.get("filterQuery");
  const filterPage = formData.get("filterPage");
  const filterSort = formData.get("filterSort");
  const filterOrder = formData.get("filterOrder");

  if (typeof requestId !== "string" || typeof status !== "string" || !isValidIntakeStatus(status)) {
    return redirectToAdmin(request, "?error=invalid-status");
  }

  const updated = await updateIntakeRequestStatus(requestId, status);
  const queryParts: string[] = [updated ? "updated=1" : "error=update-failed"];

  if (typeof filterStatus === "string" && filterStatus.length > 0) {
    queryParts.push(`status=${encodeURIComponent(filterStatus)}`);
  }

  if (typeof filterQuery === "string" && filterQuery.trim().length > 0) {
    queryParts.push(`q=${encodeURIComponent(filterQuery.trim())}`);
  }

  if (typeof filterPage === "string" && filterPage.trim().length > 0) {
    queryParts.push(`page=${encodeURIComponent(filterPage.trim())}`);
  }

  if (typeof filterSort === "string" && filterSort.trim().length > 0) {
    queryParts.push(`sort=${encodeURIComponent(filterSort.trim())}`);
  }

  if (typeof filterOrder === "string" && filterOrder.trim().length > 0) {
    queryParts.push(`order=${encodeURIComponent(filterOrder.trim())}`);
  }

  return redirectToAdmin(request, `?${queryParts.join("&")}`);
}