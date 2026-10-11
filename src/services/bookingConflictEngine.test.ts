import { describe, it, expect } from 'vitest';
import { checkBookingConflict, doSlotsOverlap } from './bookingConflictEngine';
import { BookingRequest } from '../types';

describe('Booking Conflict Engine', () => {
  it('correctly calculates slot overlap', () => {
    expect(doSlotsOverlap('dinner', 'dinner')).toBe(true);
    expect(doSlotsOverlap('dinner', 'lunch')).toBe(false);
    expect(doSlotsOverlap('full_day', 'lunch')).toBe(true);
    expect(doSlotsOverlap('lunch', 'full_day')).toBe(true);
  });

  const mockConfirmedBooking: BookingRequest = {
    id: 'booking-1',
    referenceNumber: 'MRQ-2026-001',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
    customerName: 'Alexander Wright',
    customerPhone: '+1-555-0192',
    customerEmail: 'alex@example.com',
    eventType: 'wedding',
    eventDate: '2026-11-20',
    timeSlot: 'dinner',
    guestCount: 500,
    hallId: 'hall-imperial-grand',
    hallName: 'The Imperial Grand Hall',
    calculatorSnapshot: {} as any,
    calculationSnapshot: {} as any,
    status: 'confirmed',
    statusHistory: [],
    totalQuotationAmount: 35000,
    advanceRequired: 10500,
    totalPaid: 10500,
    outstandingBalance: 24500,
    payments: [],
  };

  it('detects conflict for same hall, date, and overlapping slot', () => {
    const result = checkBookingConflict(
      {
        hallId: 'hall-imperial-grand',
        eventDate: '2026-11-20',
        timeSlot: 'dinner',
      },
      [mockConfirmedBooking]
    );

    expect(result.hasConflict).toBe(true);
    expect(result.conflictingBookingId).toBe('booking-1');
  });

  it('allows booking on same date if slot is different (e.g. lunch vs dinner)', () => {
    const result = checkBookingConflict(
      {
        hallId: 'hall-imperial-grand',
        eventDate: '2026-11-20',
        timeSlot: 'lunch', // Confirmed is dinner
      },
      [mockConfirmedBooking]
    );

    expect(result.hasConflict).toBe(false);
  });

  it('allows booking on same date and slot if different hall', () => {
    const result = checkBookingConflict(
      {
        hallId: 'hall-crystal-pavilion', // Different hall
        eventDate: '2026-11-20',
        timeSlot: 'dinner',
      },
      [mockConfirmedBooking]
    );

    expect(result.hasConflict).toBe(false);
  });

  it('ignores cancelled or rejected bookings', () => {
    const cancelledBooking: BookingRequest = {
      ...mockConfirmedBooking,
      id: 'booking-2',
      status: 'cancelled',
    };

    const result = checkBookingConflict(
      {
        hallId: 'hall-imperial-grand',
        eventDate: '2026-11-20',
        timeSlot: 'dinner',
      },
      [cancelledBooking]
    );

    expect(result.hasConflict).toBe(false);
  });

  it('allows booking if pending approved hold has expired', () => {
    const expiredHoldBooking: BookingRequest = {
      ...mockConfirmedBooking,
      id: 'booking-3',
      status: 'approved',
      holdExpiresAt: '2026-10-05T00:00:00Z', // Expired
    };

    const result = checkBookingConflict(
      {
        hallId: 'hall-imperial-grand',
        eventDate: '2026-11-20',
        timeSlot: 'dinner',
      },
      [expiredHoldBooking],
      '2026-10-10T00:00:00Z' // Current time > holdExpiresAt
    );

    expect(result.hasConflict).toBe(false);
  });
});
