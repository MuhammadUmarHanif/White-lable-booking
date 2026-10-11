import { BrandSettings, Hall, MenuItem, MenuPackage, DecorationOption, OptionalService, PricingRules, BookingRequest } from '../types';

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  businessName: 'Elysian Grand Marquee ',
  legalEntityName: 'Elysian Hospitality & Event Banquets Pvt Ltd (Pakistan)',
  tagline: 'Where Mughal Grandeur Meets Regal Pakistani Celebrations',
  logoUrl: '/favicon.svg',
  primaryColor: '#D4AF37', // Regal Antique Gold
  secondaryColor: '#1C1917', // Deep Royal Charcoal
  accentColor: '#997A15',
  contactEmail: 'concierge@elysiangrand.pk',
  contactPhone: '+92 (300) 845-6789',
  whatsappNumber: '923008456789',
  address: 'Main Bedian Road, Adjacent DHA Phase 6 / Club Avenue, Cantt, Lahore, Pakistan',
  googleMapsUrl: 'https://maps.google.com',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
  },
  businessHours: 'Mon - Sun: 11:00 AM – 11:30 PM (Govt. Banquet Timing Compliant)',
  heroHeadline: 'Pakistan’s Premier Luxury Marquee for Barat, Walima & Mehendi',
  heroSubheadline: 'Step into a regal sanctuary of pillarless Mughal architecture, authentic Shahi Dastarkhwan banquets, and 100% uninterrupted generator power.',
  heroImages: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=80',
  ],
  aboutText: 'Crafted for distinguished Pakistani families, Elysian Grand Marquee presents an unmatched blend of 35-foot pillarless acoustic architecture, 100% Halal gourmet kitchens, dedicated pardah/segregation partitions when requested, and dual 300kVA soundproof generator backup. Whether hosting a Barat procession of 1,000 guests, an elegant Walima feast, or a colorful Mehendi night, our venue guarantees timeless elegance.',
  aboutHighlights: [
    '50,000 sq.ft. Pillarless Grand Hall with 32ft High Acoustic Ceilings',
    '100% Guaranteed Uninterrupted Dual 300kVA Heavy-Duty Generator Power',
    'Certified 100% Halal Master Kitchens & Live Degi / Charcoal BBQ Stations',
    'Dedicated Royal Bridal Dressing Suites with Attached Vanity & Safe Locker',
    'Valet Parking for 500+ Vehicles with Licensed Armed Security Personnel',
    'Optional Elegant Islamic Segregation / Pardah Partition Architecture'
  ],
  currencySymbol: 'Rs.',
  currencyCode: 'PKR',
  showcaseSpaces: [
    {
      id: 'space-barat',
      title: 'The Grand Shahi Barat',
      badge: 'Royal Wedding Procession',
      subtitle: '32ft crystal chandeliers, dramatic royal aisle illumination & grand ballroom',
      category: 'BARAT CEREMONY • FLAGSHIP PILLARLESS BALLROOM',
      occasion: 'barat',
      hallId: 'hall-mughal-shahi',
      rentPrice: 280000,
      perPersonPrice: 2800,
      description: 'Our crown jewel pillarless ballroom engineered for grand Barat processions. Features dual bridal and groom vanity suites, red royal aisle carpet, heavy backup generators, and certified Halal Shahi Dastarkhwan master kitchens.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Pillarless 1,200 Capacity', 'Dual Presidential Suites', 'Live Mutton Kunna Degi', '300kVA Heavy Generator Backup'],
      link: '/calculator?eventType=barat&hall=hall-mughal-shahi',
    },
    {
      id: 'space-walima',
      title: 'The Regal Walima Reception',
      badge: 'Gala Dinner & Reception',
      subtitle: 'Italian fountain courtyard, crystal glasshouse & sophisticated ambience',
      category: 'WALIMA RECEPTION • GLASS ARCHITECTURE & COURTYARD',
      occasion: 'walima',
      hallId: 'hall-crystal-courtyard',
      rentPrice: 220000,
      perPersonPrice: 2500,
      description: 'A modern European glasshouse pavilion overlooking candlelit fountain gardens. Perfect for sophisticated Walima dinners with live carving counters, continental and Mughlai fusion menus, and ambient ivory lighting.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Glass Architecture & Fountain Deck', 'Warm Fairy Light Canopies', 'Live BBQ & Dessert Parlor', '600 Guest Capacity'],
      link: '/calculator?eventType=walima&hall=hall-crystal-courtyard',
    },
    {
      id: 'space-mehendi',
      title: 'The Festive Mehendi & Mayun',
      badge: 'Colors, Flora & Music',
      subtitle: 'Fresh marigold decor, ceremonial jhoola swing & high-energy acoustics',
      category: 'MEHENDI & MAYUN • ROYAL JASMINE LAWN & COURTYARD',
      occasion: 'mehendi',
      hallId: 'hall-jasmine-lawn',
      rentPrice: 180000,
      perPersonPrice: 2200,
      description: 'Lush natural grass terrace draped in vibrant marigold canopies, festive low-seating dastarkhwan, and concert-grade acoustics designed for high-energy Mehendi dance entries and live Sufi Qawwali nights.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Fresh Marigold Jhoola Swing', 'Live Hot Jalebi & Chaat Stations', 'Qawwali Concert Acoustics', '450 Guest Capacity'],
      link: '/calculator?eventType=mehendi&hall=hall-jasmine-lawn',
    },
    {
      id: 'space-dholki',
      title: 'The Traditional Dholki & Sangeet',
      badge: 'Intimate Family Heritage',
      subtitle: 'Live Punjabi dhol masters, cozy gaddi seating & street food bazaar',
      category: 'DHOLKI & SANGEET • ROYAL PERGOLA & BANQUET TERRACE',
      occasion: 'dholki',
      hallId: 'hall-jasmine-lawn',
      rentPrice: 140000,
      perPersonPrice: 1950,
      description: 'An intimate, high-vibe family space setup with traditional floor gaddi dastarkhwan, Punjabi dhol artists, steaming Kashmiri chai, and live street-food snack counters for your pre-wedding musical memories.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Team of 4 Punjabi Dhol Masters', 'Traditional Floor Gaddi Seating', 'Live Gol Gappa & Chai Stalls', 'Intimate 250 Guest Setup'],
      link: '/calculator?eventType=dholki&hall=hall-jasmine-lawn',
    },
    {
      id: 'space-nikah',
      title: 'The Sacred Nikah Ceremony',
      badge: 'Sacred Vows & Serenity',
      subtitle: 'Peaceful acoustic glasshouse, pure white floral canopy & daylight reception',
      category: 'NIKAH CEREMONY • FOUNTAIN GLASS PAVILION',
      occasion: 'nikah',
      hallId: 'hall-crystal-courtyard',
      rentPrice: 120000,
      perPersonPrice: 1800,
      description: 'A serene spiritual setting with pure white florals, delicate crystal accents, quiet acoustic zoning, and daylight fountain garden views designed for an intimate Nikah ceremony.',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Daylight Glasshouse Ambience', 'White Floral Nikah Canopy', 'Delicate Live Shehnai / Flute', '300 Guest Seating'],
      link: '/calculator?eventType=nikah&hall=hall-crystal-courtyard',
    },
    {
      id: 'space-qawwali',
      title: 'Sufi Qawwali & Musical Gala',
      badge: 'Acoustic Ambience & Melody',
      subtitle: 'Concert acoustics, royal takht diwan seating, steaming chai & rich Awadhi feast',
      category: 'QAWWALI NIGHT • REGAL CONCERT BALLROOM',
      occasion: 'qawwali_sufi',
      hallId: 'hall-mughal-shahi',
      rentPrice: 160000,
      perPersonPrice: 2100,
      description: 'Grand acoustic hall designed with raised U-shaped carpeted diwan seating, warm brass candle lanterns, stage for live Ustad Qawwals, and late-night steaming Kashmiri chai with rich Awadhi korma.',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Studio Sound Acoustic Damping', 'Royal Takht Diwan Seating', 'Live Clay Tandoor & Chai Bar', '500 Guest Capacity'],
      link: '/calculator?eventType=qawwali_sufi&hall=hall-mughal-shahi',
    },
    {
      id: 'space-engagement',
      title: 'Engagement & Mangni Ceremony',
      badge: 'Intimate Gathering & Rings',
      subtitle: 'Artisanal floral photo rings, live finger food and contemporary dinner',
      category: 'ENGAGEMENT • CRYSTAL COURTYARD SUITE',
      occasion: 'engagement_mangni',
      hallId: 'hall-crystal-courtyard',
      rentPrice: 150000,
      perPersonPrice: 1900,
      description: 'Chic modern banquet suite with customized ring exchange stage, glowing neon monograms, fresh pastel flower arches, and artisanal welcome drinks for family and close friends.',
      image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Floral Ring Exchange Stage', 'Artisanal Welcome Mocktails', 'Pastel Dining Tables', '350 Guest Capacity'],
      link: '/calculator?eventType=engagement_mangni&hall=hall-crystal-courtyard',
    },
    {
      id: 'space-birthday',
      title: 'Birthday & Milestone Celebration Gala',
      badge: 'Celebrations & Milestones',
      subtitle: 'Festive thematic stage, live barbecue, sliders, ice cream and dynamic lighting',
      category: 'BIRTHDAY & MILESTONE • JASMINE LAWN & BANQUET',
      occasion: 'birthday',
      hallId: 'hall-jasmine-lawn',
      rentPrice: 130000,
      perPersonPrice: 1750,
      description: 'High energy luxury birthday and anniversary celebration space with theatrical intelligent lighting, photo booths, live burger sliders and chaat stations, and custom dessert tables.',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1600&q=85',
      images: [
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=85',
      ],
      highlights: ['Thematic Stage & Backdrop', 'Live Sliders & Chaat Stalls', 'Dynamic Sound & DJ Setup', '250 Guest Capacity'],
      link: '/calculator?eventType=birthday&hall=hall-jasmine-lawn',
    },
  ],
};

