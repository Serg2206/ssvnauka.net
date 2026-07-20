import postgres from "postgres";

const vercelEnvironment = process.env.VERCEL_ENV;

function readDeploymentValue(baseKey: string) {
  if (vercelEnvironment === "preview") {
    return process.env[`${baseKey}_PREVIEW`] ?? process.env[baseKey];
  }

  return process.env[baseKey];
}

export type IntakeDestinationKind = "private-storage" | "crm" | (string & {});

export type IntakeDeliveryContract = {
  source: string;
  destination: string;
  destinationKind: IntakeDestinationKind;
  payload: unknown;
};

export type IntakeForwardResult = {
  stored: boolean;
  destination: string | null;
  destinationKind: IntakeDestinationKind | null;
};

export type IntakeAdminRecord = {
  requestId: string;
  submittedAt: string;
  fullName: string;
  contactValue: string;
  contactMethod: string;
  summary: string;
  locale: string;
  status: string;
  userAgent: string | null;
  requestFingerprint: string | null;
  consentAt: string | null;
  policyVersion: string | null;
};

export type IntakeRequestStatus = "new" | "reviewed" | "closed";

export type IntakeListFilters = {
  status?: IntakeRequestStatus | "all";
  query?: string;
  sort?: IntakeSortField;
  order?: IntakeSortOrder;
};

export type IntakeSortField = "submittedAt" | "status" | "locale" | "fullName";

export type IntakeSortOrder = "asc" | "desc";

const intakeStatusValues = ["new", "reviewed", "closed"] as const;
const intakeSortFields = ["submittedAt", "status", "locale", "fullName"] as const;
const intakeSortOrders = ["asc", "desc"] as const;

type IntakeSubmissionPayload = {
  requestId: string;
  submittedAt: string;
  userAgent: string | null;
  requestFingerprint: string | null;
  intake: {
    fullName: string;
    contactValue: string;
    contactMethod: "email" | "phone" | "telegram";
    summary: string;
    locale: "en" | "ru" | "uk";
    consentData: "yes";
    consentPrivacy: "yes";
    honeypot?: string;
  };
};

const intakeDestinationKind = readDeploymentValue("INTAKE_DESTINATION_KIND")?.trim() || "private-storage";
const intakeDestinationKindPreview = readDeploymentValue("INTAKE_DESTINATION_KIND_PREVIEW")?.trim();
const intakePostgresUrl = readDeploymentValue("INTAKE_POSTGRES_URL")?.trim();
const intakePostgresSchema = readDeploymentValue("INTAKE_POSTGRES_SCHEMA")?.trim() || "public";
const intakePostgresRequestsTable =
  readDeploymentValue("INTAKE_POSTGRES_REQUESTS_TABLE")?.trim() || "intake_request";
const intakePostgresConsentsTable =
  readDeploymentValue("INTAKE_POSTGRES_CONSENTS_TABLE")?.trim() || "consent_record";
const intakePostgresName = readDeploymentValue("INTAKE_POSTGRES_NAME")?.trim() || "Supabase Postgres";
const intakePolicyVersion = readDeploymentValue("INTAKE_POLICY_VERSION")?.trim() || "v1";
const intakeDestinationUrl = readDeploymentValue("INTAKE_WEBHOOK_URL")?.trim();
const intakeDestinationToken = readDeploymentValue("INTAKE_WEBHOOK_TOKEN")?.trim();
const intakeWebhookName = readDeploymentValue("INTAKE_WEBHOOK_NAME")?.trim() || "configured private destination";

let postgresClient: ReturnType<typeof postgres> | null = null;

