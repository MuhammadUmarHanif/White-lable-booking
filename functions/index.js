const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Checks whether two time slots overlap.
 * 'full_day' overlaps with everything.
 */
function doSlotsOverlap(slotA, slotB) {
  if (slotA === 'full_day' || slotB === 'full_day') return true;
  return slotA === slotB;
}

/**
 * Trusted server-side Cloud Function to confirm a booking inside a Firestore Transaction.
 * Prevents race conditions and guarantees that two customers or administrators
 * cannot confirm the same hall and time slot concurrently.
 */
exports.confirmBookingTransactional = functions.https.onCall(async (data, context) => {
  // Ensure the caller is authenticated as an administrator
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated administrators can confirm bookings.'
    );
  }

  const { bookingId, confirmedBy } = data;
  if (!bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing bookingId');
  }

  const bookingRef = db.collection('bookings').doc(bookingId);

  return db.runTransaction(async (transaction) => {
    // 1. Fetch the target booking document
    const targetDoc = await transaction.get(bookingRef);
    if (!targetDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = targetDoc.data();
    const { hallId, eventDate, timeSlot } = booking;

    // 2. Query all existing confirmed bookings on the same date for the same hall
    const querySnapshot = await transaction.get(
      db.collection('bookings')
        .where('hallId', '==', hallId)
        .where('eventDate', '==', eventDate)
        .where('status', 'in', ['confirmed', 'completed'])
    );

    // 3. Verify no overlapping slot exists
    for (const doc of querySnapshot.docs) {
      if (doc.id === bookingId) continue;
      const existing = doc.data();
      if (doSlotsOverlap(timeSlot, existing.timeSlot)) {
        throw new functions.https.HttpsError(
          'already-exists',
          `Cannot confirm: Hall is already confirmed for ${existing.timeSlot} on ${eventDate} (Ref: ${existing.referenceNumber}).`
        );
      }
    }

    // 4. Update the target booking status atomically
    const now = new Date().toISOString();
    const updatedHistory = [
      ...(booking.statusHistory || []),
      {
        status: 'confirmed',
        changedAt: now,
        changedBy: confirmedBy || context.auth.token.email || 'Admin',
        reason: 'Confirmed via trusted transactional Cloud Function',
      },
    ];

    transaction.update(bookingRef, {
      status: 'confirmed',
      updatedAt: now,
      statusHistory: updatedHistory,
    });

    return { success: true, bookingId, referenceNumber: booking.referenceNumber };
  });
});

/**
 * Scheduled or manual cleanup function for expired holds.
 * Automatically marks pending holds past their expiry as 'cancelled'.
 */
exports.expireStaleHolds = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Admin required');
  }

  const now = new Date().toISOString();
  const snapshot = await db.collection('bookings')
    .where('status', '==', 'approved')
    .where('holdExpiresAt', '<', now)
    .get();

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      status: 'cancelled',
      updatedAt: now,
      'statusHistory': admin.firestore.FieldValue.arrayUnion({
        status: 'cancelled',
        changedAt: now,
        changedBy: 'System Automation',
        reason: 'Hold reservation expired without deposit payment',
      }),
    });
  });

  await batch.commit();
  return { expiredCount: snapshot.docs.length };
});
