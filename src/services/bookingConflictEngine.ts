import { BookingRequest, TimeSlot, BookingStatus } from '../types';

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBookingId?: string;
  reason?: string;
  isDateHeldByPending?: boolean;
}

/**
 * Checks whether two time slots conflict with each other.
 * If one booking is 'full_day', it conflicts with any slot on that date.
 * If slots are identical (e.g. 'dinner' vs 'dinner'), they conflict.
 */
export function doSlotsOverlap(slotA: TimeSlot, slotB: TimeSlot): boolean {
  if (slotA === 'full_day' || slotB === 'full_day') return true;
  return slotA === slotB;
}

/**
 * Validates whether a proposed booking conflicts with existing bookings.
 * 
 * Rules:
 * 1. Only 'confirmed' or valid unexpired 'approved' / active-held bookings create a hard blocking conflict.
 * 2. 'cancelled' and 'rejected' bookings NEVER conflict.
 * 3. Expired pending bookings (past their hold expiration date) do not block dates.
 * 4. Distinct halls never conflict with each other on the same date/slot.
 */
export function checkBookingConflict(
  proposed: {
    hallId: string;
    eventDate: string;
    timeSlot: TimeSlot;
    excludeBookingId?: string;
  },
  existingBookings: BookingRequest[],
  currentTimestamp: string = new Date().toISOString()
): ConflictCheckResult {
  const activeBookingsOnSameDate = existingBookings.filter((b) => {
    if (proposed.excludeBookingId && b.id === proposed.excludeBookingId) return false;
    if (b.hallId !== proposed.hallId) return false;
    if (b.eventDate !== proposed.eventDate) return false;
    return true;
  });

  for (const booking of activeBookingsOnSameDate) {
    // Check if slots overlap
    if (doSlotsOverlap(proposed.timeSlot, booking.timeSlot)) {
      // 1. Hard Conflict: Confirmed or Completed booking
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        return {
          hasConflict: true,
          conflictingBookingId: booking.id,
          reason: `Hall is already confirmed/reserved for ${booking.timeSlot} on ${booking.eventDate} (Ref: ${booking.referenceNumber}).`,
        };
      }

      // 2. Owner-approved active hold with unexpired hold date
      if (booking.status === 'approved') {
        const isHoldActive = !booking.holdExpiresAt || new Date(booking.holdExpiresAt) > new Date(currentTimestamp);
        if (isHoldActive) {
          return {
            hasConflict: true,
            conflictingBookingId: booking.id,
            reason: `Hall has an active approved hold reserved until ${booking.holdExpiresAt ? new Date(booking.holdExpiresAt).toLocaleDateString() : 'deposit payment'} (Ref: ${booking.referenceNumber}).`,
          };
        }
      }

      // 3. Pending request (informational, does not block owner from confirming another request)
      if (booking.status === 'pending') {
        return {
          hasConflict: false,
          conflictingBookingId: booking.id,
          isDateHeldByPending: true,
          reason: `There is a pending customer inquiry for this date (Ref: ${booking.referenceNumber}), but it is not yet confirmed.`,
        };
      }
    }
  }

  return { hasConflict: false };
}