function readSqlIdentifier(baseKey: string, fallback: string) {
  const value = readDeploymentValue(baseKey)?.trim() || fallback;

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid ${baseKey} value.`);
  }

  return value;
}

function getPostgresClient() {
  if (!intakePostgresUrl) {
    return null;
  }

  if (!postgresClient) {
    postgresClient = postgres(intakePostgresUrl, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 5,
      ssl: "require",
      prepare: false
    });
  }

  return postgresClient;
}

function getDestinationName() {
  if (getPostgresClient()) {
    return intakePostgresName;
  }

  return intakeWebhookName;
}

function getDestinationTransport() {
  if (getPostgresClient()) {
    return "postgres" as const;
  }

  if (intakeDestinationUrl) {
    return "webhook" as const;
  }

  return null;
}

function resolveDestinationKind() {
  if (vercelEnvironment === "preview" && intakeDestinationKindPreview) {
    return intakeDestinationKindPreview;
  }

  return intakeDestinationKind;
}

function buildDeliveryContract(payload: unknown): IntakeDeliveryContract {
  return {
    source: "ssvnauka.com",
    destination: getDestinationName(),
    destinationKind: resolveDestinationKind(),
    payload
  };
}

export function buildIntakeDeliveryContract(payload: unknown): IntakeDeliveryContract {
  return buildDeliveryContract(payload);
}

export function getIntakeDestinationKind() {
  return resolveDestinationKind();
}

export function getIntakeDestinationName() {
  return getDestinationName();
}

export function isIntakePostgresConfigured() {
  return Boolean(getPostgresClient());
}

export function isValidIntakeStatus(value: string): value is IntakeRequestStatus {
  return intakeStatusValues.includes(value as IntakeRequestStatus);
}

export function isValidIntakeSortField(value: string): value is IntakeSortField {
  return intakeSortFields.includes(value as IntakeSortField);
}

export function isValidIntakeSortOrder(value: string): value is IntakeSortOrder {
  return intakeSortOrders.includes(value as IntakeSortOrder);
}

function resolveIntakeSortField(sort?: IntakeSortField) {
  switch (sort) {
    case "status":
      return 'request.status';
    case "locale":
      return 'request.locale';
    case "fullName":
      return 'request.full_name';
    case "submittedAt":
    default:
      return 'request.submitted_at';
  }
}

function resolveIntakeSortOrder(order?: IntakeSortOrder) {
  return order === "asc" ? "asc" : "desc";
}

function buildIntakeFilterWhereClause(filters?: IntakeListFilters) {
  const conditions: string[] = [];
  const values: string[] = [];

  if (filters?.status && filters.status !== "all" && isValidIntakeStatus(filters.status)) {
    values.push(filters.status);
    conditions.push(`request.status = $${values.length}`);
  }

  if (filters?.query?.trim()) {
    const searchValue = `%${filters.query.trim().toLowerCase()}%`;
    values.push(searchValue);
    conditions.push(
      `(lower(request.full_name) like $${values.length} or lower(request.contact_value) like $${values.length} or lower(request.summary) like $${values.length})`
    );
  }

  return {
    whereClause: conditions.length > 0 ? `where ${conditions.join(" and ")}` : "",
    values
  };
}

export async function countIntakeRequests(filters?: IntakeListFilters): Promise<number> {
  const client = getPostgresClient();

  if (!client) {
    return 0;
  }

  const schema = readSqlIdentifier("INTAKE_POSTGRES_SCHEMA", intakePostgresSchema);
  const requestsTable = readSqlIdentifier("INTAKE_POSTGRES_REQUESTS_TABLE", intakePostgresRequestsTable);
  const { whereClause, values } = buildIntakeFilterWhereClause(filters);

  const result = await client.unsafe<{ total: string }[]>(
    `select count(*)::text as "total"
     from ${schema}.${requestsTable} request
     ${whereClause}`,
    values
  );

  return Number.parseInt(result[0]?.total ?? "0", 10);
}

export async function listRecentIntakeRequests(
  limit = 50,
  filters?: IntakeListFilters,
  offset = 0
): Promise<IntakeAdminRecord[]> {
  const client = getPostgresClient();

  if (!client) {
    return [];
  }

  const schema = readSqlIdentifier("INTAKE_POSTGRES_SCHEMA", intakePostgresSchema);
  const requestsTable = readSqlIdentifier("INTAKE_POSTGRES_REQUESTS_TABLE", intakePostgresRequestsTable);
  const consentsTable = readSqlIdentifier("INTAKE_POSTGRES_CONSENTS_TABLE", intakePostgresConsentsTable);
  const safeLimit = Math.min(Math.max(limit, 1), 500);
  const safeOffset = Math.max(offset, 0);
  const { whereClause, values } = buildIntakeFilterWhereClause(filters);
  const sortField = resolveIntakeSortField(filters?.sort);
  const sortOrder = resolveIntakeSortOrder(filters?.order);

  values.push(String(safeLimit));
  const limitPlaceholder = `$${values.length}`;
  values.push(String(safeOffset));
  const offsetPlaceholder = `$${values.length}`;

  return client.unsafe<IntakeAdminRecord[]>(
    `select
      request.request_id as "requestId",
      request.submitted_at as "submittedAt",
      request.full_name as "fullName",
      request.contact_value as "contactValue",
      request.contact_method as "contactMethod",
      request.summary as "summary",
      request.locale as "locale",
      request.status as "status",
      request.user_agent as "userAgent",
      request.request_fingerprint as "requestFingerprint",
      consent.consent_at as "consentAt",
      consent.policy_version as "policyVersion"
    from ${schema}.${requestsTable} request
    left join ${schema}.${consentsTable} consent on consent.request_id = request.request_id
    ${whereClause}
    order by ${sortField} ${sortOrder}, request.submitted_at desc
    limit ${limitPlaceholder}
    offset ${offsetPlaceholder}`,
    values
  );
}

export async function getIntakeRequestById(requestId: string): Promise<IntakeAdminRecord | null> {
  const client = getPostgresClient();

  if (!client) {
    return null;
  }

  const schema = readSqlIdentifier("INTAKE_POSTGRES_SCHEMA", intakePostgresSchema);
  const requestsTable = readSqlIdentifier("INTAKE_POSTGRES_REQUESTS_TABLE", intakePostgresRequestsTable);
  const consentsTable = readSqlIdentifier("INTAKE_POSTGRES_CONSENTS_TABLE", intakePostgresConsentsTable);

  const result = await client.unsafe<IntakeAdminRecord[]>(
    `select
      request.request_id as "requestId",
      request.submitted_at as "submittedAt",
      request.full_name as "fullName",
      request.contact_value as "contactValue",
      request.contact_method as "contactMethod",
      request.summary as "summary",
      request.locale as "locale",
      request.status as "status",
      request.user_agent as "userAgent",
      request.request_fingerprint as "requestFingerprint",
      consent.consent_at as "consentAt",
      consent.policy_version as "policyVersion"
    from ${schema}.${requestsTable} request
    left join ${schema}.${consentsTable} consent on consent.request_id = request.request_id
    where request.request_id = $1
    limit 1`,
    [requestId]
  );

  return result[0] ?? null;
}

export async function updateIntakeRequestStatus(requestId: string, status: IntakeRequestStatus) {
  const client = getPostgresClient();

  if (!client) {
    return false;
  }

  if (!isValidIntakeStatus(status)) {
    return false;
  }

  const schema = readSqlIdentifier("INTAKE_POSTGRES_SCHEMA", intakePostgresSchema);
  const requestsTable = readSqlIdentifier("INTAKE_POSTGRES_REQUESTS_TABLE", intakePostgresRequestsTable);

  const result = await client.unsafe<{ updated: number }[]>(
    `update ${schema}.${requestsTable}
      set status = $1
      where request_id = $2
      returning 1 as "updated"`,
    [status, requestId]
  );

  return result.length > 0;
}

async function storeIntakeInPostgres(payload: IntakeSubmissionPayload) {
  const client = getPostgresClient();

  if (!client) {
    return { stored: false, destination: null, destinationKind: null };
  }

  const schema = readSqlIdentifier("INTAKE_POSTGRES_SCHEMA", intakePostgresSchema);
  const requestsTable = readSqlIdentifier("INTAKE_POSTGRES_REQUESTS_TABLE", intakePostgresRequestsTable);
  const consentsTable = readSqlIdentifier("INTAKE_POSTGRES_CONSENTS_TABLE", intakePostgresConsentsTable);

  await client.begin(async (tx) => {
    await tx.unsafe(
      `insert into ${schema}.${requestsTable} (
        request_id,
        submitted_at,
        source,
        full_name,
        contact_value,
        contact_method,
        summary,
        locale,
        user_agent,
        request_fingerprint,
        status
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        payload.requestId,
        payload.submittedAt,
        "ssvnauka.com",
        payload.intake.fullName,
        payload.intake.contactValue,
        payload.intake.contactMethod,
        payload.intake.summary,
        payload.intake.locale,
        payload.userAgent,
        payload.requestFingerprint,
        "new"
      ]
    );

    await tx.unsafe(
      `insert into ${schema}.${consentsTable} (
        request_id,
        consent_data,
        consent_privacy,
        consent_at,
        policy_version
      ) values ($1, $2, $3, $4, $5)`,
      [payload.requestId, true, true, payload.submittedAt, intakePolicyVersion]
    );
  });

  return {
    stored: true,
    destination: intakePostgresName,
    destinationKind: resolveDestinationKind()
  };
}

export async function forwardIntakeToDestination(payload: unknown): Promise<IntakeForwardResult> {
  const transport = getDestinationTransport();

  if (transport === "postgres") {
    return storeIntakeInPostgres(payload as IntakeSubmissionPayload);
  }

  if (!intakeDestinationUrl) {
    return { stored: false, destination: null, destinationKind: null };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(intakeDestinationUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(intakeDestinationToken ? { Authorization: `Bearer ${intakeDestinationToken}` } : {})
      },
      body: JSON.stringify(buildDeliveryContract(payload))
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(
        `Configured destination responded with ${response.status}${details ? `: ${details.slice(0, 200)}` : ""}`
      );
    }

    return {
      stored: true,
      destination: intakeWebhookName,
      destinationKind: resolveDestinationKind()
    };
  } finally {
    clearTimeout(timeoutId);
  }
}