export const DEFAULT_HALLS: Hall[] = [
  {
    id: 'hall-mughal-shahi',
    name: 'The Mughal Shahi Grand Ballroom',
    description: 'Our flagship pillarless luxury ballroom featuring 32ft crystal chandeliers, dramatic royal aisle lighting, and a panoramic stage designed for royal Barat and Walima celebrations.',
    minCapacity: 350,
    maxCapacity: 1200,
    minBillableGuests: 400,
    baseRentalPrice: 280000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pillarless Layout', 'Dual Private Bridal Suites', 'VIP Executive Lounge', '4K LED Stage Walls', 'Full Central AC', 'Segregation Ready'],
    isIndoor: true,
    isActive: true,
  },
  {
    id: 'hall-crystal-courtyard',
    name: 'The Crystal Glasshouse & Courtyard',
    description: 'A modern glasshouse-inspired marquee overlooking manicured Italian fountains and evening candlelit gardens, perfect for Walima receptions and daytime Nikah feasts.',
    minCapacity: 200,
    maxCapacity: 600,
    minBillableGuests: 250,
    baseRentalPrice: 190000,
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Glass Roof Architecture', 'Fountain Courtyard', 'Warm String Lighting', 'Open-Air Lawn Deck', 'Private Green Room'],
    isIndoor: true,
    isActive: true,
  },
  {
    id: 'hall-jasmine-lawn',
    name: 'The Royal Jasmine Lawn & Pergola',
    description: 'A festive luxury open-air terrace with ivory pergolas, lush botanical backdrops, and starlit canopies ideal for vibrant Mehendi, Mayun, and Qawwali nights.',
    minCapacity: 100,
    maxCapacity: 450,
    minBillableGuests: 150,
    baseRentalPrice: 140000,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Ivory Canopies', 'Outdoor Heater Stations', 'Custom Fire Pits', 'Acoustic Sound Zones', 'Festive Jhoola Setup'],
    isIndoor: false,
    isActive: true,
  }
];

