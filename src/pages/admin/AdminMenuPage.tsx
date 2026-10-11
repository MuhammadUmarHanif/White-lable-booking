import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MenuItem, MenuPackage } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { saveMenuItem, saveMenuPackage } from '../../services/firebaseService';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  Utensils, 
  Star, 
  Check, 
  X, 
  Leaf, 
  Flame, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { AdminAlert } from '../../components/admin/AdminAlert';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const AdminMenuPage: React.FC = () => {
  const { brand, menuPackages, menuItems, refreshData, deleteMenuPackage, deleteMenuItem } = useBrand();

  const [activeTab, setActiveTab] = useState<'packages' | 'dishes'>('packages');

  // Editing state
  const [editingDish, setEditingDish] = useState<Partial<MenuItem> | null>(null);
  const [dishErrors, setDishErrors] = useState<Record<string, string>>({});
  const [editingPackage, setEditingPackage] = useState<Partial<MenuPackage> | null>(null);
  const [packageErrors, setPackageErrors] = useState<Record<string, string>>({});

  // Deletion state
  const [packageToDelete, setPackageToDelete] = useState<MenuPackage | null>(null);
  const [dishToDelete, setDishToDelete] = useState<MenuItem | null>(null);

  // New course / dish inside package editor
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseItem, setNewCourseItem] = useState<{ [courseIdx: number]: string }>({});

  // Dishes Search & Category Filter
  const [dishSearch, setDishSearch] = useState('');
  const [dishCategoryFilter, setDishCategoryFilter] = useState('all');

  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Open Dish Modal
  const handleOpenDishModal = (dish?: MenuItem) => {
    setDishErrors({});
    if (dish) {
      setEditingDish({ ...dish, dietary: dish.dietary ? [...dish.dietary] : ['halal'] });
    } else {
      setEditingDish({
        id: `dish-${Date.now()}`,
        name: '',
        category: 'mains',
        pricePerPerson: 500,
        dietary: ['halal'],
        isActive: true,
      });
    }
  };

  // Open Package Modal
  const handleOpenPackageModal = (pkg?: MenuPackage) => {
    setPackageErrors({});
    setNewCourseTitle('');
    setNewCourseItem({});
    if (pkg) {
      setEditingPackage({
        ...pkg,
        courseHighlights: pkg.courseHighlights
          ? pkg.courseHighlights.map((c) => ({ title: c.title, items: [...c.items] }))
          : [],
      });
    } else {
      setEditingPackage({
        id: `pkg-${Date.now()}`,
        name: '',
        tagline: 'Exquisite 3-Course Royal Dining',
        pricePerPerson: 2500,
        description: 'Complete multi-course banquet experience with signature royal hospitality.',
        includedDishIds: [],
        courseHighlights: [
          { title: 'Starters', items: ['Chicken Reshmi Kebab', 'Mint Raita'] },
          { title: 'Grand Entrées', items: ['Mutton Qorma', 'Chicken Biryani', 'Roghni Naan'] },
          { title: 'Artisanal Desserts', items: ['Warm Shahi Tukray', 'Kashmiri Chai'] },
        ],
        isActive: true,
        isPopular: false,
      });
    }
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    const errs: Record<string, string> = {};
    if (!editingDish.name?.trim()) {
      errs.name = 'Dish name is required.';
    }
    if ((editingDish.pricePerPerson ?? 0) < 0) {
      errs.pricePerPerson = 'Price cannot be negative.';
    }

    if (Object.keys(errs).length > 0) {
      setDishErrors(errs);
      return;
    }

    try {
      await saveMenuItem(editingDish as MenuItem);
      await refreshData();
      setEditingDish(null);
      setAlert({
        type: 'success',
        message: `Dish "${editingDish.name}" was successfully saved!`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save dish.' });
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    const errs: Record<string, string> = {};
    if (!editingPackage.name?.trim()) {
      errs.name = 'Package name is required.';
    }
    if ((editingPackage.pricePerPerson ?? 0) <= 0) {
      errs.pricePerPerson = 'Package price per person must be greater than 0.';
    }

    if (Object.keys(errs).length > 0) {
      setPackageErrors(errs);
      return;
    }

    try {
      await saveMenuPackage(editingPackage as MenuPackage);
      await refreshData();
      setEditingPackage(null);
      setAlert({
        type: 'success',
        message: `Banquet package "${editingPackage.name}" was saved successfully!`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save banquet package.' });
    }
  };

  const handleDeletePackageConfirm = async () => {
    if (!packageToDelete) return;
    try {
      await deleteMenuPackage(packageToDelete.id);
      setPackageToDelete(null);
      setAlert({
        type: 'success',
        message: `Banquet package "${packageToDelete.name}" was deleted successfully.`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete banquet package.' });
    }
  };

  const handleDeleteDishConfirm = async () => {
    if (!dishToDelete) return;
    try {
      await deleteMenuItem(dishToDelete.id);
      setDishToDelete(null);
      setAlert({
        type: 'success',
        message: `Dish "${dishToDelete.name}" was removed successfully.`,
      });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete dish.' });
    }
  };

  const toggleDietaryTag = (tag: 'halal' | 'vegetarian' | 'vegan' | 'gluten_free') => {
    if (!editingDish) return;
    const current = editingDish.dietary || [];
    if (current.includes(tag)) {
      setEditingDish({ ...editingDish, dietary: current.filter((t) => t !== tag) });
    } else {
      setEditingDish({ ...editingDish, dietary: [...current, tag] });
    }
  };

  const filteredDishes = menuItems.filter((dish) => {
    if (dishCategoryFilter !== 'all' && dish.category !== dishCategoryFilter) return false;
    if (dishSearch.trim()) {
      const q = dishSearch.toLowerCase();
      if (!dish.name.toLowerCase().includes(q) && !dish.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <AdminLayout
      title="Catering & Royal Banquet Management"
      subtitle="Curate menu packages, individual dishes, per-person pricing, and dietary tags."
    >
      <div className="space-y-6">
        {alert && (
          <AdminAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Tab switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
          <div className="inline-flex p-1 rounded-full bg-stone-100 border border-stone-200 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'packages'
                  ? 'gold-gradient-bg text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Banquet Packages ({menuPackages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dishes')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'dishes'
                  ? 'gold-gradient-bg text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              A La Carte Dishes ({menuItems.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeTab === 'packages') {
                handleOpenPackageModal();
              } else {
                handleOpenDishModal();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-sm hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {activeTab === 'packages' ? 'Package' : 'Dish'}</span>
          </button>
        </div>

        {/* Packages View */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1C1917]">{pkg.name}</h3>
                      <p className="text-xs text-[#78716C] mt-1">{pkg.tagline}</p>
                    </div>
                    {pkg.isPopular && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/20 text-[#997A15]">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="py-2 border-y border-stone-100 space-y-2 text-xs">
                    {pkg.courseHighlights?.map((course, i) => (
                      <div key={i}>
                        <strong className="text-stone-900 block">{course.title}</strong>
                        <span className="text-stone-500 text-[11px]">{course.items?.join(' • ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xl font-serif font-bold text-[#1C1917]">
                    {brand.currencySymbol} {Math.round(pkg.pricePerPerson).toLocaleString()} / guest
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPackageToDelete(pkg)}
                      className="p-1.5 rounded-lg border border-stone-200 text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPackageModal(pkg)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-[#D4AF37] text-xs font-semibold text-[#1C1917] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dishes View */}
        {activeTab === 'dishes' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            {/* Search & Category Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="Search dish by name or category..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#78716C]">Category:</span>
                <select
                  value={dishCategoryFilter}
                  onChange={(e) => setDishCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 font-medium text-xs text-[#1C1917]"
                >
                  <option value="all">All Categories ({menuItems.length})</option>
                  <option value="starters">Appetizers & Soups</option>
                  <option value="mains">Grand Entrées</option>
                  <option value="rice_bread">Rice & Breads</option>
                  <option value="desserts">Artisanal Desserts</option>
                  <option value="beverages">Mocktails & Drinks</option>
                  <option value="live_stations">Live Stations</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {filteredDishes.length === 0 ? (
                <div className="py-8 text-center text-stone-500">
                  No dishes found matching your search.
                </div>
              ) : (
                filteredDishes.map((dish) => (
                  <div key={dish.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1C1917]">{dish.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase bg-stone-100 text-stone-600">
                          {dish.category.replace('_', ' ')}
                        </span>
                        {dish.dietary?.includes('vegetarian') && (
                          <span title="Vegetarian" className="text-emerald-600 flex items-center gap-0.5 text-[10px]">
                            <Leaf className="w-3 h-3" /> Veg
                          </span>
                        )}
                        {dish.dietary?.includes('halal') && (
                          <span className="text-stone-400 text-[10px] font-semibold">Halal</span>
                        )}
                      </div>
                      {dish.description && (
                        <p className="text-[#78716C] text-[11px]">{dish.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#997A15] text-sm whitespace-nowrap">
                        +{brand.currencySymbol} {Math.round(dish.pricePerPerson).toLocaleString()} / guest
                      </span>

                      <button
                        type="button"
                        onClick={() => setDishToDelete(dish)}
                        className="p-1.5 rounded-lg border border-stone-200 text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDishModal(dish)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:border-[#D4AF37] text-stone-700 transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: EDIT / CREATE DISH */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {editingDish.name ? `Edit Dish: ${editingDish.name}` : 'Create A La Carte Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name || ''}
                  onChange={(e) => {
                    setEditingDish({ ...editingDish, name: e.target.value });
                    if (dishErrors.name) setDishErrors({ ...dishErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border mt-1 ${
                    dishErrors.name ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                  placeholder="e.g. Mutton Shinwari Karahi"
                />
                {dishErrors.name && <p className="text-[11px] text-rose-600 font-medium mt-1">{dishErrors.name}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Category</label>
                <select
                  value={editingDish.category || 'mains'}
                  onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1 bg-white"
                >
                  <option value="starters">Appetizers & Soups</option>
                  <option value="mains">Grand Entrées</option>
                  <option value="rice_bread">Rice & Tandoor Breads</option>
                  <option value="desserts">Artisanal Desserts</option>
                  <option value="beverages">Mocktails & Drinks</option>
                  <option value="live_stations">Chef Live Stations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">
                  Per-Guest Charge ({brand.currencySymbol}) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={editingDish.pricePerPerson ?? 0}
                  onChange={(e) => {
                    setEditingDish({ ...editingDish, pricePerPerson: parseFloat(e.target.value) || 0 });
                    if (dishErrors.pricePerPerson) setDishErrors({ ...dishErrors, pricePerPerson: '' });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border mt-1 font-bold ${
                    dishErrors.pricePerPerson ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                />
                {dishErrors.pricePerPerson && <p className="text-[11px] text-rose-600 font-medium mt-1">{dishErrors.pricePerPerson}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Description / Ingredients</label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  placeholder="e.g. Prime cut lamb slow-cooked with tomatoes and black pepper..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1"
                />
              </div>

              {/* Dietary Tags Checkboxes */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold uppercase text-[#78716C]">Dietary Attributes</label>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={editingDish.dietary?.includes('halal') ?? true}
                      onChange={() => toggleDietaryTag('halal')}
                      className="rounded text-[#D4AF37]"
                    />
                    <span>Halal Certified</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={editingDish.dietary?.includes('vegetarian') ?? false}
                      onChange={() => toggleDietaryTag('vegetarian')}
                      className="rounded text-[#D4AF37]"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={editingDish.dietary?.includes('gluten_free') ?? false}
                      onChange={() => toggleDietaryTag('gluten_free')}
                      className="rounded text-[#D4AF37]"
                    />
                    <span>Gluten Free</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white gold-gradient-bg font-semibold rounded-xl shadow-sm hover:opacity-95"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE BANQUET PACKAGE */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {editingPackage.name ? `Edit Dining Package: ${editingPackage.name}` : 'Create Dining Package'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name || ''}
                    onChange={(e) => {
                      setEditingPackage({ ...editingPackage, name: e.target.value });
                      if (packageErrors.name) setPackageErrors({ ...packageErrors, name: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border mt-1 ${
                      packageErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                    placeholder="e.g. Royal Mughal Feast"
                  />
                  {packageErrors.name && <p className="text-[11px] text-rose-600 font-medium mt-1">{packageErrors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#78716C]">Price Per Guest ({brand.currencySymbol}) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={editingPackage.pricePerPerson ?? 0}
                    onChange={(e) => {
                      setEditingPackage({ ...editingPackage, pricePerPerson: parseFloat(e.target.value) || 0 });
                      if (packageErrors.pricePerPerson) setPackageErrors({ ...packageErrors, pricePerPerson: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border mt-1 font-bold ${
                      packageErrors.pricePerPerson ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  />
                  {packageErrors.pricePerPerson && <p className="text-[11px] text-rose-600 font-medium mt-1">{packageErrors.pricePerPerson}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#78716C]">Tagline / Subheading</label>
                <input
                  type="text"
                  value={editingPackage.tagline || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 mt-1"
                  placeholder="e.g. Our most requested wedding banquet selection"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={editingPackage.isPopular || false}
                  onChange={(e) => setEditingPackage({ ...editingPackage, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-[#D4AF37]"
                />
                <label htmlFor="popularCheck" className="cursor-pointer font-medium text-stone-800">
                  Feature as "Most Popular" Tier on Calculator
                </label>
              </div>

              {/* Multi-Course Dishes Highlights Editor */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-[#78716C]">
                    Course Highlights & Items
                  </label>
                </div>

                <div className="space-y-3">
                  {editingPackage.courseHighlights?.map((course, cIdx) => (
                    <div key={cIdx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => {
                            const updated = [...(editingPackage.courseHighlights || [])];
                            updated[cIdx].title = e.target.value;
                            setEditingPackage({ ...editingPackage, courseHighlights: updated });
                          }}
                          className="font-bold text-xs text-[#1C1917] bg-transparent border-b border-stone-300 focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingPackage.courseHighlights || []).filter((_, i) => i !== cIdx);
                            setEditingPackage({ ...editingPackage, courseHighlights: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-[11px] font-semibold"
                        >
                          Remove Course
                        </button>
                      </div>

                      {/* Items in course */}
                      <div className="flex flex-wrap gap-1.5">
                        {course.items?.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-800"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(editingPackage.courseHighlights || [])];
                                updated[cIdx].items = updated[cIdx].items.filter((_, i) => i !== iIdx);
                                setEditingPackage({ ...editingPackage, courseHighlights: updated });
                              }}
                              className="text-stone-400 hover:text-rose-600"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add item to course */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add dish to this course..."
                          value={newCourseItem[cIdx] || ''}
                          onChange={(e) => setNewCourseItem({ ...newCourseItem, [cIdx]: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (newCourseItem[cIdx] || '').trim();
                              if (!val) return;
                              const updated = [...(editingPackage.courseHighlights || [])];
                              updated[cIdx].items = [...(updated[cIdx].items || []), val];
                              setEditingPackage({ ...editingPackage, courseHighlights: updated });
                              setNewCourseItem({ ...newCourseItem, [cIdx]: '' });
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = (newCourseItem[cIdx] || '').trim();
                            if (!val) return;
                            const updated = [...(editingPackage.courseHighlights || [])];
                            updated[cIdx].items = [...(updated[cIdx].items || []), val];
                            setEditingPackage({ ...editingPackage, courseHighlights: updated });
                            setNewCourseItem({ ...newCourseItem, [cIdx]: '' });
                          }}
                          className="px-3 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 font-semibold text-xs text-stone-800"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Course Section */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="New course section name (e.g. Live Dessert Station)..."
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCourseTitle.trim()) return;
                        setEditingPackage({
                          ...editingPackage,
                          courseHighlights: [
                            ...(editingPackage.courseHighlights || []),
                            { title: newCourseTitle.trim(), items: [] },
                          ],
                        });
                        setNewCourseTitle('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:border-stone-400 font-semibold text-xs text-stone-700 bg-stone-100"
                    >
                      + Add Course Section
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white gold-gradient-bg font-semibold rounded-xl shadow-sm hover:opacity-95"
                >
                  Save Banquet Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Package Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(packageToDelete)}
        title="Delete Banquet Package"
        message={`Are you sure you want to delete the package "${packageToDelete?.name}"? Customers using the online calculator will no longer see this tier.`}
        confirmLabel="Yes, Delete Package"
        cancelLabel="Keep Package"
        isDestructive={true}
        onConfirm={handleDeletePackageConfirm}
        onCancel={() => setPackageToDelete(null)}
      />

      {/* Delete Dish Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(dishToDelete)}
        title="Delete A La Carte Dish"
        message={`Are you sure you want to remove "${dishToDelete?.name}" from the catering catalogue?`}
        confirmLabel="Yes, Delete Dish"
        cancelLabel="Keep Dish"
        isDestructive={true}
        onConfirm={handleDeleteDishConfirm}
        onCancel={() => setDishToDelete(null)}
      />
    </AdminLayout>
  );
};
