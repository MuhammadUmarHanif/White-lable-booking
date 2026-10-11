import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Hall, ShowcaseSpace } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { saveHall, uploadImageFile } from '../../services/firebaseService';
import { DEFAULT_BRAND_SETTINGS } from '../../config/defaultSettings';
import { 
  Plus, 
  Edit2, 
  Users, 
  Building2, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  Trash2, 
  ArrowRight,
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const AdminVenuesPage: React.FC = () => {
  const { brand, halls, refreshData, updateShowcaseSpaces, deleteHall } = useBrand();

  const [activeTab, setActiveTab] = useState<'showcase' | 'halls'>('showcase');

  // Halls state
  const [isEditingHall, setIsEditingHall] = useState(false);
  const [editingHall, setEditingHall] = useState<Partial<Hall> | null>(null);
  const [hallErrors, setHallErrors] = useState<Record<string, string>>({});
  const [isSavingHall, setIsSavingHall] = useState(false);
  const [modalHallError, setModalHallError] = useState<string | null>(null);
  const [hallToDelete, setHallToDelete] = useState<Hall | null>(null);

  // Showcase Space editing state
  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [editingSpace, setEditingSpace] = useState<ShowcaseSpace | null>(null);
  const [editingSpaceIdx, setEditingSpaceIdx] = useState<number>(-1);
  const [spaceErrors, setSpaceErrors] = useState<Record<string, string>>({});
  const [isSavingSpace, setIsSavingSpace] = useState(false);
  const [modalSpaceError, setModalSpaceError] = useState<string | null>(null);
  const [spaceToDeleteIdx, setSpaceToDeleteIdx] = useState<number | null>(null);

  const [newHighlight, setNewHighlight] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  const rawShowcaseSpaces: ShowcaseSpace[] = (brand.showcaseSpaces && brand.showcaseSpaces.length > 0)
    ? brand.showcaseSpaces
    : (DEFAULT_BRAND_SETTINGS.showcaseSpaces || []);
  const showcaseSpaces: ShowcaseSpace[] = rawShowcaseSpaces;

  // Open edit for a Showcase Space card
  const handleOpenEditSpace = (space?: ShowcaseSpace, idx: number = -1) => {
    setSpaceErrors({});
    setModalSpaceError(null);
    setNewHighlight('');
    setNewImageUrl('');
    if (space) {
      setEditingSpace({
        ...space,
        images: (space.images && space.images.length > 0) ? [...space.images] : (space.image ? [space.image] : []),
        highlights: space.highlights ? [...space.highlights] : [],
        rentPrice: space.rentPrice || 0,
        perPersonPrice: space.perPersonPrice || 0,
        occasion: space.occasion || 'barat',
        hallId: space.hallId || halls[0]?.id || '',
      });
      setEditingSpaceIdx(idx);
    } else {
      // Create new showcase card
      setEditingSpace({
        id: `space-${Date.now()}`,
        title: '',
        badge: 'Bespoke Pavilion',
        subtitle: 'Grand architecture and premium luxury banquet setting',
        category: 'CUSTOM OCCASION • SIGNATURE PAVILION',
        description: 'Spectacular grand celebration setting with custom mood lighting and dedicated bridal lounge.',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'],
        highlights: ['Pillarless Grand Foyer', 'Bridal Suite with Private Washroom', 'Backup Generator Synchronized'],
        link: '/calculator',
        occasion: 'barat',
        rentPrice: 200000,
        perPersonPrice: 3500,
        hallId: halls[0]?.id || '',
      });
      setEditingSpaceIdx(-1);
    }
    setIsEditingSpace(true);
  };

  const handleSaveSpace = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!editingSpace) return;

    // Validation
    const errs: Record<string, string> = {};
    if (!editingSpace.title?.trim()) {
      errs.title = 'Card title is required.';
    }
    if (!editingSpace.description?.trim()) {
      errs.description = 'Card description is required.';
    }
    if ((editingSpace.rentPrice ?? 0) < 0) {
      errs.rentPrice = 'Rent price cannot be negative.';
    }
    if ((editingSpace.perPersonPrice ?? 0) < 0) {
      errs.perPersonPrice = 'Per person price cannot be negative.';
    }
    if (Object.keys(errs).length > 0) {
      setSpaceErrors(errs);
      setModalSpaceError(Object.values(errs)[0]);
      return;
    }

    try {
      setIsSavingSpace(true);
      setModalSpaceError(null);

      // Auto-commit any typed image URL if user forgot to click "+ Add Photo"
      let finalImages = [...(editingSpace.images || [])];
      if (newImageUrl.trim() && !finalImages.includes(newImageUrl.trim())) {
        finalImages.push(newImageUrl.trim());
      }
      if (finalImages.length === 0) {
        finalImages.push('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80');
      }

      // Auto-commit any typed highlight if user forgot to click "+ Add"
      let finalHighlights = [...(editingSpace.highlights || [])];
      if (newHighlight.trim() && !finalHighlights.includes(newHighlight.trim())) {
        finalHighlights.push(newHighlight.trim());
      }

      const spaceToSave: ShowcaseSpace = {
        ...editingSpace,
        title: editingSpace.title.trim(),
        description: editingSpace.description.trim(),
        images: finalImages,
        image: finalImages[0],
        highlights: finalHighlights,
      };

      const updatedSpaces = [...rawShowcaseSpaces];
      if (editingSpaceIdx >= 0 && editingSpaceIdx < updatedSpaces.length) {
        updatedSpaces[editingSpaceIdx] = spaceToSave;
      } else {
        updatedSpaces.push(spaceToSave);
      }

      await updateShowcaseSpaces(updatedSpaces);
      setIsSavingSpace(false);
      setIsEditingSpace(false);
      setAlert({
        type: 'success',
        message: 'Showcase space card updated successfully! Changes are live on the website.',
      });
    } catch (err: any) {
      setIsSavingSpace(false);
      setModalSpaceError(err.message || 'Failed to update showcase space.');
    }
  };

  const handleDeleteSpaceConfirm = async () => {
    if (spaceToDeleteIdx === null) return;
    try {
      const updated = showcaseSpaces.filter((_, idx) => idx !== spaceToDeleteIdx);
      await updateShowcaseSpaces(updated);
      setSpaceToDeleteIdx(null);
      setAlert({
        type: 'success',
        message: 'Showcase space card deleted successfully.',
      });
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to delete showcase space.',
      });
    }
  };

  const handleOpenEditHall = (hall?: Hall) => {
    setHallErrors({});
    setModalHallError(null);
    if (hall) {
      setEditingHall({ ...hall });
    } else {
      setEditingHall({
        id: `hall-${Date.now()}`,
        name: '',
        description: '',
        minCapacity: 150,
        maxCapacity: 600,
        minBillableGuests: 200,
        baseRentalPrice: 180000,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'],
        amenities: ['Pillarless Layout', 'Bridal Suite', 'Full Central AC'],
        isIndoor: true,
        isActive: true,
      });
    }
    setIsEditingHall(true);
  };

  const handleSaveHall = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!editingHall) return;

    // Field-level validation
    const errs: Record<string, string> = {};
    if (!editingHall.name?.trim()) {
      errs.name = 'Hall name is required.';
    }
    const minCap = editingHall.minCapacity ?? 0;
    const maxCap = editingHall.maxCapacity ?? 0;
    if (minCap <= 0) {
      errs.minCapacity = 'Minimum capacity must be at least 1.';
    }
    if (maxCap <= 0) {
      errs.maxCapacity = 'Maximum capacity must be at least 1.';
    } else if (minCap > maxCap) {
      errs.maxCapacity = 'Maximum capacity must be greater than or equal to minimum capacity.';
    }
    if ((editingHall.baseRentalPrice ?? 0) < 0) {
      errs.baseRentalPrice = 'Base rental price cannot be negative.';
    }
    if ((editingHall.minBillableGuests ?? 0) < 0) {
      errs.minBillableGuests = 'Minimum billable guests cannot be negative.';
    }

    if (Object.keys(errs).length > 0) {
      setHallErrors(errs);
      setModalHallError(Object.values(errs)[0]);
      return;
    }

    try {
      setIsSavingHall(true);
      setModalHallError(null);
      await saveHall(editingHall as Hall);
      await refreshData();
      setIsSavingHall(false);
      setIsEditingHall(false);
      setAlert({
        type: 'success',
        message: `Hall "${editingHall.name}" was saved successfully!`,
      });
    } catch (err: any) {
      setIsSavingHall(false);
      setModalHallError(err.message || 'Failed to save hall details.');
    }
  };

  const handleDeleteHallConfirm = async () => {
    if (!hallToDelete) return;
    try {
      await deleteHall(hallToDelete.id);
      setHallToDelete(null);
      setAlert({
        type: 'success',
        message: `Hall space "${hallToDelete.name}" was removed successfully.`,
      });
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to delete hall space.',
      });
    }
  };

  const handleUploadHallPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingHall) return;
    try {
      setIsUploadingPhoto(true);
      const url = await uploadImageFile(file, 'halls');
      setEditingHall({
        ...editingHall,
        images: [url, ...(editingHall.images || []).slice(1)],
      });
      setIsUploadingPhoto(false);
    } catch (err: any) {
      setIsUploadingPhoto(false);
      setAlert({ type: 'error', message: 'Failed to upload photo.' });
    }
  };

  const handleUploadSpacePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSpace) return;
    try {
      setIsUploadingPhoto(true);
      const url = await uploadImageFile(file, 'showcase');
      setEditingSpace({
        ...editingSpace,
        images: [...(editingSpace.images || []), url],
      });
      setIsUploadingPhoto(false);
    } catch (err: any) {
      setIsUploadingPhoto(false);
      setAlert({ type: 'error', message: 'Failed to upload photo.' });
    }
  };

  return (
    <AdminLayout
      title="Venue Halls & Spaces"
      subtitle="Edit the interactive homepage sticky cards (images, text, highlights) and booking calculator halls."
    >
      <div className="space-y-6">
        {alert && (
          <AdminAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            type="button"
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'showcase'
                ? 'border-[#D4AF37] text-[#997A15] font-bold bg-[#FAF8F5]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Homepage Sticky Cards ({showcaseSpaces.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('halls')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'halls'
                ? 'border-[#D4AF37] text-[#997A15] font-bold bg-[#FAF8F5]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Booking Calculator Halls ({halls.length})</span>
          </button>
        </div>

        {/* TAB 1: HOMEPAGE SHOWCASE CARDS (EDITABLE BY ADMIN) */}
        {activeTab === 'showcase' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Homepage Sticky Showcase Cards
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  These cards appear in the full-width stacking deck on the homepage. Edit titles, descriptions, architectural highlights, and multi-photo galleries.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEditSpace()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm hover:scale-105 transition-transform shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Showcase Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {showcaseSpaces.map((space, idx) => (
                <div
                  key={space.id || idx}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="relative h-56 bg-stone-900 overflow-hidden group">
                    <img
                      src={space.images?.[0] || space.image}
                      alt={space.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-mono font-bold tracking-wider">
                      CARD 0{idx + 1}
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-[#D4AF37]" />
                      <span>{space.images?.length || 1} Photos</span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                        {space.category}
                      </span>
                      <h4 className="font-serif text-xl font-normal text-white mt-0.5">
                        {space.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-serif italic text-[#997A15] block">
                        {space.badge}
                      </span>
                      <p className="text-xs text-[#78716C] leading-relaxed line-clamp-3">
                        {space.description}
                      </p>
                    </div>

                    {/* Predefined Rent & Per Person Display */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Occasion & Hall Rent</span>
                        <span className="font-bold text-[#1C1917]">{brand.currencySymbol} {Math.round(space.rentPrice || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Catering Rate</span>
                        <span className="font-bold text-[#997A15]">{brand.currencySymbol} {Math.round(space.perPersonPrice || 0).toLocaleString()} / guest</span>
                      </div>
                    </div>

                    {/* Highlights preview */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                        Highlights ({space.highlights?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {space.highlights?.map((h, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-[11px] text-[#292524] font-medium"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-mono text-[11px] truncate max-w-[150px]">
                        Link: {space.link}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSpaceToDeleteIdx(idx)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-stone-200 transition-colors"
                          title="Delete Showcase Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditSpace(space, idx)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm hover:scale-105 transition-transform"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Card</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CALCULATOR BOOKING HALLS */}
        {activeTab === 'halls' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[#78716C]">
                Configured halls directly populate the customer interactive calculator and availability calendar.
              </p>
              <button
                type="button"
                onClick={() => handleOpenEditHall()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Hall Space</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {halls.map((hall) => (
                <div
                  key={hall.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-stone-100">
                    <img src={hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'} alt={hall.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#D4AF37]" />
                      <span>{hall.minCapacity} – {hall.maxCapacity}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">{hall.name}</h3>
                      <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">{hall.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex justify-between text-[#78716C]">
                        <span>Base Space Rental:</span>
                        <span className="font-bold text-[#1C1917]">
                          {brand.currencySymbol} {Math.round(hall.baseRentalPrice).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#78716C]">
                        <span>Min Billable Threshold:</span>
                        <span className="font-semibold text-[#1C1917]">
                          {hall.minBillableGuests} Guests
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className={`text-[11px] font-semibold ${hall.isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                        {hall.isActive ? 'Active on Public Site' : 'Disabled'}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setHallToDelete(hall)}
                          className="p-1.5 rounded-lg border border-stone-200 text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Hall"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditHall(hall)}
                          className="text-xs text-[#997A15] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Hall</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: EDIT HOMEPAGE SHOWCASE SPACE CARD */}
      {isEditingSpace && editingSpace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#997A15]">
                  {editingSpaceIdx >= 0 ? `Card ${editingSpaceIdx + 1} of ${showcaseSpaces.length}` : 'New Showcase Space'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  {editingSpaceIdx >= 0 ? 'Edit Homepage Showcase Card' : 'Create Homepage Showcase Card'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingSpace(false)}
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSpace} noValidate className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Card Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSpace.title}
                    onChange={(e) => {
                      setEditingSpace({ ...editingSpace, title: e.target.value });
                      if (spaceErrors.title) setSpaceErrors({ ...spaceErrors, title: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-serif ${
                      spaceErrors.title ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                    placeholder="e.g. The Mughal Shahi Ballroom"
                  />
                  {spaceErrors.title && <p className="text-[11px] text-rose-600 font-medium">{spaceErrors.title}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Sanctum Badge</label>
                  <input
                    type="text"
                    value={editingSpace.badge}
                    onChange={(e) => setEditingSpace({ ...editingSpace, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    placeholder="e.g. Flagship Sanctuary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Occasion Tradition</label>
                  <select
                    value={editingSpace.occasion || 'barat'}
                    onChange={(e) => {
                      const occ = e.target.value;
                      setEditingSpace({
                        ...editingSpace,
                        occasion: occ,
                        link: `/calculator?eventType=${occ}&hall=${editingSpace.hallId || ''}`,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="barat">Barat</option>
                    <option value="walima">Walima</option>
                    <option value="mehendi">Mehendi & Mayun</option>
                    <option value="dholki">Dholki & Sangeet</option>
                    <option value="nikah">Nikah</option>
                    <option value="other">Other Bespoke</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Predefined Hall Rent ({brand.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={editingSpace.rentPrice || 0}
                    onChange={(e) => setEditingSpace({ ...editingSpace, rentPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Catering Rate ({brand.currencySymbol}/guest)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingSpace.perPersonPrice || 0}
                    onChange={(e) => setEditingSpace({ ...editingSpace, perPersonPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Assigned Hall Space (Calculator Mapping)</label>
                  <select
                    value={editingSpace.hallId || ''}
                    onChange={(e) => {
                      const hId = e.target.value;
                      setEditingSpace({
                        ...editingSpace,
                        hallId: hId,
                        link: `/calculator?eventType=${editingSpace.occasion || 'barat'}&hall=${hId}`,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="">-- Choose Assigned Hall --</option>
                    {halls.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} (Cap: {h.minCapacity}-{h.maxCapacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">CTA Link</label>
                  <input
                    type="text"
                    value={editingSpace.link}
                    onChange={(e) => setEditingSpace({ ...editingSpace, link: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono"
                    placeholder="e.g. /calculator?eventType=barat&hall=hall-mughal-shahi"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold uppercase text-[#78716C]">Category Top Banner</label>
                <input
                  type="text"
                  value={editingSpace.category}
                  onChange={(e) => setEditingSpace({ ...editingSpace, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  placeholder="e.g. BARAT CEREMONY • FLAGSHIP PILLARLESS BALLROOM"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold uppercase text-[#78716C]">Card Subtitle</label>
                <input
                  type="text"
                  value={editingSpace.subtitle}
                  onChange={(e) => setEditingSpace({ ...editingSpace, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  placeholder="e.g. Majestic 32ft crystal chandeliers & 50,000 sq.ft. pillarless expanse"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold uppercase text-[#78716C]">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingSpace.description}
                  onChange={(e) => setEditingSpace({ ...editingSpace, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 leading-relaxed"
                />
              </div>

              {/* Architectural Highlights / Amenities */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-semibold uppercase text-[#78716C]">
                  Key Highlights / Features ({editingSpace.highlights?.length || 0})
                </label>
                <div className="space-y-2">
                  {editingSpace.highlights?.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const updated = [...(editingSpace.highlights || [])];
                          updated[i] = e.target.value;
                          setEditingSpace({ ...editingSpace, highlights: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingSpace.highlights || []).filter((_, idx) => idx !== i);
                          setEditingSpace({ ...editingSpace, highlights: updated });
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add another highlight..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!newHighlight.trim()) return;
                          setEditingSpace({
                            ...editingSpace,
                            highlights: [...(editingSpace.highlights || []), newHighlight.trim()],
                          });
                          setNewHighlight('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newHighlight.trim()) return;
                        setEditingSpace({
                          ...editingSpace,
                          highlights: [...(editingSpace.highlights || []), newHighlight.trim()],
                        });
                        setNewHighlight('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Gallery URLs & File Upload */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-[#78716C]">
                    Multi-Angle Gallery Photos ({editingSpace.images?.length || 0})
                  </label>
                  <label className="cursor-pointer text-xs font-semibold text-[#997A15] hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadSpacePhoto}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>
                </div>

                <div className="space-y-2.5">
                  {editingSpace.images?.map((imgUrl, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img
                        src={imgUrl}
                        alt={`Photo ${i + 1}`}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                          const updated = [...(editingSpace.images || [])];
                          updated[i] = e.target.value;
                          setEditingSpace({ ...editingSpace, images: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingSpace.images || []).filter((_, idx) => idx !== i);
                          setEditingSpace({
                            ...editingSpace,
                            images: updated,
                            image: updated[0] || '',
                          });
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!newImageUrl.trim()) return;
                          setEditingSpace({
                            ...editingSpace,
                            images: [...(editingSpace.images || []), newImageUrl.trim()],
                          });
                          setNewImageUrl('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newImageUrl.trim()) return;
                        setEditingSpace({
                          ...editingSpace,
                          images: [...(editingSpace.images || []), newImageUrl.trim()],
                        });
                        setNewImageUrl('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs"
                    >
                      + Add Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Error Notice if any */}
              {modalSpaceError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{modalSpaceError}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  disabled={isSavingSpace}
                  onClick={() => setIsEditingSpace(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingSpace}
                  onClick={handleSaveSpace}
                  className="px-6 py-2.5 rounded-xl text-white gold-gradient-bg font-semibold shadow-md hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingSpace && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                  <span>{isSavingSpace ? 'Saving Changes...' : 'Save Card Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CALCULATOR HALL */}
      {isEditingHall && editingHall && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                {editingHall.name ? `Edit Hall: ${editingHall.name}` : 'Create New Hall Space'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingHall(false)}
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHall} noValidate className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold uppercase text-[#78716C]">Hall / Venue Name *</label>
                <input
                  type="text"
                  required
                  value={editingHall.name || ''}
                  onChange={(e) => {
                    setEditingHall({ ...editingHall, name: e.target.value });
                    if (hallErrors.name) setHallErrors({ ...hallErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    hallErrors.name ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                  placeholder="e.g. Imperial Grand Ballroom"
                />
                {hallErrors.name && <p className="text-[11px] text-rose-600 font-medium">{hallErrors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-semibold uppercase text-[#78716C]">Description</label>
                <textarea
                  rows={2}
                  value={editingHall.description || ''}
                  onChange={(e) => setEditingHall({ ...editingHall, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  placeholder="Describe ballroom architecture, seating style, entrance..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Base Rental Price ({brand.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={editingHall.baseRentalPrice || 0}
                    onChange={(e) => setEditingHall({ ...editingHall, baseRentalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                  />
                  {hallErrors.baseRentalPrice && <p className="text-[11px] text-rose-600 font-medium">{hallErrors.baseRentalPrice}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Min Billable Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={editingHall.minBillableGuests || 0}
                    onChange={(e) => setEditingHall({ ...editingHall, minBillableGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                  {hallErrors.minBillableGuests && <p className="text-[11px] text-rose-600 font-medium">{hallErrors.minBillableGuests}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Min Capacity (Guests)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingHall.minCapacity || 0}
                    onChange={(e) => {
                      setEditingHall({ ...editingHall, minCapacity: Number(e.target.value) });
                      if (hallErrors.minCapacity) setHallErrors({ ...hallErrors, minCapacity: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      hallErrors.minCapacity ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  />
                  {hallErrors.minCapacity && <p className="text-[11px] text-rose-600 font-medium">{hallErrors.minCapacity}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-[#78716C]">Max Capacity (Guests)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingHall.maxCapacity || 0}
                    onChange={(e) => {
                      setEditingHall({ ...editingHall, maxCapacity: Number(e.target.value) });
                      if (hallErrors.maxCapacity) setHallErrors({ ...hallErrors, maxCapacity: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      hallErrors.maxCapacity ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  />
                  {hallErrors.maxCapacity && <p className="text-[11px] text-rose-600 font-medium">{hallErrors.maxCapacity}</p>}
                </div>
              </div>

              {/* Photo URL & Upload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-[#78716C]">Hall Primary Photo</label>
                  <label className="cursor-pointer text-xs font-semibold text-[#997A15] hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadHallPhoto}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  {editingHall.images?.[0] && (
                    <img
                      src={editingHall.images[0]}
                      alt="Preview"
                      className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={editingHall.images?.[0] || ''}
                    onChange={(e) => setEditingHall({ ...editingHall, images: [e.target.value] })}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHall.isIndoor || false}
                    onChange={(e) => setEditingHall({ ...editingHall, isIndoor: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D4AF37]"
                  />
                  <span>Indoor Air Conditioned</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHall.isActive || false}
                    onChange={(e) => setEditingHall({ ...editingHall, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D4AF37]"
                  />
                  <span>Active on Public Website</span>
                </label>
              </div>

              {/* Modal Error Notice if any */}
              {modalHallError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{modalHallError}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  disabled={isSavingHall}
                  onClick={() => setIsEditingHall(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingHall}
                  onClick={handleSaveHall}
                  className="px-6 py-2.5 rounded-xl text-white gold-gradient-bg font-semibold shadow-sm hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingHall && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                  <span>{isSavingHall ? 'Saving Space...' : 'Save Space'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Hall Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(hallToDelete)}
        title="Delete Venue Hall"
        message={`Are you sure you want to delete the venue hall space "${hallToDelete?.name}"? It will no longer appear on the interactive public calculator or event calendar.`}
        confirmLabel="Yes, Delete Hall"
        cancelLabel="Keep Hall"
        isDestructive={true}
        onConfirm={handleDeleteHallConfirm}
        onCancel={() => setHallToDelete(null)}
      />

      {/* Delete Showcase Card Confirmation Modal */}
      <ConfirmModal
        isOpen={spaceToDeleteIdx !== null}
        title="Delete Showcase Card"
        message="Are you sure you want to remove this showcase sticky card from the homepage? The live website will immediately update."
        confirmLabel="Yes, Delete Card"
        cancelLabel="Keep Card"
        isDestructive={true}
        onConfirm={handleDeleteSpaceConfirm}
        onCancel={() => setSpaceToDeleteIdx(null)}
      />
    </AdminLayout>
  );
};