export const DEFAULT_MENU_PACKAGES: MenuPackage[] = [
  {
    id: 'pkg-shahi-barat',
    name: 'Shahi Barat Dastarkhwan',
    tagline: 'Traditional royal feast crafted for the quintessential grand Pakistani wedding ceremony.',
    pricePerPerson: 2800,
    description: 'Complete royal menu featuring slow-braised Awadhi mutton, aromatic Degi biryani, live tandoor breads, and traditional Kashmiri chai.',
    isPopular: true,
    includedDishIds: ['m-soup-hot-sour', 'm-reshmi-kebab', 'm-mutton-roghan', 'm-chicken-karahi', 'm-mutton-biryani', 'm-roghani-naan', 'm-gajar-halwa', 'm-kashmiri-chai', 'm-mint-margarita'],
    courseHighlights: [
      { title: 'Welcome Drinks & Starters', items: ['Fresh Mint Margarita', 'Chicken Reshmi Seekh Kebabs', 'Crispy Dahi Puri & Mint Chutney'] },
      { title: 'The Royal Main Course', items: ['Slow-Cooked Mutton Roghan Josh (Prime Cut)', 'Desi Ghee Chicken Shinwari Karahi', 'Special Mutton Degi Biryani with Fried Onions', 'Clay-Oven Live Roghani & Garlic Naan'] },
      { title: 'Shahi Meetha & Chai', items: ['Warm Gajar Ka Halwa with Pure Khoya', 'Traditional Gulab Jamun', 'Signature Kashmiri Pink Chai with Pistachio & Badam'] }
    ],
    isActive: true,
  },
  {
    id: 'pkg-walima-imperial',
    name: 'Walima Royal Reception Banquet',
    tagline: 'Sophisticated continental & Mughlai blend curated for premier wedding receptions.',
    pricePerPerson: 2500,
    description: 'Expanded luxury spread featuring tender Mutton Kunna, Chicken Malai Sajji, Fish Tikka, and live Jalebi station.',
    isPopular: false,
    includedDishIds: ['m-fish-tikka', 'm-malai-boti', 'm-mutton-kunna', 'm-chicken-sajji', 'm-sindhi-biryani', 'm-taftan', 'm-shahi-tukda', 'm-kheer', 'm-kashmiri-chai', 'm-jalebi-live'],
    courseHighlights: [
      { title: 'Appetizers & Live Grills', items: ['Charcoal Grilled Fish Tikka', 'Afghani Malai Boti', 'Fresh Garden Salad & Zeera Raita', 'Artisanal Mocktails'] },
      { title: 'Grand Entrées & Carving', items: ['Mughlai Mutton Kunna (Clay Pot)', 'Whole Roast Chicken Malai Sajji', 'Hyderabadi Dum Mutton Biryani', 'Sesame Roghani Naan & Traditional Taftan'] },
      { title: 'Dessert Galleria', items: ['Shahi Tukda with Chandi Ka Warq', 'Zafrani Kheer Thali', 'Live Hot Crispy Jalebi Counter', 'Kashmiri Saffron Doodh Patti'] }
    ],
    isActive: true,
  },
  {
    id: 'pkg-mehendi-festive',
    name: 'Mehendi & Mayun Live Street Carnival',
    tagline: 'Vibrant live food streets with barbecue, gol gappay, chaat, and desi delicacies.',
    pricePerPerson: 2200,
    description: 'Informal interactive dining with live BBQ stations, street food counters, paratha rolls, and jalebi.',
    isPopular: false,
    includedDishIds: ['m-malai-boti', 'm-reshmi-kebab', 'm-gol-gappay', 'm-chicken-karahi', 'm-jalebi-live', 'm-kashmiri-chai'],
    courseHighlights: [
      { title: 'Live Street Counters', items: ['Live Gol Gappay with Khatta & Meetha Paani', 'Dahi Bhallay & Papri Chaat Counter', 'Chicken Bihari & Reshmi Kebabs'] },
      { title: 'Buffet Entrées', items: ['Boneless Chicken Handi Makhni', 'Puri Paratha Rolls', 'Vegetable Fried Rice & Manchurian'] },
      { title: 'Mehendi Sweets', items: ['Live Crispy Thin Jalebi Counter', 'Kashmiri Chai & Karak Chai'] }
    ],
    isActive: true,
  },
  {
    id: 'pkg-qawwali-sufi',
    name: 'Sufi Qawwali Musical Gala Feast',
    tagline: 'Rich Awadhi Degi mutton korma, saffron pulao, live tandoor and hot doodh patti chai.',
    pricePerPerson: 2100,
    description: 'Acoustic night dining with slow-simmered Awadhi korma, charcoal kebabs, and continuous hot chai station.',
    isPopular: false,
    includedDishIds: ['m-mutton-roghan', 'm-reshmi-kebab', 'm-sindhi-biryani', 'm-roghani-naan', 'm-kashmiri-chai'],
    courseHighlights: [
      { title: 'Live Kebab Stations', items: ['Hot Charcoal Chicken Reshmi Kebabs', 'Crispy Dahi Bhallay'] },
      { title: 'Royal Entrées', items: ['Slow-Cooked Mutton Roghan Josh', 'Zafrani Pulao', 'Clay-Oven Live Roghani Naan'] },
      { title: 'Late-Night Sips', items: ['Traditional Badami Kheer Cups', 'Steaming Doodh Patti Karak Chai'] }
    ],
    isActive: true,
  },
  {
    id: 'pkg-engagement-mangni',
    name: 'Royal Engagement & Mangni Banquet',
    tagline: 'Elegant contemporary spread featuring chicken handi makhni, fish tikka, and dessert bar.',
    pricePerPerson: 1900,
    description: 'Modern sophisticated menu crafted for intimate family celebrations and ring ceremonies.',
    isPopular: false,
    includedDishIds: ['m-fish-tikka', 'm-chicken-karahi', 'm-chicken-biryani', 'm-roghani-naan', 'm-gulab-jamun', 'm-mint-margarita'],
    courseHighlights: [
      { title: 'Welcome Drinks & Starters', items: ['Iced Garden Mint Margarita', 'Sole Fish Tikka Skewers'] },
      { title: 'Family Dining Main Course', items: ['Boneless Chicken Handi Makhni', 'Sindhi Chicken Dum Biryani', 'Fresh Roghani Naan'] },
      { title: 'Dessert Station', items: ['Warm Pistachio Gulab Jamun', 'Kashmiri Pink Tea'] }
    ],
    isActive: true,
  },
  {
    id: 'pkg-birthday-milestone',
    name: 'Birthday & Milestone Celebration Feast',
    tagline: 'Fun celebration feast with barbecue sliders, live pizza & chaat, fried rice and ice cream.',
    pricePerPerson: 1750,
    description: 'High energy celebratory buffet packed with interactive live counters and crowd favorites.',
    isPopular: false,
    includedDishIds: ['m-malai-boti', 'm-gol-gappay', 'm-chicken-karahi', 'm-roghani-naan', 'm-jalebi-live'],
    courseHighlights: [
      { title: 'Live Street & Fast Counters', items: ['Live Gol Gappay Counter', 'Charcoal Grilled Malai Boti', 'Mini Burger Sliders'] },
      { title: 'Celebration Buffet', items: ['Chicken Shinwari Karahi', 'Egg Fried Rice & Manchurian', 'Sesame Naan'] },
      { title: 'Party Desserts', items: ['Live Hot Crispy Jalebi', 'Ice Cream & Mocktails'] }
    ],
    isActive: true,
  },
  {
    id: 'pkg-one-dish-vip',
    name: 'One-Dish VIP Feast (Govt. Compliant)',
    tagline: 'Refined single-dish banquet complying with government provincial banquet regulations.',
    pricePerPerson: 2650,
    description: 'Premium compliant 1-main course package without compromising on luxury taste, generous servings, or presentation.',
    isPopular: false,
    includedDishIds: ['m-mutton-roghan', 'm-chicken-biryani', 'm-roghani-naan', 'm-kheer', 'm-kashmiri-chai'],
    courseHighlights: [
      { title: 'Welcome Refreshments', items: ['Iced Mint Lemonade / Cold Drinks & Mineral Water'] },
      { title: 'One-Dish Main Course (Choice of Mutton or Biryani)', items: ['Slow-Cooked Mutton Qorma OR Degi Mutton Biryani', 'Fresh Clay-Oven Roghani Naan', 'Fresh Kachumber Salad & Zeera Raita'] },
      { title: 'Dessert & Warm Beverage', items: ['Traditional Pistachio Kheer Cups', 'Warm Kashmiri Doodh Patti Chai'] }
    ],
    isActive: true,
  }
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // Starters
  { id: 'm-soup-hot-sour', name: 'Desi Chicken Corn & Hot & Sour Soup', category: 'starters', pricePerPerson: 250, dietary: ['halal'], isActive: true },
  { id: 'm-reshmi-kebab', name: 'Royal Chicken Reshmi Seekh Kebabs', category: 'starters', pricePerPerson: 450, dietary: ['halal'], isActive: true },
  { id: 'm-malai-boti', name: 'Charcoal Grilled Malai Boti Skewers', category: 'starters', pricePerPerson: 500, dietary: ['halal'], isActive: true },
  { id: 'm-fish-tikka', name: 'Crispy Crusted Rahu / Sole Fish Tikka', category: 'starters', pricePerPerson: 650, dietary: ['halal'], isActive: true },
  { id: 'm-gol-gappay', name: 'Live Gol Gappay & Papri Chaat Station', category: 'starters', pricePerPerson: 300, dietary: ['vegetarian', 'halal'], isActive: true },

  // Mains
  { id: 'm-mutton-roghan', name: 'Slow-Cooked Mutton Roghan Josh (Prime Cuts)', category: 'mains', pricePerPerson: 950, dietary: ['halal'], isActive: true },
  { id: 'm-mutton-kunna', name: 'Mughlai Mutton Kunna (Chinioti Clay Pot)', category: 'mains', pricePerPerson: 1050, dietary: ['halal'], isActive: true },
  { id: 'm-chicken-karahi', name: 'Desi Ghee Chicken Shinwari Karahi', category: 'mains', pricePerPerson: 600, dietary: ['halal'], isActive: true },
  { id: 'm-chicken-sajji', name: 'Balochi Chicken Sajji with Roasted Rice', category: 'mains', pricePerPerson: 700, dietary: ['halal'], isActive: true },
  { id: 'm-beef-nihari', name: 'Dum Pukht Shahi Beef Nihari with Ginger & Chili', category: 'mains', pricePerPerson: 750, dietary: ['halal'], isActive: true },
  { id: 'm-palak-paneer', name: 'Royal Palak Paneer / Navratan Handi', category: 'mains', pricePerPerson: 350, dietary: ['vegetarian', 'halal'], isActive: true },

  // Rice & Breads
  { id: 'm-mutton-biryani', name: 'Special Mutton Degi Biryani with Brown Onions', category: 'rice_bread', pricePerPerson: 550, dietary: ['halal'], isActive: true },
  { id: 'm-chicken-biryani', name: 'Sindhi Chicken Dum Biryani', category: 'rice_bread', pricePerPerson: 400, dietary: ['halal'], isActive: true },
  { id: 'm-sindhi-biryani', name: 'Zafrani Mutton Pulao with Dry Fruits', category: 'rice_bread', pricePerPerson: 550, dietary: ['halal'], isActive: true },
  { id: 'm-roghani-naan', name: 'Live Clay-Oven Roghani Naan Basket (Sesame & Butter)', category: 'rice_bread', pricePerPerson: 150, dietary: ['vegetarian', 'halal'], isActive: true },
  { id: 'm-taftan', name: 'Traditional Saffron Taftan & Sheermal', category: 'rice_bread', pricePerPerson: 180, dietary: ['vegetarian', 'halal'], isActive: true },

  // Desserts
  { id: 'm-gajar-halwa', name: 'Traditional Gajar Ka Halwa with Pure Khoya', category: 'desserts', pricePerPerson: 350, dietary: ['vegetarian', 'halal'], isActive: true },
  { id: 'm-shahi-tukda', name: 'Royal Shahi Tukda with Chandi Ka Warq', category: 'desserts', pricePerPerson: 300, dietary: ['vegetarian', 'halal'], isActive: true },
  { id: 'm-kheer', name: 'Zafrani Badami Kheer in Clay Thalis', category: 'desserts', pricePerPerson: 250, dietary: ['vegetarian', 'halal'], isActive: true },
  { id: 'm-gulab-jamun', name: 'Warm Pistachio Gulab Jamun', category: 'desserts', pricePerPerson: 250, dietary: ['vegetarian', 'halal'], isActive: true },

  // Beverages
  { id: 'm-mint-margarita', name: 'Iced Fresh Garden Mint Margarita', category: 'beverages', pricePerPerson: 180, dietary: ['halal', 'vegan'], isActive: true },
  { id: 'm-kashmiri-chai', name: 'Signature Kashmiri Pink Tea with Crushed Pista & Almonds', category: 'beverages', pricePerPerson: 250, dietary: ['vegetarian', 'halal'], isActive: true },

  // Live Stations
  { id: 'm-jalebi-live', name: 'Live Hot Crispy Jalebi Counter with Rabri', category: 'live_stations', pricePerPerson: 350, dietary: ['vegetarian', 'halal'], isActive: true },
  { id: 'm-live-bbq', name: 'Live Charcoal BBQ Pit (Seekh Kebabs & Boti)', category: 'live_stations', pricePerPerson: 550, dietary: ['halal'], isActive: true },
];

