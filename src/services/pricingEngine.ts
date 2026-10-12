import { 
  CalculatorState, 
  CalculationResult, 
  CalculationBreakdownItem, 
  Hall, 
  MenuPackage, 
  MenuItem, 
  DecorationOption, 
  OptionalService, 
  PricingRules 
} from '../types';

export interface PricingContext {
  halls: Hall[];
  menuPackages: MenuPackage[];
  menuItems: MenuItem[];
  decorations: DecorationOption[];
  optionalServices: OptionalService[];
  pricingRules: PricingRules;
}

/**
 * Checks whether a given ISO date (YYYY-MM-DD) falls on a weekend (Friday, Saturday, Sunday)
 */
export function isWeekendDay(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return false;
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const day = date.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
    return day === 0 || day === 5 || day === 6;
  } catch {
    return false;
  }
}

/**
 * Checks whether a given ISO date falls within configured peak season months (1-indexed: 1 = Jan .. 12 = Dec)
 */
export function isPeakSeasonDate(dateStr: string, peakMonths: number[]): boolean {
  if (!dateStr || !peakMonths || peakMonths.length === 0) return false;
  try {
    const parts = dateStr.split('-');
    if (parts.length < 2) return false;
    const month = parseInt(parts[1], 10);
    return peakMonths.includes(month);
  } catch {
    return false;
  }
}

/**
 * Round monetary numbers to pure integer (Pakistani Rupee without decimals)
 */
export function roundToTwoDecimals(num: number): number {
  return Math.round(Number(num) || 0);
}

/**
 * Universal Pakistani Rupee currency formatter (strips decimals completely)
 */
export function formatPrice(val: number | string | undefined | null): string {
  const num = Number(val) || 0;
  return Math.round(num).toLocaleString('en-US');
}

/**
 * Centralized, pure, deterministic pricing engine.
 * Calculates accurate itemized cost breakdowns, capacity validations, minimum guest billings,
 * taxes, service fees, discounts, and advance deposit requirements.
 */
