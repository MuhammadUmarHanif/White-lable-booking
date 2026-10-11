import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import { getAllBookings } from '../../services/firebaseService';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { 
  ShieldCheck, 
  Download, 
  Key, 
  UserCheck, 
  Database, 
  FileSpreadsheet, 
  RefreshCcw,
  Trash2,
  Server
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { currentUser, isFirebaseActive } = useAuth();
  const { brand, resetAllData } = useBrand();

  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const data = await getAllBookings();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marquee_bookings_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setAlertInfo({ type: 'success', message: 'All booking records exported as JSON successfully!' });
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err.message || 'Failed to export JSON.' });
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const data = await getAllBookings();
      const headers = ['RefNumber', 'CustomerName', 'Phone', 'Email', 'EventDate', 'Slot', 'Guests', 'Hall', 'Status', 'TotalQuotation', 'TotalPaid', 'Balance'];
      const rows = data.map((b) => [
        b.referenceNumber,
        `"${b.customerName || ''}"`,
        b.customerPhone || '',
        b.customerEmail || '',
        b.eventDate,
        b.timeSlot,
        b.guestCount,
        `"${b.hallName || ''}"`,
        b.status,
        b.totalQuotationAmount,
        b.totalPaid,
        b.outstandingBalance,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marquee_bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setAlertInfo({ type: 'success', message: 'Bookings exported as CSV spreadsheet successfully!' });
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err.message || 'Failed to export CSV.' });
    } finally {
      setExporting(false);
    }
  };

  const handleConfirmResetData = async () => {
    try {
      setResetting(true);
      await resetAllData();
      setIsResetModalOpen(false);
      setAlertInfo({ 
        type: 'success', 
        message: 'Default marquee demo catalog, sample bookings, halls, and settings have been restored!' 
      });
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err.message || 'Failed to reset demo data.' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <AdminLayout
      title="Settings, Security & Data Management"
      subtitle="Deployment environment details, staff access controls, and data backup exports."
    >
      <div className="space-y-6">
        {alertInfo && (
          <AdminAlert
            type={alertInfo.type}
            message={alertInfo.message}
            onClose={() => setAlertInfo(null)}
          />
        )}

        {/* 1. Deployment Mode & Firebase Configuration */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Independent Database & Infrastructure
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isFirebaseActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isFirebaseActive ? 'Live Firebase Connected' : 'Evaluation Standalone Mode'}
            </span>
          </div>

          <p className="text-xs text-[#78716C] leading-relaxed">
            This deployment is architected for single-tenant isolation. Each marquee client deploys their own independent Firebase project. Marquee A never shares records, users, or storage buckets with Marquee B.
          </p>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-[#1C1917] block">To connect production Firebase:</span>
            <p className="text-[#57534E]">1. Create a Firebase project in console.firebase.google.com</p>
            <p className="text-[#57534E]">2. Copy credentials into <code>.env.local</code> per the provided <code>.env.example</code></p>
            <p className="text-[#57534E]">3. Deploy <code>firestore.rules</code> and <code>storage.rules</code></p>
          </div>
        </div>

        {/* 2. Staff & Admin Account */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <UserCheck className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Current Account Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#78716C] block">Name</span>
              <span className="font-bold text-sm text-[#1C1917] block mt-0.5">
                {currentUser?.displayName || 'Administrator'}
              </span>
            </div>
            <div>
              <span className="text-[#78716C] block">Email</span>
              <span className="font-medium text-stone-900 block mt-0.5">
                {currentUser?.email || 'admin@marquee.com'}
              </span>
            </div>
            <div>
              <span className="text-[#78716C] block">Role Assignment</span>
              <span className="font-semibold text-emerald-700 block mt-0.5 uppercase tracking-wider">
                {currentUser?.role || 'Owner / Director'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Data Export & Backup */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <Download className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Client Data Export & Ledger
            </h3>
          </div>

          <p className="text-xs text-[#78716C]">
            Export complete booking inquiries, agreed quotations, and payment audit logs at any time for accounting or archival purposes.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm hover:scale-105 transition-transform"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV (Excel / Google Sheets)</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-700 border border-stone-200 hover:bg-stone-50"
            >
              <Download className="w-4 h-4" />
              <span>Export Raw JSON Backup</span>
            </button>
          </div>
        </div>

        {/* 4. Factory Reset / Seed Demo Catalog */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-red-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-5 h-5 text-red-500" />
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Restore Demo Data & Initial Catalog
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
              Admin Maintenance
            </span>
          </div>

          <p className="text-xs text-[#78716C] leading-relaxed">
            Need to refresh your test environment? This will re-seed default Royal Majestic banquet halls, packages, luxury décor themes, and sample inquiries back to their pristine initial state.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              disabled={resetting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
            >
              <RefreshCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting Data...' : 'Reset System Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset All Demo Data?"
        message="Are you sure you want to restore all marquee sample data to the original defaults? Custom halls, packages, and bookings created during testing will be reset."
        confirmLabel="Yes, Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmResetData}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </AdminLayout>
  );
};
