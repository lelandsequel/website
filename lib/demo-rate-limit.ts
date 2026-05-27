import { createHash } from "node:crypto";

type RateLimitConfig = {
  namespace: string;
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitDecision = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  subjectHash: string;
};

const globalBuckets = globalThis as typeof globalThis & {
  __jourdanPublicRunRateBuckets?: Map<string, Bucket>;
  __jourdanDemoRateBuckets?: Map<string, Bucket>;
};

const buckets =
  globalBuckets.__jourdanPublicRunRateBuckets ??
  globalBuckets.__jourdanDemoRateBuckets ??
  new Map<string, Bucket>();
globalBuckets.__jourdanPublicRunRateBuckets = buckets;
globalBuckets.__jourdanDemoRateBuckets = buckets;

export function checkDemoRateLimit(request: Request, config: RateLimitConfig): RateLimitDecision {
  const now = Date.now();
  const subject = identifyRequestSubject(request);
  const key = `${config.namespace}:${subject}`;
  const existing = buckets.get(key);
  const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + config.windowMs };

  if (bucket.count >= config.limit) {
    return {
      ok: false,
      limit: config.limit,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      subjectHash: shortHash(subject),
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    ok: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - bucket.count),
    resetAt: bucket.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    subjectHash: shortHash(subject),
  };
}

export function rateLimitHeaders(decision: RateLimitDecision) {
  return {
    "x-public-run-limit": String(decision.limit),
    "x-public-run-remaining": String(decision.remaining),
    "x-public-run-reset": new Date(decision.resetAt).toISOString(),
    "x-public-run-subject": decision.subjectHash,
    "x-demo-rate-limit": String(decision.limit),
    "x-demo-rate-remaining": String(decision.remaining),
    "x-demo-rate-reset": new Date(decision.resetAt).toISOString(),
    "x-demo-rate-subject": decision.subjectHash,
    ...(decision.ok ? {} : { "retry-after": String(decision.retryAfterSeconds) }),
  };
}

export function rateLimitExceededBody(decision: RateLimitDecision) {
  return {
    error: "Public run gate exhausted for this IP window.",
    detail:
      "This public deterministic runner is capped so the live workbench stays useful. Try again after the reset time or contact JourdanLabs for an evaluation key.",
    retry_after_seconds: decision.retryAfterSeconds,
    reset_at: new Date(decision.resetAt).toISOString(),
  };
}

function identifyRequestSubject(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const flyIp = request.headers.get("fly-client-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.slice(0, 96) ?? "unknown-agent";
  return forwarded || realIp || flyIp || `local:${userAgent}`;
}

function shortHash(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}
