import React from 'react';
import { CalculatorState, TimeSlot, Hall } from '../../types';
import { Calendar, Users, Clock, Building2, Sun, ShieldCheck, CheckCircle2, Sparkles, Utensils, Baby, Layers } from 'lucide-react';

import { useBrand } from '../../context/BrandContext';

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  halls: Hall[];
}

export const Step1EventDetails: React.FC<Props> = ({ state, onChange, halls }) => {
  const { brand, pricingRules } = useBrand();
  const partitionFee = pricingRules?.partitionFee !== undefined ? Math.max(0, Number(pricingRules.partitionFee) || 0) : 0;

  const eventTypes = [
    { id: 'barat', label: 'Barat (Wedding Procession & Feast)', tag: 'Grand Wedding' },
    { id: 'walima', label: 'Walima (Royal Groom Reception)', tag: 'Signature Banquet' },
    { id: 'mehendi', label: 'Mehendi & Mayun (Festive Henna Night)', tag: 'Music & Dhol' },
    { id: 'dholki', label: 'Dholki & Sangeet (Intimate Musical Gathering)', tag: 'Traditional Heritage' },
    { id: 'nikah', label: 'Nikah (Solemnization Ceremony)', tag: 'Sacred Vows' },
    { id: 'qawwali_sufi', label: 'Qawwali & Sufi Musical Gala', tag: 'Acoustic Ambience' },
    { id: 'engagement_mangni', label: 'Engagement / Mangni Ceremony', tag: 'Intimate Gathering' },
    { id: 'birthday', label: 'Birthday & Milestone Celebration', tag: 'Celebration' },
  ];

  const timeSlots: { id: TimeSlot; label: string; time: string; note: string }[] = [
    { id: 'lunch', label: 'Day / Walima Lunch', time: '1:00 PM – 4:30 PM', note: 'Ideal for sunlit Winter Walimas & Nikah' },
    { id: 'dinner', label: 'Night Banquet (Dinner)', time: '7:30 PM – 11:00 PM', note: 'Strictly compliant with Punjab/Sindh closing laws' },
    { id: 'full_day', label: 'Full Day Exclusive Access', time: '11:00 AM – 11:30 PM', note: 'Complete private venue buyout' },
  ];

  const selectedHall = halls.find((h) => h.id === state.hallId) || halls[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#997A15] mb-1">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Pakistani Traditional Wedding Configurator</span>
        </div>
        <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
          Step 1: Event Tradition, Schedule & Attendance
        </h3>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Select your wedding tradition to customize provincial banquet rules, hall capacities, and Shahi Dastarkhwan setups.
        </p>
      </div>

      {/* Pakistani Event Type Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          Traditional Occasion
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {eventTypes.map((type) => {
            const isSelected = state.eventType === type.id;
            const matchingSpace = brand.showcaseSpaces?.find((s) => s.occasion === type.id);

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  onChange({
                    eventType: type.id as any,
                    ...(matchingSpace?.hallId ? { hallId: matchingSpace.hallId } : {}),
                    ...(matchingSpace?.rentPrice ? { customHallRent: matchingSpace.rentPrice } : {}),
                    ...(matchingSpace?.perPersonPrice ? { customPerPersonRate: matchingSpace.perPersonPrice } : {}),
                  });
                }}
                className={`p-2.5 sm:p-3.5 text-left rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] text-[#1C1917] ring-2 ring-[#D4AF37] shadow-sm font-semibold'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50 text-[#44403C]'
                }`}
              >
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#997A15] block tracking-wider">
                    {type.tag}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1C1917] mt-0.5 sm:mt-1 block leading-tight">
                    {type.label}
                  </span>
                </div>

                {matchingSpace && (
                  <div className="mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-stone-200/60 text-[10px] sm:text-[11px] space-y-0.5">
                    <div className="text-stone-600 leading-tight">
                      Rent: <strong className="text-[#1C1917]">
                        {state.bookingModel === 'hall_only' ? (
                          `${brand.currencySymbol} ${Math.round(matchingSpace.rentPrice || 0).toLocaleString()}`
                        ) : (
                          <span className="text-emerald-700">FREE (Rs. 0)</span>
                        )}
                      </strong>
                    </div>
                    {matchingSpace.perPersonPrice && state.bookingModel !== 'hall_only' ? (
                      <div className="text-[#997A15] font-semibold leading-tight">
                        Catering: {brand.currencySymbol} {Math.round(matchingSpace.perPersonPrice).toLocaleString()} / head
                      </div>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Mode: Per-Person (Hall Rent Free) vs Sirf Hall Only */}
      <div className="space-y-3 bg-[#FAF8F5] p-3.5 sm:p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1917]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Booking & Pricing Model</span>
          </label>
          <span className="text-[10px] sm:text-[11px] text-[#997A15] font-medium bg-[#F5EFEB] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
            Choose your billing preference
          </span>
        </div>

        {(() => {
          const selectedOccasionSpace = brand.showcaseSpaces?.find((s) => s.occasion === state.eventType);
          const defaultPerPersonRate = selectedOccasionSpace?.perPersonPrice || 2800;
          const currentPerPersonRate = state.customPerPersonRate || defaultPerPersonRate;

          return (
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {/* 1. Per-Person Catering (Hall Rent Free) */}
              <button
                type="button"
                onClick={() => onChange({ bookingModel: 'per_person_only', customPerPersonRate: currentPerPersonRate })}
                className={`p-2.5 sm:p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  state.bookingModel !== 'hall_only'
                    ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37] shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:border-[#D4AF37]/50 text-[#57534E]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200 leading-tight">
                      Hall: FREE (Rs. 0)
                    </span>
                    {state.bookingModel !== 'hall_only' && (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-[#1C1917] mt-1 sm:mt-1.5">Per-Person Rate</div>
                  <p className="text-[10px] sm:text-[11px] text-[#78716C] mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Flat per-head catering rate. <strong>Hall Rent is completely FREE (Rs. 0)</strong>!
                  </p>
                </div>
                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-stone-100 text-[10px] sm:text-[11px] font-semibold text-[#997A15]">
                  {brand.currencySymbol} {currentPerPersonRate.toLocaleString()}/head • Rent: Rs. 0 FREE
                </div>
              </button>

              {/* 2. Hall Only Booking */}
              <button
                type="button"
                onClick={() => onChange({ bookingModel: 'hall_only' })}
                className={`p-2.5 sm:p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  state.bookingModel === 'hall_only'
                    ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37] shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:border-[#D4AF37]/50 text-[#57534E]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#997A15] bg-[#FBF6E9] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#D4AF37]/40 leading-tight">
                      Sirf Hall
                    </span>
                    {state.bookingModel === 'hall_only' && (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-[#1C1917] mt-1 sm:mt-1.5">Sirf Hall Booking</div>
                  <p className="text-[10px] sm:text-[11px] text-[#78716C] mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Book venue hall only. Outside catering / decor (Catering = Rs. 0).
                  </p>
                </div>
                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-stone-100 text-[10px] sm:text-[11px] font-semibold text-emerald-700">
                  Hall Rent Only • Catering Rs. 0
                </div>
              </button>
            </div>
          );
        })()}
      </div>

      {/* Date & Guest Count Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        {/* Event Date */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span>Event Date</span>
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={state.eventDate}
            onChange={(e) => onChange({ eventDate: e.target.value })}
            className="w-full px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
          />
          <p className="text-[9px] sm:text-[11px] text-[#A8A29E] hidden sm:block">
            Fri, Sat, and Sun banquets apply priority weekend staffing rates.
          </p>
        </div>

        {/* Expected Adult Guests */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span>Adult Guests (Full Rate)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="50"
              max="2500"
              step="25"
              value={state.guestCount || ''}
              onChange={(e) => onChange({ guestCount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              placeholder="e.g. 500"
              className="w-full px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
            />
            <span className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-[#A8A29E] font-medium">
              Adults
            </span>
          </div>
          {selectedHall && (
            <p className="text-[9px] sm:text-[11px] text-[#78716C] truncate hidden sm:block">
              {selectedHall.name}: {selectedHall.minCapacity}–{selectedHall.maxCapacity} cap.
            </p>
          )}
        </div>

        {/* Children Under 8 Years (50% Rate) */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              <Baby className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              <span>Children (&lt;8 Yrs)</span>
            </label>
            <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              50% Rate
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="500"
              step="5"
              value={state.childrenCount || ''}
              onChange={(e) => onChange({ childrenCount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              placeholder="0"
              className="w-full px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
            />
            <span className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-[#A8A29E] font-medium">
              Kids
            </span>
          </div>
          <p className="text-[9px] sm:text-[11px] text-[#78716C] truncate hidden sm:block">
            50% food rate for children under 8.
          </p>
        </div>
      </div>

      {/* Pardah / Islamic Segregation Setup */}
      <div className="bg-[#FAF8F5] p-3.5 sm:p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF6E9] border border-[#D4AF37]/40 flex items-center justify-center text-[#997A15] shrink-0 mt-0.5">
              <Layers className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-[#1C1917]">
                  Pardah / Islamic Segregation (Ladies & Gents Partition)
                </h4>
                <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  partitionFee === 0
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-[#997A15] bg-[#FBF6E9] border-[#D4AF37]/30'
                }`}>
                  {partitionFee === 0 ? 'Complimentary / FREE (Rs. 0)' : `+Rs. ${partitionFee.toLocaleString()} Setup`}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#78716C] mt-1 leading-relaxed">
                Includes acoustic soundproof wall dividers, separate ladies entrance, dual buffet lanes, and dedicated female banquet service staff{partitionFee === 0 ? ' (Free / Complimentary setup).' : ` (+Rs. ${partitionFee.toLocaleString()} setup fee).`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ isSegregated: !state.isSegregated })}
            className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all shrink-0 flex items-center gap-2 self-start sm:self-auto ${
              state.isSegregated
                ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm ring-2 ring-[#D4AF37]'
                : 'bg-white text-[#44403C] border-stone-200 hover:border-[#D4AF37]/50'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${state.isSegregated ? 'text-[#D4AF37]' : 'text-stone-300'}`} />
            <span>{state.isSegregated ? 'Pardah Partition Added' : 'Add Pardah Partition'}</span>
          </button>
        </div>
      </div>

      {/* Banquet Time Slot */}
      <div className="space-y-2 sm:space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <span>Banquet Timing Slot</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {timeSlots.map((slot) => {
            const isSelected = state.timeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onChange({ timeSlot: slot.id })}
                className={`p-2.5 sm:p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] ring-1 ring-[#D4AF37] shadow-sm'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="font-semibold text-xs sm:text-sm text-[#1C1917] truncate">{slot.label}</div>
                <div className="text-[10px] sm:text-xs font-bold text-[#997A15] mt-0.5">{slot.time}</div>
                <div className="text-[9px] sm:text-[11px] text-[#78716C] mt-0.5 sm:mt-1 line-clamp-1">{slot.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout & Segregation Setup */}
      <div className="space-y-2 sm:space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          <Sun className="w-4 h-4 text-[#D4AF37]" />
          <span>Seating & Layout Configuration</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            { id: 'indoor', title: 'Grand AC Ballroom', desc: 'Combined hall setup' },
            { id: 'outdoor', title: 'Starlit Lawn', desc: 'Ivory pergolas & open skies' },
            { id: 'both', title: 'Pardah Partitions', desc: 'Ladies & Gents sections' },
          ].map((pref) => {
            const isSelected = state.isIndoorOutdoor === pref.id;
            return (
              <button
                key={pref.id}
                type="button"
                onClick={() => onChange({ isIndoorOutdoor: pref.id as any })}
                className={`p-2.5 sm:p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] ring-1 ring-[#D4AF37] shadow-sm'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="font-semibold text-xs sm:text-sm text-[#1C1917] truncate">{pref.title}</div>
                <div className="text-[9px] sm:text-[11px] text-[#78716C] mt-0.5 sm:mt-1 line-clamp-1">{pref.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
