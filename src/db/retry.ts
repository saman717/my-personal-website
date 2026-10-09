// Wrapper برای retry کردن query در صورت statement timeout یا connection errors
// Supabase free tier گاهی query ها رو با code 57014 cancel می‌کنه
// در حالت cold start هم connection errors ممکنه بیاد
//
// ⚠️ بودجه‌ی زمانی: retry بی‌حساب باعث می‌شود یک خطای کند تبدیل به هنگِ طولانی شود.
// با connect_timeout=10 و ۳ تلاش و backoff ۸۰۰/۱۶۰۰ms، بدترین حالت ~۳۳ ثانیه بود.
// حالا کل عملیات با یک deadline سقف‌گذاری می‌شود.

const RETRYABLE = new Set([
  '57014', // statement_timeout
  '08006', // connection_failure
  '08001', // sqlclient_unable_to_establish_sqlconnection
  '08003', // connection_does_not_exist
  '08004', // sqlserver_rejected_establishment
  'CONNECTION_ENDED',
  'CONNECTION_CLOSED',
  'CONNECTION_DESTROYED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
]);

function errCode(err: unknown): string | undefined {
  const e = err as { code?: string; errno?: string; cause?: { code?: string } };
  return e?.code ?? e?.cause?.code ?? e?.errno;
}

export async function dbRetry<T>(
  fn: () => Promise<T>,
  attempts = 2,
  deadlineMs = 12_000
): Promise<T> {
  const start = Date.now();
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;

      const retryable = RETRYABLE.has(errCode(err) ?? '');
      const lastAttempt = i === attempts - 1;
      const outOfTime = Date.now() - start > deadlineMs;

      // غیرقابل retry، آخرین تلاش، یا از بودجه زمانی گذشتیم → پرتاب کن
      if (!retryable || lastAttempt || outOfTime) throw err;

      // backoff کوتاه — ۴۰۰ms، ۸۰۰ms
      await new Promise<void>((r) => setTimeout(r, 400 * (i + 1)));
    }
  }

  throw lastErr;
}
