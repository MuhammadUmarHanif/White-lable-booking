import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculatorState, CalculationResult } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { calculateEventCost } from '../../services/pricingEngine';
import { Step1EventDetails } from './Step1EventDetails';
import { Step2VenueSelection } from './Step2VenueSelection';
import { Step3FoodSelection } from './Step3FoodSelection';
import { Step4Decoration } from './Step4Decoration';
import { Step5OptionalServices } from './Step5OptionalServices';
import { Step6CostSummary } from './Step6CostSummary';
import { ChevronLeft, ChevronRight, Check, Sparkles, Receipt, UtensilsCrossed, ArrowRight } from 'lucide-react';

interface Props {
  initialState?: Partial<CalculatorState>;
  onComplete?: (state: CalculatorState, calculation: CalculationResult) => void;
}

export const MultiStepCalculator: React.FC<Props> = ({ initialState, onComplete }) => {
  const navigate = useNavigate();
  const { brand, halls, menuPackages, menuItems, decorations, optionalServices, pricingRules } = useBrand();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Set default initial date to next month's Saturday
  const defaultEventDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const OCCASION_PACKAGE_MAP: Record<string, string> = {
    barat: 'pkg-shahi-barat',
    walima: 'pkg-walima-imperial',
    mehendi: 'pkg-mehendi-festive',
    dholki: 'pkg-mehendi-festive',
    nikah: 'pkg-engagement-mangni',
    qawwali_sufi: 'pkg-qawwali-sufi',
    engagement_mangni: 'pkg-engagement-mangni',
    birthday: 'pkg-birthday-milestone',
    corporate_gala: 'pkg-qawwali-sufi',
  };

  const [state, setState] = useState<CalculatorState>(() => {
    const targetType = (initialState?.eventType || 'barat') as string;
    const occ = brand.showcaseSpaces?.find((s) => s.occasion === targetType) || brand.showcaseSpaces?.[0];
    return {
      eventType: (initialState?.eventType || occ?.occasion || 'barat') as any,
      eventDate: defaultEventDate,
      timeSlot: 'dinner',
      guestCount: 500,
      hallId: initialState?.hallId || occ?.hallId || halls[0]?.id || 'hall-mughal-shahi',
      isIndoorOutdoor: 'indoor',
      selectedPackageId: initialState?.selectedPackageId || OCCASION_PACKAGE_MAP[targetType] || 'pkg-shahi-barat',
      customDishIds: [],
      selectedDecorationIds: [], // Start without pre-selected decor so initial cost starts purely from the occasion predefined rent + catering
      selectedServiceIds: [],
      customHallRent: initialState?.customHallRent || occ?.rentPrice,
      customPerPersonRate: initialState?.customPerPersonRate || occ?.perPersonPrice,
      ...initialState,
    };
  });

  // Calculate live cost synchronously via pure pricing engine
  const calculation: CalculationResult = useMemo(() => {
    return calculateEventCost(state, {
      halls,
      menuPackages,
      menuItems,
      decorations,
      optionalServices,
      pricingRules,
    });
  }, [state, halls, menuPackages, menuItems, decorations, optionalServices, pricingRules]);

  const updateState = (updates: Partial<CalculatorState>) => {
    if (updates.eventType && updates.eventType !== state.eventType) {
      const occ = brand.showcaseSpaces?.find((s) => s.occasion === updates.eventType);
      const pkgId = OCCASION_PACKAGE_MAP[updates.eventType] || state.selectedPackageId;
      if (occ) {
        updates = {
          ...updates,
          hallId: occ.hallId || state.hallId,
          customHallRent: occ.rentPrice,
          customPerPersonRate: occ.perPersonPrice,
          selectedPackageId: pkgId,
        };
      } else {
        updates = {
          ...updates,
          selectedPackageId: pkgId,
        };
      }
    }
    setState((prev) => ({ ...prev, ...updates }));
  };

  const selectedHall = halls.find((h) => h.id === state.hallId) || halls[0];

  const steps = [
    { number: 1, title: 'Schedule & Guests' },
    { number: 2, title: 'Hall Space' },
    { number: 3, title: state.bookingModel === 'hall_only' ? 'Catering (Self-Arranged)' : 'Catering & Banquets' },
    { number: 4, title: 'Stage & Décor' },
    { number: 5, title: 'Power & Services' },
    { number: 6, title: 'Cost Summary' },
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleProceedToBooking = () => {
    // Save current calculator snapshot into session storage
    sessionStorage.setItem('current_calculator_state', JSON.stringify(state));
    sessionStorage.setItem('current_calculation_result', JSON.stringify(calculation));
    if (onComplete) {
      onComplete(state, calculation);
    } else {
      navigate('/booking-request');
    }
  };

  const handlePrintQuotation = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Multi-step Header Stepper */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2 sm:pb-0">
          {steps.map((s) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setCurrentStep(s.number)}
                className="flex items-center gap-2.5 min-w-max group text-left focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-stone-900 text-[#D4AF37]'
                      : isCurrent
                      ? 'gold-gradient-bg text-white shadow-md ring-2 ring-[#D4AF37]/40'
                      : 'bg-stone-100 text-[#78716C] group-hover:bg-stone-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.number}
                </div>
                <div className="hidden sm:block">
                  <span
                    className={`text-xs block font-medium ${
                      isCurrent ? 'text-[#1C1917] font-bold' : 'text-[#78716C]'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Step Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm min-h-[520px]">
        {currentStep === 1 && (
          <Step1EventDetails state={state} onChange={updateState} halls={halls} />
        )}
        {currentStep === 2 && (
          <Step2VenueSelection
            state={state}
            onChange={updateState}
            halls={halls}
            pricingRules={pricingRules}
            currencySymbol={brand.currencySymbol}
          />
        )}
        {currentStep === 3 && (
          state.bookingModel === 'hall_only' ? (
            <div className="py-12 px-4 text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <Check className="w-3.5 h-3.5" /> Catering Fee Waived (Rs. 0)
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
                  Sirf Hall Booking (Hall Only) Active
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed max-w-md mx-auto">
                  Aap ne sirf hall rent par lene ka option select kiya hai. Marquee catering aur per-head food charges <span className="font-semibold text-emerald-700">Rs. 0</span> hain. Aap bahar se apna catering setup aur degain laa saktay hain.
                </p>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 text-left space-y-1.5 max-w-md mx-auto">
                <p className="font-semibold text-stone-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Outside Catering Permissions Included:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                  <li>Kitchen washing bay & service area access included</li>
                  <li>Catering service timing aligns with booked slot</li>
                  <li>No per-person dining charges applied by marquee</li>
                </ul>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="gold-gradient-bg text-white px-7 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] text-xs uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <span>Agay Barhein: Stage & Décor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Step3FoodSelection
              state={state}
              onChange={updateState}
              menuPackages={menuPackages}
              menuItems={menuItems}
              currencySymbol={brand.currencySymbol}
            />
          )
        )}
        {currentStep === 4 && (
          <Step4Decoration
            state={state}
            onChange={updateState}
            decorations={decorations}
            currencySymbol={brand.currencySymbol}
          />
        )}
        {currentStep === 5 && (
          <Step5OptionalServices
            state={state}
            onChange={updateState}
            optionalServices={optionalServices}
            currencySymbol={brand.currencySymbol}
          />
        )}
        {currentStep === 6 && (
          <Step6CostSummary
            state={state}
            calculation={calculation}
            pricingRules={pricingRules}
            selectedHall={selectedHall}
            currencySymbol={brand.currencySymbol}
            onProceedToBooking={handleProceedToBooking}
            onPrintQuotation={handlePrintQuotation}
          />
        )}
      </div>

      {/* Persistent Bottom Controls & Live Estimate Bar */}
      <div className="sticky bottom-4 z-40 bg-[#1C1917] text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Live running calculation indicator */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#292524] text-[#D4AF37] shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#A8A29E]">
                Estimated Total:
              </span>
              <span className="text-xl sm:text-2xl font-numeric font-bold text-[#FAF8F5]">
                {brand.currencySymbol} {Math.round(calculation.totalEstimatedPrice).toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-[#A8A29E]">
              {state.bookingModel === 'per_person_only' ? (
                <>
                  <span className="text-[#D4AF37] font-semibold">
                    Catering: {brand.currencySymbol} {Math.round(calculation.foodCost).toLocaleString()}
                  </span>
                  {' '}({brand.currencySymbol} {Math.round(calculation.costPerGuest || 500).toLocaleString()} × {state.guestCount} guests)
                  {' '}+ <span className="text-emerald-400 font-semibold">Hall Rent: FREE (Rs. 0)</span>
                </>
              ) : state.bookingModel === 'hall_only' ? (
                <>
                  <span className="text-[#D4AF37] font-semibold">
                    Hall Rent Only: {brand.currencySymbol} {Math.round(calculation.venueRentalCost).toLocaleString()}
                  </span>
                  {' '}• Catering: Self-Arranged (Rs. 0) • {state.guestCount} guests • {selectedHall?.name}
                </>
              ) : calculation.foodCost > 0 ? (
                <>
                  <span className="text-[#D4AF37] font-semibold">
                    Catering: {brand.currencySymbol} {Math.round(calculation.foodCost).toLocaleString()}
                  </span>
                  {' '}({brand.currencySymbol} {Math.round(calculation.costPerGuest).toLocaleString()} × {state.guestCount} guests)
                  {calculation.venueRentalCost > 0 ? (
                    ` + Hall Rent: ${brand.currencySymbol} ${Math.round(calculation.venueRentalCost).toLocaleString()}`
                  ) : (
                    <> + <span className="text-emerald-400 font-semibold">Hall Rent: FREE (Rs. 0 Included)</span></>
                  )}
                </>
              ) : (
                <>
                  Hall Space Rent: {brand.currencySymbol} {Math.round(calculation.venueRentalCost).toLocaleString()} • {state.guestCount} guests • {selectedHall?.name}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Step Navigation */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-full border border-stone-700 bg-stone-800 hover:bg-stone-700 text-xs font-semibold uppercase tracking-wider text-white transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-1.5"
            >
              <span>Next: {steps[currentStep].title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleProceedToBooking}
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Reserve Date Now</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
