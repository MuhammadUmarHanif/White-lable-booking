import React from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '../../context/BrandContext';
import { MapPin, Phone, Mail, Clock, Zap, ShieldCheck, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { brand } = useBrand();
  const currentYear = new Date().getFullYear();

  const whatsappClean = (brand.whatsappNumber || brand.contactPhone || '923008456789').replace(/[^0-9]/g, '');

  const footerInitials = (brand.businessName || 'EG')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'EG';

  return (
    <footer className="bg-[#12100E] text-[#FAF8F5] pt-16 pb-10 border-t border-[#D4AF37]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Clean 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#292524]">
          {/* Col 1: Venue Identity & Hallmarks (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full border border-[#D4AF37] ring-1 ring-[#D4AF37]/40 flex items-center justify-center bg-black/60 text-[#D4AF37] font-serif text-sm font-bold tracking-wider shadow-lg shrink-0 overflow-hidden">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.businessName} className="w-full h-full object-contain p-1" />
                ) : (
                  <span>{footerInitials}</span>
                )}
              </div>
              <div>
                <span className="font-serif text-2xl font-normal tracking-wide text-white block leading-tight">
                  {brand.businessName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans block mt-0.5">
                  {brand.tagline || 'Regal Wedding & Banquet Venue • Lahore'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A8A29E] font-light leading-relaxed max-w-md">
              {brand.aboutText || 'A premier 50,000 sq.ft. pillarless sanctuary crafted for grand Barat entries, royal Walima feasts, festive Mehendi nights, and intimate Nikah solemnities.'}
            </p>

            <div className="space-y-2 pt-1 text-xs text-[#D4AF37]">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-stone-300 text-xs">Dual 300kVA ATS Soundproof Generator Backup</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-stone-300 text-xs">Punjab Marriage Ordinance & One-Dish Compliant</span>
              </div>
            </div>
          </div>

          {/* Col 2: Real Operating Hours & Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-semibold text-[#D4AF37] tracking-[0.2em] uppercase">
              Event Timings & Office
            </h4>
            
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-white">Night Banquets</span>
                  <span className="text-[11px] text-stone-400">7:00 PM – 10:30 PM (Govt. Law)</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-white">Afternoon Banquets</span>
                  <span className="text-[11px] text-stone-400">1:00 PM – 4:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-white">Booking Office</span>
                  <span className="text-[11px] text-stone-400">10:00 AM – 9:00 PM (Daily)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-400">
              <Link to="/#halls" className="hover:text-[#D4AF37] transition-colors">Halls</Link>
              <Link to="/packages" className="hover:text-[#D4AF37] transition-colors">Catering</Link>
              <Link to="/calculator" className="hover:text-[#D4AF37] transition-colors">Calculator</Link>
              <Link to="/gallery" className="hover:text-[#D4AF37] transition-colors">Gallery</Link>
              <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link>
            </div>
          </div>

          {/* Col 3: Real Direct Contact & WhatsApp (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-xs font-semibold text-[#D4AF37] tracking-[0.2em] uppercase">
              Direct Contact
            </h4>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{brand.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${brand.contactPhone}`} className="hover:text-[#D4AF37] transition-colors font-medium text-white">
                  {brand.contactPhone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${brand.contactEmail}`} className="hover:text-[#D4AF37] transition-colors text-stone-300">
                  {brand.contactEmail}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappClean}?text=Assalam-o-Alaikum,%20I%20would%20like%20to%20inquire%20about%20booking%20dates%20for%20Elysian%20Grand%20Marquee.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-950" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-3">
          <p>© {currentYear} {brand.businessName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/calculator" className="hover:text-[#D4AF37] transition-colors">
              Cost Calculator
            </Link>
            <Link to="/admin/login" className="hover:text-[#D4AF37] transition-colors text-stone-400">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
