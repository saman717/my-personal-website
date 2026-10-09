// Wrapper برای retry کردن query در صورت statement timeout یا connection errors
// Supabase free tier گاهی query ها رو با code 57014 cancel می‌کنه
// در حالت cold start هم connection errors ممکنه بیاد

export async function dbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;

      // Postgres error code یا TCP connection error
      const code =
        (err as any)?.code ??
        (err as any)?.cause?.code ??
        (err as any)?.errno;

      // کدهای قابل retry — statement timeout + connection issues
      const retryable =
        code === '57014' ||              // statement_timeout
        code === '08006' ||              // connection_failure
        code === '08001' ||              // sqlclient_unable_to_establish_sqlconnection
        code === '08003' ||              // connection_does_not_exist
        code === '08004' ||              // sqlserver_rejected_establishment
        code === 'CONNECTION_ENDED' ||
        code === 'CONNECTION_CLOSED' ||
        code === 'CONNECTION_DESTROYED' ||
        code === 'ECONNRESET' ||
        code === 'ETIMEDOUT' ||
        code === 'ECONNREFUSED';

      // آخرین تلاش یا خطای غیر قابل retry — پرتاب کن
      if (!retryable || i === attempts - 1) throw err;

      // Exponential backoff: 800ms, 1600ms, 2400ms
      await new Promise<void>((r) => setTimeout(r, 800 * (i + 1)));
    }
  }

  throw lastErr;
}
