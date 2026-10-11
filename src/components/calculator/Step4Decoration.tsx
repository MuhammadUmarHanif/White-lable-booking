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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decorations.map((dec) => {
          const isSelected = (state.selectedDecorationIds || []).includes(dec.id);

          return (
            <div
              key={dec.id}
              onClick={() => toggleDecoration(dec.id)}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] bg-[#FBF6E9] shadow-md'
                  : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
              }`}
            >
              {dec.image && (
                <div className="h-40 w-full overflow-hidden bg-stone-100">
                  <img
                    src={dec.image}
                    alt={dec.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-base font-bold text-[#1C1917]">
                      {dec.name}
                    </h4>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#D4AF37] text-white' : 'border border-stone-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                    {dec.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-[#78716C] capitalize">
                    {dec.category.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-[#1C1917]">
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
