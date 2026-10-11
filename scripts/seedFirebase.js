import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import {
  DEFAULT_BRAND_SETTINGS,
  DEFAULT_HALLS,
  DEFAULT_MENU_PACKAGES,
  DEFAULT_MENU_ITEMS,
  DEFAULT_DECORATIONS,
  DEFAULT_SERVICES,
  DEFAULT_PRICING_RULES,
} from './seedData.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBeGs9Za2M34hsrGNCFjj8-0jos4hEWS5I",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "whitelablebooking.firebaseapp.com",
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://whitelablebooking-default-rtdb.firebaseio.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "whitelablebooking",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "whitelablebooking.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "361948078049",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:361948078049:web:54bf5d1aab0cd772c83ca0",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2HYRWGXNPT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const arrayToMap = (arr) => {
  const map = {};
  for (const item of arr) {
    if (item && item.id) map[item.id] = item;
  }
  return map;
};

async function runSeed() {
  console.log(`🚀 Seeding Pakistani Marquee calculator data into Firebase RTDB (${firebaseConfig.databaseURL})...`);

  // 1. Brand settings
  await set(ref(db, 'settings/brand'), DEFAULT_BRAND_SETTINGS);
  console.log('✔ Brand settings seeded with Pakistani traditions & currency (Rs. / PKR).');

  // 2. Pricing Rules
  await set(ref(db, 'settings/pricingRules'), DEFAULT_PRICING_RULES);
  console.log('✔ Pricing rules seeded with Pakistani peak wedding season & clean rates.');

  // 3. Halls
  await set(ref(db, 'halls'), arrayToMap(DEFAULT_HALLS));
  console.log(`✔ ${DEFAULT_HALLS.length} Halls seeded (Mughal Shahi, Crystal Glasshouse, Jasmine Lawn).`);

  // 4. Menu Packages
  await set(ref(db, 'packages'), arrayToMap(DEFAULT_MENU_PACKAGES));
  console.log(`✔ ${DEFAULT_MENU_PACKAGES.length} Menu Packages seeded (Shahi Barat, Walima Imperial, One-Dish VIP, Mehendi Carnival).`);

  // 5. Menu Items
  await set(ref(db, 'menuItems'), arrayToMap(DEFAULT_MENU_ITEMS));
  console.log(`✔ ${DEFAULT_MENU_ITEMS.length} Menu Items seeded (Biryani, Kunna, Shinwari, Roghani Naan, Kashmiri Chai, Jalebi).`);

  // 6. Decorations
  await set(ref(db, 'decorations'), arrayToMap(DEFAULT_DECORATIONS));
  console.log(`✔ ${DEFAULT_DECORATIONS.length} Stage & Ambience Décor options seeded.`);

  // 7. Optional Services
  await set(ref(db, 'services'), arrayToMap(DEFAULT_SERVICES));
  console.log(`✔ ${DEFAULT_SERVICES.length} Services seeded (300kVA Generator, Dhol & Shehnai, AC/Heating, Bridal Suite).`);

  console.log('🎉 Seed complete! All calculator catalog data successfully stored in Firebase DB.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
