import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Calendar, 
  Building2, 
  UtensilsCrossed, 
  Sparkles, 
  DollarSign, 
  Palette, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface Props {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<Props> = ({ onCloseMobile }) => {
  const { logout, currentUser, isFirebaseActive } = useAuth();
  const { brand } = useBrand();

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings & Requests', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Event Calendar', path: '/admin/calendar', icon: Calendar },
    { name: 'Venue Halls', path: '/admin/venues', icon: Building2 },
    { name: 'Catering & Menus', path: '/admin/menus', icon: UtensilsCrossed },
    { name: 'Décor & Services', path: '/admin/decor', icon: Sparkles },
    { name: 'Pricing & Taxes', path: '/admin/pricing', icon: DollarSign },
    { name: 'Website Branding', path: '/admin/customization', icon: Palette },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 h-screen flex flex-col justify-between shrink-0">
      {/* Brand & Marquee Logo */}
      <div className="p-5 border-b border-stone-100">
        <Link to="/" target="_blank" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#1C1917] text-[#D4AF37] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-serif text-sm font-bold text-[#1C1917] truncate leading-tight group-hover:text-[#997A15] transition-colors">
              {brand.businessName}
            </h2>
            <span className="text-[10px] text-[#78716C] flex items-center gap-1">
              <span>Public Site</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-[#FBF6E9] text-[#1C1917] font-semibold border-l-4 border-[#D4AF37]'
                    : 'text-[#57534E] hover:bg-stone-50 hover:text-[#1C1917]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-[#78716C]" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-stone-200 bg-[#FAF8F5] space-y-3">
        {!isFirebaseActive && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-800 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Standalone Preview Mode</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-[#1C1917] block truncate">
              {currentUser?.displayName || 'Administrator'}
            </span>
            <span className="text-[10px] text-[#78716C] block truncate">
              {currentUser?.email || 'admin@marquee.com'}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
