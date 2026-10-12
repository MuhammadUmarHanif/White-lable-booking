import React, { useState } from 'react';
import { CalculatorState, MenuPackage, MenuItem } from '../../types';
import { Utensils, Check, Plus, Star, Leaf, Sparkles, ShieldCheck } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';

const PACKAGE_OCCASION_MAP: Record<string, string> = {
  'pkg-shahi-barat': 'barat',
  'pkg-walima-imperial': 'walima',
  'pkg-mehendi-festive': 'mehendi',
  'pkg-qawwali-sufi': 'qawwali_sufi',
  'pkg-engagement-mangni': 'engagement_mangni',
  'pkg-birthday-milestone': 'birthday',
};

interface Props {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
  menuPackages: MenuPackage[];
  menuItems: MenuItem[];
  currencySymbol: string;
}

export const Step3FoodSelection: React.FC<Props> = ({
  state,
  onChange,
  menuPackages,
  menuItems,
  currencySymbol,
}) => {
  const { brand } = useBrand();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'starters', label: 'Appetizers & Grills' },
    { id: 'mains', label: 'Mutton & Chicken Entrées' },
    { id: 'rice_bread', label: 'Biryani & Tandoor Breads' },
    { id: 'desserts', label: 'Shahi Meetha & Halwa' },
    { id: 'beverages', label: 'Kashmiri Chai & Drinks' },
    { id: 'live_stations', label: 'Live Jalebi & BBQ' },
  ];

  const filteredDishes = activeCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const toggleDish = (dishId: string) => {
    const current = state.customDishIds || [];
    if (current.includes(dishId)) {
      onChange({ customDishIds: current.filter((id) => id !== dishId) });
    } else {
      onChange({ customDishIds: [...current, dishId] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#997A15] mb-1">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>100% Halal Gourmet Culinary Dastarkhwan</span>
        </div>
        <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
          Step 3: Royal Catering & Shahi Dastarkhwan
        </h3>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Choose a grand Barat, Walima, or One-Dish compliant dining tier, or enrich your feast with live jalebi counters and charcoal barbecue.
        </p>
      </div>

      {/* Occasion Predefined Per-Head Catering Rate Indicator */}
      {state.customPerPersonRate ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FBF6E9] to-[#FAF8F5] border border-[#D4AF37]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#997A15] block">
              Active {state.eventType ? state.eventType.toUpperCase() : 'OCCASION'} Catering Rate
            </span>
            <p className="text-xs text-[#78716C] mt-0.5">
              Configured by venue at <strong className="text-[#1C1917]">{currencySymbol} {Math.round(state.customPerPersonRate).toLocaleString()} / guest</strong>. Adjusts dynamically for your {state.guestCount} guests. You may also select a chef banquet package below.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-numeric font-bold text-[#1C1917]">
              {currencySymbol} {Math.round(state.customPerPersonRate * state.guestCount).toLocaleString()}
            </span>
            <span className="text-[11px] text-[#78716C] block font-medium">Total for {state.guestCount} guests</span>
          </div>
        </div>
      ) : null}

      {/* Package Tier Selection */}
      <div className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          Choose a Curated Traditional Feast
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {menuPackages.map((pkg) => {
            const isSelected = state.selectedPackageId === pkg.id;
            const linkedOccasion = PACKAGE_OCCASION_MAP[pkg.id];
            const space = linkedOccasion ? brand.showcaseSpaces?.find((s) => s.occasion === linkedOccasion) : undefined;
            const effectivePrice = (space?.perPersonPrice && space.perPersonPrice > 0)
              ? space.perPersonPrice
              : (isSelected && state.customPerPersonRate ? state.customPerPersonRate : pkg.pricePerPerson);

            return (
              <div
                key={pkg.id}
                onClick={() => onChange({
                  selectedPackageId: isSelected ? null : pkg.id,
                  customPerPersonRate: isSelected ? undefined : effectivePrice
                })}
                className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] bg-[#FBF6E9] shadow-md'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-2.5 sm:-top-3 right-2 sm:right-4 px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] uppercase font-bold tracking-wider gold-gradient-bg text-white shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" /> Popular
                  </span>
                )}

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-serif text-xs sm:text-lg font-bold text-[#1C1917] leading-tight">{pkg.name}</h4>
                    {isSelected && (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#78716C] leading-relaxed line-clamp-2">{pkg.tagline}</p>
                </div>

                {/* Highlights */}
                <div className="my-2 sm:my-3 space-y-1 sm:space-y-2 border-y border-stone-200/60 py-1.5 sm:py-2.5">
                  {pkg.courseHighlights?.map((course, idx) => (
                    <div key={idx} className="text-[10px] sm:text-[11px]">
                      <span className="font-semibold text-[#1C1917] block leading-tight">{course.title}</span>
                      <span className="text-[#78716C] line-clamp-1 sm:line-clamp-2">{course.items.join(' • ')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] sm:text-xs">
                  <span className="text-[#78716C]">Per Head</span>
                  <span className="text-sm sm:text-lg font-serif font-bold text-[#1C1917]">
                    {currencySymbol} {Math.round(effectivePrice).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* A La Carte / Additional Add-On Dishes */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              Enrich with Signature Specialties & Live Counters
            </label>
            <p className="text-xs text-[#78716C]">
              Add individual live jalebi stations, mutton kunna, or fish tikka to your banquet spread.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#1C1917] text-white font-medium shadow-xs'
                    : 'bg-stone-100 text-[#57534E] hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
          {filteredDishes.map((dish) => {
            const isSelected = (state.customDishIds || []).includes(dish.id);
            return (
              <div
                key={dish.id}
                onClick={() => toggleDish(dish.id)}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#FBF6E9] shadow-sm'
                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="space-y-0.5 sm:space-y-1 pr-1 flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#1C1917] truncate block">{dish.name}</span>
                    {dish.dietary?.includes('vegetarian') && (
                      <span title="Vegetarian">
                        <Leaf className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#997A15] block">
                    +{currencySymbol} {Math.round(dish.pricePerPerson).toLocaleString()} / head
                  </span>
                </div>

                <button
                  type="button"
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#D4AF37] text-white'
                      : 'border border-stone-300 text-stone-500 hover:border-[#D4AF37]'
                  }`}
                  aria-label={isSelected ? 'Remove dish' : 'Add dish'}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
