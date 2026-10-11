import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '../../context/BrandContext';
import { 
  Sparkles, 
  Utensils, 
  Check, 
  X, 
  ArrowRight, 
  Star, 
  Zap, 
  Music, 
  Camera, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const { brand, halls, menuPackages, menuItems, decorations, optionalServices, pricingRules } = useBrand();
  const [activeTab, setActiveTab] = useState<'catering' | 'venues' | 'decor' | 'services'>('catering');

  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FBF6E9] text-xs font-semibold text-[#997A15]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Transparent Bespoke Curation</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#1C1917]">
          Packages, Royal Banquets & Tailored Add-Ons
        </h1>
        <p className="text-sm sm:text-base text-[#78716C] max-w-2xl mx-auto font-light leading-relaxed">
          Every price and inclusion is directly driven by our active venue database. Mix, match, or customize using our live calculator.
        </p>

        {/* Tab Controls */}
        <div className="flex justify-center pt-6">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-stone-200 shadow-sm gap-1">
            {[
              { id: 'catering', label: 'Catering Banquets' },
              { id: 'venues', label: 'Halls & Spaces' },
              { id: 'decor', label: 'Stage & Décor' },
              { id: 'services', label: 'Audio & Services' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'gold-gradient-bg text-white shadow-md'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. CATERING PACKAGES */}
        {activeTab === 'catering' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {menuPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-8 border bg-white flex flex-col justify-between transition-all ${
                    pkg.isPopular
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] shadow-xl relative'
                      : 'border-stone-200 shadow-sm'
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3.5 right-6 px-4 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest gold-gradient-bg text-white shadow-md">
                      Client Favorite
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#1C1917]">{pkg.name}</h3>
                      <p className="text-xs text-[#78716C] mt-2 leading-relaxed">{pkg.tagline}</p>
                    </div>

                    <div className="py-4 border-y border-stone-100 space-y-4">
                      {pkg.courseHighlights.map((course, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <span className="text-xs font-bold text-[#1C1917] block">
                            {course.title}
                          </span>
                          <ul className="space-y-1 text-xs text-[#57534E]">
                            {course.items.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-[#997A15] shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Inclusions & Policies */}
                    <div className="space-y-2 text-[11px] text-[#78716C]">
                      <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Included Standard Amenities:</span>
                      </div>
                      <p>• Bone china tableware, gold cutlery, and linen napkins</p>
                      <p>• Professional uniformed banquet captains and culinary waitstaff</p>
                      <p>• Live tandoor station baked on-demand</p>
                    </div>
                  </div>

                  <div className="pt-8 space-y-4">
                    <div className="flex items-baseline justify-between border-t border-stone-100 pt-4">
                      <span className="text-xs text-[#78716C]">Per Attending Guest</span>
                      <span className="text-3xl font-numeric font-bold text-[#1C1917]">
                        {brand.currencySymbol} {Math.round(pkg.pricePerPerson).toLocaleString()}
                      </span>
                    </div>

                    <Link
                      to={`/calculator?package=${pkg.id}`}
                      className="w-full block text-center py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md hover:scale-[1.01] transition-transform"
                    >
                      Configure with This Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. VENUE HALLS */}
        {activeTab === 'venues' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {halls.map((hall) => (
              <div
                key={hall.id}
                className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-60 overflow-hidden bg-stone-100">
                  <img
                    src={hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                    alt={hall.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium">
                    Capacity: {hall.minCapacity} – {hall.maxCapacity} Guests
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1C1917]">{hall.name}</h3>
                    <p className="text-xs text-[#78716C] mt-2 leading-relaxed">{hall.description}</p>

                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                      <span className="text-xs font-semibold text-[#1C1917] block">Hall Specifications:</span>
                      <ul className="text-xs text-[#57534E] space-y-1">
                        <li>• Minimum Billable Guests: {hall.minBillableGuests}</li>
                        <li>• Climate Architecture: {hall.isIndoor ? 'Fully Air Conditioned' : 'Open-Air Pergola'}</li>
                        {(hall.amenities || []).map((a, i) => (
                          <li key={i}>• {a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#A8A29E] block">Fixed Base Space Hire</span>
                      <span className="text-2xl font-numeric font-bold text-[#1C1917]">
                        {brand.currencySymbol} {Math.round(hall.baseRentalPrice).toLocaleString()}
                      </span>
                    </div>

                    <Link
                      to={`/calculator?hall=${hall.id}`}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm"
                    >
                      Book Hall
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. STAGE & DECOR */}
        {activeTab === 'decor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {decorations.map((dec) => (
              <div
                key={dec.id}
                className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                {dec.image && (
                  <div className="h-52 overflow-hidden bg-stone-100">
                    <img src={dec.image} alt={dec.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#997A15]">
                      {dec.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#1C1917] mt-1">{dec.name}</h3>
                    <p className="text-xs text-[#78716C] mt-2 leading-relaxed">{dec.description}</p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#1C1917]">
                      {dec.pricingType === 'per_person'
                        ? `${brand.currencySymbol} ${Math.round(dec.price).toLocaleString()} / guest`
                        : `${brand.currencySymbol} ${Math.round(dec.price).toLocaleString()} fixed`}
                    </span>
                    <Link
                      to="/calculator"
                      className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg"
                    >
                      Add in Calculator
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. SERVICES */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {optionalServices.map((srv) => (
              <div
                key={srv.id}
                className="rounded-3xl p-6 bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base text-[#1C1917]">{srv.name}</h3>
                    {srv.isMandatory && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1C1917] text-[#D4AF37]">
                        Required Policy
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#78716C] mt-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-base font-bold text-[#1C1917]">
                    {srv.pricingType === 'per_person'
                      ? `${brand.currencySymbol} ${Math.round(srv.price).toLocaleString()} / guest`
                      : `${brand.currencySymbol} ${Math.round(srv.price).toLocaleString()} fixed`}
                  </span>
                  <Link
                    to="/calculator"
                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg"
                  >
                    Configure
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
