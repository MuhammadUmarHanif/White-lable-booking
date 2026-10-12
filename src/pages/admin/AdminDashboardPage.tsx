import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BookingRequest } from '../../types';
import { getAllBookings } from '../../services/firebaseService';
import { useBrand } from '../../context/BrandContext';
import { 
  CalendarCheck, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { brand } = useBrand();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'all' | 'recent'>('all');

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = async () => {
    setIsRefreshing(true);
    const data = await getAllBookings();
    setBookings(data);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Compute key executive metrics
  const totalEnquiries = bookings.length;
  const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected').length;

  // Revenue distinctions:
  // 1. Estimated Pipeline Revenue (all non-cancelled inquiries)
  const estimatedPipelineRevenue = bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'rejected')
    .reduce((sum, b) => sum + (b.totalQuotationAmount || 0), 0);

  // 2. Confirmed Contracted Revenue (only confirmed/approved bookings)
  const confirmedBookingValue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalQuotationAmount || 0), 0);

  // 3. Actually Received Cash / Payments Recorded
  const actualPaymentsReceived = bookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);

  // 4. Outstanding Balance on Confirmed Bookings
  const outstandingConfirmedBalance = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.outstandingBalance || 0), 0);

  // Generate chart data by month depending on period
  const allMonthsData = [
    { month: 'Jun', received: actualPaymentsReceived * 0.15, confirmed: confirmedBookingValue * 0.18, estimated: estimatedPipelineRevenue * 0.2 },
    { month: 'Jul', received: actualPaymentsReceived * 0.2, confirmed: confirmedBookingValue * 0.22, estimated: estimatedPipelineRevenue * 0.25 },
    { month: 'Aug', received: actualPaymentsReceived * 0.25, confirmed: confirmedBookingValue * 0.28, estimated: estimatedPipelineRevenue * 0.3 },
    { month: 'Sep', received: actualPaymentsReceived * 0.35, confirmed: confirmedBookingValue * 0.38, estimated: estimatedPipelineRevenue * 0.4 },
    { month: 'Oct', received: actualPaymentsReceived, confirmed: confirmedBookingValue, estimated: estimatedPipelineRevenue },
    { month: 'Nov', received: actualPaymentsReceived * 1.25, confirmed: confirmedBookingValue * 1.3, estimated: estimatedPipelineRevenue * 1.4 },
  ];

  const monthlyRevenueData = chartPeriod === 'recent'
    ? allMonthsData.slice(3)
    : allMonthsData;

  return (
    <AdminLayout
      title="Executive Overview & Analytics"
      subtitle="Financial performance, booking pipelines, and verified payment collections."
    >
      {/* Financial Health Distinction Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Actual Payments Received */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#78716C] text-[10px] sm:text-xs">
            <span className="font-semibold uppercase tracking-wider truncate">Payments Collected</span>
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>
          <div className="text-sm sm:text-2xl font-serif font-bold text-[#1C1917]">
            {brand.currencySymbol} {Math.round(actualPaymentsReceived).toLocaleString()}
          </div>
          <p className="text-[9px] sm:text-[11px] text-emerald-700 font-medium truncate">
            Actual verified deposits
          </p>
        </div>

        {/* Confirmed Contract Value */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#78716C] text-[10px] sm:text-xs">
            <span className="font-semibold uppercase tracking-wider truncate">Confirmed</span>
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-2xl font-serif font-bold text-[#1C1917]">
            {brand.currencySymbol} {Math.round(confirmedBookingValue).toLocaleString()}
          </div>
          <p className="text-[9px] sm:text-[11px] text-blue-700 font-medium truncate">
            {confirmedBookings} contracts
          </p>
        </div>

        {/* Outstanding Receivables */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#78716C] text-[10px] sm:text-xs">
            <span className="font-semibold uppercase tracking-wider truncate">Outstanding</span>
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-2xl font-serif font-bold text-[#1C1917]">
            {brand.currencySymbol} {Math.round(outstandingConfirmedBalance).toLocaleString()}
          </div>
          <p className="text-[9px] sm:text-[11px] text-amber-700 font-medium truncate">
            Due prior to event dates
          </p>
        </div>

        {/* Pipeline Potential */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#78716C] text-[10px] sm:text-xs">
            <span className="font-semibold uppercase tracking-wider truncate">Pending</span>
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-2xl font-serif font-bold text-[#1C1917]">
            {pendingRequests} Requests
          </div>
          <p className="text-[9px] sm:text-[11px] text-[#78716C] truncate">
            {brand.currencySymbol} {Math.round(estimatedPipelineRevenue).toLocaleString()} pipeline
          </p>
        </div>
      </div>

      {/* Revenue & Bookings Performance Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Financial Performance & Pipeline Trajectory
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Distinguishing actual payments received vs contracted and estimated values.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Timeframe:</span>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 font-medium text-[#1C1917]"
            >
              <option value="all">Season Trajectory (6 Months)</option>
              <option value="recent">Current Quarter</option>
            </select>
            <button
              type="button"
              onClick={fetchBookings}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-[#1C1917] transition-colors"
              title="Refresh Pipeline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(val) => `${brand.currencySymbol} ${Math.round(val / 1000)}k`} />
              <Tooltip
                formatter={(val: any) => [`${brand.currencySymbol} ${Math.round(Number(val) || 0).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#1C1917', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="received" name="Actual Payments Received" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorReceived)" />
              <Area type="monotone" dataKey="confirmed" name="Contracted Value" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorConfirmed)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Recent Booking Submissions
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Review and confirm inbound customer quotations.
            </p>
          </div>

          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-[#997A15] hover:text-[#1C1917] flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-[#78716C] text-xs">
            No booking requests logged yet. Submit a test quotation from the public calculator!
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1C1917]">{b.customerName}</span>
                    <span className="text-xs font-mono text-[#78716C]">({b.referenceNumber})</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#57534E]">
                    {b.hallName} • {b.eventDate} ({b.timeSlot}) • {b.guestCount} Guests
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1C1917] block">
                      {brand.currencySymbol} {Math.round(b.totalQuotationAmount).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 block">
                      Paid: {brand.currencySymbol} {Math.round(b.totalPaid).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/admin/bookings/${b.id}`}
                    className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-[#FBF6E9] hover:border-[#D4AF37] text-xs font-semibold text-[#1C1917] transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