export const DEFAULT_DECORATIONS: DecorationOption[] = [
  {
    id: 'dec-stage-mughal',
    name: 'Royal Mughal Shahi Barat Stage',
    category: 'stage',
    description: 'Handcrafted antique golden Mughal arches, rich maroon & gold floral drapery, crystal candelabras, and velvet diwan seating for bride & groom.',
    price: 185000,
    pricingType: 'fixed',
    image: '/images/decor/barat-stage.jpg',
    isPopular: true,
    isActive: true,
  },
  {
    id: 'dec-stage-walima-crystal',
    name: 'Modern Pastel White & Mirror Walima Stage',
    category: 'stage',
    description: 'Contemporary European-inspired stage with imported white hydrangeas, baby’s breath, mirrored floor aisle, and soft warm champagne lighting.',
    price: 160000,
    pricingType: 'fixed',
    image: '/images/decor/walima-stage.jpg',
    isActive: true,
  },
  {
    id: 'dec-stage-mehendi-genda',
    name: 'Traditional Genda & Motia Mehendi Setup',
    category: 'stage',
    description: 'Vibrant marigold and jasmine garlands, colorful floral jhoola (swing), Rajasthani umbrellas, and floor cushions.',
    price: 120000,
    pricingType: 'fixed',
    image: '/images/decor/mehendi-stage.jpg',
    isPopular: true,
    isActive: true,
  },
  {
    id: 'dec-walkway-mirrored',
    name: 'Grand Mirrored Shahi Walkway Tunnel',
    category: 'entrance',
    description: 'A 60ft illuminated mirrored aisle flanked by continuous fresh floral urns and welcoming crystal lanterns for royal bridal entry.',
    price: 75000,
    pricingType: 'fixed',
    isActive: true,
  },
  {
    id: 'dec-table-motia',
    name: 'Fresh Jasmine (Motia) & Rose Table Centerpieces',
    category: 'table_centerpiece',
    description: 'Tall golden candelabras crowned with fresh motia buds, fragrant red roses, and glowing floating candles.',
    price: 250,
    pricingType: 'per_person',
    isPopular: true,
    isActive: true,
  }
];

