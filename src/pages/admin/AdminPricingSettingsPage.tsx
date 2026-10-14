import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PricingRules } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { DEFAULT_PRICING_RULES } from '../../config/defaultSettings';
import { Save, CheckCircle2, DollarSign, Calendar, Percent, RotateCcw } from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const AdminPricingSettingsPage: React.FC = () => {
  const { pricingRules, updatePricingRules } = useBrand();

  const [formData, setFormData] = useState<PricingRules>({ ...pricingRules });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({ ...pricingRules });
  }, [pricingRules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errs: Record<string, string> = {};
    if (formData.taxPercentage < 0 || formData.taxPercentage > 100) {
      errs.taxPercentage = 'Tax must be between 0% and 100%.';
    }
    if (formData.serviceChargePercentage < 0 || formData.serviceChargePercentage > 100) {
      errs.serviceChargePercentage = 'Service charge must be between 0% and 100%.';
    }
    if (formData.advancePaymentPercentage < 1 || formData.advancePaymentPercentage > 100) {
      errs.advancePaymentPercentage = 'Advance deposit percentage must be between 1% and 100%.';
    }
    if (formData.weekendSurchargePercentage < 0 || formData.weekendSurchargePercentage > 100) {
      errs.weekendSurchargePercentage = 'Weekend surcharge must be between 0% and 100%.';
    }
    if (formData.peakSeasonSurchargePercentage < 0 || formData.peakSeasonSurchargePercentage > 100) {
      errs.peakSeasonSurchargePercentage = 'Peak season surcharge must be between 0% and 100%.';
    }
    if (formData.quotationValidityDays < 1 || formData.quotationValidityDays > 365) {
      errs.quotationValidityDays = 'Validity days must be between 1 and 365.';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      setAlert({
        type: 'error',
        message: 'Please resolve the highlighted input errors before saving.',
      });
      return;
    }

    try {
      setIsSaving(true);
      setFormErrors({});
      await updatePricingRules(formData);
      setIsSaving(false);
      setAlert({
        type: 'success',
        message: 'Pricing rules and seasonal surcharge percentages saved successfully!',
      });
    } catch (err: any) {
      setIsSaving(false);
      setAlert({
        type: 'error',
        message: err.message || 'Failed to save pricing rules.',
      });
    }
  };

  const handleResetToDefaults = async () => {
    try {
      await updatePricingRules(DEFAULT_PRICING_RULES);
      setFormData({ ...DEFAULT_PRICING_RULES });
      setFormErrors({});
      setShowResetModal(false);
      setAlert({
        type: 'success',
        message: 'Pricing rules reset to system recommended defaults successfully.',
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to reset pricing rules.' });
    }
  };

  const handleToggleMonth = (m: number) => {
    const current = formData.peakSeasonMonths || [];
    if (current.includes(m)) {
      setFormData({ ...formData, peakSeasonMonths: current.filter((x) => x !== m) });
    } else {
      setFormData({ ...formData, peakSeasonMonths: [...current, m] });
    }
  };

  const monthLabels = [
    { num: 1, label: 'Jan' }, { num: 2, label: 'Feb' }, { num: 3, label: 'Mar' },
    { num: 4, label: 'Apr' }, { num: 5, label: 'May' }, { num: 6, label: 'Jun' },
    { num: 7, label: 'Jul' }, { num: 8, label: 'Aug' }, { num: 9, label: 'Sep' },
    { num: 10, label: 'Oct' }, { num: 11, label: 'Nov' }, { num: 12, label: 'Dec' },
  ];

  return (
    <AdminLayout
      title="Pricing, Taxes & Seasonal Rules"
      subtitle="Centralized rules governing the event cost calculation engine and advance deposits."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {alert && (
          <AdminAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Taxes & Surcharges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] border-b border-stone-100 pb-2">
              Government Tax & Hospitality Service Charge
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Applicable Event VAT / Government Tax (%)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.taxPercentage}
                    onChange={(e) => {
                      setFormData({ ...formData, taxPercentage: parseFloat(e.target.value) || 0 });
                      if (formErrors.taxPercentage) setFormErrors({ ...formErrors, taxPercentage: '' });
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      formErrors.taxPercentage ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  />
                  <Percent className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {formErrors.taxPercentage ? (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.taxPercentage}</p>
                ) : (
                  <p className="text-[11px] text-[#A8A29E] mt-1">
                    Automatically applied to subtotal in official quotations.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Banquet Hospitality & Service Charge (%)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.serviceChargePercentage}
                    onChange={(e) => {
                      setFormData({ ...formData, serviceChargePercentage: parseFloat(e.target.value) || 0 });
                      if (formErrors.serviceChargePercentage) setFormErrors({ ...formErrors, serviceChargePercentage: '' });
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      formErrors.serviceChargePercentage ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  />
                  <Percent className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {formErrors.serviceChargePercentage && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.serviceChargePercentage}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Required Advance Deposit (%) *
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.advancePaymentPercentage}
                    onChange={(e) => {
                      setFormData({ ...formData, advancePaymentPercentage: parseFloat(e.target.value) || 0 });
                      if (formErrors.advancePaymentPercentage) setFormErrors({ ...formErrors, advancePaymentPercentage: '' });
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border font-bold ${
                      formErrors.advancePaymentPercentage ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  />
                  <Percent className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {formErrors.advancePaymentPercentage ? (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.advancePaymentPercentage}</p>
                ) : (
                  <p className="text-[11px] text-[#A8A29E] mt-1">
                    Initial deposit required from customer to lock in their date.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-[#78716C]">
                    Pardah / Islamic Partition Setup Fee (Rs.)
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    Number(formData.partitionFee || 0) === 0
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-[#997A15] bg-[#FBF6E9] border-[#D4AF37]/40'
                  }`}>
                    {Number(formData.partitionFee || 0) === 0 ? 'Complimentary / FREE (Rs. 0)' : `Rs. ${Number(formData.partitionFee).toLocaleString()}`}
                  </span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.partitionFee !== undefined ? formData.partitionFee : 0}
                    onChange={(e) => {
                      const val = Math.max(0, parseFloat(e.target.value) || 0);
                      setFormData({ ...formData, partitionFee: val });
                    }}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 font-bold"
                  />
                  <span className="text-xs text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 font-bold">
                    PKR
                  </span>
                </div>
                <p className="text-[11px] text-[#A8A29E] mt-1">
                  Set to <strong>0</strong> for <strong>Free / Complimentary</strong> Pardah setup, or enter custom rupee fee if charging.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Weekend & Peak Season Surcharges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] border-b border-stone-100 pb-2">
              Peak Seasons & Weekend Rates
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Weekend Surcharge Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.weekendSurchargePercentage}
                  onChange={(e) => {
                    setFormData({ ...formData, weekendSurchargePercentage: parseFloat(e.target.value) || 0 });
                    if (formErrors.weekendSurchargePercentage) setFormErrors({ ...formErrors, weekendSurchargePercentage: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border mt-1 ${
                    formErrors.weekendSurchargePercentage ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                />
                {formErrors.weekendSurchargePercentage ? (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.weekendSurchargePercentage}</p>
                ) : (
                  <p className="text-[11px] text-[#A8A29E] mt-1">
                    Automatically applied on Friday, Saturday, and Sunday bookings.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Peak Wedding Season Surcharge (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.peakSeasonSurchargePercentage}
                  onChange={(e) => {
                    setFormData({ ...formData, peakSeasonSurchargePercentage: parseFloat(e.target.value) || 0 });
                    if (formErrors.peakSeasonSurchargePercentage) setFormErrors({ ...formErrors, peakSeasonSurchargePercentage: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border mt-1 ${
                    formErrors.peakSeasonSurchargePercentage ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                />
                {formErrors.peakSeasonSurchargePercentage && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{formErrors.peakSeasonSurchargePercentage}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Active Peak Season Months
                </label>
                <div className="grid grid-cols-6 gap-1.5 mt-2">
                  {monthLabels.map((m) => {
                    const isSelected = (formData.peakSeasonMonths || []).includes(m.num);
                    return (
                      <button
                        key={m.num}
                        type="button"
                        onClick={() => handleToggleMonth(m.num)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'gold-gradient-bg text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Policies & Cancellation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1C1917] border-b border-stone-100 pb-2">
            Quotation Validity & Cancellation Policy Terms
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold uppercase text-[#78716C]">
                Quotation Validity Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                max="365"
                required
                value={formData.quotationValidityDays}
                onChange={(e) => {
                  setFormData({ ...formData, quotationValidityDays: parseInt(e.target.value, 10) || 14 });
                  if (formErrors.quotationValidityDays) setFormErrors({ ...formErrors, quotationValidityDays: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  formErrors.quotationValidityDays ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                }`}
              />
              {formErrors.quotationValidityDays && (
                <p className="text-[11px] text-rose-600 font-medium">{formErrors.quotationValidityDays}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase text-[#78716C]">
                Official Cancellation Policy Statement
              </label>
              <textarea
                rows={3}
                value={formData.cancellationPolicy}
                onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block font-semibold uppercase text-[#78716C]">
              Standard Venue Terms & Conditions (Shown on Customer Quotations)
            </label>
            <textarea
              rows={3}
              value={formData.termsAndConditions || ''}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Recommended Defaults</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white gold-gradient-bg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Pricing Settings'}</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Pricing Rules to Default"
        message="Are you sure you want to restore default pricing, tax, and seasonal rules? This will reset custom surcharge rates to system defaults."
        confirmLabel="Yes, Reset Rules"
        cancelLabel="Keep Current Rules"
        isDestructive={false}
        onConfirm={handleResetToDefaults}
        onCancel={() => setShowResetModal(false)}
      />
    </AdminLayout>
  );
};
