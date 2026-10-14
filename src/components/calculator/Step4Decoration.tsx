import React from 'react';
import { CalculatorState, DecorationOption } from '../../types';
import { Sparkles, Check, Plus, Image } from 'lucide-react';

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  decorations: DecorationOption[];
  currencySymbol: string;
}

export const Step4Decoration: React.FC<Props> = ({
  state,
  onChange,
  decorations,
  currencySymbol,
}) => {
  const toggleDecoration = (id: string) => {
    const current = state.selectedDecorationIds || [];
    if (current.includes(id)) {
      onChange({ selectedDecorationIds: current.filter((item) => item !== id) });
    } else {
      onChange({ selectedDecorationIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
          Step 4: Stage Design, Florals & Ambience Décor
        </h3>
        <p className="text-sm text-[#78716C] mt-1">
          Select bespoke architectural stage setups, fresh floral canopies, and mood lighting.
        </p>
      </div>

      {/* Outside Event Designer / Decorator Royalty Option */}
      <div className="bg-[#FAF8F5] p-3.5 sm:p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF6E9] border border-[#D4AF37]/40 flex items-center justify-center text-[#997A15] shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-[#1C1917]">
                  Bringing an Outside Event Designer / Decorator?
                </h4>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[#997A15] bg-[#FBF6E9] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  +Rs. 35,000 Royalty Fee
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#78716C] mt-1 leading-relaxed">
                If hiring an external wedding planner or third-party designer, marquee charges fixed royalty covering high-voltage generator access, ceiling truss rigging, and cleanup.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ hasOutsideDecorator: !state.hasOutsideDecorator })}
            className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all shrink-0 flex items-center gap-2 self-start sm:self-auto ${
              state.hasOutsideDecorator
                ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm ring-2 ring-[#D4AF37]'
                : 'bg-white text-[#44403C] border-stone-200 hover:border-[#D4AF37]/50'
            }`}
          >
            <Check className={`w-4 h-4 ${state.hasOutsideDecorator ? 'text-[#D4AF37]' : 'text-stone-300'}`} />
            <span>{state.hasOutsideDecorator ? 'Royalty Fee Added (+35k)' : 'Bring Outside Decorator'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
        {decorations.map((dec) => {
          const isSelected = (state.selectedDecorationIds || []).includes(dec.id);

          return (
            <div
              key={dec.id}
              onClick={() => toggleDecoration(dec.id)}
              className={`rounded-xl sm:rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] bg-[#FBF6E9] shadow-md'
                  : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
              }`}
            >
              {dec.image && (
                <div className="h-24 sm:h-40 w-full overflow-hidden bg-stone-100">
                  <img
                    src={dec.image}
                    alt={dec.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-serif text-xs sm:text-base font-bold text-[#1C1917] leading-tight">
                      {dec.name}
                    </h4>
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#D4AF37] text-white' : 'border border-stone-300 text-transparent'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#78716C] mt-1 leading-relaxed line-clamp-2">
                    {dec.description}
                  </p>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-stone-200/60 flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-[#78716C] capitalize truncate pr-1">
                    {dec.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] sm:text-sm font-bold text-[#1C1917] shrink-0">
                    {dec.pricingType === 'per_person'
                      ? `+${currencySymbol} ${Math.round(dec.price).toLocaleString()} / guest`
                      : `${currencySymbol} ${Math.round(dec.price).toLocaleString()} fixed`}
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