export function calculateEventCost(
  state: CalculatorState,
  context: PricingContext
): CalculationResult {
  const { halls, menuPackages, menuItems, decorations, optionalServices, pricingRules } = context;
  const items: CalculationBreakdownItem[] = [];

  // Guard guest count against negative or NaN values
  const rawGuests = Math.max(0, Math.floor(Number(state.guestCount) || 0));

  // 1. Find Selected Hall
  const selectedHall = halls.find((h) => h.id === state.hallId) || halls[0];
  let minCapacityWarning: string | undefined;
  let maxCapacityWarning: string | undefined;
  let minBillableWarning: string | undefined;

  let billableGuests = rawGuests;

  if (selectedHall) {
    if (rawGuests > 0 && rawGuests < selectedHall.minCapacity) {
      minCapacityWarning = `Selected guests (${rawGuests}) is below the hall minimum capacity of ${selectedHall.minCapacity}.`;
    }
    if (rawGuests > selectedHall.maxCapacity) {
      maxCapacityWarning = `Selected guests (${rawGuests}) exceeds maximum capacity of ${selectedHall.maxCapacity}.`;
    }

    // Check minimum billable guests rule
    if (rawGuests > 0 && selectedHall.minBillableGuests && rawGuests < selectedHall.minBillableGuests) {
      billableGuests = selectedHall.minBillableGuests;
      minBillableWarning = `The hall requires a minimum billing threshold of ${selectedHall.minBillableGuests} guests. Catering and per-person charges apply to ${selectedHall.minBillableGuests} guests.`;
    }
  }

  // 2. Venue Base Rental
  let venueRentalCost = 0;
  if (selectedHall) {
    if (state.bookingModel === 'hall_only') {
      // Sirf Hall Booking: Client pays full hall rental price
      const basePrice = (state.customHallRent !== undefined && state.customHallRent > 0)
        ? state.customHallRent
        : selectedHall.baseRentalPrice;
      venueRentalCost = basePrice;
      items.push({
        id: `venue-${selectedHall.id}`,
        label: `Venue Rental (${selectedHall.name})`,
        category: 'venue',
        quantity: 1,
        unitPrice: basePrice,
        pricingType: 'fixed',
        subtotal: basePrice,
        notes: `${selectedHall.minCapacity} - ${selectedHall.maxCapacity} guest capacity`
      });
    } else {
      // Standard (Full Package Hall + Food) or Per-Person: Hall rent is 100% FREE / Waived with Catering!
      venueRentalCost = 0;
      items.push({
        id: `venue-${selectedHall.id}`,
        label: `Venue Rental (${selectedHall.name})`,
        category: 'venue',
        quantity: 1,
        unitPrice: 0,
        pricingType: 'fixed',
        subtotal: 0,
        notes: 'Complimentary / FREE (Rs. 0 Waived with Catering Package)'
      });
    }
  }

  // 3. Food & Catering Cost
  let foodCost = 0;
  if (state.bookingModel === 'hall_only') {
    // Hall only - no catering charges
    foodCost = 0;
    items.push({
      id: 'catering-hall-only',
      label: 'Catering: Self-Arranged / Hall Only',
      category: 'food',
      quantity: billableGuests,
      unitPrice: 0,
      pricingType: 'fixed',
      subtotal: 0,
      notes: 'No marquee catering charges apply'
    });
  } else {
    // Per-Person Catering (Hall Rent Free)
    const pkg = menuPackages.find((p) => p.id === state.selectedPackageId) || menuPackages[0];
    const defaultPackageRate = pkg ? pkg.pricePerPerson : 2800;
    const rate = (state.customPerPersonRate && state.customPerPersonRate > 0)
      ? state.customPerPersonRate
      : defaultPackageRate;
    const pkgName = pkg ? pkg.name : 'Shahi Dastarkhwan Feast';
    const foodSubtotal = roundToTwoDecimals(rate * billableGuests);
    foodCost += foodSubtotal;
    items.push({
      id: pkg ? `pkg-${pkg.id}` : 'catering-per-person',
      label: `Catering Package: ${pkgName} (${rate.toLocaleString()}/guest)`,
      category: 'food',
      quantity: billableGuests,
      unitPrice: rate,
      pricingType: 'per_person',
      subtotal: foodSubtotal,
      notes: rawGuests !== billableGuests ? `Billed at min ${billableGuests} guests` : undefined
    });
  }

  // Individual / Custom Add-on Dishes (only apply when not hall_only)
  if (state.bookingModel !== 'hall_only' && state.customDishIds && state.customDishIds.length > 0) {
    state.customDishIds.forEach((dishId) => {
      const dish = menuItems.find((d) => d.id === dishId);
      if (dish) {
        const dishSubtotal = roundToTwoDecimals(dish.pricePerPerson * billableGuests);
        foodCost += dishSubtotal;
        items.push({
          id: `dish-${dish.id}`,
          label: `A La Carte Dish: ${dish.name}`,
          category: 'food',
          quantity: billableGuests,
          unitPrice: dish.pricePerPerson,
          pricingType: 'per_person',
          subtotal: dishSubtotal
        });
      }
    });
  }

  // 4. Decoration Cost
  let decorationCost = 0;
  if (state.selectedDecorationIds && state.selectedDecorationIds.length > 0) {
    state.selectedDecorationIds.forEach((decId) => {
      const dec = decorations.find((d) => d.id === decId);
      if (dec) {
        let decSubtotal = 0;
        let qty = 1;
        if (dec.pricingType === 'per_person') {
          qty = billableGuests;
          decSubtotal = roundToTwoDecimals(dec.price * billableGuests);
        } else {
          decSubtotal = dec.price;
        }
        decorationCost += decSubtotal;
        items.push({
          id: `dec-${dec.id}`,
          label: `Décor: ${dec.name}`,
          category: 'decoration',
          quantity: qty,
          unitPrice: dec.price,
          pricingType: dec.pricingType,
          subtotal: decSubtotal
        });
      }
    });
  }

  // 5. Optional & Mandatory Services Cost
  let servicesCost = 0;
  // Combine user-selected services with any mandatory services defined by the owner
  const effectiveServiceIds = new Set(state.selectedServiceIds || []);
  optionalServices.forEach((srv) => {
    if (srv.isMandatory && srv.isActive) {
      effectiveServiceIds.add(srv.id);
    }
  });

  effectiveServiceIds.forEach((srvId) => {
    const srv = optionalServices.find((s) => s.id === srvId);
    if (srv && srv.isActive) {
      let srvSubtotal = 0;
      let qty = 1;
      if (srv.pricingType === 'per_person') {
        qty = billableGuests;
        srvSubtotal = roundToTwoDecimals(srv.price * billableGuests);
      } else {
        srvSubtotal = srv.price;
      }
      servicesCost += srvSubtotal;
      items.push({
        id: `srv-${srv.id}`,
        label: `Service: ${srv.name}${srv.isMandatory ? ' (Required)' : ''}`,
        category: 'service',
        quantity: qty,
        unitPrice: srv.price,
        pricingType: srv.pricingType,
        subtotal: srvSubtotal
      });
    }
  });

  // 6. Base Subtotal before surcharges
  const rawSubtotal = roundToTwoDecimals(venueRentalCost + foodCost + decorationCost + servicesCost);

  // 7. Weekend & Peak Season Surcharges
  const isWeekend = isWeekendDay(state.eventDate);
  const isPeakSeason = isPeakSeasonDate(state.eventDate, pricingRules.peakSeasonMonths);

  let weekendSurcharge = 0;
  if (isWeekend && pricingRules.weekendSurchargePercentage > 0) {
    // Surcharge calculated on base venue & services
    weekendSurcharge = roundToTwoDecimals((rawSubtotal * pricingRules.weekendSurchargePercentage) / 100);
    items.push({
      id: 'fee-weekend',
      label: `Weekend Surcharge (${pricingRules.weekendSurchargePercentage}%)`,
      category: 'fee',
      quantity: 1,
      unitPrice: weekendSurcharge,
      pricingType: 'percentage',
      subtotal: weekendSurcharge,
      notes: 'Applied for Fri/Sat/Sun events'
    });
  }

  let peakSeasonSurcharge = 0;
  if (isPeakSeason && pricingRules.peakSeasonSurchargePercentage > 0) {
    peakSeasonSurcharge = roundToTwoDecimals((rawSubtotal * pricingRules.peakSeasonSurchargePercentage) / 100);
    items.push({
      id: 'fee-peak-season',
      label: `Peak Wedding Season Surcharge (${pricingRules.peakSeasonSurchargePercentage}%)`,
      category: 'fee',
      quantity: 1,
      unitPrice: peakSeasonSurcharge,
      pricingType: 'percentage',
      subtotal: peakSeasonSurcharge,
      notes: 'Applied during high-demand months'
    });
  }

  // 8. Promo / Discount handling
  let discountAmount = 0;
  if (state.promoCode && state.promoCode.trim().toUpperCase() === 'ROYAL5') {
    discountAmount = roundToTwoDecimals((rawSubtotal * 0.05));
    items.push({
      id: 'disc-royal5',
      label: 'Special Welcome Privilege Discount (5%)',
      category: 'discount',
      quantity: 1,
      unitPrice: -discountAmount,
      pricingType: 'percentage',
      subtotal: -discountAmount
    });
  }

  const subtotalBeforeTax = Math.max(0, roundToTwoDecimals(rawSubtotal + weekendSurcharge + peakSeasonSurcharge - discountAmount));

  // 9. Hospitality Service Charge
  let serviceChargeAmount = 0;
  if (pricingRules.serviceChargePercentage > 0) {
    serviceChargeAmount = roundToTwoDecimals((subtotalBeforeTax * pricingRules.serviceChargePercentage) / 100);
    items.push({
      id: 'fee-service-charge',
      label: `Hospitality & Service Charge (${pricingRules.serviceChargePercentage}%)`,
      category: 'fee',
      quantity: 1,
      unitPrice: serviceChargeAmount,
      pricingType: 'percentage',
      subtotal: serviceChargeAmount
    });
  }

  // 10. Applicable Taxes (VAT / GST)
  let taxAmount = 0;
  if (pricingRules.taxPercentage > 0) {
    taxAmount = roundToTwoDecimals(((subtotalBeforeTax + serviceChargeAmount) * pricingRules.taxPercentage) / 100);
    items.push({
      id: 'fee-tax',
      label: `Government Event Tax / VAT (${pricingRules.taxPercentage}%)`,
      category: 'tax',
      quantity: 1,
      unitPrice: taxAmount,
      pricingType: 'percentage',
      subtotal: taxAmount
    });
  }

  // 11. Total Estimated Price
  const totalEstimatedPrice = roundToTwoDecimals(subtotalBeforeTax + serviceChargeAmount + taxAmount);

  // 12. Cost Per Guest (Catering rate per person if configured or package selected, otherwise food cost per guest)
  let costPerGuest = 0;
  if (rawGuests === 0) {
    costPerGuest = 0;
  } else if (state.customPerPersonRate !== undefined && state.customPerPersonRate > 0) {
    costPerGuest = state.customPerPersonRate;
  } else if (state.selectedPackageId) {
    const pkg = menuPackages.find((p) => p.id === state.selectedPackageId);
    costPerGuest = pkg ? pkg.pricePerPerson : (rawGuests > 0 ? roundToTwoDecimals(foodCost / rawGuests) : 0);
  } else {
    costPerGuest = rawGuests > 0 ? roundToTwoDecimals(foodCost / rawGuests) : 0;
  }

  // 13. Required Advance Payment & Balance
  const advancePercent = Math.min(100, Math.max(0, pricingRules.advancePaymentPercentage || 25));
  const requiredAdvanceAmount = roundToTwoDecimals((totalEstimatedPrice * advancePercent) / 100);
  const remainingBalanceAmount = roundToTwoDecimals(totalEstimatedPrice - requiredAdvanceAmount);

  const minimumGuestBillAdjustment = rawGuests > 0 && selectedHall && rawGuests < selectedHall.minBillableGuests
    ? roundToTwoDecimals((selectedHall.minBillableGuests - rawGuests) * (state.selectedPackageId ? (menuPackages.find(p => p.id === state.selectedPackageId)?.pricePerPerson || 0) : 0))
    : 0;

  return {
    items,
    venueRentalCost,
    foodCost,
    decorationCost,
    servicesCost,
    minimumGuestBillAdjustment,
    weekendSurcharge,
    peakSeasonSurcharge,
    subtotalBeforeTax,
    discountAmount,
    serviceChargeAmount,
    taxAmount,
    totalEstimatedPrice,
    costPerGuest,
    requiredAdvanceAmount,
    remainingBalanceAmount,
    minCapacityWarning,
    maxCapacityWarning,
    minBillableWarning,
    isWeekend,
    isPeakSeason,
  };
}
