import { ref as dbRef, get, set, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { rtdb, storage, isFirebaseConfigured } from '../config/firebase';
import { 
  BrandSettings, 
  Hall, 
  MenuItem, 
  MenuPackage, 
  DecorationOption, 
  OptionalService, 
  PricingRules, 
  BookingRequest, 
  BookingStatus, 
  PaymentRecord,
  ContactInquiry 
} from '../types';
import { 
  DEFAULT_BRAND_SETTINGS, 
  DEFAULT_HALLS, 
  DEFAULT_MENU_PACKAGES, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_DECORATIONS, 
  DEFAULT_SERVICES, 
  DEFAULT_PRICING_RULES,
  DEFAULT_BOOKINGS
} from '../config/defaultSettings';
import { checkBookingConflict } from './bookingConflictEngine';

// Local storage cache keys for zero-latency instant offline capability
const LS_PREFIX = 'marquee_whitelabel_';
const LS_BRAND = `${LS_PREFIX}brand`;
const LS_RULES = `${LS_PREFIX}rules`;
const LS_HALLS = `${LS_PREFIX}halls`;
const LS_PACKAGES = `${LS_PREFIX}packages`;
const LS_MENU_ITEMS = `${LS_PREFIX}menu_items`;
const LS_DECORATIONS = `${LS_PREFIX}decorations`;
const LS_SERVICES = `${LS_PREFIX}services`;
const LS_BOOKINGS = `${LS_PREFIX}bookings`;
const LS_INQUIRIES = `${LS_PREFIX}inquiries`;

function getLocalOrFallback<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    const parsed = JSON.parse(val);
    if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === 0 && (fallback as any).length > 0) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function mapToArray<T>(val: any, fallback: T[]): T[] {
  if (!val) return fallback;
  if (Array.isArray(val)) return val.filter(Boolean);
  return Object.values(val);
}

function arrayToMap<T extends { id: string }>(arr: T[]): Record<string, T> {
  const map: Record<string, T> = {};
  for (const item of arr) {
    if (item && item.id) {
      map[item.id] = item;
    }
  }
  return map;
}

/**
 * Executes a Realtime Database query with short timeout and fallback
 */
async function rtdbGetWithFallback<T>(path: string, fallback: T, timeoutMs: number = 1800): Promise<T> {
  if (!isFirebaseConfigured || !rtdb) {
    return fallback;
  }

  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });

  try {
    const fetchPromise = (async () => {
      const snap = await get(dbRef(rtdb, path));
      if (snap.exists()) {
        const val = snap.val();
        if (Array.isArray(fallback)) {
          return mapToArray(val, fallback) as unknown as T;
        }
        return val as T;
      }
      return fallback;
    })();

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (err) {
    clearTimeout(timer);
    console.warn(`RTDB read failed at path "${path}", using fallback:`, err);
    return fallback;
  }
}

/**
 * Non-blocking optimistic write to Firebase Realtime Database
 */
function rtdbSetBackground(path: string, data: any): void {
  if (!isFirebaseConfigured || !rtdb) return;
  setTimeout(async () => {
    try {
      if (rtdb) await set(dbRef(rtdb, path), data);
    } catch (e) {
      console.warn(`RTDB write skipped at "${path}":`, e);
    }
  }, 10);
}

function rtdbUpdateBackground(path: string, data: any): void {
  if (!isFirebaseConfigured || !rtdb) return;
  setTimeout(async () => {
    try {
      if (rtdb) await update(dbRef(rtdb, path), data);
    } catch (e) {
      console.warn(`RTDB update skipped at "${path}":`, e);
    }
  }, 10);
}

function rtdbRemoveBackground(path: string): void {
  if (!isFirebaseConfigured || !rtdb) return;
  setTimeout(async () => {
    try {
      if (rtdb) await remove(dbRef(rtdb, path));
    } catch (e) {
      console.warn(`RTDB remove skipped at "${path}":`, e);
    }
  }, 10);
}

