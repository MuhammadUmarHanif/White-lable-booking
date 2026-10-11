import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '../../context/BrandContext';
import { Lightbox } from '../../components/common/Lightbox';
import { ShowcaseSpace } from '../../types';
import { DEFAULT_BRAND_SETTINGS } from '../../config/defaultSettings';
import gsap from 'gsap';
import {
  Sparkles,
  ArrowRight,
  Users,
  Star,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Award,
  Zap,
  Play,
  Pause,
  MapPin,
  Calendar,
  Clock,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { brand, halls, menuPackages } = useBrand();
  const heroRef = useRef<HTMLDivElement>(null);
  const giantTitleRef = useRef<HTMLHeadingElement>(null);
  const introHeadlineRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [activeCeremony, setActiveCeremony] = useState<'barat' | 'walima' | 'mehendi' | 'nikah'>('barat');

  // Active photo index for each space card (0 to 3)
  const [spacePhotoIndices, setSpacePhotoIndices] = useState<{ [key: number]: number }>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  });

  const nextSpacePhoto = (spaceIdx: number, totalPhotos: number) => {
    setSpacePhotoIndices(prev => ({
      ...prev,
      [spaceIdx]: ((prev[spaceIdx] || 0) + 1) % totalPhotos,
    }));
  };

  const prevSpacePhoto = (spaceIdx: number, totalPhotos: number) => {
    setSpacePhotoIndices(prev => ({
      ...prev,
      [spaceIdx]: ((prev[spaceIdx] || 0) - 1 + totalPhotos) % totalPhotos,
    }));
  };

  const setSpacePhoto = (spaceIdx: number, photoIdx: number) => {
    setSpacePhotoIndices(prev => ({
      ...prev,
      [spaceIdx]: photoIdx,
    }));
  };

  // Track scroll position for subtle optical parallax on Hero
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to #halls when landing on page or hash changes
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#halls') {
        const el = document.getElementById('halls');
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // GSAP entrance reveal animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && giantTitleRef.current) {
      const ctx = gsap.context(() => {
        // Giant wordmark slide-up reveal
        gsap.from(giantTitleRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
        });
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  const galleryImages = [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
  ];

  // Fallback 4 Architectural Occasion Spaces from default settings (live editable in Admin Portal)
  const defaultSpaces: ShowcaseSpace[] = DEFAULT_BRAND_SETTINGS.showcaseSpaces || [];

  // Dynamic spaces pulled from Admin Portal settings (live editable)
  const spaces: ShowcaseSpace[] = (brand.showcaseSpaces && brand.showcaseSpaces.length > 0)
    ? brand.showcaseSpaces
    : defaultSpaces;

  // Authentic Pakistani Wedding Ceremonies Data
  const ceremonies = {
    barat: {
      id: 'barat',
      name: 'The Royal Barat',
      urdu: 'بارات',
      tagline: 'Grand Procession & Regal Stage Entrance',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
      badge: '1,200 GUEST CAPACITY • PILLARLESS',
      description: 'A grand 100-foot royal aisle procession led by ceremonial Punjabi dhol masters and shahi shehnai, leading to a panoramic 50ft floral throne stage with 32ft crystal chandeliers.',
      specs: [
        'Dedicated 100ft Royal Barat Procession Aisle',
        'Dual 300kVA Soundproof Generator Backup',
        'VIP Groom & Family Welcoming Lounge',
        'Pillarless 360° Stage Sightlines for 1,200 Guests',
      ],
      ambience: 'Ceremonial Dhol, Warm Amber Chandelier Glow & Royal Red Velvet Carpet',
    },
    walima: {
      id: 'walima',
      name: 'The Grand Walima',
      urdu: 'ولیمہ',
      tagline: 'Opulent Reception & Slow-Cooked Shahi Feast',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      badge: 'EXECUTIVE BANQUET • WHITE-GLOVE SERVICE',
      description: 'An evening of sophisticated grandeur featuring slow-cooked Shahi Dastarkhwan delicacies, elegant round banquet tables with crystal candelabras, and certified One-Dish compliance.',
      specs: [
        'Slow-Cooked Mutton Roghan Josh & Live Roghani Naan',
        'Executive White-Glove Uniformed Banquet Service',
        'Crystal Centerpieces & Ambient Candlelit Illumination',
        'Compliant with Punjab/Sindh Marriage Functions Law',
      ],
      ambience: 'Gentle Instrumental Sitar, Crystal Candelabras & Warm Ivory Linens',
    },
    mehendi: {
      id: 'mehendi',
      name: 'Mehendi & Sufi Night',
      urdu: 'مہندی اور صوفی نائٹ',
      tagline: 'Vibrant Floral Jhoola, Live Dholki & Qawwali Concert',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85',
      badge: 'OPEN-AIR & INDOOR • CONCERT SOUND',
      description: 'Lush natural grass and botanical terrace adorned with fresh marigold garlands (Genda), fragrant Motia, ceremonial bride swing (Jhoola), live hot jalebi counters, and concert-grade acoustics.',
      specs: [
        'Custom Fresh Marigold & Motia Floral Jhoola',
        'Live Hot Jalebi & Kadak Doodh Patti Chai Station',
        'Concert-Grade Acoustic Line-Array Audio for Qawwali',
        'Vibrant Traditional Floor Seating & Low Takht Baithak',
      ],
      ambience: 'Rhythmic Dhol Beats, Scent of Fresh Jasmine & Fairy-Lit Night Sky',
    },
    nikah: {
      id: 'nikah',
      name: 'Auspicious Nikah',
      urdu: 'نکاح رسم',
      tagline: 'Sacred Solemnity with Optional Acoustic Segregation',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      badge: 'SACRED PRIVACY • PARDAH SEPARATION',
      description: 'Intimate and dignified solemnity with custom mirrored signing table, ivory floral archways, specialized soundproof Pardah segregation partitions, and ceremonial dry-fruit bid distribution.',
      specs: [
        'Acoustically Insulated Segregation (Pardah) Partitions',
        'Handcrafted Mirrored Nikah Signing Table & Pen Stand',
        'Ceremonial Dry Fruit (Bid) & Rose Water Welcome',
        'Dedicated Private Family Prayer & Dua Sanctuary',
      ],
      ambience: 'Soft Attar Fragrance, Serene Quranic Recitation & Intimate Royal Dignity',
    },
  };

  const testimonials = [
    {
      name: 'Chaudhry Tariq & Family',
      event: 'Royal Barat Ceremony • 850 Guests • DHA Lahore',
      quote: 'The Mughal Shahi hall and 32ft acoustic ceilings made our son’s Barat unforgettable. The slow-cooked mutton roghan josh, hot roghani naan, and Kashmiri chai received endless praise from our guests.',
      rating: 5,
    },
    {
      name: 'Dr. Farhan & Ayesha',
      event: 'Walima Reception • 650 Guests • Islamabad',
      quote: 'The interactive cost calculator gave us complete financial clarity and transparency for our Walima feast before visiting. Zero load-shedding with their heavy-duty generator backup!',
      rating: 5,
    },
    {
      name: 'Syed Mansoor Ali',
      event: 'Mehendi & Sufi Night • 500 Guests • Karachi',
      quote: 'The vibrant marigold stage decor, live hot jalebi counter, and professional Bose sound setup for our Qawwali night was world-class. Truly Pakistan’s premier marquee.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'Do you offer One-Dish compliant wedding packages in accordance with government laws?',
      a: 'Yes. We provide an official One-Dish VIP Feast package that strictly complies with provincial banquet ordinance guidelines (Punjab & Sindh) while maintaining unmatched luxury presentation and generous portions.',
    },
    {
      q: 'How do you handle power load-shedding and air conditioning in summer?',
      a: 'We operate dual 300kVA heavy-duty soundproof generators with automatic instant transfer switch (ATS). Your event experiences zero blackout interruptions for central air conditioning, kitchen chillers, and stage lighting.',
    },
    {
      q: 'Can you arrange segregated (Pardah) seating partitions for Ladies and Gents?',
      a: 'Yes. Our pillarless architectural design supports custom sound-dampening velvet partition walls with separate entrances, independent buffet lines, and dedicated female staff for the ladies hall.',
    },
    {
      q: 'What are the banquet closing hours and reservation deposit requirements?',
      a: 'Per provincial government regulations, night events conclude by 10:30 PM / 11:00 PM. Dates are reserved and protected against conflicts upon submitting a 30% advance deposit following quotation review.',
    },
  ];

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  // Primary brand wordmark (e.g. ELYSIAN)
  const brandWordmark = brand.businessName.split(' ')[0].toUpperCase() || 'ELYSIAN';

  return (
    <div className="space-y-0 pb-20">
      {/* ========================================================================= */}
      {/* 1. HILLBROOK ESTATE-STYLE HERO HEADER                                    */}
      {/* ========================================================================= */}
      <header
        ref={heroRef}
        className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-between select-none bg-stone-950"
      >
        {/* Cinematic Background Image with Ken Burns Zoom & Optical Parallax */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            transform: `translate3d(0, ${scrollY * 0.22}px, 0)`,
          }}
        >
          <img
            src={brand.heroImages[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=85'}
            alt={brand.businessName}
            className="w-full h-full object-cover animate-kenburns brightness-[0.88]"
          />
          {/* Subtle Vignette & Gradient Overlays for Razor-Sharp Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60" />
          <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-black/20 to-black/70 pointer-events-none" />
        </div>

        {/* Top Spacer for transparent header */}
        <div className="pt-28" />



        {/* Monumental Baseline Wordmark ("ELYSIAN") & Location Tagline Side-by-Side (Aamnay-Samnay) */}
        <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-6 sm:pb-8">
          <div className="border-b border-white/20 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1
              ref={giantTitleRef}
              className="font-serif text-[18vw] md:text-[11vw] lg:text-[10vw] font-normal leading-[0.85] tracking-tight uppercase text-white select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
            >
              {brandWordmark}
            </h1>

            <div className="md:text-right pb-1 sm:pb-2 shrink-0 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]">
              <p className="text-xs sm:text-sm text-white/95 uppercase tracking-[0.25em] font-sans font-medium leading-relaxed">
                ROYAL MUGHAL ARCHITECTURE<br />
                ON BEDIAN & CLUB AVENUE<br />
                <span className="text-[#D4AF37] font-bold tracking-[0.3em]">EXCLUSIVELY YOURS</span>
              </p>
            </div>
          </div>

          {/* Sub-hero status bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white/80 text-[11px] uppercase tracking-widest font-sans font-light">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>50,000 SQ.FT. PILLARLESS SANCTUARY • 1,200 CAPACITY • DUAL 300KVA POWER</span>
            </div>

            <div className="flex items-center gap-2 text-white/70">
              <span>Scroll to Explore</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. REDESIGNED LUXURY EDITORIAL SPREAD & ARCHITECTURAL HERITAGE             */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF8F5] py-24 sm:py-32 border-b border-[#D4AF37]/25 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative Column (7 cols) */}
            <div ref={introHeadlineRef} className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-10 bg-[#D4AF37]" />
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-[#997A15]">
                  ROYAL MUGHAL ARCHITECTURE • ESTABLISHED FOR LEGACIES
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] font-normal tracking-tight leading-[1.1]">
                  Some moments <span className="italic font-serif text-[#997A15]">are celebrated.</span>
                </h2>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#292524] font-normal tracking-tight leading-[1.1]">
                  At {brand.businessName},
                </h2>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#997A15] italic font-normal tracking-tight leading-[1.1]">
                  legacies are immortalized.
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed max-w-2xl">
                {brand.aboutText} Designed specifically for Punjab’s most distinguished families, our 50,000 sq.ft. pillarless sanctuary combines concert-grade acoustic engineering, dual 300kVA automated power redundancy, and authentic Shahi Dastarkhwan master kitchens strictly aligned with provincial One-Dish ordinances.
              </p>

              {/* 4 Architectural Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-xs">
                  <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-white shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1917] block">35 FT Pillarless Ceiling</span>
                    <span className="text-[10px] text-[#78716C]">Acoustic insulation & crystal chandeliers</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-xs">
                  <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-white shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1917] block">Dual 300kVA Generators</span>
                    <span className="text-[10px] text-[#78716C]">Zero blackout WAPDA redundancy</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-xs">
                  <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1917] block">One-Dish Law Compliant</span>
                    <span className="text-[10px] text-[#78716C]">100% Halal certified live degi stations</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-xs">
                  <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1917] block">Pardah / Segregation</span>
                    <span className="text-[10px] text-[#78716C]">Soundproof partition walls on demand</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/calculator"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest text-white gold-gradient-bg shadow-xl hover:scale-[1.03] transition-all group"
                >
                  <span>Calculate Event Cost</span>
                  <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </Link>

                <Link
                  to="/contact"
                  className="text-xs font-semibold uppercase tracking-widest text-[#1C1917] hover:text-[#997A15] px-5 py-4 rounded-full border border-stone-300 hover:border-[#D4AF37] transition-all"
                >
                  Schedule Private Tour →
                </Link>
              </div>
            </div>

            {/* Right Visual Composition (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Vertical Frame */}
                <div className="relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/35 group bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85"
                    alt="Elysian Grand Banquet Hall"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white text-[10px] font-mono tracking-widest uppercase">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/30">
                      FLAGSHIP BALLROOM
                    </span>
                    <span className="text-[#D4AF37] font-bold">
                      ISLAMABAD, PAKISTAN
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs font-serif italic text-[#D4AF37] block">
                      32ft Crystal Chandeliers
                    </span>
                    <h4 className="font-serif text-2xl font-normal text-white mt-0.5">
                      The Royal Grand Sanctuary
                    </h4>
                  </div>
                </div>

                {/* Overlapping Floating Capacity Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 shadow-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center text-white font-serif text-lg font-bold shadow-md">
                    1.2K
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#1C1917] block">Guest Capacity</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#997A15] font-semibold">Pillarless Grand Ballroom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WIDESCREEN CINEMATIC EXPERIENCE SHOWCASE                               */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF8F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/40 bg-black group">
            {isVideoPlaying ? (
              <iframe
                src="https://www.youtube-nocookie.com/embed/OeLZAbagHNE?autoplay=1&mute=1&loop=1&playlist=OeLZAbagHNE&controls=1&rel=0&playsinline=1"
                title="Elysian Grand Luxury Marquee Tour"
                className="w-full h-full object-cover border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setIsVideoPlaying(true)}
                className="relative w-full h-full cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85"
                  alt="Elysian Grand Wedding Experience"
                  className="w-full h-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                {/* Center Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/60 bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 hover:border-[#D4AF37] transition-all shadow-2xl">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caption Bar Below Video */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-[#1C1917]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#997A15]">
                  Cinematic Venue Experience
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] mt-0.5">
                Royal Splendor, Acoustic Grandeur & Night Illumination
              </h3>
            </div>
            <div className="text-xs text-[#78716C] font-light max-w-sm">
              Featuring 32ft crystal chandeliers, central climate control, and certified Halal culinary service.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EXPANSIVE FULL-WIDTH STICKY STACKING CARDS WITH CHANGEABLE PICTURES (SS1) */}
      {/* ========================================================================= */}
      <section id="halls" className="bg-[#FAF8F5] pt-6 pb-24 border-t border-[#D4AF37]/25 relative scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Full-Width Sticky Stacking Deck starting directly */}
          <div className="relative space-y-8 sm:space-y-12 pb-24">
            {spaces.map((sp, idx) => {
              const spaceImages = (sp.images && Array.isArray(sp.images) && sp.images.length > 0)
                ? sp.images
                : (sp.image ? [sp.image] : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85']);
              const currentPhotoIdx = spacePhotoIndices[idx] || 0;
              const currentPhoto = spaceImages[currentPhotoIdx] || spaceImages[0] || '';

              return (
                <div
                  key={idx}
                  className="sticky rounded-3xl sm:rounded-[2.5rem] bg-white border border-[#D4AF37]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300"
                  style={{
                    top: `calc(5rem + ${idx * 24}px)`,
                    zIndex: 10 + idx,
                  }}
                >
                  {/* Top Card Meta Strip */}
                  <div className="bg-[#FAF8F5]/90 backdrop-blur-xs px-6 sm:px-10 py-3.5 sm:py-4 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-white text-[#997A15] border border-[#D4AF37]/40 font-mono font-bold text-[11px] tracking-wider shadow-xs">
                        {String(idx + 1).padStart(2, '0')} / {String(spaces.length).padStart(2, '0')}
                      </span>
                      <span className="font-bold uppercase tracking-[0.2em] text-[#57534E] text-[11px] sm:text-xs">
                        {sp.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#997A15]">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span>Prime Wedding Season 2026/27</span>
                    </div>
                  </div>

                  {/* Card Main Body: 2 Columns Full Width */}
                  <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Narrative & Amenities */}
                    <div className="lg:col-span-6 space-y-6">
                      <div>
                        <span className="text-xs font-serif italic text-[#997A15] block mb-1">
                          {sp.badge}
                        </span>
                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] font-normal tracking-tight leading-tight">
                          {sp.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#78716C] mt-2 font-medium">
                          {sp.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm md:text-base text-[#57534E] font-light leading-relaxed">
                        {sp.description}
                      </p>

                      {/* Architectural Highlights Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {sp.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs text-[#292524] font-medium"
                          >
                            <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-[#997A15]" />
                            </div>
                            <span className="leading-tight">{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Predefined Occasion & Hall Rent Card */}
                      {(sp.rentPrice || sp.perPersonPrice) && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FBF6E9] to-[#FAF8F5] border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#997A15] block">
                              Predefined Hall Space Rent
                            </span>
                            <div className="text-xl sm:text-2xl font-numeric font-bold text-[#1C1917]">
                              {brand.currencySymbol} {Math.round(sp.rentPrice || 0).toLocaleString()}
                            </div>
                            <span className="text-[11px] text-[#78716C]">
                              Exclusive space reservation & heavy power backup
                            </span>
                          </div>

                          {sp.perPersonPrice && (
                            <div className="space-y-0.5 text-left sm:border-l sm:border-stone-200/80 sm:pl-4">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#997A15] block">
                                Catering / Per Head
                              </span>
                              <div className="text-lg sm:text-xl font-numeric font-bold text-[#997A15]">
                                {brand.currencySymbol} {Math.round(sp.perPersonPrice).toLocaleString()}
                                <span className="text-xs font-normal text-[#78716C]"> / guest</span>
                              </div>
                              <span className="text-[11px] text-[#78716C]">
                                Multiplies dynamically with guest count
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link
                          to={sp.link || `/calculator?eventType=${sp.occasion || 'barat'}&hall=${sp.hallId || ''}`}
                          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white gold-gradient-bg shadow-xl hover:scale-105 transition-all group"
                        >
                          <span>Select {sp.occasion ? sp.occasion.toUpperCase() : 'Occasion'} & Calculate</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          to="/contact"
                          className="text-xs font-semibold uppercase tracking-widest text-[#1C1917] hover:text-[#997A15] px-4 py-3.5 rounded-full hover:bg-[#FAF8F5] transition-all"
                        >
                          Schedule Private Tour →
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Interactive Multi-Photo Gallery Box */}
                    <div className="lg:col-span-6 relative">
                      <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/35 group bg-stone-900">
                        {/* Current Active Image with Smooth Transition */}
                        <img
                          key={currentPhoto}
                          src={currentPhoto}
                          alt={`${sp.title} - View ${currentPhotoIdx + 1}`}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

                        {/* Prev & Next Floating Image Switcher Arrows */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            prevSpacePhoto(idx, spaceImages.length);
                          }}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all z-20 cursor-pointer shadow-xl hover:scale-110"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            nextSpacePhoto(idx, spaceImages.length);
                          }}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all z-20 cursor-pointer shadow-xl hover:scale-110"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Top Overlays: Gallery Counter & Badge */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono tracking-widest text-white border border-white/20">
                            SANCTUM VIEW
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono tracking-widest text-[#D4AF37] border border-[#D4AF37]/50 font-bold">
                            PHOTO {currentPhotoIdx + 1} / {spaceImages.length}
                          </span>
                        </div>

                        {/* Bottom Thumbnail Dots Selector */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                          {spaceImages.map((_, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSpacePhoto(idx, pIdx);
                              }}
                              className={`h-2 rounded-full transition-all cursor-pointer ${pIdx === currentPhotoIdx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/50 hover:bg-white'
                                }`}
                              aria-label={`Select photo ${pIdx + 1}`}
                            />
                          ))}
                        </div>

                        {/* Image Bottom Information Bar */}
                        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4 text-white z-10">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                              ARCHITECTURAL EXCELLENCE
                            </span>
                            <h4 className="font-serif text-lg sm:text-xl font-normal text-white mt-0.5">
                              {sp.title}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const foundIdx = currentPhoto ? galleryImages.indexOf(currentPhoto) : -1;
                              openLightboxAt(foundIdx >= 0 ? foundIdx : 0);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-[10px] font-medium uppercase tracking-wider text-white hover:bg-white hover:text-[#1C1917] transition-all shrink-0 cursor-pointer shadow-md"
                          >
                            Fullscreen View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROYAL PAKISTANI WEDDING STAGE & CEREMONIES SHOWCASE                    */}
      {/* ========================================================================= */}
      <section className="bg-[#141210] text-[#FAF8F5] py-20 sm:py-28 border-y border-[#D4AF37]/35 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Interactive Ceremony Stage Visual Portal (Left 5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl bg-stone-900 group">
                {/* Active Ceremony Stage Image */}
                <div className="relative h-[420px] sm:h-[480px] overflow-hidden">
                  <img
                    key={activeCeremony}
                    src={ceremonies[activeCeremony].image}
                    alt={ceremonies[activeCeremony].name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] font-serif font-bold text-xs">
                      {ceremonies[activeCeremony].urdu} • {ceremonies[activeCeremony].name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[10px]">
                      {ceremonies[activeCeremony].badge}
                    </span>
                  </div>

                  {/* Bottom Ambience Box */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-4 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Stage Atmosphere & Acoustics</span>
                    </div>
                    <p className="text-stone-300 text-[11px] font-light leading-relaxed">
                      {ceremonies[activeCeremony].ambience}
                    </p>
                  </div>
                </div>

                {/* Ceremony Quick Selector Tabs */}
                <div className="p-3 bg-[#1C1917] border-t border-[#D4AF37]/30 grid grid-cols-4 gap-1.5 text-center">
                  {(['barat', 'walima', 'mehendi', 'nikah'] as const).map((cKey) => (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setActiveCeremony(cKey)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-medium uppercase tracking-wider transition-all cursor-pointer ${activeCeremony === cKey
                          ? 'gold-gradient-bg text-white font-bold shadow-md'
                          : 'text-stone-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {cKey === 'barat' ? 'Barat' : cKey === 'walima' ? 'Walima' : cKey === 'mehendi' ? 'Mehendi' : 'Nikah'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content on Right (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Sacred Union & Royal Pakistani Heritage</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-tight leading-tight">
                  Grand Ceremonies of <span className="italic font-serif text-[#D4AF37]">Pakistani Weddings</span>
                </h2>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light pt-1">
                  Click each ceremony below to explore our tailor-made stage setups, culinary protocols, acoustic provisions, and majestic aisle entries.
                </p>
              </div>

              {/* 4 Interactive Ceremony Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {(['barat', 'walima', 'mehendi', 'nikah'] as const).map((cKey) => {
                  const cData = ceremonies[cKey];
                  const isSelected = activeCeremony === cKey;

                  return (
                    <div
                      key={cKey}
                      onClick={() => setActiveCeremony(cKey)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${isSelected
                          ? 'bg-gradient-to-br from-[#262220] to-[#1C1917] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg'
                          : 'bg-white/5 border-stone-800 hover:border-stone-600 hover:bg-white/[0.07]'
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`font-serif text-base font-semibold ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                            {cData.name}
                          </span>
                          <span className="text-xs text-[#D4AF37] font-serif font-bold">
                            {cData.urdu}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                          {cData.tagline}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="space-y-1.5 pt-2 border-t border-[#D4AF37]/20 text-[11px] text-stone-300 animate-fadeIn">
                          {cData.specs.map((spc, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="leading-tight">{spc}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/calculator"
                  className="px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white gold-gradient-bg shadow-xl hover:scale-105 transition-all"
                >
                  Configure {ceremonies[activeCeremony].name} in Calculator →
                </Link>

                <Link
                  to="/packages"
                  className="px-5 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-stone-300 border border-stone-700 hover:text-white hover:border-[#D4AF37] transition-all"
                >
                  Explore Royal Menus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FEATURED SHAHI DASTARKHWAN BANQUETS                                    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#D4AF37]/20">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#997A15]">
              Curated Dastarkhwan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
              Royal Pakistani Wedding Banquets
            </h2>
          </div>
          <Link
            to="/packages"
            className="text-xs uppercase font-bold tracking-widest text-[#997A15] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>Explore Full Dastarkhwan Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${pkg.isPopular
                  ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] bg-white shadow-xl relative'
                  : 'border-stone-200 bg-white shadow-sm'
                }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest gold-gradient-bg text-white shadow-md">
                  Most Requested Tier
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">{pkg.name}</h3>
                  <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">{pkg.tagline}</p>
                </div>

                <div className="py-3 border-y border-stone-100 space-y-2.5">
                  {pkg.courseHighlights.map((course, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <span className="font-bold text-[#1C1917] block text-[11px]">{course.title}</span>
                      <p className="text-[#78716C] text-[10px] leading-relaxed line-clamp-2">
                        {course.items.join(' • ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#78716C]">Per Head</span>
                  <span className="text-xl font-numeric font-bold text-[#1C1917]">
                    {brand.currencySymbol} {Math.round(pkg.pricePerPerson).toLocaleString()}
                  </span>
                </div>

                <Link
                  to={`/calculator?package=${pkg.id}`}
                  className="w-full block text-center py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md hover:scale-[1.02] transition-transform"
                >
                  Select Feast
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PHOTO GALLERY & LIGHTBOX                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#997A15]">
            Visual Galleria
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
            Moments of Shahi Splendor & Grandeur
          </h2>
          <p className="text-xs text-[#78716C]">
            Click any photograph to view our grand ballrooms, Barat stages, and festive Mehendi setups.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightboxAt(idx)}
              className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
            >
              <img
                src={img}
                alt={`Marquee Showcase ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS FROM RESPECTED PAKISTANI FAMILIES                        */}
      {/* ========================================================================= */}
      <section className="bg-[#1C1917] text-white py-20 border-y border-[#D4AF37]/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Distinguished Host Endorsements
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5]">
              Celebrated by Respected Pakistani Families
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-[#292524] border border-[#D4AF37]/30 flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#D6D3D1] font-light leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <span className="font-serif text-base font-semibold text-[#FAF8F5] block">
                    {t.name}
                  </span>
                  <span className="text-[11px] text-[#A8A29E] block mt-0.5">
                    {t.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS & POLICY TRANSPARENCY                      */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#997A15]">
            Essential Clarifications
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
            Frequently Addressed Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#1C1917] hover:text-[#997A15]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#57534E] leading-relaxed border-t border-stone-100 font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Component */}
      <Lightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((p) => (p > 0 ? p - 1 : galleryImages.length - 1))}
        onNext={() => setLightboxIndex((p) => (p < galleryImages.length - 1 ? p + 1 : 0))}
      />
    </div>
  );
};
