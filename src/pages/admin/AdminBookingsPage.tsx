import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BookingRequest, BookingStatus } from '../../types';
import { getAllBookings, deleteBooking } from '../../services/firebaseService';
import { useBrand } from '../../context/BrandContext';
import { Search, Filter, Calendar, Users, Eye, Trash2, Download, RefreshCw, X, FileSpreadsheet } from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const AdminBookingsPage: React.FC = () => {
  const { brand, halls } = useBrand();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hallFilter, setHallFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Deletion modal state
  const [bookingToDelete, setBookingToDelete] = useState<BookingRequest | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const loadBookings = async () => {
    setLoading(true);
    const res = await getAllBookings();
    setBookings(res);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteBooking(bookingToDelete.id);
      setAlert({
        type: 'success',
        message: `Booking ${bookingToDelete.referenceNumber} for "${bookingToDelete.customerName}" was deleted successfully.`,
      });
      setBookingToDelete(null);
      await loadBookings();
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to delete booking request.',
      });
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) {
      setAlert({ type: 'warning', message: 'No booking records available to export.' });
      return;
    }
    const headers = ['RefNumber', 'CustomerName', 'Phone', 'Email', 'EventDate', 'Slot', 'Guests', 'Hall', 'Status', 'TotalQuotation', 'TotalPaid', 'Balance'];
    const rows = filtered.map((b) => [
      b.referenceNumber,
      `"${b.customerName}"`,
      b.customerPhone,
      b.customerEmail,
      b.eventDate,
      b.timeSlot,
      b.guestCount,
      `"${b.hallName}"`,
      b.status,
      b.totalQuotationAmount,
      b.totalPaid,
      b.outstandingBalance,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setAlert({ type: 'success', message: `Exported ${filtered.length} bookings to CSV spreadsheet successfully.` });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setHallFilter('all');
    setPage(1);
  };

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || hallFilter !== 'all';

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (hallFilter !== 'all' && b.hallId !== hallFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = b.customerName?.toLowerCase().includes(q);
      const matchRef = b.referenceNumber?.toLowerCase().includes(q);
      const matchEmail = b.customerEmail?.toLowerCase().includes(q);
      const matchPhone = b.customerPhone?.includes(q);
      if (!matchName && !matchRef && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">Approved Hold</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">Pending Review</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">Cancelled</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">Declined</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">Completed</span>;
    }
  };

  return (
    <AdminLayout
      title="Bookings & Quotation Enquiries"
      subtitle="Track customer submissions, approve holds, prevent date conflicts, and register payments."
    >
      <div className="space-y-6">
        {alert && (
          <AdminAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Header Action & Metrics Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#78716C]">
                Total: <strong className="text-[#1C1917]">{bookings.length}</strong>
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-semibold text-amber-700">
                Pending: <strong>{bookings.filter((b) => b.status === 'pending').length}</strong>
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-semibold text-emerald-700">
                Confirmed: <strong>{bookings.filter((b) => b.status === 'confirmed').length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-[#1C1917] transition-colors"
                title="Export filtered rows to CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={loadBookings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-[#1C1917] transition-colors"
                title="Refresh Bookings"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by customer name, ref #, phone, email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 font-medium text-xs text-[#1C1917]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved Hold</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Hall Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                <span>Hall:</span>
                <select
                  value={hallFilter}
                  onChange={(e) => {
                    setHallFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 font-medium text-xs text-[#1C1917]"
                >
                  <option value="all">All Halls</option>
                  {halls.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filter Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-stone-200 text-[#78716C] uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Ref & Customer</th>
                    <th className="py-3.5 px-4">Event Date & Slot</th>
                    <th className="py-3.5 px-4">Hall Space</th>
                    <th className="py-3.5 px-4 text-center">Guests</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Quotation</th>
                    <th className="py-3.5 px-4 text-right">Balance Due</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#78716C]">
                        {hasActiveFilters
                          ? 'No booking requests found matching criteria.'
                          : 'No bookings logged yet.'}
                      </td>
                    </tr>
                  ) : (
                    paginated.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-sm text-[#1C1917] block">
                            {b.customerName}
                          </span>
                          <span className="text-[11px] font-mono text-[#78716C]">
                            {b.referenceNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#1C1917] block">{b.eventDate}</span>
                          <span className="text-[11px] text-[#78716C] capitalize">{b.timeSlot}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#57534E]">{b.hallName}</td>
                        <td className="py-3.5 px-4 text-center font-medium text-[#1C1917]">
                          {b.guestCount}
                        </td>
                        <td className="py-3.5 px-4 text-center">{getStatusBadge(b.status)}</td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#1C1917]">
                          {brand.currencySymbol} {Math.round(b.totalQuotationAmount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`font-semibold ${b.outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {brand.currencySymbol} {Math.round(b.outstandingBalance).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link
                              to={`/admin/bookings/${b.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-[#D4AF37] hover:bg-[#FBF6E9] text-xs font-semibold text-[#1C1917] transition-colors"
                              title="View & manage booking details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => setBookingToDelete(b)}
                              className="p-1.5 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between text-xs text-[#78716C]">
                <span>
                  Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
                </span>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                        page === i + 1
                          ? 'gold-gradient-bg text-white'
                          : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(bookingToDelete)}
        title="Delete Booking Record"
        message={`Are you sure you want to permanently delete booking ${bookingToDelete?.referenceNumber} for "${bookingToDelete?.customerName}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete Booking"
        cancelLabel="Keep Booking"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBookingToDelete(null)}
      />
    </AdminLayout>
  );
};
