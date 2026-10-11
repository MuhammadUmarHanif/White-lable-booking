import React from 'react';
import { CalculatorState, TimeSlot, Hall } from '../../types';
import { Calendar, Users, Clock, Building2, Sun, ShieldCheck, CheckCircle2, Sparkles, Utensils } from 'lucide-react';

import { useBrand } from '../../context/BrandContext';

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  halls: Hall[];
}

export const Step1EventDetails: React.FC<Props> = ({ state, onChange, halls }) => {
  const { brand } = useBrand();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                className={`p-3.5 text-left rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] text-[#1C1917] ring-2 ring-[#D4AF37] shadow-sm font-semibold'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50 text-[#44403C]'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#997A15] block tracking-wider">
                    {type.tag}
                  </span>
                  <span className="text-xs font-bold text-[#1C1917] mt-1 block">
                    {type.label}
                  </span>
                </div>

                {matchingSpace && (
                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-[11px] space-y-0.5">
                    <div className="text-stone-600">
                      Rent: <strong className="text-[#1C1917]">
                        {state.bookingModel === 'hall_only' ? (
                          `${brand.currencySymbol} ${Math.round(matchingSpace.rentPrice || 0).toLocaleString()}`
                        ) : (
                          <span className="text-emerald-700">FREE (Rs. 0 Included)</span>
                        )}
                      </strong>
                    </div>
                    {matchingSpace.perPersonPrice && state.bookingModel !== 'hall_only' ? (
                      <div className="text-[#997A15] font-semibold">
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

      {/* Booking Mode: Full Package vs Hall Only vs Per-Person Only (Hall Rent Free) */}
      <div className="space-y-3 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1917]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Booking & Pricing Model</span>
          </label>
          <span className="text-[11px] text-[#997A15] font-medium bg-[#F5EFEB] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
            Choose your billing preference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. All-Inclusive Package */}
          <button
            type="button"
            onClick={() => onChange({ bookingModel: 'all_inclusive', customPerPersonRate: undefined })}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
              (!state.bookingModel || state.bookingModel === 'all_inclusive')
                ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37] shadow-sm'
                : 'border-stone-200 bg-white/70 hover:border-[#D4AF37]/50 text-[#57534E]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#997A15]">Standard</span>
                {(!state.bookingModel || state.bookingModel === 'all_inclusive') && (
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                )}
              </div>
              <div className="font-bold text-sm text-[#1C1917] mt-1">Full Package (Hall + Food)</div>
              <p className="text-[11px] text-[#78716C] mt-1 leading-relaxed">
                Standard Hall Space plus Shahi Dastarkhwan catering. Hall rent is 100% complimentary (Rs. 0)!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] font-semibold text-emerald-700">
              Per-Person Catering Only • Hall Rent Free (Rs. 0)
            </div>
          </button>

          {/* 2. Hall Only Booking */}
          <button
            type="button"
            onClick={() => onChange({ bookingModel: 'hall_only', customPerPersonRate: undefined })}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
              state.bookingModel === 'hall_only'
                ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37] shadow-sm'
                : 'border-stone-200 bg-white/70 hover:border-[#D4AF37]/50 text-[#57534E]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#997A15]">Sirf Hall</span>
                {state.bookingModel === 'hall_only' && (
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                )}
              </div>
              <div className="font-bold text-sm text-[#1C1917] mt-1">Sirf Hall Booking (Hall Only)</div>
              <p className="text-[11px] text-[#78716C] mt-1 leading-relaxed">
                Book the venue hall only. Bring your own outside catering / decor (Catering = Rs. 0).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] font-semibold text-emerald-700">
              Only Hall Rent Charged • Catering Rs. 0
            </div>
          </button>

          {/* 3. Per-Person Catering (Hall Rent Free) */}
          <button
            type="button"
            onClick={() => onChange({ bookingModel: 'per_person_only', customPerPersonRate: state.customPerPersonRate || 500 })}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
              state.bookingModel === 'per_person_only'
                ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37] shadow-sm'
                : 'border-stone-200 bg-white/70 hover:border-[#D4AF37]/50 text-[#57534E]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Hall Rent: FREE (Rs. 0)
                </span>
                {state.bookingModel === 'per_person_only' && (
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                )}
              </div>
              <div className="font-bold text-sm text-[#1C1917] mt-1">Per-Person Rate</div>
              <p className="text-[11px] text-[#78716C] mt-1 leading-relaxed">
                Flat per-head catering rate. <strong>Hall Rent is completely FREE (Rs. 0 waived)</strong>!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] font-semibold text-[#997A15]">
              {brand.currencySymbol} {(state.customPerPersonRate || 500).toLocaleString()}/head • Rent: Rs. 0 FREE
            </div>
          </button>
        </div>

        {/* If Per-Person model selected, show custom rate selector & Rs. 500 preset buttons */}
        {/* {state.bookingModel === 'per_person_only' && (
          <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 bg-white p-4 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#1C1917]">Select or Enter Per-Head Rate:</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                ✓ Hall Rent 100% Waived (Rs. 0)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[500, 1000, 1500, 2000, 2500].map((rate) => {
                const isActive = (state.customPerPersonRate || 500) === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onChange({ customPerPersonRate: rate })}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#1C1917] text-[#D4AF37] ring-2 ring-[#D4AF37] shadow-xs'
                        : 'bg-stone-100 text-[#44403C] hover:bg-[#FBF6E9] hover:text-[#997A15]'
                    }`}
                  >
                    {rate === 500 ? '★ Rs. 500 / person' : `Rs. ${rate.toLocaleString()} / person`}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-[#78716C] whitespace-nowrap">Or Custom Rate:</span>
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#997A15]">
                  {brand.currencySymbol}
                </span>
                <input
                  type="number"
                  min="200"
                  max="15000"
                  step="50"
                  value={state.customPerPersonRate || 500}
                  onChange={(e) => onChange({ customPerPersonRate: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full pl-10 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-[#1C1917] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
              <span className="text-xs text-[#78716C]">/ guest</span>
            </div>
          </div>
        )} */}
      </div>

      {/* Date & Guest Count Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Target Event Date</span>
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={state.eventDate}
            onChange={(e) => onChange({ eventDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
          />
          <p className="text-[11px] text-[#A8A29E]">
            Friday, Saturday, and Sunday banquets apply priority weekend staffing rates.
          </p>
        </div>

        {/* Expected Guests */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Expected Guest Headcount (Pardah / Combined)</span>
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
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A8A29E] font-medium">
              Guests
            </span>
          </div>
          {selectedHall && (
            <p className="text-[11px] text-[#78716C]">
              {selectedHall.name}: {selectedHall.minCapacity} – {selectedHall.maxCapacity} guest capacity (Min billable: {selectedHall.minBillableGuests}).
            </p>
          )}
        </div>
      </div>

      {/* Banquet Time Slot */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <span>Banquet Timing Slot</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = state.timeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onChange({ timeSlot: slot.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] ring-1 ring-[#D4AF37] shadow-sm'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="font-semibold text-sm text-[#1C1917]">{slot.label}</div>
                <div className="text-xs font-bold text-[#997A15] mt-0.5">{slot.time}</div>
                <div className="text-[11px] text-[#78716C] mt-1">{slot.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout & Segregation Setup */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          <Sun className="w-4 h-4 text-[#D4AF37]" />
          <span>Seating & Layout Configuration</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'indoor', title: 'Grand Central AC Ballroom', desc: 'Combined hall setup with central stage' },
            { id: 'outdoor', title: 'Starlit Open-Air Lawn', desc: 'Ivory pergolas & open skies' },
            { id: 'both', title: 'Segregated Pardah Partitions', desc: 'Independent Ladies & Gents sections' },
          ].map((pref) => {
            const isSelected = state.isIndoorOutdoor === pref.id;
            return (
              <button
                key={pref.id}
                type="button"
                onClick={() => onChange({ isIndoorOutdoor: pref.id as any })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] text-[#1C1917] font-semibold ring-1 ring-[#D4AF37]'
                    : 'border-stone-200 bg-white text-[#57534E] hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="text-xs font-bold text-[#1C1917]">{pref.title}</div>
                <div className="text-[11px] text-[#78716C] mt-0.5">{pref.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
