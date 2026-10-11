import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BookingRequest, Hall } from '../../types';
import { getAllBookings, getHalls } from '../../services/firebaseService';
import { useBrand } from '../../context/BrandContext';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Filter, Clock } from 'lucide-react';

export const AdminCalendarPage: React.FC = () => {
  const { brand } = useBrand();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHallFilter, setSelectedHallFilter] = useState('all');

  useEffect(() => {
    Promise.all([getAllBookings(), getHalls()]).then(([b, h]) => {
      setBookings(b);
      setHalls(h);
    });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map bookings to day number
  const getBookingsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter((b) => {
      if (b.eventDate !== formattedDate) return false;
      if (selectedHallFilter !== 'all' && b.hallId !== selectedHallFilter) return false;
      return true;
    });
  };

  return (
    <AdminLayout
      title="Banquet Event Calendar & Availability"
      subtitle="Visual hall schedule across lunch and dinner slots with date conflict locks."
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Calendar Nav & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#78716C]">Filter Space:</span>
            <select
              value={selectedHallFilter}
              onChange={(e) => setSelectedHallFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-[#1C1917]"
            >
              <option value="all">All Halls & Pavilions</option>
              {halls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#78716C]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Confirmed Event (Date Locked)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span>Approved Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Pending Inquiry</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-stone-200 rounded-2xl overflow-hidden">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 bg-[#FAF8F5] border-b border-stone-200 text-center text-xs font-semibold text-[#78716C] py-2.5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 min-h-[500px]">
            {/* Empty offset days */}
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`offset-${i}`} className="bg-stone-50/40 p-2 min-h-[90px]" />
            ))}

            {/* Days in month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dayBookings = getBookingsForDay(dayNum);

              return (
                <div
                  key={`day-${dayNum}`}
                  className="p-2 min-h-[90px] hover:bg-stone-50/60 transition-colors flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-stone-800">{dayNum}</span>

                  <div className="space-y-1 mt-1">
                    {dayBookings.map((b) => (
                      <Link
                        key={b.id}
                        to={`/admin/bookings/${b.id}`}
                        className={`block p-1 rounded text-[10px] truncate leading-tight font-medium ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-900 border-l-2 border-emerald-600'
                            : b.status === 'approved'
                            ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-600'
                            : 'bg-amber-100 text-amber-900 border-l-2 border-amber-600'
                        }`}
                        title={`${b.customerName || 'Guest'} - ${b.hallName} (${b.timeSlot})`}
                      >
                        <span className="font-bold">{(b.customerName || 'Guest').split(' ')[0]}</span> ({b.timeSlot})
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
