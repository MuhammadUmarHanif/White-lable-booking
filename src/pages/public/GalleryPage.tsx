import React, { useState, useMemo } from 'react';
import { useBrand } from '../../context/BrandContext';
import { Lightbox } from '../../components/common/Lightbox';
import { Camera, Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { brand, halls, decorations, menuItems } = useBrand();
  const [filter, setFilter] = useState<'all' | 'halls' | 'banquets' | 'stages'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Dynamically assemble all marquee photos from active database (halls, decor, spaces, hero)
  const images = useMemo(() => {
    const list: { url: string; cat: 'halls' | 'stages' | 'banquets'; title: string }[] = [];
    const seenUrls = new Set<string>();

    const addPhoto = (url: string | undefined, cat: 'halls' | 'stages' | 'banquets', title: string) => {
      if (!url || seenUrls.has(url)) return;
      seenUrls.add(url);
      list.push({ url, cat, title });
    };

    // 1. Halls
    halls.forEach((h) => {
      (h.images || []).forEach((img, idx) => {
        addPhoto(img, 'halls', `${h.name} — Luxury Architecture & Chandelier Setup`);
      });
    });

    // 2. Showcase Spaces
    (brand.showcaseSpaces || []).forEach((s) => {
      const allImgs = (s.images && s.images.length > 0) ? s.images : (s.image ? [s.image] : []);
      allImgs.forEach((img) => {
        const cat = (s.occasion === 'barat' || s.occasion === 'walima') ? 'halls' : 'stages';
        addPhoto(img, cat, `${s.title} — ${s.badge}`);
      });
    });

    // 3. Decorations
    decorations.forEach((d) => {
      if (d.image) {
        addPhoto(d.image, 'stages', `${d.name} (${d.category.replace('_', ' ')})`);
      }
    });

    // 4. Culinary & Banquets
    menuItems.forEach((m) => {
      if (m.image) {
        addPhoto(m.image, 'banquets', `${m.name}`);
      }
    });

    // 5. Brand Hero Images
    (brand.heroImages || []).forEach((img, i) => {
      addPhoto(img, 'halls', `${brand.businessName} — Main Foyer`);
    });

    // Fallback high-res Pakistani wedding banquet photos if any category is sparse
    const defaultBanquets = [
      { url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80', cat: 'banquets' as const, title: 'Live Charcoal BBQ, Shinwari Sajji & Degi Biryani' },
      { url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80', cat: 'banquets' as const, title: 'Royal Shahi Dastarkhwan Cutlery, Bone China & Brass Thalis' },
      { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', cat: 'banquets' as const, title: 'Authentic Degi Awadhi Mutton & Clay Pot Live Station' },
    ];
    defaultBanquets.forEach((item) => addPhoto(item.url, item.cat, item.title));

    return list;
  }, [brand, halls, decorations, menuItems]);

  const filtered = filter === 'all' ? images : images.filter((img) => img.cat === filter);

  return (
    <div className="pt-28 pb-20 space-y-12 champagne-gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF8F5] text-xs font-semibold text-[#997A15]">
          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Real Celebrations Portfolio</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
          Moments of Shahi Pakistani Weddings
        </h1>
        <p className="text-sm text-[#78716C] max-w-xl mx-auto font-light">
          Explore real photographs from grand Barat processions, elegant Walima receptions, and festive Mehendi nights.
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center pt-2 sm:pt-4">
          <div className="inline-flex flex-wrap justify-center p-1 rounded-2xl sm:rounded-full bg-white border border-stone-200 shadow-sm gap-1">
            {[
              { id: 'all', label: 'All Photographs' },
              { id: 'halls', label: 'Ballrooms & Lawns' },
              { id: 'stages', label: 'Stage & Décor' },
              { id: 'banquets', label: 'Culinary Banquets' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'gold-gradient-bg text-white shadow-sm'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative h-40 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md bg-stone-100 border border-stone-200"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2.5 sm:p-6 flex flex-col justify-end">
                <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  {item.cat}
                </span>
                <h4 className="text-[10px] sm:text-sm font-semibold text-white mt-0.5 sm:mt-1 line-clamp-2">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        images={filtered.map((f) => f.url)}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((p) => (p > 0 ? p - 1 : filtered.length - 1))}
        onNext={() => setLightboxIndex((p) => (p < filtered.length - 1 ? p + 1 : 0))}
        caption={filtered[lightboxIndex]?.title}
      />
    </div>
  );
};
