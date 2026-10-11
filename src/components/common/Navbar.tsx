import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBrand } from '../../context/BrandContext';
import { Calculator, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { brand } = useBrand();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Halls', path: '/#halls' },
    { name: 'Catering', path: '/packages' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  // Only the top of the homepage floating over the dark hero uses the transparent overlay
  const isHomeTop = location.pathname === '/' && !isScrolled;

  const brandInitials = (brand.businessName || 'EG')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'EG';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path === '/#halls') {
      if (location.pathname === '/') {
        e.preventDefault();
        const el = document.getElementById('halls');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', '/#halls');
        }
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomeTop 
          ? 'bg-gradient-to-b from-black/75 via-black/25 to-transparent py-4 sm:py-5' 
          : 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/20 py-3.5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-serif text-xs font-bold tracking-widest transition-all duration-300 group-hover:scale-105 shadow-md shrink-0 overflow-hidden ${
            isHomeTop 
              ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 bg-black/60 text-[#D4AF37] backdrop-blur-md'
              : 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30 bg-[#1C1917] text-[#D4AF37]'
          }`}>
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.businessName} className="w-full h-full object-contain p-1" />
            ) : (
              <span>{brandInitials}</span>
            )}
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className={`font-serif text-lg sm:text-xl font-normal tracking-[0.08em] uppercase block leading-none whitespace-nowrap transition-colors ${
              isHomeTop ? 'text-white drop-shadow-md' : 'text-[#1C1917]'
            }`}>
              {brand.businessName || 'Elysian Grand'}
            </span>
            <span className={`text-[9px] uppercase tracking-[0.25em] font-sans block whitespace-nowrap transition-colors ${
              isHomeTop ? 'text-[#D4AF37] drop-shadow-xs' : 'text-[#997A15]'
            }`}>
              {brand.tagline || 'Shahi Marquee • Lahore'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 shrink-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative py-1.5 font-medium whitespace-nowrap ${
                  isActive 
                    ? isHomeTop ? 'text-[#D4AF37] font-semibold' : 'text-[#997A15] font-semibold'
                    : isHomeTop ? 'text-white/90 hover:text-[#D4AF37]' : 'text-[#292524] hover:text-[#997A15]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Button (Cost Calculator CTA - Admin is hidden from public navbar) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            to="/calculator"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] text-white gold-gradient-bg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] whitespace-nowrap"
          >
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span>Calculate Cost</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/calculator"
            className="p-2 rounded-full gold-gradient-bg text-white shadow-sm"
            aria-label="Cost Calculator"
          >
            <Calculator className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isHomeTop ? 'text-white hover:bg-white/10' : 'text-[#1C1917] hover:bg-[#F5EFEB]'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#D4AF37]/20 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  handleLinkClick(e, link.path);
                  setMobileMenuOpen(false);
                }}
                className="text-base font-medium text-[#1C1917] hover:text-[#997A15] py-2 border-b border-stone-100"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md"
            >
              Interactive Event Calculator
            </Link>
            {brand.contactPhone && (
              <div className="flex items-center justify-center pt-2 text-xs text-[#78716C]">
                <span>Direct Concierge: {brand.contactPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
