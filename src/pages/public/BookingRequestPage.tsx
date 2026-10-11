import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { useBrand } from '../../context/BrandContext';
import { CalculatorState, CalculationResult, BookingRequest } from '../../types';
import { createBookingRequest } from '../../services/firebaseService';
import { calculateEventCost } from '../../services/pricingEngine';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Clock, 
  Receipt, 
  Building2, 
  AlertCircle, 
  Printer, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

const bookingSchema = z.object({
  customerName: z.string().min(3, 'Full name is required (minimum 3 characters)'),
  customerPhone: z.string().min(7, 'A valid contact phone number is required'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerCity: z.string().optional(),
  customerNotes: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the marquee terms and booking policy'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const BookingRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { brand, halls, menuPackages, menuItems, decorations, optionalServices, pricingRules } = useBrand();

  const [savedCalculatorState, setSavedCalculatorState] = useState<CalculatorState | null>(null);
  const [savedCalculation, setSavedCalculation] = useState<CalculationResult | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    // Load snapshot from session storage
    const stateStr = sessionStorage.getItem('current_calculator_state');
    const calcStr = sessionStorage.getItem('current_calculation_result');

    if (stateStr && calcStr) {
      try {
        setSavedCalculatorState(JSON.parse(stateStr));
        setSavedCalculation(JSON.parse(calcStr));
      } catch (e) {
        console.error('Error parsing session state:', e);
      }
    } else {
      // Fallback default calculation state
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 30);
      const fallbackState: CalculatorState = {
        eventType: 'wedding',
        eventDate: fallbackDate.toISOString().split('T')[0],
        timeSlot: 'dinner',
        guestCount: 500,
        hallId: halls[0]?.id || 'hall-imperial-grand',
        isIndoorOutdoor: 'indoor',
        selectedPackageId: menuPackages[0]?.id || null,
        customDishIds: [],
        selectedDecorationIds: [],
        selectedServiceIds: [],
      };
      setSavedCalculatorState(fallbackState);
      const fallbackCalc = calculateEventCost(fallbackState, {
        halls,
        menuPackages,
        menuItems,
        decorations,
        optionalServices,
        pricingRules,
      });
      setSavedCalculation(fallbackCalc);
    }
  }, [halls, menuPackages, menuItems, decorations, optionalServices, pricingRules]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!savedCalculatorState || !savedCalculation) return;

    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      const selectedHall = halls.find((h) => h.id === savedCalculatorState.hallId) || halls[0];

      const newBooking = await createBookingRequest({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerCity: data.customerCity,
        customerNotes: data.customerNotes,
        eventType: savedCalculatorState.eventType,
        eventDate: savedCalculatorState.eventDate,
        timeSlot: savedCalculatorState.timeSlot,
        guestCount: savedCalculatorState.guestCount,
        hallId: savedCalculatorState.hallId,
        hallName: selectedHall.name,
        calculatorSnapshot: savedCalculatorState,
        calculationSnapshot: savedCalculation,
        totalQuotationAmount: savedCalculation.totalEstimatedPrice,
        advanceRequired: savedCalculation.requiredAdvanceAmount,
      });

      setSubmittedBooking(newBooking);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FAF8F5', '#1C1917'],
      });
    } catch (err: any) {
      console.error('Error submitting booking request:', err);
      setSubmissionError(err.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedHall = halls.find((h) => h.id === savedCalculatorState?.hallId) || halls[0];
  const selectedPkg = menuPackages.find((p) => p.id === savedCalculatorState?.selectedPackageId);

  // If submitted successfully, show confirmation screen
  if (submittedBooking) {
    return (
      <div className="pt-28 pb-20 min-h-screen champagne-gradient-bg">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-[#D4AF37]/40 p-8 sm:p-12 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#997A15]">
                Booking Request Successfully Logged
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
                Reference #{submittedBooking.referenceNumber}
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-[#1C1917]">{submittedBooking.customerName}</strong>. Your event quotation and requirements have been submitted to the marquee concierge.
              </p>
            </div>

            {/* Pending Notice Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Status: Pending Concierge Review</span>
              </div>
              <p>
                Per venue policy, dates are not confirmed until reviewed and approved by management. An executive concierge will contact you at <strong className="text-amber-950">{submittedBooking.customerPhone}</strong> within 24 hours to confirm date lock and deposit terms.
              </p>
            </div>

            {/* Summary Snapshot Card */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-stone-200 pb-2 font-bold text-[#1C1917]">
                <span>Venue Space:</span>
                <span>{submittedBooking.hallName}</span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span>Target Date & Slot:</span>
                <span>{submittedBooking.eventDate} ({submittedBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span>Guest Count:</span>
                <span>{submittedBooking.guestCount} Guests</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-base text-[#1C1917]">
                <span>Total Quotation:</span>
                <span>{brand.currencySymbol} {Math.round(submittedBooking.totalQuotationAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/quotation/${submittedBooking.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>View Official Printable Quotation</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1C1917] border border-stone-300 hover:bg-stone-50"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen champagne-gradient-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center gap-2">
          <Link
            to="/calculator"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Selections in Calculator</span>
          </Link>
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#997A15]">
            Formal Booking Request
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
            Submit Request & Lock Quotation
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Provide your contact details so our event directors can verify hall availability and issue your official reserved booking agreement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  Primary Host Information
                </h3>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('customerName')}
                    placeholder="e.g. Chaudhry Mohammad Tariq"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-rose-600">{errors.customerName.message}</p>
                  )}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      Contact Telephone / Mobile *
                    </label>
                    <input
                      type="tel"
                      {...register('customerPhone')}
                      placeholder="+92 (300) 845-6789"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-rose-600">{errors.customerPhone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('customerEmail')}
                      placeholder="tariq@example.pk"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.customerEmail && (
                      <p className="text-xs text-rose-600">{errors.customerEmail.message}</p>
                    )}
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Resident City (Islamabad, Islamabad, Karachi, Rawalpindi, etc.)
                  </label>
                  <input
                    type="text"
                    {...register('customerCity')}
                    placeholder="e.g. DHA Islamabad / Bahria Town / Islamabad"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                {/* Customer Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Special Requests or Bridal Preferences
                  </label>
                  <textarea
                    rows={3}
                    {...register('customerNotes')}
                    placeholder="Specify segregation (pardah partition), Dhol arrival timing, live jalebi stall, or dietary details..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                {/* Terms Acceptance */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('acceptTerms')}
                      className="w-4 h-4 rounded text-[#D4AF37] border-stone-300 focus:ring-[#D4AF37] mt-0.5"
                    />
                    <span className="text-xs text-[#57534E] leading-relaxed">
                      I understand that this request creates an official inquiry hold and is subject to date verification and final deposit confirmation by {brand.businessName}.
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-xs text-rose-600 mt-1">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>

              {submissionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {submissionError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest text-white gold-gradient-bg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting Request...' : 'Submit Request & Lock Quotation'}
              </button>
            </form>
          </div>

          {/* Right Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#1C1917] border-b border-stone-100 pb-3">
              Quotation Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#78716C]">
                <span>Occasion:</span>
                <span className="font-semibold text-[#1C1917] capitalize">
                  {savedCalculatorState?.eventType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Date & Slot:</span>
                <span className="font-semibold text-[#1C1917]">
                  {savedCalculatorState?.eventDate} ({savedCalculatorState?.timeSlot})
                </span>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Attending Guests:</span>
                <span className="font-semibold text-[#1C1917]">
                  {savedCalculatorState?.guestCount} Guests
                </span>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Selected Hall:</span>
                <span className="font-semibold text-[#1C1917]">
                  {selectedHall?.name}
                </span>
              </div>
              {selectedPkg && (
                <div className="flex justify-between text-[#78716C]">
                  <span>Dining Package:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {selectedPkg.name}
                  </span>
                </div>
              )}
            </div>

            {/* Price breakdown summary */}
            {savedCalculation && (
              <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Venue Space Rental</span>
                  <span>{brand.currencySymbol} {Math.round(savedCalculation.venueRentalCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Catering & Food</span>
                  <span>{brand.currencySymbol} {Math.round(savedCalculation.foodCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Décor & Florals</span>
                  <span>{brand.currencySymbol} {Math.round(savedCalculation.decorationCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Power & AV Services</span>
                  <span>{brand.currencySymbol} {Math.round(savedCalculation.servicesCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Taxes & Service Charge</span>
                  <span>{brand.currencySymbol} {Math.round(savedCalculation.taxAmount + savedCalculation.serviceChargeAmount).toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                  <span className="font-serif text-base font-bold text-[#1C1917]">Total Estimate</span>
                  <span className="font-numeric text-2xl font-bold text-[#1C1917]">
                    {brand.currencySymbol} {Math.round(savedCalculation.totalEstimatedPrice).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FBF6E9] border border-[#D4AF37]/30 flex justify-between items-center text-xs">
                  <span className="text-[#997A15] font-semibold">Advance to Confirm ({pricingRules.advancePaymentPercentage}%):</span>
                  <span className="font-bold text-[#1C1917]">
                    {brand.currencySymbol} {Math.round(savedCalculation.requiredAdvanceAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
