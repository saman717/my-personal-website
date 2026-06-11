
import { db } from "@/lib/db";
import { reservations } from "@/lib/schema";
import { and, eq, or, between } from "drizzle-orm";

export async function checkTimeConflict(
  requestedStart: Date,
  requestedEnd: Date
): Promise<boolean> {
  const conflicts = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.status, "confirmed"), // highlight-line
        or(
          between(reservations.startTime, requestedStart, requestedEnd),
          between(reservations.endTime, requestedStart, requestedEnd)
        )
      )
    );

  return conflicts.length > 0;
}