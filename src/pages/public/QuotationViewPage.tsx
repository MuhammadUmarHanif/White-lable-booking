import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingRequest } from '../../types';
import { getBookingById } from '../../services/firebaseService';
import { useBrand } from '../../context/BrandContext';
import { Printer, ArrowLeft, Sparkles, ShieldCheck, Calendar, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';

export const QuotationViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { brand } = useBrand();
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getBookingById(id).then((res) => {
        setBooking(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-serif text-[#1C1917]">Quotation Record Not Found</h2>
          <p className="text-sm text-[#78716C]">The requested booking or quotation ID does not exist.</p>
          <Link to="/" className="inline-block px-6 py-2.5 rounded-full gold-gradient-bg text-white text-xs font-semibold uppercase">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const calc = booking.calculationSnapshot;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation & Print Actions bar (hidden in print) */}
        <div className="no-print mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Venue</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md hover:scale-105 transition-transform"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Quotation</span>
          </button>
        </div>

        {/* Official Printable Quotation Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-200 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#1C1917] text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  {brand.businessName}
                </h1>
              </div>
              <p className="text-xs text-[#78716C] max-w-sm">{brand.address}</p>
              <div className="text-xs text-[#78716C] flex flex-wrap gap-4 pt-1">
                <span>Phone: {brand.contactPhone}</span>
                <span>Email: {brand.contactEmail}</span>
              </div>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-[#997A15] block">
                Official Banquet Quotation
              </span>
              <div className="text-lg font-serif font-bold text-[#1C1917]">
                Ref: {booking.referenceNumber}
              </div>
              <div className="text-xs text-[#78716C]">
                Date: {new Date(booking.createdAt).toLocaleDateString()}
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800">
                  Status: {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Client & Event Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs">
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-[#78716C] block">
                Host Details
              </span>
              <p className="font-semibold text-sm text-[#1C1917]">{booking.customerName}</p>
              <p className="text-[#57534E]">Contact: {booking.customerPhone}</p>
              <p className="text-[#57534E]">Email: {booking.customerEmail}</p>
              {booking.customerCity && <p className="text-[#57534E]">City: {booking.customerCity}</p>}
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-[#78716C] block">
                Event Specifications
              </span>
              <p className="font-semibold text-sm text-[#1C1917] capitalize">
                {booking.eventType.replace('_', ' ')}
              </p>
              <p className="text-[#57534E]">Reserved Hall: {booking.hallName}</p>
              <p className="text-[#57534E]">Scheduled Date: {booking.eventDate} ({booking.timeSlot})</p>
              <p className="text-[#57534E]">Expected Attendance: {booking.guestCount} Guests</p>
            </div>
          </div>

          {/* Itemized Snapshot Table */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Agreed Itemized Specification
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-stone-200 text-[#78716C] uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4 text-center">Type</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Rate</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {calc.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#1C1917]">{item.label}</span>
                        {item.notes && <p className="text-[10px] text-[#78716C]">{item.notes}</p>}
                      </td>
                      <td className="py-3 px-4 text-center text-[#78716C] capitalize">{item.pricingType.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-center font-medium">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-[#78716C]">
                        {brand.currencySymbol} {Math.round(Math.abs(item.unitPrice)).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-[#1C1917]">
                        {item.subtotal < 0 ? '-' : ''}{brand.currencySymbol} {Math.round(Math.abs(item.subtotal)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-stone-200 text-xs">
            <div className="space-y-1.5 max-w-sm text-[#78716C]">
              <span className="font-bold text-[#1C1917] block">Terms & Deposit Condition:</span>
              <p>• Advance required to confirm: {brand.currencySymbol} {Math.round(booking.advanceRequired).toLocaleString()}</p>
              <p>• Outstanding balance due prior to event commencement.</p>
              <p>• Quotations valid for 14 days from initial submission.</p>
              <p>• Payments accepted via 1-Link Online Transfer, Pay Order, or Cash at Reception.</p>
            </div>

            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-[#78716C]">
                <span>Net Subtotal:</span>
                <span>{brand.currencySymbol} {Math.round(calc.subtotalBeforeTax).toLocaleString()}</span>
              </div>
              {calc.serviceChargeAmount > 0 && (
                <div className="flex justify-between text-[#78716C]">
                  <span>Hospitality Service Charge:</span>
                  <span>+{brand.currencySymbol} {Math.round(calc.serviceChargeAmount).toLocaleString()}</span>
                </div>
              )}
              {calc.taxAmount > 0 && (
                <div className="flex justify-between text-[#78716C]">
                  <span>Applicable Provincial Tax / VAT:</span>
                  <span>+{brand.currencySymbol} {Math.round(calc.taxAmount).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between font-numeric text-xl font-bold text-[#1C1917]">
                <span className="font-serif">Total Amount:</span>
                <span>{brand.currencySymbol} {Math.round(booking.totalQuotationAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signatures for Print */}
          <div className="pt-12 grid grid-cols-2 gap-12 border-t border-stone-200 print-only">
            <div className="border-t border-stone-400 pt-2 text-center text-xs text-[#78716C]">
              Authorized Marquee Representative
            </div>
            <div className="border-t border-stone-400 pt-2 text-center text-xs text-[#78716C]">
              Host Acceptance Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
