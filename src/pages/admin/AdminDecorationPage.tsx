import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DecorationOption, OptionalService, PricingType } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { saveDecoration, saveOptionalService, uploadImageFile } from '../../services/firebaseService';
import { 
  Plus, 
  Edit2, 
  Sparkles, 
  Check, 
  X, 
  ShieldAlert, 
  Trash2, 
  Upload, 
  Search, 
  Image as ImageIcon 
} from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const AdminDecorationPage: React.FC = () => {
  const { 
    brand, 
    decorations, 
    optionalServices, 
    refreshData, 
    deleteDecoration, 
    deleteOptionalService 
  } = useBrand();

  const [activeTab, setActiveTab] = useState<'decor' | 'services'>('decor');

  // Modals & form state
  const [editingDec, setEditingDec] = useState<Partial<DecorationOption> | null>(null);
  const [decErrors, setDecErrors] = useState<Record<string, string>>({});
  const [decToDelete, setDecToDelete] = useState<DecorationOption | null>(null);

  const [editingSrv, setEditingSrv] = useState<Partial<OptionalService> | null>(null);
  const [srvErrors, setSrvErrors] = useState<Record<string, string>>({});
  const [srvToDelete, setSrvToDelete] = useState<OptionalService | null>(null);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Open Decor Modal
  const handleOpenDecModal = (dec?: DecorationOption) => {
    setDecErrors({});
    if (dec) {
      setEditingDec({ ...dec });
    } else {
      setEditingDec({
        id: `dec-${Date.now()}`,
        name: '',
        category: 'stage',
        description: '',
        price: 75000,
        pricingType: 'fixed',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      });
    }
  };

  // Open Service Modal
  const handleOpenSrvModal = (srv?: OptionalService) => {
    setSrvErrors({});
    if (srv) {
      setEditingSrv({ ...srv });
    } else {
      setEditingSrv({
        id: `srv-${Date.now()}`,
        name: '',
        category: 'custom',
        description: '',
        price: 25000,
        pricingType: 'fixed',
        isMandatory: false,
        isActive: true,
      });
    }
  };

  const handleSaveDec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDec) return;

    const errs: Record<string, string> = {};
    if (!editingDec.name?.trim()) {
      errs.name = 'Décor name is required.';
    }
    if ((editingDec.price ?? 0) < 0) {
      errs.price = 'Price cannot be negative.';
    }

    if (Object.keys(errs).length > 0) {
      setDecErrors(errs);
      return;
    }

    try {
      await saveDecoration(editingDec as DecorationOption);
      await refreshData();
      setEditingDec(null);
      setAlert({
        type: 'success',
        message: `Décor theme "${editingDec.name}" saved successfully!`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save décor setup.' });
    }
  };

  const handleSaveSrv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSrv) return;

    const errs: Record<string, string> = {};
    if (!editingSrv.name?.trim()) {
      errs.name = 'Service name is required.';
    }
    if ((editingSrv.price ?? 0) < 0) {
      errs.price = 'Price cannot be negative.';
    }

    if (Object.keys(errs).length > 0) {
      setSrvErrors(errs);
      return;
    }

    try {
      await saveOptionalService(editingSrv as OptionalService);
      await refreshData();
      setEditingSrv(null);
      setAlert({
        type: 'success',
        message: `Service option "${editingSrv.name}" saved successfully!`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save service option.' });
    }
  };

  const handleDeleteDecConfirm = async () => {
    if (!decToDelete) return;
    try {
      await deleteDecoration(decToDelete.id);
      setDecToDelete(null);
      setAlert({
        type: 'success',
        message: `Décor setup "${decToDelete.name}" was deleted successfully.`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete décor option.' });
    }
  };

  const handleDeleteSrvConfirm = async () => {
    if (!srvToDelete) return;
    try {
      await deleteOptionalService(srvToDelete.id);
      setSrvToDelete(null);
      setAlert({
        type: 'success',
        message: `Service option "${srvToDelete.name}" was removed successfully.`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete service option.' });
    }
  };

  const handleUploadDecPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDec) return;
    try {
      setIsUploadingPhoto(true);
      const url = await uploadImageFile(file, 'decorations');
      setEditingDec({ ...editingDec, image: url });
      setIsUploadingPhoto(false);
    } catch (err: any) {
      setIsUploadingPhoto(false);
      setAlert({ type: 'error', message: 'Failed to upload photo.' });
    }
  };

  return (
    <AdminLayout
      title="Stage Décor & Optional Services"
      subtitle="Configure stage architectures, floral centerpieces, generator backups, and sound systems."
    >
      <div className="space-y-6">
        {alert && (
          <AdminAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
          <div className="inline-flex p-1 rounded-full bg-stone-100 border border-stone-200 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('decor')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'decor'
                  ? 'gold-gradient-bg text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Stage & Floral Décor ({decorations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'services'
                  ? 'gold-gradient-bg text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Services & Power Backup ({optionalServices.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeTab === 'decor') {
                handleOpenDecModal();
              } else {
                handleOpenSrvModal();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {activeTab === 'decor' ? 'Décor Setup' : 'Service'}</span>
          </button>
        </div>

        {/* Décor List */}
        {activeTab === 'decor' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {decorations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all"
              >
                {d.image && (
                  <div className="h-28 sm:h-44 bg-stone-100 overflow-hidden relative">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">
                      {d.category.replace('_', ' ')}
                    </span>
                  </div>
                )}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <div>
                    <h4 className="font-serif text-xs sm:text-base font-bold text-[#1C1917] truncate">{d.name}</h4>
                    <p className="text-[10px] sm:text-xs text-[#78716C] mt-1 leading-relaxed line-clamp-2">{d.description}</p>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                    <span className="font-bold text-[#1C1917] text-[10px] sm:text-xs">
                      {d.pricingType === 'per_person'
                        ? `${brand.currencySymbol} ${Math.round(d.price).toLocaleString()} / guest`
                        : `${brand.currencySymbol} ${Math.round(d.price).toLocaleString()} fixed`}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDecToDelete(d)}
                        className="p-1.5 rounded-lg border border-stone-200 text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Décor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDecModal(d)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-[#D4AF37] text-xs font-semibold text-[#1C1917] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services List */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalServices.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex items-start justify-between gap-4 hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#1C1917]">{s.name}</h4>
                    {s.isMandatory && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1C1917] text-[#D4AF37]">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#78716C] leading-relaxed">{s.description}</p>
                  <span className="text-xs font-bold text-[#997A15] block pt-1">
                    {s.pricingType === 'per_person'
                      ? `${brand.currencySymbol} ${Math.round(s.price).toLocaleString()} / guest`
                      : `${brand.currencySymbol} ${Math.round(s.price).toLocaleString()} fixed`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSrvToDelete(s)}
                    className="p-2 rounded-lg border border-stone-200 text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenSrvModal(s)}
                    className="p-2 rounded-lg border border-stone-200 hover:border-[#D4AF37] text-stone-700 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Décor Modal */}
      {editingDec && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {editingDec.name ? `Edit Décor: ${editingDec.name}` : 'Create Décor Setup'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDec(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDec} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Décor Setup Name *</label>
                <input
                  type="text"
                  required
                  value={editingDec.name || ''}
                  onChange={(e) => {
                    setEditingDec({ ...editingDec, name: e.target.value });
                    if (decErrors.name) setDecErrors({ ...decErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border mt-1 ${
                    decErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                  placeholder="e.g. Mughal Royal Floral Stage"
                />
                {decErrors.name && <p className="text-[11px] text-rose-600 font-medium mt-1">{decErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">Category</label>
                  <select
                    value={editingDec.category || 'stage'}
                    onChange={(e) => setEditingDec({ ...editingDec, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1 bg-white"
                  >
                    <option value="stage">Stage Architecture</option>
                    <option value="floral">Floral Arrangement</option>
                    <option value="entrance">Grand Entrance</option>
                    <option value="lighting">Ceiling Lighting</option>
                    <option value="table_centerpiece">Table Centerpiece</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">Pricing Type</label>
                  <select
                    value={editingDec.pricingType || 'fixed'}
                    onChange={(e) => setEditingDec({ ...editingDec, pricingType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1 bg-white"
                  >
                    <option value="fixed">Fixed Cost</option>
                    <option value="per_person">Per Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Price ({brand.currencySymbol}) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={editingDec.price ?? 0}
                  onChange={(e) => {
                    setEditingDec({ ...editingDec, price: parseFloat(e.target.value) || 0 });
                    if (decErrors.price) setDecErrors({ ...decErrors, price: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border mt-1 font-bold ${
                    decErrors.price ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                />
                {decErrors.price && <p className="text-[11px] text-rose-600 font-medium mt-1">{decErrors.price}</p>}
              </div>

              {/* Photo URL & Upload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-[#78716C]">Photo URL</label>
                  <label className="cursor-pointer text-xs font-semibold text-[#997A15] hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadDecPhoto}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  {editingDec.image && (
                    <img
                      src={editingDec.image}
                      alt="Preview"
                      className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={editingDec.image || ''}
                    onChange={(e) => setEditingDec({ ...editingDec, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Description</label>
                <textarea
                  rows={2}
                  value={editingDec.description || ''}
                  onChange={(e) => setEditingDec({ ...editingDec, description: e.target.value })}
                  placeholder="e.g. Imported Ecuadorian roses with warm amber candelabras..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDec(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white gold-gradient-bg font-semibold rounded-xl shadow-sm hover:opacity-95"
                >
                  Save Décor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingSrv && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {editingSrv.name ? `Edit Service: ${editingSrv.name}` : 'Create Optional Service'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSrv(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSrv} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Service Name *</label>
                <input
                  type="text"
                  required
                  value={editingSrv.name || ''}
                  onChange={(e) => {
                    setEditingSrv({ ...editingSrv, name: e.target.value });
                    if (srvErrors.name) setSrvErrors({ ...srvErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border mt-1 ${
                    srvErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                  placeholder="e.g. 500 kVA Standby Backup Generator"
                />
                {srvErrors.name && <p className="text-[11px] text-rose-600 font-medium mt-1">{srvErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">Category</label>
                  <select
                    value={editingSrv.category || 'custom'}
                    onChange={(e) => setEditingSrv({ ...editingSrv, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1 bg-white"
                  >
                    <option value="generator">Generator Power</option>
                    <option value="ac_heating">Climate AC / Heating</option>
                    <option value="sound_dj">Bose Sound & Mics</option>
                    <option value="photography">Cinema 4K & Drone</option>
                    <option value="valet">Valet Parking</option>
                    <option value="custom">Other Add-on</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">Pricing Type</label>
                  <select
                    value={editingSrv.pricingType || 'fixed'}
                    onChange={(e) => setEditingSrv({ ...editingSrv, pricingType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1 bg-white"
                  >
                    <option value="fixed">Fixed Cost</option>
                    <option value="per_person">Per Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Price ({brand.currencySymbol}) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={editingSrv.price ?? 0}
                  onChange={(e) => {
                    setEditingSrv({ ...editingSrv, price: parseFloat(e.target.value) || 0 });
                    if (srvErrors.price) setSrvErrors({ ...srvErrors, price: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border mt-1 font-bold ${
                    srvErrors.price ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                />
                {srvErrors.price && <p className="text-[11px] text-rose-600 font-medium mt-1">{srvErrors.price}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Description</label>
                <textarea
                  rows={2}
                  value={editingSrv.description || ''}
                  onChange={(e) => setEditingSrv({ ...editingSrv, description: e.target.value })}
                  placeholder="e.g. Uninterrupted power supply with automated transfer switch..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatoryCheck"
                  checked={editingSrv.isMandatory || false}
                  onChange={(e) => setEditingSrv({ ...editingSrv, isMandatory: e.target.checked })}
                  className="w-4 h-4 rounded text-[#D4AF37]"
                />
                <label htmlFor="mandatoryCheck" className="cursor-pointer text-stone-800 font-medium">
                  Mandatory (Automatically included in all new quotations)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingSrv(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white gold-gradient-bg font-semibold rounded-xl shadow-sm hover:opacity-95"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Décor Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(decToDelete)}
        title="Delete Décor Setup"
        message={`Are you sure you want to delete the stage décor theme "${decToDelete?.name}"?`}
        confirmLabel="Yes, Delete Décor"
        cancelLabel="Keep Décor"
        isDestructive={true}
        onConfirm={handleDeleteDecConfirm}
        onCancel={() => setDecToDelete(null)}
      />

      {/* Delete Service Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(srvToDelete)}
        title="Delete Service Option"
        message={`Are you sure you want to remove the optional service "${srvToDelete?.name}"?`}
        confirmLabel="Yes, Delete Service"
        cancelLabel="Keep Service"
        isDestructive={true}
        onConfirm={handleDeleteSrvConfirm}
        onCancel={() => setSrvToDelete(null)}
      />
    </AdminLayout>
  );
};
