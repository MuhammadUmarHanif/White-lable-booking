export type TimeSlot = 'lunch' | 'dinner' | 'full_day' | 'morning';

export interface Hall {
  id: string;
  name: string;
  description: string;
  minCapacity: number;
  maxCapacity: number;
  minBillableGuests: number;
  baseRentalPrice: number; // Base rental price for the hall
  images: string[];
  amenities: string[];
  isIndoor: boolean;
  isActive: boolean;
}

export type PricingType = 'fixed' | 'per_person' | 'per_item' | 'percentage';

export interface MenuItem {
  id: string;
  name: string;
  category: 'starters' | 'mains' | 'rice_bread' | 'desserts' | 'beverages' | 'live_stations';
  description?: string;
  pricePerPerson: number; // Per-guest charge if selected individually
  isIncludedInPackage?: boolean;
  dietary?: ('halal' | 'vegetarian' | 'vegan' | 'gluten_free')[];
  image?: string;
  isActive: boolean;
}

export interface MenuPackage {
  id: string;
  name: string;
  tagline: string;
  pricePerPerson: number;
  description: string;
  isPopular?: boolean;
  includedDishIds: string[];
  courseHighlights: {
    title: string;
    items: string[];
  }[];
  isActive: boolean;
}

export interface DecorationOption {
  id: string;
  name: string;
  category: 'stage' | 'floral' | 'lighting' | 'seating' | 'entrance' | 'table_centerpiece';
  description: string;
  price: number;
  pricingType: PricingType;
  image?: string;
  isPopular?: boolean;
  isActive: boolean;
}

export interface OptionalService {
  id: string;
  name: string;
  category: 'generator' | 'ac_heating' | 'sound_dj' | 'photography' | 'bridal_suite' | 'valet' | 'security' | 'custom';
  description: string;
  price: number;
  pricingType: PricingType;
  isMandatory?: boolean;
  isActive: boolean;
}

export interface PricingRules {
  taxPercentage: number; // e.g. 13% or 16%
  serviceChargePercentage: number; // e.g. 5%
  advancePaymentPercentage: number; // e.g. 25%
  weekendSurchargePercentage: number; // e.g. 10% for Fri/Sat/Sun
  peakSeasonMonths: number[]; // e.g. [11, 12, 1, 2] (Nov-Feb)
  peakSeasonSurchargePercentage: number; // e.g. 15%
  quotationValidityDays: number; // e.g. 14 days
  termsAndConditions: string;
  cancellationPolicy: string;
}

export interface ShowcaseSpace {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  category: string;
  description: string;
  image?: string;
  images: string[];
  highlights: string[];
  link: string;
  occasion?: string; // 'barat' | 'walima' | 'mehendi' | 'dholki'
  rentPrice?: number; // Predefined base hall rent for this occasion
  perPersonPrice?: number; // Configurable per head catering cost
  hallId?: string; // Associated hall ID
}

export interface BrandSettings {
  businessName: string;
  legalEntityName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string; // e.g. #D4AF37
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  businessHours: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImages: string[];
  aboutText: string;
  aboutHighlights: string[];
  currencySymbol: string;
  currencyCode: string;
  showcaseSpaces?: ShowcaseSpace[];
}

export interface CalculatorState {
  // Step 1: Event Details
  eventType: 
    | 'barat' 
    | 'walima' 
    | 'mehendi' 
    | 'dholki'
    | 'nikah' 
    | 'qawwali_sufi' 
    | 'engagement_mangni' 
    | 'corporate_gala' 
    | 'wedding' 
    | 'reception' 
    | 'other';
  bookingModel?: 'all_inclusive' | 'hall_only' | 'per_person_only';
  eventDate: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  guestCount: number;
  hallId: string;
  isIndoorOutdoor: 'indoor' | 'outdoor' | 'both';
  customHallRent?: number;
  customPerPersonRate?: number;

  // Step 2: Food
  selectedPackageId: string | null;
  customDishIds: string[];

  // Step 3: Decoration
  selectedDecorationIds: string[];

  // Step 4: Optional Services
  selectedServiceIds: string[];

  // Step 5: Special requests / Promo code
  promoCode?: string;
}

export interface CalculationBreakdownItem {
  id: string;
  label: string;
  category: 'venue' | 'food' | 'decoration' | 'service' | 'fee' | 'discount' | 'tax';
  quantity: number;
  unitPrice: number;
  pricingType: PricingType;
  subtotal: number;
  notes?: string;
}

export interface CalculationResult {
  // Line items
  items: CalculationBreakdownItem[];

  // Subtotals
  venueRentalCost: number;
  foodCost: number;
  decorationCost: number;
  servicesCost: number;
  
  // Adjustments
  minimumGuestBillAdjustment: number;
  weekendSurcharge: number;
  peakSeasonSurcharge: number;
  subtotalBeforeTax: number;
  
  // Discounts and Fees
  discountAmount: number;
  serviceChargeAmount: number;
  taxAmount: number;

  // Final totals
  totalEstimatedPrice: number;
  costPerGuest: number;
  requiredAdvanceAmount: number;
  remainingBalanceAmount: number;

  // Flags & warnings
  minCapacityWarning?: string;
  maxCapacityWarning?: string;
  minBillableWarning?: string;
  isWeekend: boolean;
  isPeakSeason: boolean;
}

export type BookingStatus = 'pending' | 'approved' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'credit_card' | 'cheque' | 'online';
  transactionReference: string;
  notes?: string;
  recordedBy: string;
}

export interface BookingRequest {
  id: string;
  referenceNumber: string; // e.g. MRQ-2026-1042
  createdAt: string;
  updatedAt: string;
  
  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity?: string;
  customerNotes?: string;

  // Event specifics
  eventType: string;
  eventDate: string;
  timeSlot: TimeSlot;
  guestCount: number;
  hallId: string;
  hallName: string;

  // Selection Snapshot
  calculatorSnapshot: CalculatorState;
  calculationSnapshot: CalculationResult;

  // Status & Management
  status: BookingStatus;
  internalNotes?: string;
  statusHistory: {
    status: BookingStatus;
    changedAt: string;
    changedBy: string;
    reason?: string;
  }[];

  // Financial tracking
  totalQuotationAmount: number;
  advanceRequired: number;
  totalPaid: number;
  outstandingBalance: number;
  payments: PaymentRecord[];

  // Expiration / Hold policy
  holdExpiresAt?: string;
}