// -------------------------------------------------------------
// BRAND SETTINGS
// -------------------------------------------------------------
export async function getBrandSettings(): Promise<BrandSettings> {
  const sanitize = (data: Partial<BrandSettings>): BrandSettings => {
    const def = DEFAULT_BRAND_SETTINGS.showcaseSpaces || [];
    const incoming = (data.showcaseSpaces && data.showcaseSpaces.length > 0) ? data.showcaseSpaces : def;
    // Keep user's exact customized showcase spaces (with any deleted or added photos preserved)
    const mergedSpaces = incoming.map((s) => ({ ...s }));
    // Only append any default occasions that are completely missing
    def.forEach((d) => {
      if (!mergedSpaces.some((m) => m.occasion === d.occasion || m.id === d.id)) {
        mergedSpaces.push(d);
      }
    });

    return {
      ...DEFAULT_BRAND_SETTINGS,
      ...data,
      showcaseSpaces: mergedSpaces,
    };
  };

  const local = sanitize(getLocalOrFallback(LS_BRAND, DEFAULT_BRAND_SETTINGS));
  const remote = await rtdbGetWithFallback<BrandSettings>('settings/brand', local);

  if (!remote || !remote.businessName) {
    // Seed initial brand to RTDB so console shows it
    rtdbSetBackground('settings/brand', DEFAULT_BRAND_SETTINGS);
    return local;
  }

  const merged = sanitize(remote);
  setLocal(LS_BRAND, merged);
  return merged;
}

export async function saveBrandSettings(settings: BrandSettings): Promise<void> {
  setLocal(LS_BRAND, settings);
  if (isFirebaseConfigured && rtdb) {
    try {
      await set(dbRef(rtdb, 'settings/brand'), settings);
    } catch (e) {
      console.warn('RTDB set skipped at "settings/brand":', e);
    }
  }
}

// -------------------------------------------------------------
// PRICING RULES
// -------------------------------------------------------------
export async function getPricingRules(): Promise<PricingRules> {
  const sanitize = (r: Partial<PricingRules>): PricingRules => {
    const weekend = r.weekendSurchargePercentage === 10 ? 0 : (r.weekendSurchargePercentage ?? 0);
    const peak = r.peakSeasonSurchargePercentage === 15 ? 0 : (r.peakSeasonSurchargePercentage ?? 0);
    const tax = r.taxPercentage === 5 ? 0 : (r.taxPercentage ?? 0);
    const service = r.serviceChargePercentage === 5 ? 0 : (r.serviceChargePercentage ?? 0);
    return {
      ...DEFAULT_PRICING_RULES,
      ...r,
      weekendSurchargePercentage: weekend,
      peakSeasonSurchargePercentage: peak,
      taxPercentage: tax,
      serviceChargePercentage: service,
      partitionFee: r.partitionFee !== undefined ? Math.max(0, Number(r.partitionFee) || 0) : 0,
    };
  };

  const local = sanitize(getLocalOrFallback(LS_RULES, DEFAULT_PRICING_RULES));
  const remote = await rtdbGetWithFallback<PricingRules>('settings/pricingRules', local);

  if (!remote) {
    rtdbSetBackground('settings/pricingRules', DEFAULT_PRICING_RULES);
    return local;
  }

  const merged = sanitize(remote);
  setLocal(LS_RULES, merged);
  return merged;
}

export async function savePricingRules(rules: PricingRules): Promise<void> {
  setLocal(LS_RULES, rules);
  rtdbSetBackground('settings/pricingRules', rules);
}

// -------------------------------------------------------------
// VENUE HALLS
// -------------------------------------------------------------
export async function getHalls(): Promise<Hall[]> {
  const local = getLocalOrFallback<Hall[]>(LS_HALLS, DEFAULT_HALLS);
  const remote = await rtdbGetWithFallback<Hall[]>('halls', local);

  if (!remote || remote.length === 0) {
    rtdbSetBackground('halls', arrayToMap(DEFAULT_HALLS));
    return local;
  }

  setLocal(LS_HALLS, remote);
  return remote;
}

export async function saveHall(hall: Hall): Promise<void> {
  const current = getLocalOrFallback<Hall[]>(LS_HALLS, DEFAULT_HALLS);
  const updated = current.some((h) => h.id === hall.id)
    ? current.map((h) => (h.id === hall.id ? hall : h))
    : [...current, hall];
  setLocal(LS_HALLS, updated);

  rtdbSetBackground(`halls/${hall.id}`, hall);
}

export async function deleteHall(id: string): Promise<void> {
  const current = getLocalOrFallback<Hall[]>(LS_HALLS, DEFAULT_HALLS);
  const updated = current.filter((h) => h.id !== id);
  setLocal(LS_HALLS, updated);

  rtdbRemoveBackground(`halls/${id}`);
}

