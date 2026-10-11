import React from 'react';
import { CalculatorState, Hall, PricingRules } from '../../types';
import { isWeekendDay, isPeakSeasonDate } from '../../services/pricingEngine';
import { Building2, Users, Check, AlertCircle, Info, Sparkles } from 'lucide-react';

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  halls: Hall[];
  pricingRules: PricingRules;
  currencySymbol: string;
}

export const Step2VenueSelection: React.FC<Props> = ({
  state,
  onChange,
  halls,
  pricingRules,
  currencySymbol,
}) => {
  const isWeekend = isWeekendDay(state.eventDate);
  const isPeak = isPeakSeasonDate(state.eventDate, pricingRules.peakSeasonMonths);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
          Step 2: Venue Space & Hall Selection
        </h3>
        <p className="text-sm text-[#78716C] mt-1">
          Choose the architectural hall or pavilion that best accommodates your guest attendance and ambiance desires.
        </p>
      </div>

      {/* Seasonal & Weekend Notice Banner */}
      {(isWeekend || isPeak) && (
        <div className="p-4 rounded-xl bg-[#FBF6E9] border border-[#D4AF37]/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#997A15] shrink-0 mt-0.5" />
          <div className="text-xs text-[#57534E] space-y-1">
            <span className="font-semibold text-[#1C1917] block">
              Active Date Rules Applied to Estimate
            </span>
            {isWeekend && (
              <p>
                • Your selected date is a weekend. A {pricingRules.weekendSurchargePercentage}% premium applies for priority weekend banquet coordination.
              </p>
            )}
            {isPeak && (
              <p>
                • Your selected date falls within the peak wedding season. A {pricingRules.peakSeasonSurchargePercentage}% peak demand rate applies.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hall Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {halls.map((hall) => {
          const isSelected = state.hallId === hall.id;
          const isUnderCapacity = state.guestCount > 0 && state.guestCount < hall.minCapacity;
          const isOverCapacity = state.guestCount > hall.maxCapacity;

          return (
            <div
              key={hall.id}
              onClick={() => onChange({ hallId: hall.id })}
              className={`relative rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/80 shadow-lg bg-[#FAF8F5]'
                  : 'border-stone-200 bg-white hover:border-[#D4AF37]/50 hover:shadow-md'
              }`}
            >
              {/* Image Preview */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                  alt={hall.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#D4AF37]" />
                  <span>{hall.minCapacity} – {hall.maxCapacity}</span>
                </div>
                {hall.isIndoor ? (
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] text-white">
                    Indoor Climate Control
                  </span>
                ) : (
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] text-white">
                    Open-Air Canopy
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                      {hall.name}
                    </h4>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">
                    {hall.description}
                  </p>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(hall.amenities || []).slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-[#57534E]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Capacity warning indicator if guests out of range */}
                {(isUnderCapacity || isOverCapacity) && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isUnderCapacity
                        ? `Min capacity is ${hall.minCapacity}`
                        : `Max capacity is ${hall.maxCapacity}`}
                    </span>
                  </div>
                )}

                {/* Base price footer */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-[#78716C]">
                    {state.bookingModel === 'hall_only' ? 'Occasion Hall Rent' : 'Base Space Rental'}
                  </span>
                  <span className="text-base font-bold text-[#1C1917]">
                    {state.bookingModel === 'per_person_only' ? (
                      <span className="text-emerald-700 font-bold">FREE (Waived)</span>
                    ) : (
                      `${currencySymbol} ${Math.round(
                        (isSelected && state.customHallRent) ? state.customHallRent : (state.customHallRent || hall.baseRentalPrice || 0)
                      ).toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
