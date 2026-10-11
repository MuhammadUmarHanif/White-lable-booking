import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BookingRequest, BookingStatus, PaymentRecord } from '../../types';
import { getBookingById, updateBookingStatus, addPaymentToBooking, deleteBooking } from '../../services/firebaseService';
import { useBrand } from '../../context/BrandContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Calendar,
  ShieldCheck,
  Send,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brand } = useBrand();
  const { currentUser } = useAuth();

  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Reason modal state for declining/cancelling
  const [statusPrompt, setStatusPrompt] = useState<{ status: BookingStatus; title: string } | null>(null);
  const [statusReason, setStatusReason] = useState('');

  // Payment Form State & Errors
  const [payAmount, setPayAmount] = useState('');
  const [payAmountError, setPayAmountError] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'cash' | 'credit_card' | 'cheque'>('bank_transfer');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  const loadData = () => {
    if (id) {
      getBookingById(id).then((res) => {
        setBooking(res);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: BookingStatus, customReason?: string) => {
    if (!booking) return;
    setActionError(null);
    setActionSuccess(null);

    const changedByName = currentUser?.displayName || 'Administrator';
    const res = await updateBookingStatus(
      booking.id,
      newStatus,
      changedByName,
      customReason || `Status updated to ${newStatus}`
    );

    if (res.success) {
      setActionSuccess(`Booking status successfully transitioned to ${newStatus.toUpperCase()}`);
      setStatusPrompt(null);
      setStatusReason('');
      loadData();
    } else {
      setActionError(res.message || 'Failed to update booking status.');
    }
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;
    try {
      await deleteBooking(booking.id);
      navigate('/admin/bookings');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete booking.');
      setShowDeleteModal(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setPayAmountError(null);

    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayAmountError('Please enter a valid positive payment amount.');
      return;
    }

    setIsRecordingPayment(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await addPaymentToBooking(booking.id, {
      amount: amountNum,
      date: new Date().toISOString(),
      paymentMethod: payMethod,
      transactionReference: payRef.trim() || `REF-${Date.now()}`,
      notes: payNotes.trim() || undefined,
      recordedBy: currentUser?.displayName || 'Administrator',
    });

    setIsRecordingPayment(false);
    if (res.success && res.updatedBooking) {
      setBooking(res.updatedBooking);
      setPayAmount('');
      setPayRef('');
      setPayNotes('');
      setPayAmountError(null);
      setActionSuccess(`Payment deposit of ${brand.currencySymbol} ${Math.round(amountNum).toLocaleString()} successfully recorded!`);
    } else {
      setActionError(res.message || 'Failed to record payment.');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Booking Record">
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto" />
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout title="Booking Not Found">
        <div className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-[#1C1917]">Booking record not found.</h2>
          <Link to="/admin/bookings" className="text-xs text-[#997A15] underline">
            Return to bookings list
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Booking Details: ${booking.referenceNumber}`}
      subtitle={`Created on ${new Date(booking.createdAt).toLocaleString()}`}
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Bookings</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={`/quotation/${booking.id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-[#1C1917] transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print Official Quotation</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Booking</span>
            </button>
          </div>
        </div>

        {/* Feedback alerts */}
        {actionError && (
          <AdminAlert
            type="error"
            title="Validation Conflict / Action Error"
            message={actionError}
            onClose={() => setActionError(null)}
          />
        )}

        {actionSuccess && (
          <AdminAlert
            type="success"
            message={actionSuccess}
            onClose={() => setActionSuccess(null)}
          />
        )}

        {/* Status Transition Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
              Current Reservation Status
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                    : booking.status === 'approved'
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500/20'
                    : booking.status === 'pending'
                    ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-500/20'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {booking.status}
              </span>
              {booking.holdExpiresAt && booking.status !== 'confirmed' && (
                <span className="text-xs text-[#78716C]">
                  Hold Expiration: {new Date(booking.holdExpiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons based on status */}
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  Approve 7-Day Hold
                </button>
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm transition-all"
                >
                  Confirm Booking Now
                </button>
                <button
                  onClick={() => setStatusPrompt({ status: 'rejected', title: 'Decline Booking Request' })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-stone-700 border border-stone-200 hover:bg-stone-50 transition-all"
                >
                  Decline
                </button>
              </>
            )}

            {booking.status === 'approved' && (
              <>
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm transition-all"
                >
                  Confirm Contract & Lock Date
                </button>
                <button
                  onClick={() => setStatusPrompt({ status: 'cancelled', title: 'Release Hold / Cancel Reservation' })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all"
                >
                  Release Hold / Cancel
                </button>
              </>
            )}

            {booking.status === 'confirmed' && (
              <>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 shadow-sm transition-all"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => setStatusPrompt({ status: 'cancelled', title: 'Cancel Confirmed Booking' })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all"
                >
                  Cancel Booking
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Host info, itemized quotation, payments */}
          <div className="lg:col-span-8 space-y-6">
            {/* Host Details */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Customer & Event Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[#78716C] block">Host Name</span>
                  <span className="font-bold text-sm text-[#1C1917] block">{booking.customerName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#78716C] block">Phone Number</span>
                  <a href={`tel:${booking.customerPhone}`} className="font-semibold text-stone-900 block hover:text-[#D4AF37]">
                    {booking.customerPhone}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[#78716C] block">Email Address</span>
                  <a href={`mailto:${booking.customerEmail}`} className="font-semibold text-stone-900 block hover:text-[#D4AF37]">
                    {booking.customerEmail}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-stone-100 text-xs">
                <div className="space-y-1">
                  <span className="text-[#78716C] block">Hall Space</span>
                  <span className="font-semibold text-stone-900 block">{booking.hallName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#78716C] block">Scheduled Date & Slot</span>
                  <span className="font-semibold text-stone-900 block">
                    {booking.eventDate} ({booking.timeSlot})
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#78716C] block">Guest Attendance</span>
                  <span className="font-semibold text-stone-900 block">{booking.guestCount} Guests</span>
                </div>
              </div>

              {booking.customerNotes && (
                <div className="pt-3 border-t border-stone-100 text-xs">
                  <span className="text-[#78716C] block font-semibold">Host Special Notes:</span>
                  <p className="text-stone-700 mt-1 italic">{booking.customerNotes}</p>
                </div>
              )}
            </div>

            {/* Payments & Transactions Log */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Payment Records & Balances
                </h3>
                <span className="text-xs font-semibold text-emerald-700">
                  Total Collected: {brand.currencySymbol} {Math.round(booking.totalPaid).toLocaleString()}
                </span>
              </div>

              {/* Record Payment Form */}
              <form onSubmit={handleRecordPayment} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 text-xs">
                <span className="font-bold text-[#1C1917] block">Record New Payment Deposit</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder={`Amount in ${brand.currencySymbol} (e.g. 50000)`}
                      value={payAmount}
                      onChange={(e) => {
                        setPayAmount(e.target.value);
                        if (payAmountError) setPayAmountError(null);
                      }}
                      className={`w-full px-3 py-2 rounded-xl border bg-white ${
                        payAmountError
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                          : 'border-stone-200 focus:ring-2 focus:ring-[#D4AF37]'
                      }`}
                    />
                    {payAmountError && (
                      <p className="text-[11px] text-rose-600 font-medium">{payAmountError}</p>
                    )}
                  </div>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="bank_transfer">Bank Wire Transfer</option>
                    <option value="cash">Direct Cash</option>
                    <option value="credit_card">Credit / Debit Card</option>
                    <option value="cheque">Bank Cheque</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Tx Ref / Cheque # (Optional)"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Internal memo / note..."
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={isRecordingPayment}
                    className="px-4 py-2 rounded-xl text-xs font-semibold uppercase text-white gold-gradient-bg shadow-sm hover:opacity-95 disabled:opacity-50"
                  >
                    {isRecordingPayment ? 'Recording...' : 'Register Payment'}
                  </button>
                </div>
              </form>

              {/* Transactions List */}
              {(!booking.payments || booking.payments.length === 0) ? (
                <p className="text-xs text-[#78716C] py-2">No payments logged yet.</p>
              ) : (
                <div className="divide-y divide-stone-100 text-xs">
                  {booking.payments.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#1C1917] block">
                          {brand.currencySymbol} {Math.round(p.amount).toLocaleString()} ({p.paymentMethod.replace('_', ' ')})
                        </span>
                        <span className="text-[10px] text-[#78716C]">
                          Ref: {p.transactionReference} • {new Date(p.date).toLocaleString()} • Logged by {p.recordedBy}
                        </span>
                      </div>
                      {p.notes && <span className="text-[11px] text-stone-500 italic">{p.notes}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Agreed Quotation Itemized Snapshot */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Itemized Quotation Snapshot
              </h3>
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F5] border-b border-stone-200 text-[#78716C] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {booking.calculationSnapshot.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-3 font-medium text-[#1C1917]">{item.label}</td>
                        <td className="py-2 px-3 text-center text-[#78716C]">{item.quantity}</td>
                        <td className="py-2 px-3 text-right font-semibold text-[#1C1917]">
                          {brand.currencySymbol} {Math.round(Math.abs(item.subtotal)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Balances & Audit Trail */}
          <div className="lg:col-span-4 space-y-6">
            {/* Financial Overview Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-[#1C1917] border-b border-stone-100 pb-2">
                Financial Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[#78716C]">
                  <span>Total Quotation:</span>
                  <span className="font-bold text-[#1C1917]">
                    {brand.currencySymbol} {Math.round(booking.totalQuotationAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Required Advance:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {brand.currencySymbol} {Math.round(booking.advanceRequired).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Total Paid:</span>
                  <span className="font-bold">
                    {brand.currencySymbol} {Math.round(booking.totalPaid).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-[#1C1917]">
                  <span>Outstanding Balance:</span>
                  <span className={booking.outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                    {brand.currencySymbol} {Math.round(booking.outstandingBalance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit History Log */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-[#1C1917] border-b border-stone-100 pb-2">
                Status History Audit Trail
              </h3>
              <div className="space-y-3">
                {booking.statusHistory.map((h, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-[#D4AF37] space-y-0.5">
                    <span className="font-bold text-[#1C1917] capitalize block">
                      {h.status}
                    </span>
                    <span className="text-[10px] text-[#78716C] block">
                      {new Date(h.changedAt).toLocaleString()} by {h.changedBy}
                    </span>
                    {h.reason && <p className="text-[11px] text-stone-600 italic">{h.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Booking Record"
        message={`Are you sure you want to permanently delete booking ${booking.referenceNumber} for "${booking.customerName}"? All payment records and quotation logs will be permanently erased.`}
        confirmLabel="Yes, Delete Booking"
        cancelLabel="Keep Booking"
        isDestructive={true}
        onConfirm={handleDeleteBooking}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Decline / Cancel Status Reason Modal */}
      {statusPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {statusPrompt.title}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setStatusPrompt(null);
                  setStatusReason('');
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold uppercase text-[#78716C]">
                Reason or Memo for Audit History
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Host requested cancellation, date changed, or conflicting schedule..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStatusPrompt(null);
                  setStatusReason('');
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(statusPrompt.status, statusReason.trim() || undefined)}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold uppercase tracking-wider shadow-sm"
              >
                Confirm {statusPrompt.status === 'rejected' ? 'Decline' : 'Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