// -------------------------------------------------------------
// CATERING PACKAGES & DISHES
// -------------------------------------------------------------
export async function getMenuPackages(): Promise<MenuPackage[]> {
  const local = getLocalOrFallback<MenuPackage[]>(LS_PACKAGES, DEFAULT_MENU_PACKAGES);
  const remote = await rtdbGetWithFallback<MenuPackage[]>('menuPackages', local);

  const source = (!remote || remote.length === 0) ? local : remote;
  const merged = DEFAULT_MENU_PACKAGES.map((defPkg) => {
    const existing = source.find((p) => p.id === defPkg.id);
    return existing ? { ...defPkg, ...existing } : defPkg;
  });
  source.forEach((p) => {
    if (!merged.some((m) => m.id === p.id)) merged.push(p);
  });

  setLocal(LS_PACKAGES, merged);
  return merged;
}

export async function saveMenuPackage(pkg: MenuPackage): Promise<void> {
  const current = getLocalOrFallback<MenuPackage[]>(LS_PACKAGES, DEFAULT_MENU_PACKAGES);
  const updated = current.some((p) => p.id === pkg.id)
    ? current.map((p) => (p.id === pkg.id ? pkg : p))
    : [...current, pkg];
  setLocal(LS_PACKAGES, updated);

  rtdbSetBackground(`menuPackages/${pkg.id}`, pkg);
}

export async function deleteMenuPackage(id: string): Promise<void> {
  const current = getLocalOrFallback<MenuPackage[]>(LS_PACKAGES, DEFAULT_MENU_PACKAGES);
  const updated = current.filter((p) => p.id !== id);
  setLocal(LS_PACKAGES, updated);

  rtdbRemoveBackground(`menuPackages/${id}`);
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const local = getLocalOrFallback<MenuItem[]>(LS_MENU_ITEMS, DEFAULT_MENU_ITEMS);
  const remote = await rtdbGetWithFallback<MenuItem[]>('menuItems', local);

  if (!remote || remote.length === 0) {
    rtdbSetBackground('menuItems', arrayToMap(DEFAULT_MENU_ITEMS));
    return local;
  }

  setLocal(LS_MENU_ITEMS, remote);
  return remote;
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  const current = getLocalOrFallback<MenuItem[]>(LS_MENU_ITEMS, DEFAULT_MENU_ITEMS);
  const updated = current.some((i) => i.id === item.id)
    ? current.map((i) => (i.id === item.id ? item : i))
    : [...current, item];
  setLocal(LS_MENU_ITEMS, updated);

  rtdbSetBackground(`menuItems/${item.id}`, item);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const current = getLocalOrFallback<MenuItem[]>(LS_MENU_ITEMS, DEFAULT_MENU_ITEMS);
  const updated = current.filter((i) => i.id !== id);
  setLocal(LS_MENU_ITEMS, updated);

  rtdbRemoveBackground(`menuItems/${id}`);
}

// -------------------------------------------------------------
// DECORATIONS & SERVICES
// -------------------------------------------------------------
export async function getDecorations(): Promise<DecorationOption[]> {
  const sanitizeDecs = (decs: DecorationOption[]): DecorationOption[] => {
    return decs.map((d) => {
      if (d.id === 'dec-stage-mughal' && (!d.image || d.image.includes('photo-1519741497674'))) {
        return { ...d, image: '/images/decor/barat-stage.jpg' };
      }
      if (d.id === 'dec-stage-walima-crystal' && (!d.image || d.image.includes('photo-1465495976277'))) {
        return { ...d, image: '/images/decor/walima-stage.jpg' };
      }
      if (d.id === 'dec-stage-mehendi-genda' && (!d.image || d.image.includes('photo-1519167758481'))) {
        return { ...d, image: '/images/decor/mehendi-stage.jpg' };
      }
      return d;
    });
  };

  const local = sanitizeDecs(getLocalOrFallback<DecorationOption[]>(LS_DECORATIONS, DEFAULT_DECORATIONS));
  const remote = await rtdbGetWithFallback<DecorationOption[]>('decorations', local);

  if (!remote || remote.length === 0) {
    rtdbSetBackground('decorations', arrayToMap(local));
    return local;
  }

  const merged = sanitizeDecs(remote);
  setLocal(LS_DECORATIONS, merged);
  return merged;
}

export async function saveDecoration(dec: DecorationOption): Promise<void> {
  const current = getLocalOrFallback<DecorationOption[]>(LS_DECORATIONS, DEFAULT_DECORATIONS);
  const updated = current.some((d) => d.id === dec.id)
    ? current.map((d) => (d.id === dec.id ? dec : d))
    : [...current, dec];
  setLocal(LS_DECORATIONS, updated);

  rtdbSetBackground(`decorations/${dec.id}`, dec);
}

