import { describe, it, expect } from 'vitest';
import { calculateEventCost, isWeekendDay, isPeakSeasonDate } from './pricingEngine';
import { 
  DEFAULT_HALLS, 
  DEFAULT_MENU_PACKAGES, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_DECORATIONS, 
  DEFAULT_SERVICES, 
  DEFAULT_PRICING_RULES 
} from '../config/defaultSettings';
import { CalculatorState } from '../types';

describe('Pricing Engine', () => {
  const context = {
    halls: DEFAULT_HALLS,
    menuPackages: DEFAULT_MENU_PACKAGES,
    menuItems: DEFAULT_MENU_ITEMS,
    decorations: DEFAULT_DECORATIONS,
    optionalServices: DEFAULT_SERVICES,
    pricingRules: DEFAULT_PRICING_RULES,
  };

  it('correctly handles zero guests without crash and zero cost per guest', () => {
    const state: CalculatorState = {
      eventType: 'wedding',
      bookingModel: 'hall_only',
      eventDate: '2026-06-15', // Monday (weekday, off-peak)
      timeSlot: 'dinner',
      guestCount: 0,
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: DEFAULT_MENU_PACKAGES[0].id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const result = calculateEventCost(state, context);
    expect(result.foodCost).toBe(0);
    expect(result.costPerGuest).toBe(0);
    expect(result.totalEstimatedPrice).toBeGreaterThan(0); // Base hall rental + mandatory generator
  });

  it('enforces minimum billable guest count when guests are below hall threshold', () => {
    const imperialHall = DEFAULT_HALLS[0]; // minBillableGuests = 400
    const goldPackage = DEFAULT_MENU_PACKAGES[1]; // $54 per person

    const state: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-06-15', // weekday
      timeSlot: 'dinner',
      guestCount: 360, // Below 400
      hallId: imperialHall.id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: goldPackage.id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const result = calculateEventCost(state, context);
    // Should be billed at 400 guests * package price
    expect(result.foodCost).toBe(400 * goldPackage.pricePerPerson);
    expect(result.minBillableWarning).toBeDefined();
  });

  it('triggers capacity warnings correctly for under and over capacity', () => {
    const imperialHall = DEFAULT_HALLS[0]; // minCapacity: 350, maxCapacity: 1200

    const underState: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-06-15',
      timeSlot: 'dinner',
      guestCount: 200, // below minCapacity
      hallId: imperialHall.id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: null,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const underResult = calculateEventCost(underState, context);
    expect(underResult.minCapacityWarning).toBeDefined();

    const overState: CalculatorState = {
      ...underState,
      guestCount: 1500, // above maxCapacity 1200
    };

    const overResult = calculateEventCost(overState, context);
    expect(overResult.maxCapacityWarning).toBeDefined();
  });

  it('correctly detects weekends (Fri/Sat/Sun) and applies surcharge', () => {
    expect(isWeekendDay('2026-10-16')).toBe(true); // Friday
    expect(isWeekendDay('2026-10-17')).toBe(true); // Saturday
    expect(isWeekendDay('2026-10-18')).toBe(true); // Sunday
    expect(isWeekendDay('2026-10-19')).toBe(false); // Monday

    const state: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-10-17', // Saturday
      timeSlot: 'dinner',
      guestCount: 500,
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: DEFAULT_MENU_PACKAGES[0].id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const result = calculateEventCost(state, {
      ...context,
      pricingRules: { ...DEFAULT_PRICING_RULES, weekendSurchargePercentage: 10 },
    });
    expect(result.isWeekend).toBe(true);
    expect(result.weekendSurcharge).toBeGreaterThan(0);
  });

  it('detects peak season months and applies peak surcharge', () => {
    // Peak season months: [11, 12, 1, 2]
    expect(isPeakSeasonDate('2026-12-15', [11, 12, 1, 2])).toBe(true);
    expect(isPeakSeasonDate('2026-07-15', [11, 12, 1, 2])).toBe(false);

    const state: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-12-10', // December
      timeSlot: 'dinner',
      guestCount: 500,
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: DEFAULT_MENU_PACKAGES[0].id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const result = calculateEventCost(state, {
      ...context,
      pricingRules: { ...DEFAULT_PRICING_RULES, peakSeasonSurchargePercentage: 15 },
    });
    expect(result.isPeakSeason).toBe(true);
    expect(result.peakSeasonSurcharge).toBeGreaterThan(0);
  });

  it('automatically includes mandatory services even if unselected by user', () => {
    const state: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-06-15',
      timeSlot: 'dinner',
      guestCount: 500,
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: null,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [], // Empty!
    };

    const result = calculateEventCost(state, {
      ...context,
      optionalServices: [
        {
          id: 'srv-generator',
          name: 'Heavy Duty 500kVA Generator Fuel & Backup',
          category: 'generator',
          price: 45000,
          pricingType: 'fixed',
          isMandatory: true,
          isActive: true,
          description: 'Power backup',
        },
      ],
    });
    const generatorService = result.items.find(item => item.id.includes('srv-generator'));
    expect(generatorService).toBeDefined();
    expect(generatorService?.notes || generatorService?.label).toContain('Required');
  });

  it('calculates 30% advance deposit and remaining balance correctly', () => {
    const state: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-06-15',
      timeSlot: 'dinner',
      guestCount: 400,
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: DEFAULT_MENU_PACKAGES[0].id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const result = calculateEventCost(state, context);
    expect(result.requiredAdvanceAmount + result.remainingBalanceAmount).toBeCloseTo(result.totalEstimatedPrice, 1);
    expect(result.requiredAdvanceAmount / result.totalEstimatedPrice).toBeCloseTo(0.30, 2);
  });

  it('guarantees all pricing outputs have zero decimals (Pakistani Rupee integers)', () => {
    const customRules = {
      ...DEFAULT_PRICING_RULES,
      taxPercentage: 16.5,
      serviceChargePercentage: 7.25,
      advancePaymentPercentage: 25,
    };
    const state: CalculatorState = {
      eventType: 'wedding',
      eventDate: '2026-10-17', // Saturday (weekend surcharge)
      timeSlot: 'dinner',
      guestCount: 433, // Odd number of guests
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: DEFAULT_MENU_PACKAGES[0].id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    const result = calculateEventCost(state, { ...context, pricingRules: customRules });
    expect(Number.isInteger(result.totalEstimatedPrice)).toBe(true);
    expect(Number.isInteger(result.costPerGuest)).toBe(true);
    expect(Number.isInteger(result.taxAmount)).toBe(true);
    expect(Number.isInteger(result.serviceChargeAmount)).toBe(true);
    expect(Number.isInteger(result.weekendSurcharge)).toBe(true);
    expect(Number.isInteger(result.subtotalBeforeTax)).toBe(true);
    expect(Number.isInteger(result.requiredAdvanceAmount)).toBe(true);
    expect(Number.isInteger(result.remainingBalanceAmount)).toBe(true);
  });

  it('respects predefined occasion custom hall rent and dynamic per person cost based on guest count', () => {
    const dholkiState: CalculatorState = {
      eventType: 'dholki',
      bookingModel: 'hall_only',
      eventDate: '2026-06-15', // weekday, off-peak
      timeSlot: 'dinner',
      guestCount: 200,
      hallId: DEFAULT_HALLS[2].id,
      isIndoorOutdoor: 'outdoor',
      selectedPackageId: null,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
      customHallRent: 140000,
      customPerPersonRate: 1950,
    };

    const result = calculateEventCost(dholkiState, context);
    expect(result.venueRentalCost).toBe(140000);
    expect(result.subtotalBeforeTax).toBe(140000 + (result.servicesCost || 0));
  });

  it('correctly calculates 50% subsidized rate for children under 8 years', () => {
    const state: CalculatorState = {
      eventType: 'barat',
      bookingModel: 'per_person_only',
      eventDate: '2026-06-16', // Tuesday
      timeSlot: 'dinner',
      guestCount: 400,
      childrenCount: 50,
      hallId: DEFAULT_HALLS[0].id,
      isIndoorOutdoor: 'indoor',
      selectedPackageId: DEFAULT_MENU_PACKAGES[0].id,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
      customPerPersonRate: 2000,
    };

    const result = calculateEventCost(state, context);
    // Adult food = 400 * 2000 = 800,000
    // Child food = 50 * (2000 * 0.5) = 50 * 1000 = 50,000
    expect(result.foodCost).toBe(850000);
    expect(result.childrenFoodCost).toBe(50000);
  });

  it('treats Islamic segregation as complimentary (Rs. 0) by default and applies outside decorator royalty (Rs. 35,000)', () => {
    const state: CalculatorState = {
      eventType: 'barat',
      bookingModel: 'hall_only',
      eventDate: '2026-06-16',
      timeSlot: 'dinner',
      guestCount: 200,
      hallId: 'hall-1',
      isIndoorOutdoor: 'indoor',
      isSegregated: true,
      hasOutsideDecorator: true,
      selectedPackageId: null,
      customDishIds: [],
      selectedDecorationIds: [],
      selectedServiceIds: [],
    };

    // 1. By default: partitionFee is 0 (FREE / Complimentary in Pakistani Marquees)
    const resultDefault = calculateEventCost(state, context);
    expect(resultDefault.segregationCost).toBe(0);
    expect(resultDefault.outsideDecoratorFee).toBe(35000);
    expect(resultDefault.decorationCost).toBe(35000);

    // 2. When Admin customizes partition fee in Settings (e.g. Rs. 20,000)
    const customContext = {
      ...context,
      pricingRules: {
        ...context.pricingRules,
        partitionFee: 20000,
      },
    };
    const resultCustom = calculateEventCost(state, customContext);
    expect(resultCustom.segregationCost).toBe(20000);
    expect(resultCustom.servicesCost).toBeGreaterThanOrEqual(20000);
  });
});
