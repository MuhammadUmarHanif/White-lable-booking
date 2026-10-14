import React from 'react';
import { CalculationResult, CalculatorState, PricingRules, Hall } from '../../types';
import { Receipt, AlertCircle, CheckCircle2, Printer, ArrowRight, ShieldAlert, Sparkles, MessageCircle } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';

interface Props {
  state: CalculatorState;
  calculation: CalculationResult;
  pricingRules: PricingRules;
  selectedHall: Hall;
  currencySymbol: string;
  onProceedToBooking: () => void;
  onPrintQuotation: () => void;
}

export const Step6CostSummary: React.FC<Props> = ({
  state,
  calculation,
  pricingRules,
  selectedHall,
  currencySymbol,
  onProceedToBooking,
  onPrintQuotation,
}) => {
  const { brand } = useBrand();

  const handleWhatsAppShare = () => {
    const totalGuests = (state.guestCount || 0) + (state.childrenCount || 0);
    const slotLabel = state.timeSlot === 'lunch' ? 'Lunch / Day' : state.timeSlot === 'dinner' ? 'Dinner / Night' : 'Full Day';
    const message =
      `*${brand?.name || 'Grand Royale Banquet Marquee'} — Official Event Quotation*\n\n` +
      `• *Occasion:* ${state.eventType.toUpperCase()}\n` +
      `• *Date:* ${state.eventDate} (${slotLabel})\n` +
      `• *Hall Venue:* ${selectedHall?.name || 'Selected Hall'}\n` +
      `• *Total Guests:* ${state.guestCount} Adults${state.childrenCount ? ` + ${state.childrenCount} Kids (<8 yrs)` : ''} (Total: ${totalGuests})\n` +
      `• *Booking Mode:* ${state.bookingModel === 'hall_only' ? 'Sirf Hall (Venue Only)' : 'Per-Person Catering (Hall Rent: Rs. 0 FREE)'}\n` +
      (state.isSegregated ? `• *Islamic Segregation (Pardah):* Yes ${calculation.segregationCost > 0 ? `(+Rs. ${Math.round(calculation.segregationCost).toLocaleString()})` : '(Complimentary / FREE)'}\n` : '') +
      (state.hasOutsideDecorator ? `• *Outside Decorator Royalty:* Yes (+Rs. 35,000)\n` : '') +
      `\n*FINANCIAL ESTIMATE BREAKDOWN:*\n` +
      `• Net Subtotal: ${currencySymbol} ${Math.round(calculation.subtotalBeforeTax).toLocaleString()}\n` +
      `• Service Charge: +${currencySymbol} ${Math.round(calculation.serviceChargeAmount).toLocaleString()}\n` +
      `• Provincial Tax: +${currencySymbol} ${Math.round(calculation.taxAmount).toLocaleString()}\n` +
      `--------------------------------\n` +
      `*TOTAL ESTIMATED COST: ${currencySymbol} ${Math.round(calculation.totalEstimatedPrice).toLocaleString()}*\n` +
      `• Advance Required (Booking): ${currencySymbol} ${Math.round(calculation.requiredAdvanceAmount).toLocaleString()}\n` +
      `• Remaining Balance: ${currencySymbol} ${Math.round(calculation.remainingBalanceAmount).toLocaleString()}\n\n` +
      `_Official estimate generated via ${brand?.name || 'Marquee'} System._`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
            Step 6: Itemized Cost Breakdown & Estimate
          </h3>
          <p className="text-sm text-[#78716C] mt-1">
            Complete transparent pricing calculation with real-time tax and hospitality fee schedule.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-xs transition-colors"
            title="Share this quotation with family on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={onPrintQuotation}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-[#1C1917] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Print / Export</span>
          </button>
        </div>
      </div>

      {/* Warnings & Notes */}
      {(calculation.minCapacityWarning || calculation.maxCapacityWarning || calculation.minBillableWarning) && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Capacity & Minimum Billing Advisory</span>
          </div>
          {calculation.minCapacityWarning && <p>• {calculation.minCapacityWarning}</p>}
          {calculation.maxCapacityWarning && <p>• {calculation.maxCapacityWarning}</p>}
          {calculation.minBillableWarning && <p>• {calculation.minBillableWarning}</p>}
        </div>
      )}

      {/* Itemized Table */}
      <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-200 text-[#78716C] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Item & Specification</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Unit Rate</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {calculation.items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1C1917] block">{item.label}</span>
                    {item.notes && <span className="text-[11px] text-[#A8A29E]">{item.notes}</span>}
                  </td>
                  <td className="py-3 px-4 text-center text-[#78716C] capitalize">
                    {item.pricingType.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-[#1C1917]">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-[#78716C]">
                    {item.unitPrice < 0 ? '-' : ''}
                    {currencySymbol} {Math.round(Math.abs(item.unitPrice)).toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${item.subtotal < 0 ? 'text-emerald-700' : 'text-[#1C1917]'}`}>
                    {item.subtotal < 0 ? '-' : ''}
                    {currencySymbol} {Math.round(Math.abs(item.subtotal)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals Footer */}
        <div className="bg-[#FAF8F5] p-6 border-t border-stone-200 space-y-3">
          <div className="flex justify-between text-xs text-[#78716C]">
            <span>Net Subtotal (Before Surcharges & Taxes)</span>
            <span className="font-semibold text-[#1C1917]">
              {currencySymbol} {Math.round(calculation.subtotalBeforeTax).toLocaleString()}
            </span>
          </div>

          {calculation.serviceChargeAmount > 0 && (
            <div className="flex justify-between text-xs text-[#78716C]">
              <span>Banquet Hospitality & Service Charge ({pricingRules.serviceChargePercentage}%)</span>
              <span className="font-semibold text-[#1C1917]">
                +{currencySymbol} {Math.round(calculation.serviceChargeAmount).toLocaleString()}
              </span>
            </div>
          )}

          {calculation.taxAmount > 0 && (
            <div className="flex justify-between text-xs text-[#78716C]">
              <span>Provincial Government Event Tax / Services VAT ({pricingRules.taxPercentage}%)</span>
              <span className="font-semibold text-[#1C1917]">
                +{currencySymbol} {Math.round(calculation.taxAmount).toLocaleString()}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#78716C] block">
                Total Estimated Price
              </span>
              <span className="text-xs text-[#997A15] font-medium">
                {currencySymbol} {Math.round(calculation.costPerGuest).toLocaleString()} per adult guest ({state.guestCount} adults{state.childrenCount ? ` + ${state.childrenCount} kids` : ''})
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-numeric font-bold text-[#1C1917]">
              {currencySymbol} {Math.round(calculation.totalEstimatedPrice).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Advance Payment & Balance Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl border border-[#D4AF37]/40 bg-[#FBF6E9] flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#997A15] leading-tight">
            Advance Deposit ({pricingRules.advancePaymentPercentage}%)
          </span>
          <span className="text-sm sm:text-2xl font-serif font-bold text-[#1C1917] mt-1 sm:mt-2">
            {currencySymbol} {Math.round(calculation.requiredAdvanceAmount).toLocaleString()}
          </span>
          <span className="text-[9px] sm:text-[11px] text-[#78716C] mt-0.5 sm:mt-1 line-clamp-2">
            Payable upon booking confirmation.
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-stone-200 bg-white flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#78716C] leading-tight">
            Remaining Balance
          </span>
          <span className="text-sm sm:text-2xl font-serif font-bold text-[#1C1917] mt-1 sm:mt-2">
            {currencySymbol} {Math.round(calculation.remainingBalanceAmount).toLocaleString()}
          </span>
          <span className="text-[9px] sm:text-[11px] text-[#78716C] mt-0.5 sm:mt-1 line-clamp-2">
            Settled prior to event day.
          </span>
        </div>
      </div>

      {/* Booking Disclaimer & Pakistani Payment Note */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-2">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-800">Booking Transparency & Compliance:</strong> This cost calculation is an accurate official quotation based on your selected requirements. Dates are formalized upon approval by marquee concierge. All wedding events comply strictly with government closing timings (10:30 PM / 11:00 PM).
          </p>
        </div>
        <p className="text-[11px] text-stone-500 pl-8">
          Advance deposits payable via 1-Link Online Bank Transfer / IBAN, Pay Order, Crossed Cheque, or Cash at the Marquee Concierge Desk.
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onProceedToBooking}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
        >
          <span>Submit Booking Request for Approval</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