export async function deleteDecoration(id: string): Promise<void> {
  const current = getLocalOrFallback<DecorationOption[]>(LS_DECORATIONS, DEFAULT_DECORATIONS);
  const updated = current.filter((d) => d.id !== id);
  setLocal(LS_DECORATIONS, updated);

  rtdbRemoveBackground(`decorations/${id}`);
}

export async function getOptionalServices(): Promise<OptionalService[]> {
  const sanitizeServices = (services: OptionalService[]): OptionalService[] =>
    services.map((s) => (s.id === 'srv-generator' ? { ...s, isMandatory: false } : s));

  const local = sanitizeServices(getLocalOrFallback<OptionalService[]>(LS_SERVICES, DEFAULT_SERVICES));
  const remote = await rtdbGetWithFallback<OptionalService[]>('services', local);

  if (!remote || remote.length === 0) {
    rtdbSetBackground('services', arrayToMap(DEFAULT_SERVICES));
    return local;
  }

  const sanitizedRemote = sanitizeServices(remote);
  setLocal(LS_SERVICES, sanitizedRemote);
  return sanitizedRemote;
}

export async function saveOptionalService(srv: OptionalService): Promise<void> {
  const current = getLocalOrFallback<OptionalService[]>(LS_SERVICES, DEFAULT_SERVICES);
  const updated = current.some((s) => s.id === srv.id)
    ? current.map((s) => (s.id === srv.id ? srv : s))
    : [...current, srv];
  setLocal(LS_SERVICES, updated);

  rtdbSetBackground(`services/${srv.id}`, srv);
}

export async function deleteOptionalService(id: string): Promise<void> {
  const current = getLocalOrFallback<OptionalService[]>(LS_SERVICES, DEFAULT_SERVICES);
  const updated = current.filter((s) => s.id !== id);
  setLocal(LS_SERVICES, updated);

  rtdbRemoveBackground(`services/${id}`);
}

