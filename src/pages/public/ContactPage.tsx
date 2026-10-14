import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { createContactInquiry } from '../../services/firebaseService';
import { ContactInquiry } from '../../types';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Loader2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { brand } = useBrand();
  const [submittedInquiry, setSubmittedInquiry] = useState<ContactInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [eventType, setEventType] = useState('Barat');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and contact phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const newInquiry = await createContactInquiry({
        name,
        phone,
        eventDate: date,
        eventType,
        message: `City: ${city}. Notes: ${message}`,
      });
      setSubmittedInquiry(newInquiry);
    } catch (err: any) {
      console.error('Failed to submit walkthrough inquiry:', err);
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 champagne-gradient-bg min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF8F5] text-xs font-semibold text-[#997A15]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Private Concierge Desk</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
          Connect & Schedule a Private Walkthrough
        </h1>
        <p className="text-sm text-[#78716C] max-w-xl mx-auto font-light leading-relaxed">
          Experience our grand ballroom acoustics, private bridal vanity suites, and live master kitchens in person with our senior event directors.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                Concierge Coordinates
              </h3>

              <div className="space-y-5 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FBF6E9] border border-[#D4AF37] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#997A15]" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block">Venue Location</span>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">{brand.address}</p>
                    <a
                      href={brand.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#997A15] underline font-semibold mt-1 inline-block"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FBF6E9] border border-[#D4AF37] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#997A15]" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block">Telephone Enquiries</span>
                    <a href={`tel:${brand.contactPhone}`} className="text-stone-600 mt-0.5 block hover:text-[#D4AF37]">
                      {brand.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FBF6E9] border border-[#D4AF37] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#997A15]" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block">Electronic Mail</span>
                    <a href={`mailto:${brand.contactEmail}`} className="text-stone-600 mt-0.5 block hover:text-[#D4AF37]">
                      {brand.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FBF6E9] border border-[#D4AF37] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#997A15]" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block">Private Viewing Hours</span>
                    <p className="text-stone-600 mt-0.5">{brand.businessHours}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Chat */}
              <div className="pt-4 border-t border-stone-100">
                <a
                  href={`https://wa.me/${brand.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm">
            {submittedInquiry ? (
              <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#997A15]">
                    Inquiry Reference: {submittedInquiry.referenceNumber}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                    Walkthrough Inquiry Recorded!
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submittedInquiry.name}</strong>. Your inquiry for <strong>{submittedInquiry.eventType}</strong> has been logged in our reservation directory. A senior banquet director will phone you shortly at <strong>{submittedInquiry.phone}</strong>.
                </p>

                {/* Instant WhatsApp Direct Connect */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum, I submitted private tour inquiry Ref: ${submittedInquiry.referenceNumber} for ${submittedInquiry.eventType}. My name is ${submittedInquiry.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Inquiry Details via WhatsApp Directly</span>
                  </a>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/calculator"
                    className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md hover:scale-105 transition-transform"
                  >
                    Calculate Event Cost Now
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedInquiry(null);
                      setName('');
                      setPhone('');
                      setDate('');
                      setMessage('');
                    }}
                    className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-700 border border-stone-200 hover:bg-stone-50"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  Request an Exclusive Private Tour
                </h3>
                <p className="text-xs text-[#78716C]">
                  Please allow us 2 hours for a comprehensive walkthrough including hall acoustic testing, bridal suite tour, and culinary tasting consultations.
                </p>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Host Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chaudhry Tariq Mehmood / Malik Asim"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      WhatsApp / Mobile Contact *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 (300) 123-4567"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      City of Residence
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Other">Overseas / Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      Preferred Tour Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      Wedding Function Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                    >
                      <option value="Barat">Royal Barat Ceremony</option>
                      <option value="Walima">Walima Reception</option>
                      <option value="Mehendi">Mehendi / Mayun Night</option>
                      <option value="Nikah">Nikah Ceremony & Daytime Feast</option>
                      <option value="Qawwali">Qawwali & Musical Evening</option>
                      <option value="Corporate">Corporate Gala / Dinner</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Message / Event Vision
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Anticipated guest count (e.g. 500-800), segregation / pardah preferences, food tasting requests..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest text-white gold-gradient-bg shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Tour Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
