import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MultiStepCalculator } from '../../components/calculator/MultiStepCalculator';
import { Sparkles } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventTypeParam = (searchParams.get('eventType') || searchParams.get('occasion')) as any;
  const hallParam = searchParams.get('hall');
  const packageParam = searchParams.get('package');
  const rentParam = searchParams.get('rent') ? Number(searchParams.get('rent')) : undefined;
  const perPersonParam = searchParams.get('perPerson') ? Number(searchParams.get('perPerson')) : undefined;

  return (
    <div className="pt-24 pb-20 min-h-screen champagne-gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF8F5] text-xs font-semibold text-[#997A15]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Interactive Bespoke Estimator</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1C1917]">
          Event Cost & Banquet Configurator
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto font-light leading-relaxed">
          Select your desired hall, chef catering tier, stage architecture, and optional power backup. Our pure calculation engine computes itemized costs instantly.
        </p>
      </div>

      <MultiStepCalculator
        initialState={{
          ...(eventTypeParam ? { eventType: eventTypeParam } : {}),
          ...(hallParam ? { hallId: hallParam } : {}),
          ...(packageParam ? { selectedPackageId: packageParam } : {}),
          ...(rentParam ? { customHallRent: rentParam } : {}),
          ...(perPersonParam ? { customPerPersonRate: perPersonParam } : {}),
        }}
      />
    </div>
  );
};
