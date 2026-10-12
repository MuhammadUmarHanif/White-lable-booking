import React from 'react';
import { CalculatorState, OptionalService } from '../../types';
import { Zap, ShieldCheck, Check, Plus, AlertCircle } from 'lucide-react';

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  optionalServices: OptionalService[];
  currencySymbol: string;
}

export const Step5OptionalServices: React.FC<Props> = ({
  state,
  onChange,
  optionalServices,
  currencySymbol,
}) => {
  const toggleService = (id: string, isMandatory?: boolean) => {
    if (isMandatory) return; // Cannot uncheck mandatory venue policy services
    const current = state.selectedServiceIds || [];
    if (current.includes(id)) {
      onChange({ selectedServiceIds: current.filter((item) => item !== id) });
    } else {
      onChange({ selectedServiceIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
          Step 5: Event Services, Power & Audio Visuals
        </h3>
        <p className="text-sm text-[#78716C] mt-1">
          Ensure flawless execution with heavy-duty backup generators, concert sound systems, and dedicated valet teams.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {optionalServices.map((srv) => {
          const isSelected = srv.isMandatory || (state.selectedServiceIds || []).includes(srv.id);

          return (
            <div
              key={srv.id}
              onClick={() => toggleService(srv.id, srv.isMandatory)}
              className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all flex items-start justify-between gap-2 sm:gap-4 ${
                srv.isMandatory
                  ? 'border-[#D4AF37]/50 bg-[#FBF6E9]/60 cursor-default'
                  : isSelected
                  ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] bg-[#FBF6E9] shadow-sm cursor-pointer'
                  : 'border-stone-200 bg-white hover:border-[#D4AF37]/50 cursor-pointer'
              }`}
            >
              <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-[#1C1917] leading-tight truncate">{srv.name}</h4>
                  {srv.isMandatory && (
                    <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] uppercase font-bold bg-[#1C1917] text-[#D4AF37]">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-[#78716C] leading-relaxed line-clamp-2 sm:line-clamp-none">{srv.description}</p>
                <div className="text-[10px] sm:text-xs font-bold text-[#997A15] pt-0.5 sm:pt-1">
                  {srv.pricingType === 'per_person'
                    ? `+${currencySymbol} ${Math.round(srv.price).toLocaleString()} / guest`
                    : `${currencySymbol} ${Math.round(srv.price).toLocaleString()} fixed`}
                </div>
              </div>

              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 transition-colors ${
                  isSelected
                    ? 'bg-[#D4AF37] text-white'
                    : 'border border-stone-300 text-transparent'
                }`}
              >
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
