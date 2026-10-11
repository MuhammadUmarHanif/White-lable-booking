import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ExternalLink, Calendar, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBrand } from '../../context/BrandContext';
import { getAllBookings } from '../../services/firebaseService';
import { BookingRequest } from '../../types';

interface Props {
  onToggleMobileMenu: () => void;
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<Props> = ({ onToggleMobileMenu, title, subtitle }) => {
  const { brand } = useBrand();
  const [pendingBookings, setPendingBookings] = useState<BookingRequest[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllBookings().then((all) => {
      setPendingBookings(all.filter((b) => b.status === 'pending'));
    });
  }, [title]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#1C1917] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-[#78716C] hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Pending Notifications Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title={`${pendingBookings.length} Pending Inquiries`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {pendingBookings.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingBookings.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#1C1917]">Pending Inquiries</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {pendingBookings.length} New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 my-2">
                {pendingBookings.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#78716C]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <span>All inquiries have been reviewed!</span>
                  </div>
                ) : (
                  pendingBookings.slice(0, 5).map((b) => (
                    <Link
                      key={b.id}
                      to={`/admin/bookings/${b.id}`}
                      onClick={() => setShowNotifications(false)}
                      className="py-2.5 px-1 flex items-center justify-between hover:bg-stone-50 rounded-lg transition-colors group block text-left"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-[#1C1917] group-hover:text-[#997A15] block">
                          {b.customerName}
                        </span>
                        <span className="text-[10px] text-[#78716C] flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{b.eventDate} ({b.timeSlot}) • {b.hallName}</span>
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700" />
                    </Link>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
                <Link
                  to="/admin/bookings"
                  onClick={() => setShowNotifications(false)}
                  className="font-semibold text-[#997A15] hover:underline"
                >
                  View All Bookings
                </Link>
                <span className="text-[10px] text-[#A8A29E]">Live Updates</span>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-[#57534E] hover:bg-stone-50 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="w-8 h-8 rounded-full gold-gradient-bg text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {brand.businessName.charAt(0)}
        </div>
      </div>
    </header>
  );
};
