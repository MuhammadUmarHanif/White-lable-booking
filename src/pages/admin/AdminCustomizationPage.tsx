import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BrandSettings } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { uploadImageFile } from '../../services/firebaseService';
import { Save, CheckCircle2, Upload, Sparkles, Building, Loader2 } from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';

export const AdminCustomizationPage: React.FC = () => {
  const { brand, updateBrand } = useBrand();
  const [formData, setFormData] = useState<BrandSettings>({ ...brand });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    setFormData({ ...brand });
  }, [brand]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    // Validations
    const errs: Record<string, string> = {};
    if (!formData.businessName?.trim()) {
      errs.businessName = 'Business name is required.';
    }
    if (!formData.currencySymbol?.trim()) {
      errs.currencySymbol = 'Currency symbol is required (e.g. Rs. or $).';
    }
    if (!formData.currencyCode?.trim()) {
      errs.currencyCode = 'Currency code is required (e.g. PKR or USD).';
    }
    if (formData.contactEmail && !formData.contactEmail.includes('@')) {
      errs.contactEmail = 'Please enter a valid email address.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setAlert({
        type: 'error',
        message: 'Please resolve the highlighted input errors before saving.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});
      await updateBrand(formData);
      setIsSaving(false);
      setAlert({
        type: 'success',
        message: 'Branding changes updated successfully! The public website styling and tokens have refreshed immediately.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsSaving(false);
      setAlert({
        type: 'error',
        message: err.message || 'Failed to update brand settings.',
      });
    }
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const url = await uploadImageFile(file, 'branding');
      setFormData({ ...formData, logoUrl: url });
      setIsUploadingLogo(false);
    } catch (err) {
      setIsUploadingLogo(false);
      setAlert({ type: 'error', message: 'Failed to upload logo image.' });
    }
  };

  return (
    <AdminLayout
      title="Website Branding & Customization"
      subtitle="Tailor marquee naming, primary brand colors, hero editorial text, and public contact coordinates."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {alert && (
          <AdminAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Identity & Palette */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] border-b border-stone-100 pb-2">
              Identity & Palette
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Marquee Venue Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => {
                    setFormData({ ...formData, businessName: e.target.value });
                    if (errors.businessName) setErrors({ ...errors, businessName: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border mt-1 font-serif text-sm ${
                    errors.businessName ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                  placeholder="e.g. Royal Palm Grand Marquee"
                />
                {errors.businessName && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. Timeless Elegance & Royal Celebrations"
                />
              </div>

              {/* Logo URL & Upload */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-[#78716C]">
                    Brand Logo URL / Emblem
                  </label>
                  <label className="cursor-pointer text-xs font-semibold text-[#997A15] hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogo}
                      className="hidden"
                      disabled={isUploadingLogo}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {formData.logoUrl && (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-200 font-mono text-xs"
                    placeholder="https://... or upload above"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">
                    Primary Gold / Accent Color
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={formData.primaryColor || '#D4AF37'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#D4AF37'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">
                    Currency Code & Symbol *
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      required
                      value={formData.currencySymbol}
                      onChange={(e) => {
                        setFormData({ ...formData, currencySymbol: e.target.value });
                        if (errors.currencySymbol) setErrors({ ...errors, currencySymbol: '' });
                      }}
                      placeholder="Rs."
                      className="w-14 text-center px-2 py-2 rounded-xl border border-stone-200 font-bold"
                    />
                    <input
                      type="text"
                      required
                      value={formData.currencyCode}
                      onChange={(e) => {
                        setFormData({ ...formData, currencyCode: e.target.value });
                        if (errors.currencyCode) setErrors({ ...errors, currencyCode: '' });
                      }}
                      placeholder="PKR"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 font-bold"
                    />
                  </div>
                  {errors.currencySymbol && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.currencySymbol}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Hero & About Editorial */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] border-b border-stone-100 pb-2">
              Hero Section Copy
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. Royal Mughal Celebrations"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. Experience opulent ballroom spaces with bespoke culinary curation."
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  About The Venue Introduction
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutText}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 mt-1 leading-relaxed"
                  placeholder="Tell your guests about the heritage, hospitality, and architecture..."
                />
              </div>
            </div>
          </div>

          {/* 3. Contact & Location Coordinates */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] border-b border-stone-100 pb-2">
              Contact & Concierge Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Telephone</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. +92 300 1234567"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. +92 300 1234567"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Email Address</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, contactEmail: e.target.value });
                    if (errors.contactEmail) setErrors({ ...errors, contactEmail: '' });
                  }}
                  className={`w-full px-4 py-2 rounded-xl border mt-1 ${
                    errors.contactEmail ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                  placeholder="concierge@marquee.com"
                />
                {errors.contactEmail && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.contactEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. Club Road, Lahore, Pakistan"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Operating Hours</label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. Mon - Sun: 11:00 AM – 11:00 PM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Alert Feedback right above the button */}
        {alert && (
          <div className="animate-in fade-in">
            <AdminAlert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white gold-gradient-bg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Updating Venue Branding...' : 'Update Venue Branding'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