export const DEFAULT_SERVICES: OptionalService[] = [
  {
    id: 'srv-generator',
    name: '300kVA Heavy-Duty Soundproof Generator (Continuous Backup)',
    category: 'generator',
    description: 'Uninterrupted power assurance for lighting, kitchen equipment, and centralized AC with zero load-shedding switchover.',
    price: 45000,
    pricingType: 'fixed',
    isMandatory: false,
    isActive: true,
  },
  {
    id: 'srv-ac-heating',
    name: 'High-Tonnage Central AC / Heavy Winter Gas Blowers',
    category: 'ac_heating',
    description: 'High-tonnage precision climate control maintained at comfortable 21°C in summer or warm cozy temperature in winter.',
    price: 35000,
    pricingType: 'fixed',
    isMandatory: false,
    isActive: true,
  },
  {
    id: 'srv-dhol-shehnai',
    name: 'Traditional Dhol Masters & Shahi Shehnai Welcome',
    category: 'custom',
    description: 'Team of 4 royal uniformed Punjabi dhol masters and live shehnai artist for the groom Barat arrival.',
    price: 25000,
    pricingType: 'fixed',
    isActive: true,
  },
  {
    id: 'srv-sound-jbl',
    name: 'JBL / Bose Professional Acoustic Sound & Stage Microphones',
    category: 'sound_dj',
    description: 'Crystal-clear acoustic sound coverage across the entire hall, wireless Shure microphones for Nikah Khawan, and background Sufi ambience.',
    price: 30000,
    pricingType: 'fixed',
    isActive: true,
  },
  {
    id: 'srv-bridal-suite',
    name: 'Royal Bridal Vanity Suite with Attached Restroom & Safe Locker',
    category: 'bridal_suite',
    description: 'Dedicated air-conditioned bridal sanctuary with vanity mirror, comfortable seating, and secure jewelry locker.',
    price: 20000,
    pricingType: 'fixed',
    isActive: true,
  },
  {
    id: 'srv-security-valet',
    name: 'Licensed Armed Security Personnel & Executive Valet Team',
    category: 'valet',
    description: '10 Uniformed armed security guards, metal detector archways, and 8 executive valet parking attendants.',
    price: 35000,
    pricingType: 'fixed',
    isActive: true,
  }
];

export const DEFAULT_PRICING_RULES: PricingRules = {
  taxPercentage: 0, // No hidden tax by default (pure direct pricing)
  serviceChargePercentage: 0, // No hidden service charge by default
  advancePaymentPercentage: 30, // 30% advance deposit to lock date
  weekendSurchargePercentage: 0, // 0% default (clean pricing)
  peakSeasonMonths: [10, 11, 12, 1, 2, 3], // October to March (Peak Pakistani Wedding Season)
  peakSeasonSurchargePercentage: 0, // 0% default (no surprise markups)
  quotationValidityDays: 14,
  termsAndConditions: '1. Quotation prices are valid for 14 days from generation.\n2. Date is locked exclusively upon receipt of the 30% advance deposit.\n3. All wedding banquets must strictly comply with government closing timings (10:30 PM / 11:00 PM).\n4. 100% Halal meat is prepared in-house under strict food authority hygiene standards.\n5. Outside catering is not permitted without written authorization from management.',
  cancellationPolicy: 'Cancellations made 60+ days prior receive a 50% refund of advance paid. Within 30 days, deposit is transferable to another mutually agreed date within 6 months.',
};

export const DEFAULT_BOOKINGS: BookingRequest[] = [];