// -------------------------------------------------------------
// BOOKING REQUESTS & QUOTATIONS
// -------------------------------------------------------------
function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MRQ-${year}-${randomNum}`;
}

export async function createBookingRequest(
  data: Omit<BookingRequest, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory' | 'totalPaid' | 'outstandingBalance' | 'payments'>
): Promise<BookingRequest> {
  const id = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const referenceNumber = generateReferenceNumber();
  const now = new Date().toISOString();

  const holdExpiry = new Date();
  holdExpiry.setDate(holdExpiry.getDate() + 7);

  const newBooking: BookingRequest = {
    ...data,
    id,
    referenceNumber,
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    holdExpiresAt: holdExpiry.toISOString(),
    statusHistory: [
      {
        status: 'pending',
        changedAt: now,
        changedBy: 'Customer (Web Portal)',
        reason: 'Initial booking request submitted',
      },
    ],
    totalPaid: 0,
    outstandingBalance: data.totalQuotationAmount,
    payments: [],
  };

  // Local storage save immediately
  const currentBookings = getLocalOrFallback<BookingRequest[]>(LS_BOOKINGS, []);
  const cleanCurrent = (currentBookings || []).filter(
    (b) => b && b.id && !b.id.startsWith('booking-oct-') && !b.id.startsWith('booking-shahi-')
  );
  setLocal(LS_BOOKINGS, [newBooking, ...cleanCurrent]);

  // Realtime Database save
  rtdbSetBackground(`bookings/${id}`, newBooking);

  // Instant notification to all active browser tabs
  broadcastBookingsChange(newBooking);

  return newBooking;
}

export function broadcastBookingsChange(booking?: BookingRequest): void {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('marquee:bookings-updated', { detail: booking }));
    }
  } catch {
    // Ignore non-browser environments
  }
}

export function onBookingsChanged(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handleCustom = () => callback();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === LS_BOOKINGS) callback();
  };
  window.addEventListener('marquee:bookings-updated', handleCustom);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener('marquee:bookings-updated', handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

export async function getAllBookings(): Promise<BookingRequest[]> {
  const isReal = (b: BookingRequest) => b && b.id && !b.id.startsWith('booking-oct-') && !b.id.startsWith('booking-shahi-');
  const localList = getLocalOrFallback<BookingRequest[]>(LS_BOOKINGS, []);
  const cleanLocal = (localList || []).filter(isReal);

  // Fast timeout (400ms if local exists, else 1200ms) so UI never hangs
  const timeoutMs = cleanLocal.length > 0 ? 400 : 1200;
  const remote = await rtdbGetWithFallback<BookingRequest[]>('bookings', cleanLocal, timeoutMs);
  const cleanRemote = (remote || []).filter(isReal);

  // MERGE cleanLocal and cleanRemote by ID so newest local bookings are never wiped out or lost
  const mergedMap = new Map<string, BookingRequest>();
  cleanRemote.forEach((b) => { if (b && b.id) mergedMap.set(b.id, b); });
  cleanLocal.forEach((b) => { if (b && b.id) mergedMap.set(b.id, b); });
  const merged = Array.from(mergedMap.values());

  setLocal(LS_BOOKINGS, merged);
  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBookingById(id: string): Promise<BookingRequest | null> {
  const isReal = (b: BookingRequest) => b && b.id && !b.id.startsWith('booking-oct-') && !b.id.startsWith('booking-shahi-');
  const localList = getLocalOrFallback<BookingRequest[]>(LS_BOOKINGS, []);
  const cleanLocal = (localList || []).filter(isReal);
  const localFound = cleanLocal.find((b) => b.id === id) || null;

  const remote = await rtdbGetWithFallback<BookingRequest | null>(`bookings/${id}`, localFound, 600);
  if (remote && isReal(remote)) return remote;
  return localFound;
}

export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
  changedBy: string,
  reason?: string,
  customHoldExpiresAt?: string
): Promise<{ success: boolean; message?: string }> {
  const all = await getAllBookings();
  const target = all.find((b) => b.id === id);
  if (!target) {
    return { success: false, message: 'Booking not found' };
  }

  // Conflict check if attempting to approve or confirm
  if (newStatus === 'confirmed' || newStatus === 'approved') {
    const conflict = checkBookingConflict(
      {
        hallId: target.hallId,
        eventDate: target.eventDate,
        timeSlot: target.timeSlot,
        excludeBookingId: target.id,
      },
      all
    );

    if (conflict.hasConflict) {
      return {
        success: false,
        message: conflict.reason || 'Conflict detected: Hall is already confirmed for this date and time slot.',
      };
    }
  }

  const now = new Date().toISOString();
  const updatedHistory = [
    ...target.statusHistory,
    {
      status: newStatus,
      changedAt: now,
      changedBy,
      reason,
    },
  ];

  const updatedBooking: BookingRequest = {
    ...target,
    status: newStatus,
    updatedAt: now,
    statusHistory: updatedHistory,
    holdExpiresAt: customHoldExpiresAt !== undefined ? customHoldExpiresAt : target.holdExpiresAt,
  };

  // Update in local storage immediately
  const updatedList = all.map((b) => (b.id === id ? updatedBooking : b));
  setLocal(LS_BOOKINGS, updatedList);

  // Background update in Realtime Database
  rtdbUpdateBackground(`bookings/${id}`, {
    status: newStatus,
    updatedAt: now,
    statusHistory: updatedHistory,
    holdExpiresAt: updatedBooking.holdExpiresAt,
  });

  // Notify listeners
  broadcastBookingsChange(updatedBooking);

  return { success: true };
}

export async function addPaymentToBooking(
  bookingId: string,
  payment: Omit<PaymentRecord, 'id'>
): Promise<{ success: boolean; updatedBooking?: BookingRequest; message?: string }> {
  const all = await getAllBookings();
  const target = all.find((b) => b.id === bookingId);
  if (!target) {
    return { success: false, message: 'Booking not found' };
  }

  const newPayment: PaymentRecord = {
    ...payment,
    id: `pay_${Date.now()}`,
  };

  const updatedPayments = [...(target.payments || []), newPayment];
  const newTotalPaid = updatedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const newOutstanding = Math.max(0, target.totalQuotationAmount - newTotalPaid);

  const updatedBooking: BookingRequest = {
    ...target,
    payments: updatedPayments,
    totalPaid: newTotalPaid,
    outstandingBalance: newOutstanding,
    updatedAt: new Date().toISOString(),
  };

  const updatedList = all.map((b) => (b.id === bookingId ? updatedBooking : b));
  setLocal(LS_BOOKINGS, updatedList);

  rtdbUpdateBackground(`bookings/${bookingId}`, {
    payments: updatedPayments,
    totalPaid: newTotalPaid,
    outstandingBalance: newOutstanding,
    updatedAt: updatedBooking.updatedAt,
  });

  broadcastBookingsChange(updatedBooking);

  return { success: true, updatedBooking };
}

export async function uploadImageFile(file: File, path: string): Promise<string> {
  if (isFirebaseConfigured && storage) {
    try {
      const storageRefInstance = storageRef(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRefInstance, file);
      return await getDownloadURL(storageRefInstance);
    } catch (err) {
      console.warn('Firebase Storage upload failed, falling back to local object URL:', err);
    }
  }

  // Fallback to local Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function deleteBooking(id: string): Promise<void> {
  const all = getLocalOrFallback<BookingRequest[]>(LS_BOOKINGS, DEFAULT_BOOKINGS);
  const updated = all.filter((b) => b.id !== id);
  setLocal(LS_BOOKINGS, updated);

  rtdbRemoveBackground(`bookings/${id}`);
}

export async function resetToDefaultData(): Promise<void> {
  setLocal(LS_BRAND, DEFAULT_BRAND_SETTINGS);
  setLocal(LS_RULES, DEFAULT_PRICING_RULES);
  setLocal(LS_HALLS, DEFAULT_HALLS);
  setLocal(LS_PACKAGES, DEFAULT_MENU_PACKAGES);
  setLocal(LS_MENU_ITEMS, DEFAULT_MENU_ITEMS);
  setLocal(LS_DECORATIONS, DEFAULT_DECORATIONS);
  setLocal(LS_SERVICES, DEFAULT_SERVICES);
  setLocal(LS_BOOKINGS, DEFAULT_BOOKINGS);

  rtdbSetBackground('settings/brand', DEFAULT_BRAND_SETTINGS);
  rtdbSetBackground('settings/pricingRules', DEFAULT_PRICING_RULES);
  rtdbSetBackground('halls', arrayToMap(DEFAULT_HALLS));
  rtdbSetBackground('menuPackages', arrayToMap(DEFAULT_MENU_PACKAGES));
  rtdbSetBackground('menuItems', arrayToMap(DEFAULT_MENU_ITEMS));
  rtdbSetBackground('decorations', arrayToMap(DEFAULT_DECORATIONS));
  rtdbSetBackground('services', arrayToMap(DEFAULT_SERVICES));
  rtdbSetBackground('bookings', arrayToMap(DEFAULT_BOOKINGS));
}

// -------------------------------------------------------------
// CONTACT INQUIRIES & WALKTHROUGH LEADS
// -------------------------------------------------------------

export async function getAllContactInquiries(): Promise<ContactInquiry[]> {
  const local = getLocalOrFallback<ContactInquiry[]>(LS_INQUIRIES, []);
  try {
    const remote = await rtdbGetWithFallback<ContactInquiry[]>('inquiries', local);
    return Array.isArray(remote) ? remote.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : local;
  } catch {
    return local;
  }
}

export async function createContactInquiry(
  data: Omit<ContactInquiry, 'id' | 'referenceNumber' | 'createdAt' | 'status'>
): Promise<ContactInquiry> {
  const id = `inq-${Date.now()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNumber = `INQ-${new Date().getFullYear()}-${randomSuffix}`;
  const createdAt = new Date().toISOString();

  const newInquiry: ContactInquiry = {
    ...data,
    id,
    referenceNumber,
    status: 'new',
    createdAt,
  };

  const all = getLocalOrFallback<ContactInquiry[]>(LS_INQUIRIES, []);
  all.unshift(newInquiry);
  setLocal(LS_INQUIRIES, all);

  rtdbSetBackground(`inquiries/${id}`, newInquiry);

  return newInquiry;
}

export async function updateContactInquiryStatus(
  id: string,
  status: ContactInquiry['status']
): Promise<void> {
  const all = getLocalOrFallback<ContactInquiry[]>(LS_INQUIRIES, []);
  const updated = all.map((inq) => (inq.id === id ? { ...inq, status } : inq));
  setLocal(LS_INQUIRIES, updated);

  rtdbUpdateBackground(`inquiries/${id}`, { status });
}

export async function deleteContactInquiry(id: string): Promise<void> {
  const all = getLocalOrFallback<ContactInquiry[]>(LS_INQUIRIES, []);
  const updated = all.filter((inq) => inq.id !== id);
  setLocal(LS_INQUIRIES, updated);

  rtdbRemoveBackground(`inquiries/${id}`);
}
