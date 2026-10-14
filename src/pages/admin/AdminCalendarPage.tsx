import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BookingRequest } from '../../types';
import { getAllBookings, onBookingsChanged } from '../../services/firebaseService';
import { useBrand } from '../../context/BrandContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalIcon, 
  Sun, 
  Moon, 
  Clock, 
  Users, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  X, 
  Plus, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminCalendarPage: React.FC = () => {
  const { brand, halls } = useBrand();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedHallFilter, setSelectedHallFilter] = useState<string>('all');
  const [selectedDayForModal, setSelectedDayForModal] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const all = await getAllBookings();
      setBookings(all);
    } catch (err) {
      console.error('Failed to load bookings in calendar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Subscribe to real-time updates from other tabs or customer submissions with zero delay
    const unsubscribe = onBookingsChanged(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayForModal(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayForModal(null);
  };

  const handleJumpToDate = (targetYear: number, targetMonth: number, day?: number) => {
    setCurrentDate(new Date(targetYear, targetMonth, day || 1));
    if (day) {
      setSelectedDayForModal(day);
    } else {
      setSelectedDayForModal(null);
    }
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Today check
  const today = new Date();
  const isCurrentMonthToday = today.getFullYear() === year && today.getMonth() === month;

  // Map bookings to day number
  const getBookingsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter((b) => {
      const bDate = (b.eventDate || '').split('T')[0].trim();
      if (bDate !== formattedDate) return false;
      if (selectedHallFilter !== 'all' && b.hallId !== selectedHallFilter) return false;
      return true;
    });
  };

  // Detect all upcoming months that have bookings so admin can jump instantly
  const monthsWithBookings = useMemo(() => {
    const map = new Map<string, { year: number; month: number; label: string; count: number }>();
    bookings.forEach((b) => {
      if (!b.eventDate) return;
      const bDate = b.eventDate.split('T')[0].trim();
      const parts = bDate.split('-');
      if (parts.length >= 2) {
        const bYear = parseInt(parts[0], 10);
        const bMonth = parseInt(parts[1], 10) - 1;
        if (!isNaN(bYear) && !isNaN(bMonth) && bMonth >= 0 && bMonth <= 11) {
          const key = `${bYear}-${bMonth}`;
          const current = map.get(key);
          if (current) {
            current.count += 1;
          } else {
            map.set(key, {
              year: bYear,
              month: bMonth,
              label: `${monthNames[bMonth]} ${bYear}`,
              count: 1,
            });
          }
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      return a.year !== b.year ? a.year - b.year : a.month - b.month;
    });
  }, [bookings]);

  // Statistics for the currently viewed month
  const currentMonthBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.eventDate) return false;
      const bDate = b.eventDate.split('T')[0].trim();
      const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      if (!bDate.startsWith(prefix)) return false;
      if (selectedHallFilter !== 'all' && b.hallId !== selectedHallFilter) return false;
      return true;
    });
  }, [bookings, year, month, selectedHallFilter]);

  const confirmedCount = currentMonthBookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = currentMonthBookings.filter((b) => b.status === 'pending').length;
  const totalMonthRevenue = currentMonthBookings.reduce((sum, b) => sum + (b.totalQuotationAmount || 0), 0);
  const totalMonthGuests = currentMonthBookings.reduce((sum, b) => sum + (b.guestCount || 0), 0);

  // Selected Day Bookings for Modal
  const selectedDayBookings = selectedDayForModal ? getBookingsForDay(selectedDayForModal) : [];
  const selectedDayLunch = selectedDayBookings.find((b) => b.timeSlot === 'lunch' || b.timeSlot === 'full_day');
  const selectedDayDinner = selectedDayBookings.find((b) => b.timeSlot === 'dinner' || b.timeSlot === 'full_day');
  const selectedDateFormatted = selectedDayForModal
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDayForModal).padStart(2, '0')}`
    : '';

  return (
    <AdminLayout
      title="Banquet Event Calendar & Availability"
      subtitle="Visual hall schedule across lunch and dinner slots with date conflict locks."
    >
      <div className="space-y-6">
        {/* Month Statistics Overview Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                Total Month Events
              </span>
              <span className="text-xl sm:text-2xl font-bold font-numeric text-[#1C1917]">
                {currentMonthBookings.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-[#997A15]">
              <CalIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                Confirmed Banquets
              </span>
              <span className="text-xl sm:text-2xl font-bold font-numeric text-emerald-700">
                {confirmedCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                Pending Holds / Inquiries
              </span>
              <span className="text-xl sm:text-2xl font-bold font-numeric text-amber-700">
                {pendingCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                Month Quotation Volume
              </span>
              <span className="text-xl sm:text-2xl font-bold font-numeric text-[#1C1917] truncate block">
                {brand.currencySymbol} {Math.round(totalMonthRevenue).toLocaleString()}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-[#997A15]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Jump Bar for Months with Bookings */}
        {monthsWithBookings.length > 0 && (
          <div className="bg-[#FAF8F5] p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/30 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-[#1C1917] flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Active Booking Months:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {monthsWithBookings.map((m) => {
                const isCurrent = m.year === year && m.month === month;
                return (
                  <button
                    key={`${m.year}-${m.month}`}
                    onClick={() => handleJumpToDate(m.year, m.month)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'bg-white hover:bg-stone-100 text-[#57534E] border border-stone-200'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isCurrent ? 'bg-[#D4AF37] text-[#1C1917]' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {m.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Calendar Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Calendar Nav & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                {monthNames[month]} {year}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-[#1C1917] transition-colors"
                  aria-label="Previous Month"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleJumpToDate(today.getFullYear(), today.getMonth(), today.getDate())}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-[#1C1917] transition-colors"
                  aria-label="Next Month"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#78716C] font-semibold">Filter Space:</span>
              <select
                value={selectedHallFilter}
                onChange={(e) => setSelectedHallFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Halls & Pavilions ({halls.length})</option>
                {halls.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#78716C] bg-stone-50/70 p-3 rounded-xl border border-stone-200/60">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="font-medium text-stone-700">Confirmed (Date Locked)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span className="font-medium text-stone-700">Approved Hold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="font-medium text-stone-700">Pending Request</span>
              </div>
            </div>
            <div className="text-[11px] text-[#997A15] font-semibold hidden md:block">
              💡 Click any date to inspect Lunch & Dinner slot availability
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Day of week headers */}
            <div className="grid grid-cols-7 bg-[#FAF8F5] border-b border-stone-200 text-center text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#78716C] py-3">
              <span className="text-rose-700">Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span className="text-[#997A15]">Fri</span>
              <span className="text-[#997A15]">Sat</span>
            </div>

            {/* Days Matrix */}
            <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 min-h-[520px] bg-white">
              {/* Empty offset days */}
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`offset-${i}`} className="bg-stone-50/50 p-1 sm:p-2 min-h-[100px]" />
              ))}

              {/* Days in month */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const dayBookings = getBookingsForDay(dayNum);
                const isToday = isCurrentMonthToday && today.getDate() === dayNum;
                const isSelected = selectedDayForModal === dayNum;
                const hasBookings = dayBookings.length > 0;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDayForModal(dayNum)}
                    className={`p-1.5 sm:p-2.5 min-h-[100px] sm:min-h-[110px] cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#FBF6E9] ring-2 ring-[#D4AF37] ring-inset'
                        : isToday
                        ? 'bg-amber-50/30'
                        : hasBookings
                        ? 'hover:bg-stone-50/80 bg-white'
                        : 'hover:bg-stone-50/50 bg-white'
                    }`}
                  >
                    {/* Top Row: Day Number & Slot availability pill */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                          isToday
                            ? 'bg-[#1C1917] text-white shadow-xs'
                            : isSelected
                            ? 'bg-[#D4AF37] text-white'
                            : 'text-stone-800 group-hover:text-[#997A15]'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {hasBookings && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-[#1C1917]">
                          {dayBookings.length} {dayBookings.length === 1 ? 'event' : 'events'}
                        </span>
                      )}
                    </div>

                    {/* Bookings Stack in Cell */}
                    <div className="space-y-1 mt-1 flex-1">
                      {dayBookings.slice(0, 3).map((b) => {
                        const isLunch = b.timeSlot === 'lunch';
                        const isConfirmed = b.status === 'confirmed';
                        const isApproved = b.status === 'approved';

                        return (
                          <div
                            key={b.id}
                            className={`p-1 sm:p-1.5 rounded-lg text-[10px] truncate leading-tight font-semibold flex items-center justify-between gap-1 shadow-xs border ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : isApproved
                                ? 'bg-blue-50 text-blue-900 border-blue-300'
                                : 'bg-amber-50 text-amber-900 border-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-1 truncate">
                              {isLunch ? (
                                <Sun className="w-3 h-3 text-amber-600 shrink-0" />
                              ) : (
                                <Moon className="w-3 h-3 text-indigo-600 shrink-0" />
                              )}
                              <span className="truncate">
                                {(b.customerName || 'Inquiry').split(' ')[0]}
                              </span>
                            </div>
                            <span className="text-[9px] uppercase font-bold shrink-0 opacity-80">
                              {b.timeSlot === 'lunch' ? 'L' : b.timeSlot === 'dinner' ? 'D' : 'FD'}
                            </span>
                          </div>
                        );
                      })}

                      {dayBookings.length > 3 && (
                        <div className="text-[9px] text-[#997A15] font-bold text-center">
                          +{dayBookings.length - 3} more...
                        </div>
                      )}
                    </div>

                    {/* Bottom slot indicator dots */}
                    <div className="pt-1 flex items-center gap-1 text-[9px] text-stone-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        dayBookings.some((b) => b.timeSlot === 'lunch' || b.timeSlot === 'full_day')
                          ? 'bg-amber-500'
                          : 'bg-stone-200'
                      }`} title="Lunch Slot" />
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        dayBookings.some((b) => b.timeSlot === 'dinner' || b.timeSlot === 'full_day')
                          ? 'bg-indigo-500'
                          : 'bg-stone-200'
                      }`} title="Dinner Slot" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Day Details Modal */}
      {selectedDayForModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#997A15] block">
                  Date Schedule & Slot Inspection
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  {selectedDayForModal} {monthNames[month]} {year}
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  {selectedDayBookings.length} event request(s) logged on this date
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayForModal(null)}
                className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slots Grid */}
            <div className="space-y-4">
              {/* 1. Lunch Slot Card */}
              <div className="rounded-2xl border border-stone-200 p-4 bg-[#FAF8F5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1C1917]">
                        Walima / Day Lunch (1:00 PM – 4:30 PM)
                      </h4>
                      <span className="text-[10px] text-[#78716C]">Afternoon banquet slot</span>
                    </div>
                  </div>

                  {selectedDayLunch ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      selectedDayLunch.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : selectedDayLunch.status === 'approved'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {selectedDayLunch.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Available (Free)
                    </span>
                  )}
                </div>

                {selectedDayLunch ? (
                  <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-[#1C1917]">
                          {selectedDayLunch.customerName}
                        </div>
                        <div className="text-[11px] text-[#78716C]">
                          {selectedDayLunch.hallName} • {selectedDayLunch.guestCount} Guests • {selectedDayLunch.eventType.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-numeric text-[#1C1917]">
                          {brand.currencySymbol} {Math.round(selectedDayLunch.totalQuotationAmount).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#997A15] font-semibold">
                          Advance: {brand.currencySymbol} {Math.round(selectedDayLunch.totalPaid || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-[11px]">
                      {selectedDayLunch.customerPhone && (
                        <a
                          href={`tel:${selectedDayLunch.customerPhone}`}
                          className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{selectedDayLunch.customerPhone}</span>
                        </a>
                      )}
                      {selectedDayLunch.customerPhone && (
                        <a
                          href={`https://wa.me/${selectedDayLunch.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:underline font-semibold ml-2"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <Link
                        to={`/admin/bookings/${selectedDayLunch.id}`}
                        className="ml-auto flex items-center gap-1 text-[#997A15] hover:underline font-bold"
                      >
                        <span>Open Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#78716C] flex items-center justify-between pt-1">
                    <span>No bookings placed for lunch slot.</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/calculator?eventDate=${selectedDateFormatted}&timeSlot=lunch`)}
                      className="text-[11px] font-bold text-[#997A15] hover:underline"
                    >
                      Book Lunch Slot →
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Dinner Slot Card */}
              <div className="rounded-2xl border border-stone-200 p-4 bg-[#FAF8F5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1C1917]">
                        Night Banquet / Dinner (7:30 PM – 11:00 PM)
                      </h4>
                      <span className="text-[10px] text-[#78716C]">Peak evening reception slot</span>
                    </div>
                  </div>

                  {selectedDayDinner ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      selectedDayDinner.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : selectedDayDinner.status === 'approved'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {selectedDayDinner.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Available (Free)
                    </span>
                  )}
                </div>

                {selectedDayDinner ? (
                  <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-[#1C1917]">
                          {selectedDayDinner.customerName}
                        </div>
                        <div className="text-[11px] text-[#78716C]">
                          {selectedDayDinner.hallName} • {selectedDayDinner.guestCount} Guests • {selectedDayDinner.eventType.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-numeric text-[#1C1917]">
                          {brand.currencySymbol} {Math.round(selectedDayDinner.totalQuotationAmount).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#997A15] font-semibold">
                          Advance: {brand.currencySymbol} {Math.round(selectedDayDinner.totalPaid || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-[11px]">
                      {selectedDayDinner.customerPhone && (
                        <a
                          href={`tel:${selectedDayDinner.customerPhone}`}
                          className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{selectedDayDinner.customerPhone}</span>
                        </a>
                      )}
                      {selectedDayDinner.customerPhone && (
                        <a
                          href={`https://wa.me/${selectedDayDinner.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:underline font-semibold ml-2"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <Link
                        to={`/admin/bookings/${selectedDayDinner.id}`}
                        className="ml-auto flex items-center gap-1 text-[#997A15] hover:underline font-bold"
                      >
                        <span>Open Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#78716C] flex items-center justify-between pt-1">
                    <span>No bookings placed for dinner slot.</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/calculator?eventDate=${selectedDateFormatted}&timeSlot=dinner`)}
                      className="text-[11px] font-bold text-[#997A15] hover:underline"
                    >
                      Book Dinner Slot →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedDayForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => navigate(`/calculator?eventDate=${selectedDateFormatted}`)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white gold-gradient-bg shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Booking for This Date</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
